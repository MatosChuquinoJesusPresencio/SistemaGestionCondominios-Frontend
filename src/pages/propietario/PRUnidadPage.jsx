import { useState, useMemo } from "react";
import { Card, Col, Row, Button, Table, Badge, Modal, Form } from "react-bootstrap";
import { FaHome, FaUsers, FaPlus, FaEdit, FaTrash, FaInfoCircle, FaUserTag, FaIdCard, FaBuilding, FaLayerGroup } from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";
import { useData } from "../../hooks/useData";
import { useForm } from "react-hook-form";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import AnimatedPage from "../../components/animations/AnimatedPage";
import StatCard from "../../components/dashboard/StatCard";
import AuthInput from "../../components/auth/AuthInput";

const PRUnidadPage = () => {
    const { authUser } = useAuth();
    const { getTable, updateTable } = useData();
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

    // Modales
    const [showModal, setShowModal] = useState(false);
    const [editingResident, setEditingResident] = useState(null);

    // Datos
    const apartamentos = getTable('apartamentos');
    const pisos = getTable('pisos');
    const torres = getTable('torres');
    const condominios = getTable('condominios');
    const residentes = getTable('inquilinos_temporales');

    // Encontrar la unidad del propietario
    const miApto = useMemo(() => apartamentos.find(a => a.id_usuario === authUser?.id), [apartamentos, authUser]);
    const miPiso = useMemo(() => pisos.find(p => p.id === miApto?.id_piso), [pisos, miApto]);
    const miTorre = useMemo(() => torres.find(t => t.id === miPiso?.id_torre), [torres, miPiso]);
    const miCondo = useMemo(() => condominios.find(c => c.id === miTorre?.id_condominio), [condominios, miTorre]);

    // Residentes de esta unidad
    const misResidentes = useMemo(() => residentes.filter(r => r.id_apartamento === miApto?.id), [residentes, miApto]);

    const handleOpenModal = (resident = null) => {
        setEditingResident(resident);
        if (resident) {
            setValue("nombre", resident.nombre);
            setValue("dni", resident.dni);
        } else {
            reset();
        }
        setShowModal(true);
    };

    const onSubmit = (data) => {
        if (!miApto) return;

        if (editingResident) {
            const updated = residentes.map(r => r.id === editingResident.id ? { ...r, ...data } : r);
            updateTable('inquilinos_temporales', updated);
        } else {
            const newId = residentes.length > 0 ? Math.max(...residentes.map(r => r.id)) + 1 : 1;
            const newResident = {
                id: newId,
                id_apartamento: miApto.id,
                ...data
            };
            updateTable('inquilinos_temporales', [...residentes, newResident]);
        }
        setShowModal(false);
        reset();
    };

    const handleDelete = (id) => {
        if (window.confirm("¿Estás seguro de eliminar a este residente?")) {
            const filtered = residentes.filter(r => r.id !== id);
            updateTable('inquilinos_temporales', filtered);
        }
    };

    if (!miApto) {
        return (
            <AnimatedPage>
                <div className="container-fluid py-4 bg-light min-vh-100 d-flex align-items-center justify-content-center">
                    <Card className="border-0 shadow-sm rounded-4 p-5 text-center">
                        <FaHome size={60} className="text-muted mb-3 mx-auto" />
                        <h3 className="fw-bold text-dark">Sin Unidad Asignada</h3>
                        <p className="text-muted">No se encontró una unidad vinculada a tu cuenta. Contacta con administración.</p>
                    </Card>
                </div>
            </AnimatedPage>
        );
    }

    return (
        <AnimatedPage>
            <div className="container-fluid py-4 bg-light min-vh-100">
                <DashboardHeader 
                    icon={FaHome}
                    title="Detalles de mi Unidad"
                    badgeText={`Unidad ${miApto.numero}`}
                    welcomeText={`Información general y gestión de residentes para tu unidad en ${miCondo?.nombre}.`}
                />

                <Row className="g-4 mb-5">
                    <Col lg={8}>
                        <Card className="border-0 shadow-sm rounded-4 overflow-hidden h-100">
                            <Card.Header className="bg-white border-0 pt-4 px-4">
                                <h5 className="fw-bold text-dark mb-0">Información de la Propiedad</h5>
                            </Card.Header>
                            <Card.Body className="p-4">
                                <Row className="g-4">
                                    <Col md={6}>
                                        <div className="d-flex align-items-center gap-3 p-3 rounded-4 bg-light">
                                            <div className="p-3 rounded-circle bg-primary bg-opacity-10 text-primary">
                                                <FaBuilding />
                                            </div>
                                            <div>
                                                <div className="x-small text-muted text-uppercase fw-bold">Torre / Bloque</div>
                                                <div className="fw-bold text-dark">{miTorre?.nombre || "N/A"}</div>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col md={6}>
                                        <div className="d-flex align-items-center gap-3 p-3 rounded-4 bg-light">
                                            <div className="p-3 rounded-circle bg-info bg-opacity-10 text-info">
                                                <FaLayerGroup />
                                            </div>
                                            <div>
                                                <div className="x-small text-muted text-uppercase fw-bold">Nivel / Piso</div>
                                                <div className="fw-bold text-dark">Piso {miPiso?.numero_piso || "N/A"}</div>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col md={6}>
                                        <div className="d-flex align-items-center gap-3 p-3 rounded-4 bg-light">
                                            <div className="p-3 rounded-circle bg-success bg-opacity-10 text-success">
                                                <FaHome />
                                            </div>
                                            <div>
                                                <div className="x-small text-muted text-uppercase fw-bold">Número de Unidad</div>
                                                <div className="fw-bold text-dark">{miApto.numero}</div>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col md={6}>
                                        <div className="d-flex align-items-center gap-3 p-3 rounded-4 bg-light">
                                            <div className="p-3 rounded-circle bg-warning bg-opacity-10 text-warning">
                                                <FaInfoCircle />
                                            </div>
                                            <div>
                                                <div className="x-small text-muted text-uppercase fw-bold">Superficie</div>
                                                <div className="fw-bold text-dark">{miApto.metraje} m²</div>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg={4}>
                        <StatCard 
                            icon={FaUsers} 
                            label="Residentes Registrados" 
                            value={misResidentes.length} 
                            colorClass="primary" 
                        />
                        <Card className="border-0 shadow-sm rounded-4 mt-4 bg-primary-theme text-white">
                            <Card.Body className="p-4">
                                <h6 className="fw-bold mb-2">Servicios Incluidos</h6>
                                <div className="d-flex flex-column gap-2">
                                    <div className="d-flex align-items-center gap-2 small">
                                        <Badge bg="white" className="text-primary-theme">✓</Badge> Estacionamiento Privado
                                    </div>
                                    <div className="d-flex align-items-center gap-2 small">
                                        <Badge bg="white" className="text-primary-theme">✓</Badge> Uso de Áreas Comunes
                                    </div>
                                    <div className="d-flex align-items-center gap-2 small">
                                        <Badge bg="white" className="text-primary-theme">✓</Badge> Seguridad 24/7
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                    <Card.Header className="bg-white border-0 py-4 px-4 d-flex justify-content-between align-items-center">
                        <div>
                            <h5 className="fw-bold text-dark mb-1">Residentes Autorizados</h5>
                            <p className="text-muted small mb-0">Gestiona las personas que viven en tu unidad.</p>
                        </div>
                        <Button 
                            className="btn-primary-theme rounded-pill px-4 fw-bold shadow-sm border-0 d-flex align-items-center gap-2"
                            onClick={() => handleOpenModal()}
                        >
                            <FaPlus /> Añadir Residente
                        </Button>
                    </Card.Header>
                    <Card.Body className="p-0">
                        <div className="table-responsive">
                            <Table hover className="align-middle mb-0 custom-table">
                                <thead className="bg-light text-muted small text-uppercase">
                                    <tr>
                                        <th className="px-4 py-3 border-0">Residente</th>
                                        <th className="py-3 border-0">Identificación</th>
                                        <th className="py-3 border-0">Rol</th>
                                        <th className="px-4 py-3 border-0 text-end">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {misResidentes.length > 0 ? misResidentes.map(resident => (
                                        <tr key={resident.id} className="border-bottom border-light">
                                            <td className="px-4 py-3">
                                                <div className="d-flex align-items-center gap-3">
                                                    <div className="p-2 rounded-circle bg-light text-primary">
                                                        <FaUserTag />
                                                    </div>
                                                    <div className="fw-bold text-dark">{resident.nombre}</div>
                                                </div>
                                            </td>
                                            <td className="py-3">
                                                <div className="small text-muted"><FaIdCard className="me-2" />{resident.dni}</div>
                                            </td>
                                            <td className="py-3">
                                                <Badge bg="light" className="text-primary-theme border">Residente</Badge>
                                            </td>
                                            <td className="px-4 py-3 text-end">
                                                <div className="d-flex justify-content-end gap-2">
                                                    <Button variant="light" size="sm" className="rounded-circle p-2 text-warning" onClick={() => handleOpenModal(resident)}>
                                                        <FaEdit />
                                                    </Button>
                                                    <Button variant="light" size="sm" className="rounded-circle p-2 text-danger" onClick={() => handleDelete(resident.id)}>
                                                        <FaTrash />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="4" className="text-center py-5 text-muted italic">
                                                No hay residentes registrados. Haz clic en "Añadir Residente" para empezar.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </div>
                    </Card.Body>
                </Card>
            </div>

            {/* Modal para Residente */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton className="border-0">
                    <Modal.Title className="fw-bold text-primary-theme">
                        {editingResident ? "Editar Residente" : "Nuevo Residente"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="py-4">
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <AuthInput 
                            label="Nombre Completo"
                            name="nombre"
                            register={register}
                            validation={{ required: "El nombre es obligatorio" }}
                            error={errors.nombre}
                            placeholder="Ej: Juan Pérez..."
                        />
                        <AuthInput 
                            label="DNI / Documento de Identidad"
                            name="dni"
                            register={register}
                            validation={{ 
                                required: "El DNI es obligatorio",
                                pattern: { value: /^[0-9]+$/, message: "Solo números permitidos" }
                            }}
                            error={errors.dni}
                            placeholder="Ej: 77112233..."
                        />

                        <div className="d-flex justify-content-end gap-2 mt-4">
                            <Button variant="light" onClick={() => setShowModal(false)} className="rounded-pill px-4 fw-bold text-secondary border-0">
                                Cancelar
                            </Button>
                            <Button type="submit" className="btn-primary-theme rounded-pill px-4 fw-bold shadow-sm border-0">
                                {editingResident ? "Guardar Cambios" : "Registrar"}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            <style>
                {`
                .custom-table th {
                    font-size: 0.75rem;
                    letter-spacing: 0.05rem;
                }
                .btn-primary-theme {
                    background-color: #112d4d;
                    color: white;
                }
                .btn-primary-theme:hover {
                    background-color: #1a3a5f;
                    color: white;
                }
                .text-primary-theme {
                    color: #112d4d;
                }
                .bg-primary-theme {
                    background-color: #112d4d;
                }
                `}
            </style>
        </AnimatedPage>
    );
};

export default PRUnidadPage;
