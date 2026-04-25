import { useState, useMemo } from "react";
import { Card, Col, Row, Table, Badge, Form, InputGroup, Pagination, Tabs, Tab } from "react-bootstrap";
import { FaListAlt, FaShoppingCart, FaCar, FaSearch, FaFilter, FaCalendarAlt, FaClock, FaCheckCircle, FaUser, FaHome, FaBuilding } from "react-icons/fa";
import { useData } from "../../hooks/useData";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import AnimatedPage from "../../components/animations/AnimatedPage";
import StatCard from "../../components/dashboard/StatCard";

const SABitacoraPage = () => {
    const { getTable } = useData();
    
    // Tablas
    const logsCarritos = getTable('logs_prestamo_carrito');
    const logsVehiculos = getTable('logs_acceso_vehicular');
    const carritos = getTable('carritos_carga');
    const vehiculos = getTable('vehiculos');
    const apartamentos = getTable('apartamentos');
    const usuarios = getTable('usuarios');
    const estacionamientos = getTable('estacionamientos');
    const condominios = getTable('condominios');
    const pisos = getTable('pisos');
    const torres = getTable('torres');

    // Estados
    const [selectedCondo, setSelectedCondo] = useState("all");
    const [activeTab, setActiveTab] = useState("carritos");
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    // --- LÓGICA CARRITOS ---
    const mappedLogsCarritos = useMemo(() => {
        return logsCarritos.map(log => {
            const apto = apartamentos.find(a => a.id === log.id_apartamento);
            const piso = pisos.find(p => p.id === apto?.id_piso);
            const torre = torres.find(t => t.id === piso?.id_torre);
            const condo = condominios.find(c => c.id === torre?.id_condominio);
            
            const carrito = carritos.find(c => c.id === log.id_carrito);
            const user = usuarios.find(u => u.id === log.id_usuario);
            
            return {
                ...log,
                condoId: condo?.id,
                condoNombre: condo?.nombre || "N/A",
                carritoNombre: carrito?.nombre || `Carrito ${log.id_carrito}`,
                aptoNumero: apto?.numero || "N/A",
                usuarioNombre: user?.nombre || "N/A",
                estado: log.fecha_salida ? "Devuelto" : "En uso"
            };
        }).filter(log => selectedCondo === "all" || log.condoId === parseInt(selectedCondo))
          .sort((a, b) => new Date(b.fecha_entrada) - new Date(a.fecha_entrada));
    }, [logsCarritos, carritos, apartamentos, usuarios, pisos, torres, condominios, selectedCondo]);

    // --- LÓGICA ESTACIONAMIENTO ---
    const mappedLogsEstacionamiento = useMemo(() => {
        return logsVehiculos.map(log => {
            const estacionamiento = estacionamientos.find(e => e.id === log.id_estacionamiento);
            const apto = apartamentos.find(a => a.id === estacionamiento?.id_apartamento);
            const piso = pisos.find(p => p.id === apto?.id_piso);
            const torre = torres.find(t => t.id === piso?.id_torre);
            const condo = condominios.find(c => c.id === torre?.id_condominio);

            const vehiculo = vehiculos.find(v => v.id === log.id_vehiculo);
            
            return {
                ...log,
                condoId: condo?.id,
                condoNombre: condo?.nombre || "N/A",
                vehiculoInfo: vehiculo ? `${vehiculo.marca} ${vehiculo.modelo} (${vehiculo.color})` : "Vehículo externo",
                estacionamientoNumero: estacionamiento?.numero || "N/A",
                estado: log.fecha_salida ? "Fuera" : "En recinto"
            };
        }).filter(log => selectedCondo === "all" || log.condoId === parseInt(selectedCondo))
          .sort((a, b) => new Date(b.fecha_entrada) - new Date(a.fecha_entrada));
    }, [logsVehiculos, vehiculos, estacionamientos, apartamentos, pisos, torres, condominios, selectedCondo]);

    // Filtrado Dinámico
    const filteredData = useMemo(() => {
        const source = activeTab === "carritos" ? mappedLogsCarritos : mappedLogsEstacionamiento;
        
        return source.filter(item => {
            const matchesSearch = activeTab === "carritos" 
                ? (item.carritoNombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
                   item.aptoNumero.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   item.condoNombre.toLowerCase().includes(searchTerm.toLowerCase()))
                : (item.placa.toLowerCase().includes(searchTerm.toLowerCase()) || 
                   item.vehiculoInfo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   item.condoNombre.toLowerCase().includes(searchTerm.toLowerCase()));
            
            const matchesStatus = statusFilter === "all" || (statusFilter === "active" ? !item.fecha_salida : item.fecha_salida);
            
            return matchesSearch && matchesStatus;
        });
    }, [activeTab, mappedLogsCarritos, mappedLogsEstacionamiento, searchTerm, statusFilter]);

    // Paginación
    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
    const paginatedData = filteredData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const formatDateTime = (isoString) => {
        if (!isoString) return "---";
        const date = new Date(isoString);
        return date.toLocaleString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    return (
        <AnimatedPage>
            <div className="container-fluid py-4 bg-light min-vh-100">
                <DashboardHeader 
                    icon={FaListAlt}
                    title="Bitácora Global de Auditoría"
                    badgeText="Super Admin"
                    welcomeText="Supervisa el flujo de operaciones en todos los condominios registrados."
                />

                <Row className="g-4 mb-5">
                    <StatCard 
                        icon={FaBuilding} 
                        label="Condominios Activos" 
                        value={condominios.length} 
                        colorClass="primary" 
                    />
                    <StatCard 
                        icon={FaShoppingCart} 
                        label="Préstamos Totales" 
                        value={mappedLogsCarritos.length} 
                        colorClass="info" 
                    />
                    <StatCard 
                        icon={FaCheckCircle} 
                        label="Total Auditoría" 
                        value={filteredData.length} 
                        colorClass="success" 
                    />
                </Row>

                <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                    <Card.Header className="bg-white border-0 pt-4 px-4">
                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                            <Tabs
                                activeKey={activeTab}
                                onSelect={(k) => { setActiveTab(k); setStatusFilter("all"); setSearchTerm(""); setCurrentPage(1); }}
                                className="custom-tabs border-0"
                                variant="pills"
                            >
                                <Tab eventKey="carritos" title={<span><FaShoppingCart className="me-2" /> Carritos</span>} />
                                <Tab eventKey="estacionamiento" title={<span><FaCar className="me-2" /> Estacionamiento</span>} />
                            </Tabs>

                            <div style={{ minWidth: '250px' }}>
                                <Form.Group className="d-flex align-items-center gap-2">
                                    <FaBuilding className="text-muted" />
                                    <Form.Select 
                                        className="form-control rounded-pill border-light shadow-sm py-2 px-3 small"
                                        value={selectedCondo}
                                        onChange={(e) => { setSelectedCondo(e.target.value); setCurrentPage(1); }}
                                    >
                                        <option value="all">Todos los Condominios</option>
                                        {condominios.map(c => (
                                            <option key={c.id} value={c.id}>{c.nombre}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </div>
                        </div>

                        <Row className="align-items-center g-3 pb-4">
                            <Col md={7}>
                                <InputGroup className="input-no-shadow bg-light rounded-pill px-3 py-1 border-0">
                                    <InputGroup.Text className="bg-transparent border-0 text-muted">
                                        <FaSearch />
                                    </InputGroup.Text>
                                    <Form.Control 
                                        placeholder="Buscar por placa, unidad, condominio..."
                                        className="bg-transparent border-0 py-2 shadow-none"
                                        value={searchTerm}
                                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                    />
                                </InputGroup>
                            </Col>
                            <Col md={5}>
                                <Form.Select 
                                    className="form-control rounded-pill border-light shadow-sm py-2 px-3 small"
                                    value={statusFilter}
                                    onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                                >
                                    <option value="all">Todos los estados</option>
                                    <option value="active">{activeTab === "carritos" ? "En uso" : "En recinto"}</option>
                                    <option value="finished">Finalizados</option>
                                </Form.Select>
                            </Col>
                        </Row>
                    </Card.Header>

                    <Card.Body className="p-0">
                        <div className="table-responsive">
                            {activeTab === "carritos" ? (
                                <Table hover className="align-middle mb-0 custom-table">
                                    <thead className="bg-light text-muted small text-uppercase">
                                        <tr>
                                            <th className="px-4 py-3 border-0">Condominio</th>
                                            <th className="py-3 border-0">Unidad</th>
                                            <th className="py-3 border-0">Carrito</th>
                                            <th className="py-3 border-0">Entrada</th>
                                            <th className="py-3 border-0 text-center">Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedData.length > 0 ? paginatedData.map(log => (
                                            <tr key={log.id} className="border-bottom border-light">
                                                <td className="px-4 py-3">
                                                    <div className="fw-bold text-dark">{log.condoNombre}</div>
                                                </td>
                                                <td className="py-3">
                                                    <div className="small"><FaHome className="me-1 text-muted" /> {log.aptoNumero}</div>
                                                </td>
                                                <td className="py-3">
                                                    <div className="small fw-medium">{log.carritoNombre}</div>
                                                </td>
                                                <td className="py-3">
                                                    <div className="x-small"><FaClock className="me-1 text-muted" /> {formatDateTime(log.fecha_entrada)}</div>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <Badge bg={log.fecha_salida ? "success" : "warning"} className="rounded-pill px-3 py-1">
                                                        {log.estado}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr><td colSpan="5" className="text-center py-5 text-muted">No hay registros para mostrar</td></tr>
                                        )}
                                    </tbody>
                                </Table>
                            ) : (
                                <Table hover className="align-middle mb-0 custom-table">
                                    <thead className="bg-light text-muted small text-uppercase">
                                        <tr>
                                            <th className="px-4 py-3 border-0">Condominio</th>
                                            <th className="py-3 border-0">Vehículo / Placa</th>
                                            <th className="py-3 border-0">Estacionamiento</th>
                                            <th className="py-3 border-0">Entrada</th>
                                            <th className="px-4 py-3 border-0 text-center">Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedData.length > 0 ? paginatedData.map(log => (
                                            <tr key={log.id} className="border-bottom border-light">
                                                <td className="px-4 py-3">
                                                    <div className="fw-bold text-dark">{log.condoNombre}</div>
                                                </td>
                                                <td className="py-3">
                                                    <div className="fw-bold small">{log.placa}</div>
                                                    <div className="x-small text-muted">{log.vehiculoInfo}</div>
                                                </td>
                                                <td className="py-3">
                                                    <Badge bg="dark" className="rounded-2">{log.estacionamientoNumero}</Badge>
                                                </td>
                                                <td className="py-3">
                                                    <div className="x-small"><FaCalendarAlt className="me-1 text-muted" /> {formatDateTime(log.fecha_entrada)}</div>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <Badge bg={log.fecha_salida ? "secondary" : "info"} className="rounded-pill px-3 py-1">
                                                        {log.estado}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr><td colSpan="5" className="text-center py-5 text-muted">No hay registros para mostrar</td></tr>
                                        )}
                                    </tbody>
                                </Table>
                            )}
                        </div>
                    </Card.Body>

                    {totalPages > 1 && (
                        <Card.Footer className="bg-white border-0 py-3 px-4 d-flex justify-content-between align-items-center border-top">
                            <div className="small text-muted">
                                Auditoría: {filteredData.length} registros totales
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
                .custom-tabs { gap: 12px; }
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
                `}
            </style>
        </AnimatedPage>
    );
};

export default SABitacoraPage;
