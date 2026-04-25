import { useState, useMemo } from "react";
import { Button, Card, Col, Row, Table, Badge, Modal, Form, InputGroup, Pagination } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { FaUsers, FaUserPlus, FaEdit, FaTrash, FaSearch, FaFilter, FaUserShield, FaBuilding, FaEnvelope, FaLock, FaCheckCircle, FaTimesCircle, FaSave, FaExclamationTriangle } from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";
import { useData } from "../../hooks/useData";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import StatCard from "../../components/dashboard/StatCard";
import AnimatedPage from "../../components/animations/AnimatedPage";
import AuthInput from "../../components/auth/AuthInput";
import SearchBar from "../../components/ui/SearchBar";
import TablePagination from "../../components/ui/TablePagination";
import EmptyState from "../../components/ui/EmptyState";
import { ROLES_MAP } from "../../constants/roles";

const SAUsuariosPage = () => {
    const { authUser } = useAuth();
    const { getTable, updateTable } = useData();
    
    // Datos
    const usuarios = getTable('usuarios');
    const condominios = getTable('condominios');

    // Estados
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [condoFilter, setCondoFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;
    
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

    // Estadísticas
    const stats = useMemo(() => ({
        total: usuarios.length,
        admins: usuarios.filter(u => u.id_rol === 2).length,
        propietarios: usuarios.filter(u => u.id_rol === 3).length,
        activos: usuarios.filter(u => u.activo).length
    }), [usuarios]);

    // Filtrado
    const filteredUsers = useMemo(() => {
        return usuarios.filter(user => {
            const matchesSearch = user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                user.email.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesRole = roleFilter === "all" || user.id_rol.toString() === roleFilter;
            const matchesCondo = condoFilter === "all" || 
                                (condoFilter === "none" ? user.id_condominio === null : user.id_condominio?.toString() === condoFilter);
            
            return matchesSearch && matchesRole && matchesCondo;
        });
    }, [usuarios, searchTerm, roleFilter, condoFilter]);

    // Paginación
    const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
    const paginatedUsers = filteredUsers.slice(
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
            setValue("id_condominio", user.id_condominio || "");
            setValue("activo", user.activo);
        } else {
            setEditingUser(null);
            reset({
                activo: true,
                id_rol: 2,
                id_condominio: ""
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
                id_rol: parseInt(data.id_rol),
                id_condominio: data.id_condominio ? parseInt(data.id_condominio) : null
            } : u);
            updateTable('usuarios', updated);
        } else {
            const newId = usuarios.length > 0 ? Math.max(...usuarios.map(u => u.id)) + 1 : 1;
            const newUser = {
                id: newId,
                ...data,
                id_rol: parseInt(data.id_rol),
                id_condominio: data.id_condominio ? parseInt(data.id_condominio) : null,
                contraseña: "123123" // Contraseña por defecto
            };
            updateTable('usuarios', [...usuarios, newUser]);
        }
        handleCloseModal();
    };

    const handleDeleteClick = (user) => {
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
            1: { bg: "danger", label: "Super Admin" },
            2: { bg: "primary", label: "Admin Condo" },
            3: { bg: "success", label: "Propietario" },
            4: { bg: "info", label: "Seguridad" }
        };
        const role = roles[roleId] || { bg: "secondary", label: "Usuario" };
        return <Badge bg={role.bg} className="rounded-pill px-3 py-2">{role.label}</Badge>;
    };

    return (
        <AnimatedPage>
            <div className="container-fluid py-4 bg-light min-vh-100">
                <DashboardHeader 
                    icon={FaUsers}
                    title="Gestión de Usuarios"
                    badgeText="Administración"
                    welcomeText="Gestiona todos los usuarios del sistema, sus roles y condominios asignados."
                />

                <Row className="g-4 mb-5">
                    <StatCard icon={FaUsers} label="Total Usuarios" value={stats.total} colorClass="primary" />
                    <StatCard icon={FaUserShield} label="Administradores" value={stats.admins} colorClass="warning" />
                    <StatCard icon={FaBuilding} label="Propietarios" value={stats.propietarios} colorClass="success" />
                    <StatCard icon={FaCheckCircle} label="Cuentas Activas" value={stats.activos} colorClass="info" />
                </Row>

                <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                    <Card.Header className="bg-white border-0 py-4 px-4">
                        <Row className="align-items-center g-3">
                            <Col md={4}>
                                <SearchBar 
                                    searchTerm={searchTerm}
                                    onSearchChange={(val) => { setSearchTerm(val); setCurrentPage(1); }}
                                    placeholder="Buscar por nombre o correo..."
                                />
                            </Col>
                            <Col md={2}>
                                <Form.Select 
                                    className="form-control rounded-pill border-light shadow-sm py-2 px-3 small"
                                    value={roleFilter}
                                    onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1); }}
                                >
                                    <option value="all">Todos los Roles</option>
                                    <option value="1">Super Admin</option>
                                    <option value="2">Admin Condo</option>
                                    <option value="3">Propietario</option>
                                    <option value="4">Seguridad</option>
                                </Form.Select>
                            </Col>
                            <Col md={2}>
                                <Form.Select 
                                    className="form-control rounded-pill border-light shadow-sm py-2 px-3 small"
                                    value={condoFilter}
                                    onChange={(e) => { setCondoFilter(e.target.value); setCurrentPage(1); }}
                                >
                                    <option value="all">Todos los Condominios</option>
                                    <option value="none">Sin Condominio</option>
                                    {condominios.map(c => (
                                        <option key={c.id} value={c.id}>{c.nombre}</option>
                                    ))}
                                </Form.Select>
                            </Col>
                            <Col md={4} className="text-md-end">
                                <Button 
                                    className="btn-primary-theme rounded-pill px-4 fw-bold shadow-sm border-0 d-flex align-items-center gap-2 ms-auto"
                                    onClick={() => handleShowModal()}
                                >
                                    <FaUserPlus /> Nuevo Usuario
                                </Button>
                            </Col>
                        </Row>
                    </Card.Header>
                    <Card.Body className="p-0">
                        <div className="table-responsive">
                            <Table hover className="align-middle mb-0 custom-table">
                                <thead className="bg-light text-muted small text-uppercase">
                                    <tr>
                                        <th className="px-4 py-3 border-0">Usuario</th>
                                        <th className="py-3 border-0">Rol</th>
                                        <th className="py-3 border-0">Condominio</th>
                                        <th className="py-3 border-0 text-center">Estado</th>
                                        <th className="px-4 py-3 border-0 text-end">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedUsers.length > 0 ? paginatedUsers.map((user) => (
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
                                                <div className="small fw-medium text-secondary">
                                                    {user.id_condominio 
                                                        ? condominios.find(c => c.id === user.id_condominio)?.nombre 
                                                        : "Plataforma Global"}
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
                                        <EmptyState 
                                            colSpan={5} 
                                            message="No se encontraron usuarios con los criterios de búsqueda." 
                                            icon={FaUsers} 
                                        />
                                    )}
                                </tbody>
                            </Table>
                        </div>
                    </Card.Body>
                    <TablePagination 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        totalItems={filteredUsers.length}
                        itemsShowing={paginatedUsers.length}
                    />
                </Card>
            </div>

            {/* Modal Crear/Editar */}
            <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
                <Modal.Header closeButton className="border-0 pb-0 px-4 pt-4">
                    <Modal.Title className="fw-bold text-primary-theme d-flex align-items-center gap-2">
                        <div className="p-2 rounded-3 bg-primary bg-opacity-10 text-primary">
                            {editingUser ? <FaEdit /> : <FaUserPlus />}
                        </div>
                        {editingUser ? "Editar Usuario" : "Crear Nuevo Usuario"}
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
                                    placeholder="Nombre y Apellidos"
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
                                    <label className="form-label text-secondary fw-semibold small mb-1">Rol en el Sistema</label>
                                    <Form.Select 
                                        {...register("id_rol", { required: "Selecciona un rol" })}
                                        className={`form-control input-no-shadow ${errors.id_rol ? "is-invalid" : ""}`}
                                    >
                                        <option value="1">Super Admin</option>
                                        <option value="2">Admin Condominio</option>
                                        <option value="3">Propietario</option>
                                        <option value="4">Seguridad</option>
                                    </Form.Select>
                                    {errors.id_rol && <div className="invalid-feedback">{errors.id_rol.message}</div>}
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className="mb-4">
                                    <label className="form-label text-secondary fw-semibold small mb-1">Condominio Asignado</label>
                                    <Form.Select 
                                        {...register("id_condominio")}
                                        className="form-control input-no-shadow"
                                    >
                                        <option value="">Ninguno (Acceso Global)</option>
                                        {condominios.map(c => (
                                            <option key={c.id} value={c.id}>{c.nombre}</option>
                                        ))}
                                    </Form.Select>
                                    <div className="x-small text-muted mt-1">Obligatorio para Admins de Condo y Residentes.</div>
                                </div>
                            </Col>
                        </Row>

                        <div className="p-3 mb-4 rounded-4 bg-light border-0 d-flex justify-content-between align-items-center">
                            <div>
                                <span className="fw-bold text-dark d-block">Estado de la cuenta</span>
                                <span className="text-muted small">
                                    {editingUser?.id === authUser?.id 
                                        ? "No puedes desactivar tu propia cuenta." 
                                        : "Los usuarios inactivos no podrán iniciar sesión."}
                                </span>
                            </div>
                            <Form.Check 
                                type="switch"
                                id="user-status-switch"
                                {...register("activo")}
                                disabled={editingUser?.id === authUser?.id}
                            />
                        </div>

                        <div className="d-flex justify-content-end gap-2 mt-4">
                            <Button variant="light" onClick={handleCloseModal} className="rounded-pill px-4 fw-bold text-secondary border-0">
                                Cancelar
                            </Button>
                            <Button type="submit" className="btn-primary-theme rounded-pill px-4 fw-bold shadow-sm border-0">
                                <FaSave className="me-2" /> {editingUser ? "Actualizar Datos" : "Registrar Usuario"}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Modal Confirmar Eliminación */}
            <Modal show={showConfirmDelete} onHide={() => setShowConfirmDelete(false)} centered size="sm">
                <Modal.Body className="text-center p-4">
                    <FaExclamationTriangle size={40} className="text-danger mb-3" />
                    <h5 className="fw-bold text-dark">¿Eliminar usuario?</h5>
                    <p className="text-secondary small">Esta acción borrará al usuario <b>{userToDelete?.nombre}</b> permanentemente.</p>
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

export default SAUsuariosPage;
