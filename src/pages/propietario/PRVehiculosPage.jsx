import { useState, useMemo } from "react";
import { Card, Col, Row, Button, Badge } from "react-bootstrap";
import { FaCar, FaPlus, FaPalette, FaParking } from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";
import { useData } from "../../hooks/useData";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import StatCard from "../../components/dashboard/StatCard";
import AnimatedPage from "../../components/animations/AnimatedPage";
import VehicleModal from "../../components/modals/VehicleModal";
import EmptyState from "../../components/ui/EmptyState";

const PRVehiculosPage = () => {
    const { authUser } = useAuth();
    const { getTable, updateTable } = useData();

    // Modales
    const [showModal, setShowModal] = useState(false);
    const [editingVehicle, setEditingVehicle] = useState(null);

    // Datos
    const vehiculos = getTable('vehiculos');
    const apartamentos = getTable('apartamentos');
    const estacionamientos = getTable('estacionamientos');
    const residentes = getTable('inquilinos_temporales');

    // Unidad del propietario
    const miApto = useMemo(() => apartamentos.find(a => a.id_usuario === authUser?.id), [apartamentos, authUser]);
    const miEstacionamiento = useMemo(() => estacionamientos.find(e => e.id_apartamento === miApto?.id), [estacionamientos, miApto]);
    const misResidentesIds = useMemo(() => residentes.filter(r => r.id_apartamento === miApto?.id).map(r => r.id), [residentes, miApto]);

    // Mis vehículos + vehículos de mis residentes
    const misVehiculos = useMemo(() => {
        return vehiculos.filter(v => 
            v.id_usuario === authUser?.id || 
            (v.id_inquilino_temporal && misResidentesIds.includes(v.id_inquilino_temporal))
        ).map(v => {
            const residente = residentes.find(r => r.id === v.id_inquilino_temporal);
            return {
                ...v,
                propietarioNombre: v.id_usuario === authUser?.id ? "Mío" : (residente?.nombre || "Residente")
            };
        });
    }, [vehiculos, authUser, misResidentesIds, residentes]);

    const handleOpenModal = (vehicle = null) => {
        setEditingVehicle(vehicle);
        setShowModal(true);
    };

    const onSubmit = (data) => {
        if (editingVehicle) {
            const updated = vehiculos.map(v => v.id === editingVehicle.id ? { ...v, ...data } : v);
            updateTable('vehiculos', updated);
        } else {
            const newId = vehiculos.length > 0 ? Math.max(...vehiculos.map(v => v.id)) + 1 : 1;
            const newVehicle = {
                id: newId,
                id_usuario: authUser.id,
                id_inquilino_temporal: null,
                ...data
            };
            updateTable('vehiculos', [...vehiculos, newVehicle]);
        }
        setShowModal(false);
    };

    const handleDelete = (id) => {
        if (window.confirm("¿Estás seguro de eliminar este vehículo?")) {
            const filtered = vehiculos.filter(v => v.id !== id);
            updateTable('vehiculos', filtered);
        }
    };

    if (!miApto) {
        return (
            <AnimatedPage>
                <div className="container-fluid py-4 bg-light min-vh-100 d-flex align-items-center justify-content-center">
                    <Card className="border-0 shadow-sm rounded-4 p-5 text-center">
                        <FaCar size={60} className="text-muted mb-3 mx-auto" />
                        <h3 className="fw-bold text-dark">Sin Unidad Asignada</h3>
                        <p className="text-muted">No puedes gestionar vehículos sin una unidad vinculada.</p>
                    </Card>
                </div>
            </AnimatedPage>
        );
    }

    return (
        <AnimatedPage>
            <div className="container-fluid py-4 bg-light min-vh-100">
                <DashboardHeader 
                    icon={FaCar}
                    title="Gestión de Mis Vehículos"
                    badgeText={miApto.numero}
                    welcomeText="Registra y administra los vehículos autorizados para tu estacionamiento."
                />

                <Row className="g-4 mb-5">
                    <Col lg={4}>
                        <StatCard 
                            icon={FaCar} 
                            label="Vehículos Registrados" 
                            value={misVehiculos.length} 
                            colorClass="primary" 
                        />
                    </Col>
                    <Col lg={8}>
                        <Card className="border-0 shadow-sm rounded-4 bg-white h-100 d-flex flex-row align-items-center px-4">
                            <div className="p-3 rounded-circle bg-info bg-opacity-10 text-info me-4">
                                <FaParking size={24} />
                            </div>
                            <div>
                                <h6 className="fw-bold text-dark mb-1">Estacionamiento Asignado</h6>
                                <p className="mb-0 text-muted small">
                                    {miEstacionamiento ? (
                                        <>Tu unidad cuenta con el espacio: <Badge bg="dark" className="ms-2">{miEstacionamiento.numero}</Badge></>
                                    ) : (
                                        "No tienes un espacio de estacionamiento asignado actualmente."
                                    )}
                                </p>
                            </div>
                        </Card>
                    </Col>
                </Row>

                <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                    <Card.Header className="bg-white border-0 py-4 px-4 d-flex justify-content-between align-items-center">
                        <div>
                            <h5 className="fw-bold text-dark mb-1">Lista de Vehículos</h5>
                            <p className="text-muted small mb-0">Vehículos que tienen permitido el ingreso al condominio.</p>
                        </div>
                        <Button 
                            className="btn-primary-theme rounded-pill px-4 fw-bold shadow-sm border-0 d-flex align-items-center gap-2"
                            onClick={() => handleOpenModal()}
                        >
                            <FaPlus /> Registrar Vehículo
                        </Button>
                    </Card.Header>
                    <Card.Body className="p-0">
                        <div className="table-responsive">
                            <table className="table hover align-middle mb-0 custom-table">
                                <thead className="bg-light text-muted small text-uppercase">
                                    <tr>
                                        <th className="px-4 py-3 border-0">Vehículo</th>
                                        <th className="py-3 border-0">Placa</th>
                                        <th className="py-3 border-0">Asignado a</th>
                                        <th className="py-3 border-0">Color</th>
                                        <th className="px-4 py-3 border-0 text-end">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {misVehiculos.length > 0 ? misVehiculos.map(v => (
                                        <tr key={v.id} className="border-bottom border-light">
                                            <td className="px-4 py-3">
                                                <div className="d-flex align-items-center gap-3">
                                                    <div className="p-2 rounded-3 bg-light text-primary">
                                                        <FaCar />
                                                    </div>
                                                    <div>
                                                        <div className="fw-bold text-dark">{v.marca}</div>
                                                        <div className="x-small text-muted">{v.modelo}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3">
                                                <Badge bg="dark" className="px-3 py-2 fw-bold letter-spacing-1">{v.placa}</Badge>
                                            </td>
                                            <td className="py-3">
                                                <Badge bg={v.id_usuario === authUser?.id ? "primary" : "info"} className="fw-normal">
                                                    {v.propietarioNombre}
                                                </Badge>
                                            </td>
                                            <td className="py-3">
                                                <div className="d-flex align-items-center gap-2 small">
                                                    <FaPalette className="text-muted" /> {v.color}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-end">
                                                <div className="d-flex justify-content-end gap-2">
                                                    <Button variant="light" size="sm" className="rounded-circle p-2 text-warning" onClick={() => handleOpenModal(v)}>
                                                        <FaPlus />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <EmptyState colSpan={5} message="No tienes vehículos registrados." icon={FaCar} />
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card.Body>
                </Card>
            </div>

            <VehicleModal 
                show={showModal}
                onHide={() => setShowModal(false)}
                onSubmit={onSubmit}
                editingVehicle={editingVehicle}
            />

            <style>
                {`
                .btn-primary-theme { background-color: #112d4d; color: white; }
                .btn-primary-theme:hover { background-color: #1a3a5f; color: white; }
                .text-primary-theme { color: #112d4d; }
                .letter-spacing-1 { letter-spacing: 1px; }
                `}
            </style>
        </AnimatedPage>
    );
};

export default PRVehiculosPage;
