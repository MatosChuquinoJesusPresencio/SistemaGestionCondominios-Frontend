import { useState, useMemo } from "react";
import { Button, Card, Col, Row, Table, Badge, Modal, Form, InputGroup, Pagination } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { FaUsers, FaUserPlus, FaEdit, FaTrash, FaSearch, FaUserShield, FaBuilding, FaEnvelope, FaCheckCircle, FaExclamationTriangle, FaSave, FaHome } from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";
import { useData } from "../../hooks/useData";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import StatCard from "../../components/dashboard/StatCard";
import AnimatedPage from "../../components/animations/AnimatedPage";
import AuthInput from "../../components/auth/AuthInput";

const ACResidentesPage = () => {
    const { authUser } = useAuth();
    const { getTable, updateTable } = useData();
    
    // Datos
    const usuarios = getTable('usuarios');
    const apartamentos = getTable('apartamentos');
    const pisos = getTable('pisos');
    const torres = getTable('torres');
    const condominio = getTable('condominios').find(c => c.id === authUser?.id_condominio);

    // Estados
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;
    
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

    // Filtrar usuarios del condominio actual
    const residentes = useMemo(() => {
        return usuarios.filter(u => u.id_condominio === authUser?.id_condominio);
    }, [usuarios, authUser]);

    // Estadísticas
    const stats = useMemo(() => ({
        total: residentes.length,
        propietarios: residentes.filter(u => u.id_rol === 3).length,
        seguridad: residentes.filter(u => u.id_rol === 4).length,
        activos: residentes.filter(u => u.activo).length
    }), [residentes]);

    // Filtrado para la tabla
    const filteredResidentes = useMemo(() => {
        setCurrentPage(1); // Reset page on filter change
        return residentes.filter(user => {
            const matchesSearch = user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                user.email.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesRole = roleFilter === "all" || user.id_rol.toString() === roleFilter;
            
            return matchesSearch && matchesRole;
        });
    }, [residentes, searchTerm, roleFilter]);

    // Paginación
    const totalPages = Math.ceil(filteredResidentes.length / ITEMS_PER_PAGE);
    const paginatedResidentes = filteredResidentes.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // Handlers
    const handleShowModal = (user = null) => {
        if (user) {
            setEditingUser(user);
            setValue("nombre", user.nombre);
            setValue("email", user.email);
            setValue("id_rol", user.id_rol);
            setValue("activo", user.activo);
        } else {
            setEditingUser(null);
            reset({
                activo: true,
                id_rol: 3
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingUser(null);
        reset();
    };

    const onSubmit = (data) => {
        if (editingUser) {
            const updated = usuarios.map(u => u.id === editingUser.id ? {
                ...u,
                ...data,
                id_rol: parseInt(data.id_rol)
            } : u);
            updateTable('usuarios', updated);
        } else {
            const newId = usuarios.length > 0 ? Math.max(...usuarios.map(u => u.id)) + 1 : 1;
            const newUser = {
                id: newId,
                ...data,
                id_rol: parseInt(data.id_rol),
                id_condominio: authUser.id_condominio,
                contraseña: "123123",
                activo: true
            };
            updateTable('usuarios', [...usuarios, newUser]);

            // Simulación de envío de correo
            console.group("Simulación: Correo Enviado (Residente)");
            console.log(`Para: ${data.email}`);
            console.log(`Asunto: Acceso al Sistema de Gestión - ${condominio?.nombre}`);
            console.log(`Mensaje: Hola ${data.nombre}, el administrador te ha registrado.`);
            console.log(`Tus credenciales son:`);
            console.log(`- Email: ${data.email}`);
            console.log(`- Contraseña: 123123`);
            console.groupEnd();
        }
        handleCloseModal();
    };

    const handleDeleteClick = (user) => {
        // Validación: No borrar si tiene departamentos asignados
        const hasAptos = apartamentos.some(a => a.id_usuario === user.id);
        if (hasAptos) return alert("No puedes eliminar a este propietario porque tiene departamentos asignados. Desvincúlalo de la infraestructura primero.");

        setUserToDelete(user);
        setShowConfirmDelete(true);
    };

    const handleConfirmDelete = () => {
        const updated = usuarios.filter(u => u.id !== userToDelete.id);
        updateTable('usuarios', updated);
        setShowConfirmDelete(false);
        setUserToDelete(null);
    };

    const getRoleBadge = (roleId) => {
        const roles = {
            2: { bg: "primary", label: "Admin" },
            3: { bg: "success", label: "Propietario" },
            4: { bg: "info", label: "Seguridad" }
        };
        const role = roles[roleId] || { bg: "secondary", label: "Usuario" };
        return <Badge bg={role.bg} className="rounded-pill px-3 py-2">{role.label}</Badge>;
    };

    const getAptosString = (userId) => {
        const userAptos = apartamentos.filter(a => a.id_usuario === userId);
        if (userAptos.length === 0) return "Sin asignar";
        return userAptos.map(a => a.numero).join(", ");
    };

    return (
        <AnimatedPage>
            <div className="container-fluid py-4 bg-light min-vh-100">
                <DashboardHeader 
                    icon={FaUsers}
                    title="Gestión de Residentes"
                    badgeText={condominio?.nombre || "Condominio"}
                    welcomeText="Administra a los propietarios, residentes y personal de seguridad de tu condominio."
                />

                <Row className="g-4 mb-5">
                    <StatCard icon={FaUsers} label="Total Residentes" value={stats.total} colorClass="primary" />
                    <StatCard icon={FaHome} label="Propietarios" value={stats.propietarios} colorClass="success" />
                    <StatCard icon={FaUserShield} label="Seguridad" value={stats.seguridad} colorClass="info" />
                    <StatCard icon={FaCheckCircle} label="Activos" value={stats.activos} colorClass="primary" />
                </Row>

                <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                    <Card.Header className="bg-white border-0 py-4 px-4">
                        <Row className="align-items-center g-3">
                            <Col md={5}>
                                <InputGroup className="input-no-shadow bg-light rounded-pill px-3 py-1 border-0">
                                    <InputGroup.Text className="bg-transparent border-0 text-muted">
                                        <FaSearch />
                                    </InputGroup.Text>
                                    <Form.Control 
                                        placeholder="Buscar residente por nombre o email..." 
                                        className="bg-transparent border-0 py-2 shadow-none"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </InputGroup>
                            </Col>
                            <Col md={3}>
                                <Form.Select 
                                    className="form-control rounded-pill border-light shadow-sm py-2 px-3 small"
                                    value={roleFilter}
                                    onChange={(e) => setRoleFilter(e.target.value)}
                                >
                                    <option value="all">Todos los Roles</option>
                                    <option value="3">Propietario</option>
                                    <option value="4">Seguridad</option>
                                    <option value="2">Administrador</option>
                                </Form.Select>
                            </Col>
                            <Col md={4} className="text-md-end">
                                <Button 
                                    className="btn-primary-theme rounded-pill px-4 fw-bold shadow-sm border-0 d-flex align-items-center gap-2 ms-auto"
                                    onClick={() => handleShowModal()}
                                >
                                    <FaUserPlus /> Nuevo Residente
                                </Button>
                            </Col>
                        </Row>
                    </Card.Header>
                    <Card.Body className="p-0">
                        <div className="table-responsive">
                            <Table hover className="align-middle mb-0 custom-table">
                                <thead className="bg-light text-muted small text-uppercase">
                                    <tr>
                                        <th className="px-4 py-3 border-0">Residente</th>
                                        <th className="py-3 border-0">Rol</th>
                                        <th className="py-3 border-0">Departamentos</th>
                                        <th className="py-3 border-0 text-center">Estado</th>
                                        <th className="px-4 py-3 border-0 text-end">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedResidentes.length > 0 ? paginatedResidentes.map((user) => (
                                        <tr key={user.id} className="border-bottom border-light">
                                            <td className="px-4 py-3">
                                                <div className="d-flex align-items-center gap-3">
                                                    <div className="avatar-circle bg-primary bg-opacity-10 text-primary fw-bold">
                                                        {user.nombre.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="fw-bold text-dark">{user.nombre}</div>
                                                        <div className="x-small text-muted">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3">
                                                {getRoleBadge(user.id_rol)}
                                            </td>
                                            <td className="py-3">
                                                <div className="d-flex align-items-center gap-2 small fw-medium text-secondary">
                                                    <FaHome className="text-muted" />
                                                    {getAptosString(user.id)}
                                                </div>
                                            </td>
                                            <td className="py-3 text-center">
                                                {user.activo ? (
                                                    <Badge bg="success" className="bg-opacity-10 text-success rounded-pill px-2">Activo</Badge>
                                                ) : (
                                                    <Badge bg="danger" className="bg-opacity-10 text-danger rounded-pill px-2">Inactivo</Badge>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-end">
                                                <div className="d-flex justify-content-end gap-2">
                                                    <Button 
                                                        variant="light" 
                                                        className="btn-action text-warning"
                                                        onClick={() => handleShowModal(user)}
                                                    >
                                                        <FaEdit />
                                                    </Button>
                                                    <Button 
                                                        variant="light" 
                                                        className="btn-action text-danger"
                                                        onClick={() => handleDeleteClick(user)}
                                                    >
                                                        <FaTrash />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="5" className="text-center py-5 text-muted">
                                                No hay residentes que coincidan con la búsqueda.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </div>
                    </Card.Body>
                    {totalPages > 1 && (
                        <Card.Footer className="bg-white border-0 py-3 px-4 d-flex justify-content-between align-items-center">
                            <div className="small text-muted">
                                Mostrando {paginatedResidentes.length} de {filteredResidentes.length} residentes
                            </div>
                            <Pagination className="mb-0 pagination-sm">
                                <Pagination.Prev 
                                    disabled={currentPage === 1} 
                                    onClick={() => setCurrentPage(prev => prev - 1)} 
                                />
                                {[...Array(totalPages)].map((_, i) => (
                                    <Pagination.Item 
                                        key={i + 1} 
                                        active={i + 1 === currentPage}
                                        onClick={() => setCurrentPage(i + 1)}
                                    >
                                        {i + 1}
                                    </Pagination.Item>
                                ))}
                                <Pagination.Next 
                                    disabled={currentPage === totalPages} 
                                    onClick={() => setCurrentPage(prev => prev + 1)} 
                                />
                            </Pagination>
                        </Card.Footer>
                    )}
                </Card>
            </div>

            {/* Modal Crear/Editar */}
            <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
                <Modal.Header closeButton className="border-0 pb-0 px-4 pt-4">
                    <Modal.Title className="fw-bold text-primary-theme d-flex align-items-center gap-2">
                        <div className="p-2 rounded-3 bg-primary bg-opacity-10 text-primary">
                            {editingUser ? <FaEdit /> : <FaUserPlus />}
                        </div>
                        {editingUser ? "Editar Residente" : "Registrar Nuevo Residente"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Row>
                            <Col md={6}>
                                <AuthInput 
                                    label="Nombre Completo"
                                    name="nombre"
                                    register={register}
                                    validation={{ required: "El nombre es requerido" }}
                                    error={errors.nombre}
                                    placeholder="Ej: Juan Pérez"
                                />
                            </Col>
                            <Col md={6}>
                                <AuthInput 
                                    label="Correo Electrónico"
                                    name="email"
                                    type="email"
                                    register={register}
                                    validation={{ 
                                        required: "El correo es requerido",
                                        pattern: { value: /^\S+@\S+$/i, message: "Correo inválido" }
                                    }}
                                    error={errors.email}
                                    placeholder="ejemplo@correo.com"
                                />
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <div className="mb-4">
                                    <label className="form-label text-secondary fw-semibold small mb-1">Tipo de Usuario</label>
                                    <Form.Select 
                                        {...register("id_rol", { required: "Selecciona un rol" })}
                                        className={`form-control input-no-shadow ${errors.id_rol ? "is-invalid" : ""}`}
                                    >
                                        <option value="3">Propietario / Residente</option>
                                        <option value="4">Agente de Seguridad</option>
                                        <option value="2">Administrador</option>
                                    </Form.Select>
                                    {errors.id_rol && <div className="invalid-feedback">{errors.id_rol.message}</div>}
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className="mb-4">
                                    <label className="form-label text-secondary fw-semibold small mb-1">Condominio</label>
                                    <Form.Control 
                                        value={condominio?.nombre || ""} 
                                        disabled 
                                        className="form-control input-no-shadow bg-light border-0"
                                    />
                                    <div className="x-small text-muted mt-1">El usuario se registrará automáticamente en este condominio.</div>
                                </div>
                            </Col>
                        </Row>

                        <div className="p-3 mb-4 rounded-4 bg-light border-0 d-flex justify-content-between align-items-center">
                            <div>
                                <span className="fw-bold text-dark d-block">Acceso al Sistema</span>
                                <span className="text-muted small">
                                    {editingUser?.id === authUser?.id 
                                        ? "No puedes suspender tu propio acceso." 
                                        : "Desactiva esta opción para suspender el acceso de este usuario."}
                                </span>
                            </div>
                            <Form.Check 
                                type="switch"
                                id="residente-status-switch"
                                {...register("activo")}
                                disabled={editingUser?.id === authUser?.id}
                            />
                        </div>

                        <div className="d-flex justify-content-end gap-2 mt-4">
                            <Button variant="light" onClick={handleCloseModal} className="rounded-pill px-4 fw-bold text-secondary border-0">
                                Cancelar
                            </Button>
                            <Button type="submit" className="btn-primary-theme rounded-pill px-4 fw-bold shadow-sm border-0">
                                <FaSave className="me-2" /> {editingUser ? "Guardar Cambios" : "Completar Registro"}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Modal Confirmar Eliminación */}
            <Modal show={showConfirmDelete} onHide={() => setShowConfirmDelete(false)} centered size="sm">
                <Modal.Body className="text-center p-4">
                    <FaExclamationTriangle size={40} className="text-danger mb-3" />
                    <h5 className="fw-bold text-dark">Eliminar Residente</h5>
                    <p className="text-secondary small">¿Estás seguro de eliminar a <b>{userToDelete?.nombre}</b>?</p>
                    <div className="d-flex justify-content-center gap-2 mt-3">
                        <Button variant="light" onClick={() => setShowConfirmDelete(false)} className="rounded-pill px-3 small fw-bold">Cancelar</Button>
                        <Button variant="danger" onClick={handleConfirmDelete} className="rounded-pill px-3 small fw-bold shadow-sm border-0">Eliminar</Button>
                    </div>
                </Modal.Body>
            </Modal>

            <style>
                {`
                .avatar-circle {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.1rem;
                }
                .btn-action {
                    width: 34px;
                    height: 34px;
                    padding: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 8px;
                    border: none;
                    transition: all 0.2s;
                }
                .btn-action:hover {
                    background-color: #f8f9fa;
                    transform: scale(1.1);
                }
                .custom-table th {
                    font-weight: 600;
                    letter-spacing: 0.5px;
                }
                `}
            </style>
        </AnimatedPage>
    );
};

export default ACResidentesPage;
