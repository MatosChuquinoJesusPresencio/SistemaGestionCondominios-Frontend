import { useState, useMemo } from "react";
import { Card, Col, Row, Table, Badge, Form, InputGroup, Pagination, Tabs, Tab } from "react-bootstrap";
import { FaListAlt, FaShoppingCart, FaCar, FaSearch, FaFilter, FaCalendarAlt, FaClock, FaCheckCircle, FaExclamationCircle, FaUser, FaHome } from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";
import { useData } from "../../hooks/useData";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import AnimatedPage from "../../components/animations/AnimatedPage";
import StatCard from "../../components/dashboard/StatCard";

const ACLogsPage = () => {
    const { authUser } = useAuth();
    const { getTable } = useData();
    
    // Datos
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

    const condo = condominios.find(c => c.id === authUser?.id_condominio);

    // Estados
    const [activeTab, setActiveTab] = useState("carritos");
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    // --- LÓGICA CARRITOS ---
    const mappedLogsCarritos = useMemo(() => {
        return logsCarritos.filter(log => {
            const apto = apartamentos.find(a => a.id === log.id_apartamento);
            const piso = pisos.find(p => p.id === apto?.id_piso);
            const torre = torres.find(t => t.id === piso?.id_torre);
            return torre?.id_condominio === authUser?.id_condominio;
        }).map(log => {
            const carrito = carritos.find(c => c.id === log.id_carrito);
            const apto = apartamentos.find(a => a.id === log.id_apartamento);
            const user = usuarios.find(u => u.id === log.id_usuario);
            
            return {
                ...log,
                carritoNombre: carrito?.nombre || `Carrito ${log.id_carrito}`,
                aptoNumero: apto?.numero || "N/A",
                usuarioNombre: user?.nombre || "N/A",
                estado: log.fecha_salida ? "Devuelto" : "En uso"
            };
        }).sort((a, b) => new Date(b.fecha_entrada) - new Date(a.fecha_entrada));
    }, [logsCarritos, carritos, apartamentos, usuarios, pisos, torres, authUser]);

    // --- LÓGICA ESTACIONAMIENTO ---
    const mappedLogsEstacionamiento = useMemo(() => {
        return logsVehiculos.filter(log => {
            const estacionamiento = estacionamientos.find(e => e.id === log.id_estacionamiento);
            const apto = apartamentos.find(a => a.id === estacionamiento?.id_apartamento);
            const piso = pisos.find(p => p.id === apto?.id_piso);
            const torre = torres.find(t => t.id === piso?.id_torre);
            return torre?.id_condominio === authUser?.id_condominio;
        }).map(log => {
            const vehiculo = vehiculos.find(v => v.id === log.id_vehiculo);
            const estacionamiento = estacionamientos.find(e => e.id === log.id_estacionamiento);
            
            return {
                ...log,
                vehiculoInfo: vehiculo ? `${vehiculo.marca} ${vehiculo.modelo} (${vehiculo.color})` : "Vehículo externo",
                estacionamientoNumero: estacionamiento?.numero || "N/A",
                estado: log.fecha_salida ? "Fuera" : "En recinto"
            };
        }).sort((a, b) => new Date(b.fecha_entrada) - new Date(a.fecha_entrada));
    }, [logsVehiculos, vehiculos, estacionamientos, apartamentos, pisos, torres, authUser]);

    // Filtrado Dinámico
    const filteredData = useMemo(() => {
        const source = activeTab === "carritos" ? mappedLogsCarritos : mappedLogsEstacionamiento;
        setCurrentPage(1);
        
        return source.filter(item => {
            const matchesSearch = activeTab === "carritos" 
                ? (item.carritoNombre.toLowerCase().includes(searchTerm.toLowerCase()) || item.aptoNumero.toLowerCase().includes(searchTerm.toLowerCase()))
                : (item.placa.toLowerCase().includes(searchTerm.toLowerCase()) || item.vehiculoInfo.toLowerCase().includes(searchTerm.toLowerCase()));
            
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
                    title="Bitácora de Operaciones"
                    badgeText={condo?.nombre || "Condominio"}
                    welcomeText="Monitorea el historial de préstamos de carritos y el flujo de estacionamiento."
                />

                <Row className="g-4 mb-5">
                    <StatCard 
                        icon={FaShoppingCart} 
                        label="Carritos en Uso" 
                        value={mappedLogsCarritos.filter(l => !l.fecha_salida).length} 
                        colorClass="primary" 
                    />
                    <StatCard 
                        icon={FaCar} 
                        label="Vehículos en Recinto" 
                        value={mappedLogsEstacionamiento.filter(l => !l.fecha_salida).length} 
                        colorClass="info" 
                    />
                    <StatCard 
                        icon={FaCheckCircle} 
                        label="Total Operaciones" 
                        value={filteredData.length} 
                        colorClass="success" 
                    />
                </Row>

                <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                    <Card.Header className="bg-white border-0 pt-4 px-4">
                        <Tabs
                            activeKey={activeTab}
                            onSelect={(k) => { setActiveTab(k); setStatusFilter("all"); setSearchTerm(""); }}
                            className="custom-tabs mb-4"
                            variant="pills"
                        >
                            <Tab eventKey="carritos" title={<span><FaShoppingCart className="me-2" /> Préstamo de Carritos</span>} />
                            <Tab eventKey="estacionamiento" title={<span><FaCar className="me-2" /> Bitácora de Estacionamiento</span>} />
                        </Tabs>

                        <Row className="align-items-center g-3 pb-4">
                            <Col md={5}>
                                <InputGroup className="input-no-shadow bg-light rounded-pill px-3 py-1 border-0">
                                    <InputGroup.Text className="bg-transparent border-0 text-muted">
                                        <FaSearch />
                                    </InputGroup.Text>
                                    <Form.Control 
                                        placeholder={activeTab === "carritos" ? "Buscar por carrito o unidad..." : "Buscar por placa o vehículo..."}
                                        className="bg-transparent border-0 py-2 shadow-none"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </InputGroup>
                            </Col>
                            <Col md={3}>
                                <Form.Select 
                                    className="form-control rounded-pill border-light shadow-sm py-2 px-3 small"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="all">Todos los registros</option>
                                    <option value="active">{activeTab === "carritos" ? "En uso actualmente" : "Dentro del recinto"}</option>
                                    <option value="finished">{activeTab === "carritos" ? "Completados/Devueltos" : "Salidas registradas"}</option>
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
                                            <th className="px-4 py-3 border-0">Carrito</th>
                                            <th className="py-3 border-0">Solicitante</th>
                                            <th className="py-3 border-0">Unidad</th>
                                            <th className="py-3 border-0">Entrada</th>
                                            <th className="py-3 border-0">Salida / Devolución</th>
                                            <th className="py-3 border-0">Penalización</th>
                                            <th className="px-4 py-3 border-0 text-center">Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedData.length > 0 ? paginatedData.map(log => (
                                            <tr key={log.id} className="border-bottom border-light">
                                                <td className="px-4 py-3">
                                                    <div className="fw-bold text-primary-theme">{log.carritoNombre}</div>
                                                    <div className="x-small text-muted">Log ID: #{log.id}</div>
                                                </td>
                                                <td className="py-3">
                                                    <div className="d-flex align-items-center gap-2 small">
                                                        <FaUser className="text-muted x-small" /> {log.usuarioNombre}
                                                        <Badge bg="light" className="text-secondary fw-normal border">{log.solicitante}</Badge>
                                                    </div>
                                                </td>
                                                <td className="py-3">
                                                    <div className="d-flex align-items-center gap-2 small">
                                                        <FaHome className="text-muted x-small" /> {log.aptoNumero}
                                                    </div>
                                                </td>
                                                <td className="py-3">
                                                    <div className="small"><FaClock className="me-1 text-muted" /> {formatDateTime(log.fecha_entrada)}</div>
                                                </td>
                                                <td className="py-3">
                                                    <div className="small">{log.fecha_salida ? <><FaClock className="me-1 text-muted" /> {formatDateTime(log.fecha_salida)}</> : <span className="text-warning fw-bold">Pendiente</span>}</div>
                                                </td>
                                                <td className="py-3">
                                                    <span className={log.penalizacion > 0 ? "text-danger fw-bold" : "text-success"}>
                                                        S/ {log.penalizacion.toFixed(2)}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <Badge bg={log.fecha_salida ? "success" : "warning"} className="rounded-pill px-3 py-1">
                                                        {log.estado}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="7" className="text-center py-5 text-muted italic">
                                                    No se encontraron registros de préstamos de carritos.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            ) : (
                                <Table hover className="align-middle mb-0 custom-table">
                                    <thead className="bg-light text-muted small text-uppercase">
                                        <tr>
                                            <th className="px-4 py-3 border-0">Placa / Vehículo</th>
                                            <th className="py-3 border-0">Ocupante</th>
                                            <th className="py-3 border-0 text-center">Estacionamiento</th>
                                            <th className="py-3 border-0">Entrada</th>
                                            <th className="py-3 border-0">Salida</th>
                                            <th className="py-3 border-0">Método</th>
                                            <th className="px-4 py-3 border-0 text-center">Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedData.length > 0 ? paginatedData.map(log => (
                                            <tr key={log.id} className="border-bottom border-light">
                                                <td className="px-4 py-3">
                                                    <div className="fw-bold text-dark">{log.placa}</div>
                                                    <div className="x-small text-muted">{log.vehiculoInfo}</div>
                                                </td>
                                                <td className="py-3">
                                                    <div className="small fw-medium">{log.datos_inquilino || "Propietario"}</div>
                                                    <div className="x-small text-muted">{log.tipo_ocupante}</div>
                                                </td>
                                                <td className="py-3 text-center">
                                                    <Badge bg="dark" className="rounded-2">{log.estacionamientoNumero}</Badge>
                                                </td>
                                                <td className="py-3">
                                                    <div className="small"><FaCalendarAlt className="me-1 text-muted" /> {formatDateTime(log.fecha_entrada)}</div>
                                                </td>
                                                <td className="py-3">
                                                    <div className="small">{log.fecha_salida ? <><FaCalendarAlt className="me-1 text-muted" /> {formatDateTime(log.fecha_salida)}</> : <span className="text-info fw-bold">En el sitio</span>}</div>
                                                </td>
                                                <td className="py-3">
                                                    <Badge bg="light" className="text-secondary border fw-normal">{log.metodo}</Badge>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <Badge bg={log.fecha_salida ? "secondary" : "info"} className="rounded-pill px-3 py-1">
                                                        {log.estado}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="7" className="text-center py-5 text-muted italic">
                                                    No se encontraron registros de estacionamiento.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            )}
                        </div>
                    </Card.Body>

                    {totalPages > 1 && (
                        <Card.Footer className="bg-white border-0 py-3 px-4 d-flex justify-content-between align-items-center border-top">
                            <div className="small text-muted">
                                Mostrando {paginatedData.length} de {filteredData.length} registros
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
                .custom-tabs {
                    gap: 12px;
                }
                .custom-tabs.nav-pills .nav-link {
                    color: #212529 !important;
                    background-color: #f1f3f5 !important;
                    font-weight: 600;
                    border: none;
                    padding: 0.8rem 1.8rem;
                    border-radius: 12px;
                    transition: all 0.2s ease-in-out;
                    opacity: 0.85;
                }
                .custom-tabs.nav-pills .nav-link:hover {
                    background-color: #e9ecef !important;
                    opacity: 1;
                }
                .custom-tabs.nav-pills .nav-link.active {
                    background-color: #112d4d !important;
                    color: white !important;
                    opacity: 1;
                    box-shadow: 0 4px 12px rgba(17, 45, 77, 0.25);
                }
                .custom-table th {
                    font-size: 0.75rem;
                    letter-spacing: 0.05rem;
                }
                .custom-table tbody tr:hover {
                    background-color: rgba(0,0,0,0.01);
                }
                `}
            </style>
        </AnimatedPage>
    );
};

export default ACLogsPage;
