import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, Row, Form, InputGroup, Pagination, Tabs, Tab } from "react-bootstrap";
import { FaHistory, FaShoppingCart, FaCar, FaSearch, FaCheckCircle } from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";
import { useData } from "../../hooks/useData";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import StatCard from "../../components/dashboard/StatCard";
import AnimatedPage from "../../components/animations/AnimatedPage";
import ActivityTable from "../../components/tables/ActivityTable";

const PRHistorialPage = () => {
    const { authUser } = useAuth();
    const { getTable } = useData();
    const [searchParams] = useSearchParams();
    
    // Datos
    const logsCarritos = getTable('logs_prestamo_carrito');
    const logsVehiculos = getTable('logs_acceso_vehicular');
    const carritos = getTable('carritos_carga');
    const vehiculosTable = getTable('vehiculos');
    const apartamentos = getTable('apartamentos');
    const usuarios = getTable('usuarios');
    const estacionamientos = getTable('estacionamientos');

    // Unidad del propietario
    const miApto = useMemo(() => apartamentos.find(a => a.id_usuario === authUser?.id), [apartamentos, authUser]);

    const initialTab = searchParams.get("tab") || "carritos";

    // Estados
    const [activeTab, setActiveTab] = useState(initialTab);

    useEffect(() => {
        const tab = searchParams.get("tab");
        if (tab && (tab === "carritos" || tab === "estacionamiento")) {
            setActiveTab(tab);
        }
    }, [searchParams]);

    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    // --- LÓGICA CARRITOS (MIS PRÉSTAMOS) ---
    const mappedLogsCarritos = useMemo(() => {
        if (!miApto) return [];
        return logsCarritos.filter(log => log.id_apartamento === miApto.id).map(log => {
            const carrito = carritos.find(c => c.id === log.id_carrito);
            const user = usuarios.find(u => u.id === log.id_usuario);
            
            return {
                ...log,
                carritoNombre: carrito?.nombre || `Carrito ${log.id_carrito}`,
                usuarioNombre: user?.nombre || "N/A",
                estado: log.fecha_salida ? "Devuelto" : "En uso"
            };
        }).sort((a, b) => new Date(b.fecha_entrada) - new Date(a.fecha_entrada));
    }, [logsCarritos, carritos, miApto, usuarios]);

    // --- LÓGICA ESTACIONAMIENTO (MIS ACCESOS) ---
    const mappedLogsEstacionamiento = useMemo(() => {
        if (!miApto) return [];
        
        // Estacionamientos vinculados a mi apto
        const misEstacionamientosIds = estacionamientos.filter(e => e.id_apartamento === miApto.id).map(e => e.id);

        return logsVehiculos.filter(log => misEstacionamientosIds.includes(log.id_estacionamiento)).map(log => {
            const vehiculo = vehiculosTable.find(v => v.id === log.id_vehiculo);
            const estacionamiento = estacionamientos.find(e => e.id === log.id_estacionamiento);
            
            return {
                ...log,
                vehiculoInfo: vehiculo ? `${vehiculo.marca} ${vehiculo.modelo} (${vehiculo.color})` : "Vehículo externo",
                estacionamientoNumero: estacionamiento?.numero || "N/A",
                estado: log.fecha_salida ? "Fuera" : "En recinto"
            };
        }).sort((a, b) => new Date(b.fecha_entrada) - new Date(a.fecha_entrada));
    }, [logsVehiculos, vehiculosTable, estacionamientos, miApto]);

    // Filtrado Dinámico
    const filteredData = useMemo(() => {
        const source = activeTab === "carritos" ? mappedLogsCarritos : mappedLogsEstacionamiento;
        
        return source.filter(item => {
            const matchesSearch = activeTab === "carritos" 
                ? (item.carritoNombre.toLowerCase().includes(searchTerm.toLowerCase()))
                : (item.placa.toLowerCase().includes(searchTerm.toLowerCase()) || item.vehiculoInfo.toLowerCase().includes(searchTerm.toLowerCase()));
            return matchesSearch;
        });
    }, [activeTab, mappedLogsCarritos, mappedLogsEstacionamiento, searchTerm]);

    // Paginación
    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
    const paginatedData = filteredData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    // El formateo de fecha se movió al componente ActivityTable

    if (!miApto) {
        return (
            <AnimatedPage>
                <div className="container-fluid py-4 bg-light min-vh-100 d-flex align-items-center justify-content-center">
                    <Card className="border-0 shadow-sm rounded-4 p-5 text-center">
                        <FaHistory size={60} className="text-muted mb-3 mx-auto" />
                        <h3 className="fw-bold text-dark">Actividad no disponible</h3>
                        <p className="text-muted">Necesitas una unidad asignada para ver tu historial.</p>
                    </Card>
                </div>
            </AnimatedPage>
        );
    }

    return (
        <AnimatedPage>
            <div className="container-fluid py-4 bg-light min-vh-100">
                <DashboardHeader 
                    icon={FaHistory}
                    title="Mi Historial de Actividad"
                    badgeText="Residente"
                    welcomeText="Consulta el historial de accesos de tus vehículos y préstamos de carritos."
                />

                <Row className="g-4 mb-5">
                    <StatCard 
                        icon={FaCar} 
                        label="Accesos Vehiculares" 
                        value={mappedLogsEstacionamiento.length} 
                        colorClass="primary" 
                    />
                    <StatCard 
                        icon={FaShoppingCart} 
                        label="Uso de Carritos" 
                        value={mappedLogsCarritos.length} 
                        colorClass="info" 
                    />
                    <StatCard 
                        icon={FaCheckCircle} 
                        label="Registros Totales" 
                        value={filteredData.length} 
                        colorClass="success" 
                    />
                </Row>

                <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                    <Card.Header className="bg-white border-0 pt-4 px-4">
                        <Tabs
                            activeKey={activeTab}
                            onSelect={(k) => { setActiveTab(k); setSearchTerm(""); setCurrentPage(1); }}
                            className="custom-tabs mb-4"
                            variant="pills"
                        >
                            <Tab eventKey="carritos" title={<span><FaShoppingCart className="me-2" /> Historial Carritos</span>} />
                            <Tab eventKey="estacionamiento" title={<span><FaCar className="me-2" /> Historial Accesos</span>} />
                        </Tabs>

                        <div className="pb-4">
                            <InputGroup className="input-no-shadow bg-light rounded-pill px-3 py-1 border-0">
                                <InputGroup.Text className="bg-transparent border-0 text-muted">
                                    <FaSearch />
                                </InputGroup.Text>
                                <Form.Control 
                                    placeholder={activeTab === "carritos" ? "Buscar por nombre de carrito..." : "Buscar por placa o modelo..."}
                                    className="bg-transparent border-0 py-2 shadow-none"
                                    value={searchTerm}
                                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                />
                            </InputGroup>
                        </div>
                    </Card.Header>

                    <Card.Body className="p-0">
                        <div className="table-responsive">
                            <ActivityTable 
                                type={activeTab} 
                                data={paginatedData} 
                            />
                        </div>
                    </Card.Body>

                    {totalPages > 1 && (
                        <Card.Footer className="bg-white border-0 py-3 px-4 d-flex justify-content-between align-items-center border-top">
                            <div className="small text-muted">
                                Mostrando {paginatedData.length} registros
                            </div>
                            <Pagination className="mb-0 pagination-sm">
                                <Pagination.Prev disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} />
                                {[...Array(totalPages)].map((_, i) => (
                                    <Pagination.Item key={i + 1} active={i + 1 === currentPage} onClick={() => setCurrentPage(i + 1)}>
                                        {i + 1}
                                    </Pagination.Item>
                                ))}
                                <Pagination.Next disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} />
                            </Pagination>
                        </Card.Footer>
                    )}
                </Card>
            </div>

            <style>
                {`
                .custom-tabs.nav-pills .nav-link {
                    color: #212529 !important;
                    background-color: #f1f3f5 !important;
                    font-weight: 600;
                    padding: 0.8rem 1.8rem;
                    border-radius: 12px;
                    transition: all 0.2s;
                }
                .custom-tabs.nav-pills .nav-link.active {
                    background-color: #112d4d !important;
                    color: white !important;
                    box-shadow: 0 4px 12px rgba(17, 45, 77, 0.2);
                }
                .custom-table th { font-size: 0.75rem; letter-spacing: 0.05rem; }
                .text-primary-theme { color: #112d4d; }
                `}
            </style>
        </AnimatedPage>
    );
};

export default PRHistorialPage;
