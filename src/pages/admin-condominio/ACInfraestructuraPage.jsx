import { useState } from "react";
import { Accordion, Badge, Button, Card, Col, Row, Modal, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { FaBuilding, FaLayerGroup, FaHome, FaPlus, FaEdit, FaTrash, FaSitemap, FaInfoCircle, FaChevronRight, FaArrowLeft, FaSave, FaTimes, FaExclamationTriangle, FaUser } from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";
import { useData } from "../../hooks/useData";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import StatCard from "../../components/dashboard/StatCard";
import AnimatedPage from "../../components/animations/AnimatedPage";
import AuthInput from "../../components/auth/AuthInput";

const ACInfraestructuraPage = () => {
    const { authUser } = useAuth();
    const { getTable, updateTable } = useData();

    // Estados para gestión
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(""); // "torre", "piso", "apto"
    const [editingItem, setEditingItem] = useState(null);
    const [parentId, setParentId] = useState(null);

    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [deleteType, setDeleteType] = useState("");

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

    // Obtener datos del condominio del administrador
    const condominio = getTable('condominios').find(c => c.id === authUser?.id_condominio);
    const torres = getTable('torres').filter(t => t.id_condominio === condominio?.id);
    const pisos = getTable('pisos');
    const apartamentos = getTable('apartamentos');
    const usuarios = getTable('usuarios');

    // Filtrar propietarios del condominio (Rol 3) que NO tienen apartamento
    // O que son los propietarios actuales del apartamento que se está editando
    const propietariosDisponibles = usuarios.filter(u => {
        if (u.id_condominio !== condominio?.id || u.id_rol !== 3) return false;
        
        const isAssigned = apartamentos.some(a => a.id_usuario === u.id);
        if (editingItem && editingItem.id_usuario === u.id) return true;
        
        return !isAssigned;
    });

    // Totales para las tarjetas
    const torreIds = torres.map(t => t.id);
    const pisosDelCondo = pisos.filter(p => torreIds.includes(p.id_torre));
    const pisoIds = pisosDelCondo.map(p => p.id);
    const aptosDelCondo = apartamentos.filter(a => pisoIds.includes(a.id_piso));

    if (!condominio) {
        return (
            <AnimatedPage>
                <div className="container-fluid py-4 bg-light min-vh-100 d-flex align-items-center justify-content-center">
                    <div className="text-center p-5 bg-white rounded-4 shadow-sm">
                        <FaBuilding size={50} className="text-muted mb-3" />
                        <h3>No tienes un condominio asignado</h3>
                    </div>
                </div>
            </AnimatedPage>
        );
    }

    // Handlers para Modales
    const handleShowModal = (type, item = null, parent = null) => {
        setModalType(type);
        setEditingItem(item);
        setParentId(parent);
        
        if (item) {
            if (type === "torre") setValue("nombre", item.nombre);
            else if (type === "piso") setValue("numero_piso", item.numero_piso);
            else {
                setValue("numero", item.numero);
                setValue("metraje", item.metraje);
                setValue("derecho_estacionamiento", item.derecho_estacionamiento);
                setValue("id_usuario", item.id_usuario || "");
            }
        } else {
            reset({
                derecho_estacionamiento: true,
                metraje: 0,
                id_usuario: ""
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingItem(null);
        setParentId(null);
        reset();
    };

    const onSubmit = (data) => {
        const tableName = modalType === "torre" ? "torres" : (modalType === "piso" ? "pisos" : "apartamentos");
        const currentTableData = getTable(tableName);

        // --- VALIDACIONES DE RELACIÓN / DUPLICADOS ---
        if (modalType === "torre") {
            const exists = torres.some(t => t.nombre.toLowerCase() === data.nombre.toLowerCase() && t.id !== editingItem?.id);
            if (exists) return alert("Ya existe una torre con este nombre.");
        } else if (modalType === "piso") {
            const floorsInTorre = pisos.filter(p => p.id_torre === (editingItem ? editingItem.id_torre : parentId));
            const exists = floorsInTorre.some(p => parseInt(p.numero_piso) === parseInt(data.numero_piso) && p.id !== editingItem?.id);
            if (exists) return alert("Este número de piso ya existe en esta torre.");
        } else if (modalType === "apto") {
            const aptosInPiso = apartamentos.filter(a => a.id_piso === (editingItem ? editingItem.id_piso : parentId));
            const exists = aptosInPiso.some(a => a.numero === data.numero && a.id !== editingItem?.id);
            if (exists) return alert("Este número de departamento ya existe en este piso.");
        }

        if (editingItem) {
            // EDITAR
            const updated = currentTableData.map(item => 
                item.id === editingItem.id ? { 
                    ...item, 
                    ...(modalType === "torre" ? { nombre: data.nombre } : 
                       (modalType === "piso" ? { numero_piso: parseInt(data.numero_piso) } : 
                       { 
                           numero: data.numero, 
                           metraje: parseFloat(data.metraje), 
                           derecho_estacionamiento: data.derecho_estacionamiento,
                           id_usuario: data.id_usuario ? parseInt(data.id_usuario) : null
                       })) 
                } : item
            );
            updateTable(tableName, updated);
        } else {
            // CREAR
            const newId = currentTableData.length > 0 ? Math.max(...currentTableData.map(i => i.id)) + 1 : 1;
            const newItem = {
                id: newId,
                ...(modalType === "torre" ? { nombre: data.nombre, id_condominio: condominio.id } : 
                  (modalType === "piso" ? { numero_piso: parseInt(data.numero_piso), id_torre: parentId } : 
                  { 
                      numero: data.numero, 
                      id_piso: parentId, 
                      metraje: parseFloat(data.metraje),
                      derecho_estacionamiento: data.derecho_estacionamiento,
                      id_usuario: data.id_usuario ? parseInt(data.id_usuario) : null,
                      activo: true 
                  }))
            };
            updateTable(tableName, [...currentTableData, newItem]);
        }
        handleCloseModal();
    };

    const handleDeleteClick = (type, item) => {
        // Verificar dependencias
        if (type === "torre") {
            const hasPisos = pisos.some(p => p.id_torre === item.id);
            if (hasPisos) return alert("No puedes borrar una torre con pisos. Elimina los pisos primero.");
        } else if (type === "piso") {
            const hasAptos = apartamentos.some(a => a.id_piso === item.id);
            if (hasAptos) return alert("No puedes borrar un piso con departamentos. Elimina los departamentos primero.");
        }

        setDeleteType(type);
        setItemToDelete(item);
        setShowConfirmDelete(true);
    };

    const handleConfirmDelete = () => {
        const tableName = deleteType === "torre" ? "torres" : (deleteType === "piso" ? "pisos" : "apartamentos");
        const currentData = getTable(tableName);
        const filtered = currentData.filter(i => i.id !== itemToDelete.id);
        updateTable(tableName, filtered);
        setShowConfirmDelete(false);
        setItemToDelete(null);
    };

    const getOwnerName = (userId) => {
        const user = usuarios.find(u => u.id === userId);
        return user ? user.nombre : "Sin asignar";
    };

    return (
        <AnimatedPage>
            <div className="container-fluid py-4 bg-light min-vh-100">
                <DashboardHeader 
                    icon={FaSitemap}
                    title="Gestión de Infraestructura"
                    badgeText="Jerarquía"
                    welcomeText={`Visualiza y administra la estructura física de ${condominio.nombre}.`}
                />

                <Row className="g-4 mb-5">
                    <StatCard icon={FaBuilding} label="Torres Totales" value={torres.length} colorClass="primary" />
                    <StatCard icon={FaLayerGroup} label="Pisos Totales" value={pisosDelCondo.length} colorClass="info" />
                    <StatCard icon={FaHome} label="Departamentos" value={aptosDelCondo.length} colorClass="success" />
                </Row>

                <Row>
                    <Col lg={12}>
                        <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                            <Card.Header className="bg-white border-0 py-4 px-4 d-flex justify-content-between align-items-center">
                                <div>
                                    <h5 className="fw-bold text-dark mb-1">Estructura del Edificio</h5>
                                    <p className="text-muted small mb-0">Gestión de torres, niveles y unidades.</p>
                                </div>
                                <Button 
                                    className="btn-primary-theme rounded-pill px-4 fw-bold shadow-sm border-0 d-flex align-items-center gap-2"
                                    onClick={() => handleShowModal("torre")}
                                >
                                    <FaPlus /> Nueva Torre
                                </Button>
                            </Card.Header>
                            <Card.Body className="p-0">
                                <Accordion defaultActiveKey="0" className="infra-accordion">
                                    {torres.length > 0 ? torres.map((torre, tIndex) => {
                                        const pisosDeTorre = pisos.filter(p => p.id_torre === torre.id);
                                        
                                        return (
                                            <Accordion.Item eventKey={tIndex.toString()} key={torre.id} className="border-0 border-bottom">
                                                <Accordion.Header>
                                                    <div className="d-flex align-items-center gap-3 w-100 pe-3">
                                                        <div className="p-2 rounded-3 bg-primary bg-opacity-10 text-primary">
                                                            <FaBuilding />
                                                        </div>
                                                        <div className="flex-grow-1">
                                                            <div className="fw-bold text-dark">{torre.nombre}</div>
                                                            <div className="x-small text-muted">{pisosDeTorre.length} Niveles</div>
                                                        </div>
                                                        <div className="d-flex gap-2">
                                                            <span 
                                                                role="button"
                                                                className="rounded-circle p-2 text-warning bg-light hover-bg-warning-light border-0 transition-all d-flex align-items-center justify-content-center" 
                                                                onClick={(e) => { e.stopPropagation(); handleShowModal("torre", torre); }}
                                                                title="Editar Torre"
                                                            >
                                                                <FaEdit size={14} />
                                                            </span>
                                                            <span 
                                                                role="button"
                                                                className="rounded-circle p-2 text-danger bg-light hover-bg-danger-light border-0 transition-all d-flex align-items-center justify-content-center" 
                                                                onClick={(e) => { e.stopPropagation(); handleDeleteClick("torre", torre); }}
                                                                title="Eliminar Torre"
                                                            >
                                                                <FaTrash size={14} />
                                                            </span>
                                                        </div>
                                                    </div>
                                                </Accordion.Header>
                                                <Accordion.Body className="bg-light bg-opacity-25 px-4 py-4">
                                                    <Row className="g-4">
                                                        {pisosDeTorre.map((piso) => {
                                                            const aptosDePiso = apartamentos.filter(a => a.id_piso === piso.id);
                                                            
                                                            return (
                                                                <Col md={6} xl={4} key={piso.id}>
                                                                    <Card className="border-0 shadow-sm rounded-4 h-100 overflow-hidden transition-all hover-lift">
                                                                        <Card.Header className="bg-white border-0 pt-3 px-3 pb-0 d-flex justify-content-between align-items-center">
                                                                            <div className="d-flex align-items-center gap-2">
                                                                                <div className="p-1 px-2 rounded bg-info bg-opacity-10 text-info x-small fw-bold">
                                                                                    NIVEL {piso.numero_piso}
                                                                                </div>
                                                                            </div>
                                                                            <div className="d-flex gap-1">
                                                                                <Button variant="link" className="p-1 text-muted" onClick={() => handleShowModal("piso", piso)}><FaEdit size={14} /></Button>
                                                                                <Button variant="link" className="p-1 text-danger" onClick={() => handleDeleteClick("piso", piso)}><FaTrash size={14} /></Button>
                                                                            </div>
                                                                        </Card.Header>
                                                                        <Card.Body className="p-3">
                                                                            <div className="d-flex flex-wrap gap-2">
                                                                                {aptosDePiso.map((apto) => (
                                                                                    <div 
                                                                                        key={apto.id}
                                                                                        className="apt-box d-flex flex-column align-items-center justify-content-center rounded-3 bg-white border border-light shadow-sm transition-all"
                                                                                        title={`Apto ${apto.numero} - ${getOwnerName(apto.id_usuario)}`}
                                                                                    >
                                                                                        <div className="apt-overlay d-flex flex-column gap-1 justify-content-center align-items-center rounded-3">
                                                                                            <div className="d-flex gap-2">
                                                                                                <div className="p-2 bg-warning text-white rounded-circle shadow-sm cursor-pointer" onClick={(e) => { e.stopPropagation(); handleShowModal("apto", apto); }}>
                                                                                                    <FaEdit size={12} />
                                                                                                </div>
                                                                                                <div className="p-2 bg-danger text-white rounded-circle shadow-sm cursor-pointer" onClick={(e) => { e.stopPropagation(); handleDeleteClick("apto", apto); }}>
                                                                                                    <FaTrash size={12} />
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                        <span className="fw-bold text-primary-theme small mb-0">{apto.numero}</span>
                                                                                        <div className="x-small text-muted" style={{ fontSize: '7px' }}>{apto.metraje}m²</div>
                                                                                        {apto.id_usuario ? <FaUser size={6} className="text-primary mt-1" /> : null}
                                                                                    </div>
                                                                                ))}
                                                                                <Button 
                                                                                    variant="dashed" 
                                                                                    className="apt-box-add d-flex align-items-center justify-content-center rounded-3 border-secondary border-opacity-25 text-secondary"
                                                                                    onClick={() => handleShowModal("apto", null, piso.id)}
                                                                                >
                                                                                    <FaPlus size={14} />
                                                                                </Button>
                                                                            </div>
                                                                        </Card.Body>
                                                                    </Card>
                                                                </Col>
                                                            );
                                                        })}
                                                        <Col md={6} xl={4}>
                                                            <Button 
                                                                variant="light" 
                                                                className="w-100 h-100 py-5 rounded-4 border-dashed border-2 d-flex flex-column align-items-center justify-content-center gap-2 text-muted transition-all hover-bg-white shadow-sm"
                                                                onClick={() => handleShowModal("piso", null, torre.id)}
                                                            >
                                                                <FaPlus />
                                                                <span className="fw-bold small">Añadir Nivel</span>
                                                            </Button>
                                                        </Col>
                                                    </Row>
                                                </Accordion.Body>
                                            </Accordion.Item>
                                        );
                                    }) : (
                                        <div className="text-center py-5">
                                            <FaExclamationTriangle size={40} className="text-warning opacity-50 mb-3" />
                                            <p className="text-secondary">Sin estructuras configuradas.</p>
                                        </div>
                                    )}
                                </Accordion>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>

            {/* Modal de Gestión */}
            <Modal show={showModal} onHide={handleCloseModal} centered className="border-0">
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="fw-bold text-primary-theme d-flex align-items-center gap-2">
                        <div className="p-2 rounded-3 bg-primary bg-opacity-10 text-primary">
                            {modalType === "torre" ? <FaBuilding /> : (modalType === "piso" ? <FaLayerGroup /> : <FaHome />)}
                        </div>
                        {editingItem ? "Editar" : "Nueva"} {modalType === "torre" ? "Torre" : (modalType === "piso" ? "Nivel" : "Departamento")}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="py-4">
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        {modalType === "torre" ? (
                            <AuthInput 
                                label="Nombre de la Torre"
                                name="nombre"
                                register={register}
                                validation={{ required: "Campo requerido" }}
                                error={errors.nombre}
                                placeholder="Ej: Torre Norte..."
                            />
                        ) : modalType === "piso" ? (
                            <AuthInput 
                                label="Número de Nivel"
                                type="number"
                                name="numero_piso"
                                register={register}
                                validation={{ required: "Campo requerido" }}
                                error={errors.numero_piso}
                                placeholder="Ej: 1, 2, 10..."
                            />
                        ) : (
                            <>
                                <AuthInput 
                                    label="Código de Unidad (N°)"
                                    type="text"
                                    name="numero"
                                    register={register}
                                    validation={{ required: "Campo requerido" }}
                                    error={errors.numero}
                                    placeholder="Ej: 101, A-301..."
                                />
                                <Row className="g-3">
                                    <Col md={6}>
                                        <AuthInput 
                                            label="Superficie (m²)"
                                            type="number"
                                            step="0.01"
                                            name="metraje"
                                            register={register}
                                            validation={{ required: "Requerido" }}
                                            error={errors.metraje}
                                        />
                                    </Col>
                                    <Col md={6}>
                                        <div className="mb-4">
                                            <label className="form-label text-secondary fw-semibold small mb-1">
                                                Propietario Legal
                                            </label>
                                            <Form.Select 
                                                {...register("id_usuario")} 
                                                className="form-control input-no-shadow"
                                            >
                                                <option value="">Sin asignar</option>
                                                {propietariosDisponibles.map(u => (
                                                    <option key={u.id} value={u.id}>{u.nombre}</option>
                                                ))}
                                            </Form.Select>
                                        </div>
                                    </Col>
                                </Row>
                                <div className="p-3 mb-4 rounded-4 bg-light border-0 d-flex justify-content-between align-items-center">
                                    <span className="fw-bold text-secondary small">¿Incluye Estacionamiento?</span>
                                    <Form.Check 
                                        type="switch"
                                        id="parking-switch"
                                        {...register("derecho_estacionamiento")}
                                    />
                                </div>
                            </>
                        )}

                        <div className="d-flex justify-content-end gap-2 mt-4">
                            <Button variant="light" onClick={handleCloseModal} className="rounded-pill px-4 fw-bold text-secondary border-0">
                                Cancelar
                            </Button>
                            <Button type="submit" className="btn-primary-theme rounded-pill px-4 fw-bold shadow-sm border-0">
                                <FaSave className="me-2" /> {editingItem ? "Actualizar" : "Crear Registro"}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Confirmar Borrado */}
            <Modal show={showConfirmDelete} onHide={() => setShowConfirmDelete(false)} centered size="sm">
                <Modal.Body className="text-center p-4">
                    <FaExclamationTriangle size={40} className="text-danger mb-3" />
                    <h5 className="fw-bold text-dark">Eliminar Registro</h5>
                    <p className="text-secondary small">¿Estás seguro de eliminar este elemento? Esta acción no se puede deshacer.</p>
                    <div className="d-flex justify-content-center gap-2 mt-3">
                        <Button variant="light" onClick={() => setShowConfirmDelete(false)} className="rounded-pill px-3 small fw-bold">Cancelar</Button>
                        <Button variant="danger" onClick={handleConfirmDelete} className="rounded-pill px-3 small fw-bold shadow-sm border-0">Eliminar</Button>
                    </div>
                </Modal.Body>
            </Modal>

            <style>
                {`
                .infra-accordion .accordion-button:not(.collapsed) {
                    background-color: transparent;
                    box-shadow: none;
                }
                .infra-accordion .accordion-button:focus {
                    box-shadow: none;
                    border-color: rgba(0,0,0,.125);
                }
                
                .apt-box {
                    width: 70px;
                    height: 70px;
                    cursor: pointer;
                    position: relative;
                    overflow: hidden;
                    border: 1px solid #edf2f7;
                    background: #fff;
                }
                .apt-box:hover {
                    border-color: var(--primary-color) !important;
                    transform: translateY(-3px);
                }
                
                .apt-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(255,255,255,0.9);
                    backdrop-filter: blur(2px);
                    opacity: 0;
                    transition: opacity 0.3s ease;
                    z-index: 10;
                }
                .apt-box:hover .apt-overlay {
                    opacity: 1;
                }
                
                .apt-box-add {
                    width: 70px;
                    height: 70px;
                    border: 2px dashed #e2e8f0;
                    background: transparent;
                }
                .apt-box-add:hover {
                    border-color: var(--primary-color);
                    color: var(--primary-color) !important;
                }
                
                .border-dashed { border-style: dashed !important; }
                .hover-lift:hover { transform: translateY(-5px); }
                .hover-bg-warning-light:hover { background-color: #fff3cd !important; }
                .hover-bg-danger-light:hover { background-color: #f8d7da !important; }
                .hover-bg-white:hover { background-color: #fff !important; }
                .transition-all { transition: all 0.3s ease-in-out; }
                .cursor-pointer { cursor: pointer; }
                `}
            </style>
        </AnimatedPage>
    );
};

export default ACInfraestructuraPage;
