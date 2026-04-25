import { useState } from "react";
import { Modal, Button, Form, ListGroup, InputGroup } from "react-bootstrap";
import { useForm } from "react-hook-form";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import DashboardTable from "../../components/dashboard/DashboardTable";
import AnimatedPage from "../../components/animations/AnimatedPage";
import AuthInput from "../../components/auth/AuthInput";
import { FaBuilding, FaUsersCog, FaCog, FaPlusCircle, FaEye, FaEdit, FaTrashAlt, FaMapMarkerAlt, FaCalendarAlt, FaGlobe, FaSave, FaTimes, FaExclamationTriangle, FaInfoCircle, FaSearch } from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";
import { useData } from "../../hooks/useData";

const SACondominiosPage = () => {
    const { authUser } = useAuth();
    const { getTable, updateTable } = useData();
    const [showModal, setShowModal] = useState(false);
    const [editingCondo, setEditingCondo] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    
    // Paginación
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // Estados para detalles
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedCondo, setSelectedCondo] = useState(null);
    const [condoStats, setCondoStats] = useState(null);
    
    const [showRelationsModal, setShowRelationsModal] = useState(false);
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
    const [condoToDelete, setCondoToDelete] = useState(null);
    const [relations, setRelations] = useState([]);
    
    const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
        defaultValues: {
            nombre: "",
            direccion: "",
            ciudad: "",
            pais: "",
            id_administrador: ""
        }
    });

    const condominios = getTable('condominios');
    const usuarios = getTable('usuarios');
    
    // Filtrar administradores de condominio (Rol ID 2)
    const adminUsers = usuarios.filter(u => u.id_rol === 2);

    // Filtrar condominios por nombre
    const filteredCondominios = condominios.filter(condo => 
        condo.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Lógica de Paginación
    const totalPages = Math.ceil(filteredCondominios.length / itemsPerPage);
    const currentItems = filteredCondominios.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Resetear a página 1 al buscar
    };

    const handleClose = () => {
        setShowModal(false);
        setEditingCondo(null);
        reset();
    };

    const handleDetailClose = () => {
        setShowDetailModal(false);
        setSelectedCondo(null);
        setCondoStats(null);
    };

    const handleRelationsClose = () => {
        setShowRelationsModal(false);
        setRelations([]);
        setCondoToDelete(null);
    };

    const handleConfirmDeleteClose = () => {
        setShowConfirmDeleteModal(false);
        setCondoToDelete(null);
    };
    
    const handleShow = (condo = null) => {
        if (condo) {
            setEditingCondo(condo);
            setValue("nombre", condo.nombre);
            setValue("direccion", condo.direccion);
            setValue("ciudad", condo.ciudad);
            setValue("pais", condo.pais);
            
            const currentAdmin = adminUsers.find(u => u.id_condominio === condo.id);
            setValue("id_administrador", currentAdmin ? currentAdmin.id.toString() : "");
        } else {
            setValue("id_administrador", "");
        }
        setShowModal(true);
    };

    const handleDetailClick = (condo) => {
        const torres = getTable('torres').filter(t => t.id_condominio === condo.id);
        const torreIds = torres.map(t => t.id);
        
        const pisos = getTable('pisos').filter(p => torreIds.includes(p.id_torre));
        const pisoIds = pisos.map(p => p.id);
        
        const aptos = getTable('apartamentos').filter(a => pisoIds.includes(a.id_piso));
        
        const users = getTable('usuarios').filter(u => u.id_condominio === condo.id);
        const carts = getTable('carritos_carga').filter(c => c.id_condominio === condo.id);
        const config = getTable('configuraciones').find(c => c.id_condominio === condo.id);

        setCondoStats({
            torres: torres.length,
            pisos: pisos.length,
            apartamentos: aptos.length,
            usuarios: users.length,
            carritos: carts.length,
            config: config
        });
        setSelectedCondo(condo);
        setShowDetailModal(true);
    };

    const handleDeleteClick = (condo) => {
        const foundRelations = [];
        
        const users = getTable('usuarios').filter(u => u.id_condominio === condo.id);
        if (users.length > 0) foundRelations.push(`${users.length} Usuario(s) registrados`);
        
        const towers = getTable('torres').filter(t => t.id_condominio === condo.id);
        if (towers.length > 0) foundRelations.push(`${towers.length} Torre(s) / Bloque(s)`);

        const configs = getTable('configuraciones').filter(c => c.id_condominio === condo.id);
        if (configs.length > 0) foundRelations.push(`Configuración del sistema activa`);
        
        const carts = getTable('carritos_carga').filter(c => c.id_condominio === condo.id);
        if (carts.length > 0) foundRelations.push(`${carts.length} Carrito(s) de carga`);

        setCondoToDelete(condo);
        setRelations(foundRelations);

        if (foundRelations.length > 0) {
            setShowRelationsModal(true);
        } else {
            setShowConfirmDeleteModal(true);
        }
    };

    const confirmDelete = () => {
        const updatedCondominios = condominios.filter(c => c.id !== condoToDelete.id);
        updateTable('condominios', updatedCondominios);
        handleConfirmDeleteClose();
    };

    const onSubmit = (data) => {
        const { id_administrador, ...condoData } = data;
        let condoId;

        if (editingCondo) {
            condoId = editingCondo.id;
            const updatedCondominios = condominios.map(c => 
                c.id === editingCondo.id ? { ...c, ...condoData } : c
            );
            updateTable('condominios', updatedCondominios);
        } else {
            condoId = condominios.length > 0 ? Math.max(...condominios.map(c => c.id)) + 1 : 1;
            const nuevoCondominio = {
                ...condoData,
                id: condoId,
                fecha_creacion: new Date().toISOString().split('T')[0]
            };
            const updatedCondominios = [...condominios, nuevoCondominio];
            updateTable('condominios', updatedCondominios);
        }

        const updatedUsers = usuarios.map(u => {
            if (u.id_condominio === condoId && u.id_rol === 2 && u.id.toString() !== id_administrador) {
                return { ...u, id_condominio: null };
            }
            if (u.id.toString() === id_administrador) {
                return { ...u, id_condominio: condoId };
            }
            return u;
        });
        
        updateTable('usuarios', updatedUsers);
        handleClose();
    };

    return (
        <AnimatedPage>
            <div className="container-fluid py-4 bg-light min-vh-100">
                <DashboardHeader 
                    icon={FaBuilding}
                    title="Gestión de Condominios"
                    badgeText="Super Admin"
                    welcomeText={`Bienvenido, ${authUser?.nombre || "Administrador"}. Aquí puedes gestionar todos los condominios del sistema.`}
                >
                    <button 
                        className="btn btn-primary-theme d-inline-flex align-items-center gap-2 shadow-sm px-4 py-2 rounded-3 fw-semibold transition-all"
                        onClick={() => handleShow()}
                    >
                        <FaPlusCircle />
                        <span>Nuevo Condominio</span>
                    </button>
                </DashboardHeader>

                <div className="row g-4">
                    <DashboardTable 
                        title="Lista de Condominios"
                        headers={["#", "Nombre", "Ubicación", "Administrador", "Fecha Registro", "Acciones"]}
                        colSize="col-xl-12"
                        searchPlaceholder="Buscar por nombre..."
                        searchValue={searchTerm}
                        onSearchChange={handleSearchChange}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    >
                        {currentItems.map((condo, index) => {
                            const actualIndex = (currentPage - 1) * itemsPerPage + index + 1;
                            const admin = adminUsers.find(u => u.id_condominio === condo.id);
                            return (
                                <tr key={condo.id} className="border-bottom border-light">
                                    <td className="px-4 py-3 text-center">
                                        <span className="text-secondary fw-bold">{(actualIndex).toString().padStart(2, '0')}</span>
                                    </td>
                                    <td className="py-3">
                                        <div className="fw-bold text-dark mb-0">{condo.nombre}</div>
                                        <div className="x-small text-muted d-flex align-items-center gap-1">
                                            <FaGlobe className="text-primary opacity-50" /> {condo.pais}
                                        </div>
                                    </td>
                                    <td className="py-3">
                                        <div className="small fw-medium text-dark">{condo.direccion}</div>
                                        <div className="x-small text-muted d-flex align-items-center gap-1">
                                            <FaMapMarkerAlt className="text-danger opacity-50" /> {condo.ciudad}
                                        </div>
                                    </td>
                                    <td className="py-3">
                                        {admin ? (
                                            <div className="d-flex align-items-center gap-2">
                                                <div className="p-2 rounded-circle bg-primary bg-opacity-10 text-primary small">
                                                    <FaUsersCog />
                                                </div>
                                                <div>
                                                    <div className="small fw-bold text-dark">{admin.nombre}</div>
                                                    <div className="x-small text-muted">{admin.email}</div>
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="badge bg-light text-muted fw-normal border">Sin asignar</span>
                                        )}
                                    </td>
                                    <td className="py-3">
                                        <div className="small text-dark d-flex align-items-center gap-2">
                                            <FaCalendarAlt className="text-secondary opacity-50" />
                                            {new Date(condo.fecha_creacion).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-end">
                                        <div className="d-flex justify-content-end gap-2">
                                            <button 
                                                className="btn btn-action rounded-pill border-0 px-3 py-1 d-flex align-items-center gap-2 transition-all bg-info bg-opacity-10 text-info fw-bold small" 
                                                onClick={() => handleDetailClick(condo)}
                                            >
                                                <FaEye size={14} /> <span>Detalles</span>
                                            </button>
                                            <button 
                                                className="btn btn-action rounded-pill border-0 px-3 py-1 d-flex align-items-center gap-2 transition-all bg-warning bg-opacity-10 text-warning fw-bold small" 
                                                onClick={() => handleShow(condo)}
                                            >
                                                <FaEdit size={14} /> <span>Editar</span>
                                            </button>
                                            <button 
                                                className="btn btn-action rounded-pill border-0 px-3 py-1 d-flex align-items-center gap-2 transition-all bg-danger bg-opacity-10 text-danger fw-bold small" 
                                                onClick={() => handleDeleteClick(condo)}
                                            >
                                                <FaTrashAlt size={14} /> <span>Borrar</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        {currentItems.length === 0 && (
                            <tr>
                                <td colSpan="6" className="text-center py-5 text-muted">
                                    {searchTerm ? `No se encontraron condominios que coincidan con "${searchTerm}"` : "No hay condominios registrados."}
                                </td>
                            </tr>
                        )}
                    </DashboardTable>
                </div>
            </div>

            <Modal show={showDetailModal} onHide={handleDetailClose} centered size="lg" className="border-0">
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="fw-bold text-primary-theme d-flex align-items-center gap-2">
                        <div className="p-2 rounded-3 bg-info bg-opacity-10 text-info">
                            <FaInfoCircle />
                        </div>
                        Detalles del Condominio
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    {selectedCondo && (
                        <div className="row g-4">
                            <div className="col-12 col-md-6">
                                <div className="card border-0 bg-light rounded-4 p-4 h-100">
                                    <h6 className="text-muted small text-uppercase fw-bold mb-3">Información General</h6>
                                    <h3 className="fw-bold text-dark mb-1">{selectedCondo.nombre}</h3>
                                    <p className="text-secondary mb-3">{selectedCondo.direccion}, {selectedCondo.ciudad}</p>
                                    <div className="d-flex align-items-center gap-2 text-muted small">
                                        <FaCalendarAlt /> Registrado el {new Date(selectedCondo.fecha_creacion).toLocaleDateString()}
                                    </div>
                                    
                                    <div className="mt-4 pt-3 border-top border-secondary border-opacity-10">
                                        <h6 className="text-muted small text-uppercase fw-bold mb-2 text-secondary">Administrador Asignado</h6>
                                        {adminUsers.find(u => u.id_condominio === selectedCondo.id) ? (
                                            <div className="d-flex align-items-center gap-3 bg-white p-2 rounded-3 border">
                                                <div className="p-3 rounded-circle bg-primary bg-opacity-10 text-primary">
                                                    <FaUsersCog />
                                                </div>
                                                <div>
                                                    <div className="fw-bold text-dark">{adminUsers.find(u => u.id_condominio === selectedCondo.id).nombre}</div>
                                                    <div className="small text-muted">{adminUsers.find(u => u.id_condominio === selectedCondo.id).email}</div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="alert alert-light border small text-muted">No hay un administrador asignado actualmente.</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-md-6">
                                <div className="row g-3">
                                    <div className="col-6">
                                        <div className="bg-white border rounded-4 p-3 text-center shadow-sm">
                                            <div className="text-primary fs-4 mb-1"><FaBuilding /></div>
                                            <div className="fw-bold fs-5">{condoStats?.torres}</div>
                                            <div className="x-small text-muted text-uppercase fw-bold">Torres</div>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="bg-white border rounded-4 p-3 text-center shadow-sm">
                                            <div className="text-success fs-4 mb-1"><FaMapMarkerAlt /></div>
                                            <div className="fw-bold fs-5">{condoStats?.apartamentos}</div>
                                            <div className="x-small text-muted text-uppercase fw-bold">Aptos.</div>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="bg-white border rounded-4 p-3 text-center shadow-sm">
                                            <div className="text-warning fs-4 mb-1"><FaUsersCog size={24} /></div>
                                            <div className="fw-bold fs-5">{condoStats?.usuarios}</div>
                                            <div className="x-small text-muted text-uppercase fw-bold">Usuarios</div>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="bg-white border rounded-4 p-3 text-center shadow-sm">
                                            <div className="text-info fs-4 mb-1"><FaPlusCircle /></div>
                                            <div className="fw-bold fs-5">{condoStats?.carritos}</div>
                                            <div className="x-small text-muted text-uppercase fw-bold">Carritos</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {condoStats?.config && (
                                <div className="col-12">
                                    <div className="card border-0 bg-primary bg-opacity-10 rounded-4 p-4">
                                        <h6 className="text-primary small text-uppercase fw-bold mb-3 d-flex align-items-center gap-2">
                                            <FaCog /> Configuración del Sistema
                                        </h6>
                                        <div className="row g-4">
                                            <div className="col-md-3">
                                                <div className="small text-muted">Máx. Autos</div>
                                                <div className="fw-bold text-dark">{condoStats.config.max_autos}</div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="small text-muted">Máx. Motos</div>
                                                <div className="fw-bold text-dark">{condoStats.config.max_motos}</div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="small text-muted">Préstamo Carrito</div>
                                                <div className="fw-bold text-dark">{condoStats.config.tiempo_max_prestamo_min} min.</div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="small text-muted">Penalización</div>
                                                <div className="fw-bold text-dark">S/ {condoStats.config.penalizacion_por_minuto.toFixed(2)}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    <div className="text-end mt-4">
                        <Button variant="light" onClick={handleDetailClose} className="rounded-pill px-5 fw-bold text-secondary border-0">
                            Cerrar
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>

            <Modal show={showModal} onHide={handleClose} centered size="lg" className="border-0">
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="fw-bold text-primary-theme d-flex align-items-center gap-2">
                        <div className="p-2 rounded-3 bg-primary bg-opacity-10 text-primary">
                            <FaBuilding />
                        </div>
                        {editingCondo ? "Editar Condominio" : "Nuevo Condominio"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="py-4">
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <div className="row">
                            <div className="col-12">
                                <AuthInput 
                                    label="Nombre del Condominio"
                                    type="text"
                                    placeholder="Ej. Residencial Las Flores"
                                    name="nombre"
                                    register={register}
                                    validation={{ required: "El nombre es obligatorio" }}
                                    error={errors.nombre}
                                />
                            </div>
                            <div className="col-12">
                                <AuthInput 
                                    label="Dirección"
                                    type="text"
                                    placeholder="Av. Principal 123"
                                    name="direccion"
                                    register={register}
                                    validation={{ required: "La dirección es obligatoria" }}
                                    error={errors.direccion}
                                />
                            </div>
                            <div className="col-md-6">
                                <AuthInput 
                                    label="Ciudad"
                                    type="text"
                                    placeholder="Lima"
                                    name="ciudad"
                                    register={register}
                                    validation={{ required: "La ciudad es obligatoria" }}
                                    error={errors.ciudad}
                                />
                            </div>
                            <div className="col-md-6">
                                <AuthInput 
                                    label="País"
                                    type="text"
                                    placeholder="Perú"
                                    name="pais"
                                    register={register}
                                    validation={{ required: "El país es obligatorio" }}
                                    error={errors.pais}
                                />
                            </div>
                            
                            <div className="col-12">
                                <div className="mb-4">
                                    <label className="form-label text-secondary fw-semibold small mb-1">
                                        Asignar Administrador de Condominio
                                    </label>
                                    <Form.Select
                                        className={`form-control input-no-shadow ${errors.id_administrador ? "is-invalid" : ""}`}
                                        {...register("id_administrador", { required: "Debes asignar un administrador" })}
                                    >
                                        <option value="">Selecciona un administrador...</option>
                                        {adminUsers
                                            .filter(u => u.id_condominio === null || (editingCondo && u.id_condominio === editingCondo.id))
                                            .map(u => (
                                                <option key={u.id} value={u.id}>
                                                    {u.nombre} ({u.email})
                                                </option>
                                            ))
                                        }
                                    </Form.Select>
                                    {errors.id_administrador && (
                                        <div className="invalid-feedback d-block mt-1">
                                            {errors.id_administrador.message}
                                        </div>
                                    )}
                                    <div className="x-small text-muted mt-1">
                                        <FaInfoCircle className="me-1" /> Solo se muestran administradores que no tienen un condominio asignado.
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="d-flex justify-content-end gap-2 mt-2">
                            <Button variant="light" onClick={handleClose} className="rounded-pill px-4 fw-bold text-secondary border-0">
                                <FaTimes className="me-2" /> Cancelar
                            </Button>
                            <Button type="submit" className="btn-primary-theme rounded-pill px-4 fw-bold shadow-sm border-0">
                                <FaSave className="me-2" /> {editingCondo ? "Actualizar Cambios" : "Guardar Condominio"}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal show={showRelationsModal} onHide={handleRelationsClose} centered className="border-0">
                <Modal.Body className="p-4 text-center">
                    <div className="p-3 rounded-circle bg-warning bg-opacity-10 text-warning d-inline-block mb-4">
                        <FaExclamationTriangle size={40} />
                    </div>
                    <h4 className="fw-bold text-dark mb-3">No se puede eliminar</h4>
                    <p className="text-secondary mb-4">
                        El condominio <strong>{condoToDelete?.nombre}</strong> tiene relaciones activas que impiden su borrado:
                    </p>
                    <ListGroup variant="flush" className="text-start mb-4 bg-light rounded-3 p-2">
                        {relations.map((rel, idx) => (
                            <ListGroup.Item key={idx} className="bg-transparent border-0 d-flex align-items-center gap-2 small fw-medium text-secondary">
                                <FaInfoCircle className="text-warning" /> {rel}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                    <p className="small text-muted mb-4">
                        Por favor, elimina primero estas dependencias antes de intentar borrar el condominio.
                    </p>
                    <Button variant="secondary" onClick={handleRelationsClose} className="rounded-pill px-5 fw-bold border-0 shadow-sm">
                        Entendido
                    </Button>
                </Modal.Body>
            </Modal>

            <Modal show={showConfirmDeleteModal} onHide={handleConfirmDeleteClose} centered className="border-0">
                <Modal.Body className="p-4 text-center">
                    <div className="p-3 rounded-circle bg-danger bg-opacity-10 text-danger d-inline-block mb-4">
                        <FaTrashAlt size={40} />
                    </div>
                    <h4 className="fw-bold text-dark mb-3">¿Estás seguro?</h4>
                    <p className="text-secondary mb-4">
                        Estás a punto de eliminar el condominio <strong>{condoToDelete?.nombre}</strong>. Esta acción no se puede deshacer.
                    </p>
                    <div className="d-flex justify-content-center gap-2 mt-4">
                        <Button variant="light" onClick={handleConfirmDeleteClose} className="rounded-pill px-4 fw-bold text-secondary border-0">
                            Cancelar
                        </Button>
                        <Button variant="danger" onClick={confirmDelete} className="rounded-pill px-4 fw-bold shadow-sm border-0">
                            Sí, Eliminar
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>

            <style>
                {`
                .btn-action {
                    font-size: 0.75rem;
                    border: 1px solid transparent !important;
                }
                .btn-action:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                }
                .btn-action.text-info:hover { background-color: #0dcaf0 !important; color: white !important; }
                .btn-action.text-warning:hover { background-color: #ffc107 !important; color: white !important; }
                .btn-action.text-danger:hover { background-color: #dc3545 !important; color: white !important; }
                
                .search-group {
                    width: 300px;
                    border-radius: 0.75rem;
                    overflow: hidden;
                    background-color: white;
                    border: 1px solid #e5e7eb;
                }

                .transition-all { transition: all 0.2s ease-in-out; }
                `}
            </style>
        </AnimatedPage>
    );
};

export default SACondominiosPage;