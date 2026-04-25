import { useState, useMemo } from "react";
import { Button, Card, Col, Row, Table, Badge, Modal, Form, InputGroup, Pagination } from "react-bootstrap";
import { FaHome, FaUser, FaUsers, FaSearch, FaFilter, FaBuilding, FaSitemap, FaInfoCircle, FaMapMarkerAlt, FaEye } from "react-icons/fa";
import { useData } from "../../hooks/useData";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import StatCard from "../../components/dashboard/StatCard";
import AnimatedPage from "../../components/animations/AnimatedPage";

const SAUnidadesPage = () => {
    const { getTable } = useData();
    
    // Datos globales
    const apartamentos = getTable('apartamentos');
    const pisos = getTable('pisos');
    const torres = getTable('torres');
    const usuarios = getTable('usuarios');
    const condominios = getTable('condominios');
    const inquilinosTemporales = getTable('inquilinos_temporales');

    // Estados
    const [searchTerm, setSearchTerm] = useState("");
    const [condoFilter, setCondoFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;
    
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedAptoId, setSelectedAptoId] = useState(null);

    // Mapear todos los apartamentos con sus relaciones globales
    const allAptos = useMemo(() => {
        return apartamentos.map(a => {
            const piso = pisos.find(p => p.id === a.id_piso);
            const torre = torres.find(t => t.id === piso?.id_torre);
            const condo = condominios.find(c => c.id === torre?.id_condominio);
            const owner = usuarios.find(u => u.id === a.id_usuario);
            const residents = inquilinosTemporales.filter(i => i.id_apartamento === a.id);
            
            return {
                ...a,
                condoId: condo?.id,
                condoNombre: condo?.nombre || "N/A",
                torreNombre: torre?.nombre || "N/A",
                pisoNumero: piso?.numero_piso || "?",
                ownerName: owner?.nombre || "Sin Propietario",
                residents: residents
            };
        });
    }, [apartamentos, pisos, torres, condominios, usuarios, inquilinosTemporales]);

    // Estadísticas Globales
    const stats = useMemo(() => ({
        totalUnidades: allAptos.length,
        totalCondos: condominios.length,
        ocupacion: allAptos.length > 0 ? Math.round((allAptos.filter(a => a.id_usuario !== null).length / allAptos.length) * 100) : 0,
        totalPoblacion: inquilinosTemporales.length
    }), [allAptos, condominios, inquilinosTemporales]);

    // Filtrado de la tabla
    const filteredAptos = useMemo(() => {
        setCurrentPage(1);
        return allAptos.filter(apto => {
            const matchesSearch = apto.numero.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                apto.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                apto.condoNombre.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCondo = condoFilter === "all" || apto.condoId?.toString() === condoFilter;
            
            return matchesSearch && matchesCondo;
        });
    }, [allAptos, searchTerm, condoFilter]);

    // Paginación
    const totalPages = Math.ceil(filteredAptos.length / ITEMS_PER_PAGE);
    const paginatedAptos = filteredAptos.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // Handlers
    const handleViewDetails = (aptoId) => {
        setSelectedAptoId(aptoId);
        setShowDetailModal(true);
    };

    const currentApto = useMemo(() => {
        return allAptos.find(a => a.id === selectedAptoId);
    }, [allAptos, selectedAptoId]);

    return (
        <AnimatedPage>
            <div className="container-fluid py-4 bg-light min-vh-100">
                <DashboardHeader 
                    icon={FaSitemap}
                    title="Explorador Global de Unidades"
                    badgeText="Vista de Auditoría"
                    welcomeText="Supervisa la ocupación y distribución de unidades habitacionales en todos los condominios registrados."
                />

                <Row className="g-4 mb-5">
                    <StatCard icon={FaBuilding} label="Total Unidades" value={stats.totalUnidades} colorClass="primary" />
                    <StatCard icon={FaMapMarkerAlt} label="Condominios" value={stats.totalCondos} colorClass="info" />
                    <StatCard icon={FaInfoCircle} label="Ocupación Global" value={`${stats.ocupacion}%`} colorClass="success" />
                    <StatCard icon={FaUsers} label="Inquilinos Totales" value={stats.totalPoblacion} colorClass="warning" />
                </Row>

                <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                    <Card.Header className="bg-white border-0 py-4 px-4">
                        <Row className="align-items-center g-3">
                            <Col lg={4}>
                                <InputGroup className="input-no-shadow bg-light rounded-pill px-3 py-1 border-0">
                                    <InputGroup.Text className="bg-transparent border-0 text-muted">
                                        <FaSearch />
                                    </InputGroup.Text>
                                    <Form.Control 
                                        placeholder="Buscar por unidad, propietario o condo..." 
                                        className="bg-transparent border-0 py-2 shadow-none"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </InputGroup>
                            </Col>
                            <Col lg={3}>
                                <Form.Select 
                                    className="form-control rounded-pill border-light shadow-sm py-2 px-3 small"
                                    value={condoFilter}
                                    onChange={(e) => setCondoFilter(e.target.value)}
                                >
                                    <option value="all">Todos los Condominios</option>
                                    {condominios.map(c => (
                                        <option key={c.id} value={c.id}>{c.nombre}</option>
                                    ))}
                                </Form.Select>
                            </Col>

                        </Row>
                    </Card.Header>
                    <Card.Body className="p-0">
                        <div className="table-responsive">
                            <Table hover className="align-middle mb-0 custom-table">
                                <thead className="bg-light text-muted small text-uppercase">
                                    <tr>
                                        <th className="px-4 py-3 border-0">Condominio</th>
                                        <th className="py-3 border-0">Unidad</th>
                                        <th className="py-3 border-0">Ubicación</th>
                                        <th className="py-3 border-0">Propietario</th>
                                        <th className="py-3 border-0 text-center">Residentes</th>
                                        <th className="px-4 py-3 border-0 text-end">Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedAptos.length > 0 ? paginatedAptos.map((apto) => (
                                        <tr key={apto.id} className="border-bottom border-light">
                                            <td className="px-4 py-3">
                                                <div className="fw-bold text-primary-theme small">{apto.condoNombre}</div>
                                                <div className="x-small text-muted">ID Condo: {apto.condoId}</div>
                                            </td>
                                            <td className="py-3">
                                                <Badge bg="dark" className="rounded-3 px-2 py-1 small">{apto.numero}</Badge>
                                            </td>
                                            <td className="py-3">
                                                <div className="small text-secondary">
                                                    {apto.torreNombre} • Piso {apto.pisoNumero}
                                                </div>
                                            </td>
                                            <td className="py-3">
                                                <div className="small fw-medium text-dark">
                                                    {apto.ownerName}
                                                </div>
                                            </td>
                                            <td className="py-3 text-center">
                                                <Badge bg={apto.residents.length > 0 ? "info" : "light"} className={`rounded-pill px-2 ${apto.residents.length === 0 ? "text-muted border" : ""}`}>
                                                    {apto.residents.length}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3 text-end">
                                                <Button 
                                                    variant="light" 
                                                    className="btn-sm rounded-circle p-2 text-primary"
                                                    onClick={() => handleViewDetails(apto.id)}
                                                >
                                                    <FaEye />
                                                </Button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="6" className="text-center py-5 text-muted italic">
                                                No hay unidades que coincidan con los criterios de búsqueda global.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </div>
                    </Card.Body>
                    {totalPages > 1 && (
                        <Card.Footer className="bg-white border-0 py-3 px-4 d-flex justify-content-between align-items-center border-top">
                            <div className="small text-muted">
                                Mostrando {paginatedAptos.length} de {filteredAptos.length} unidades totales
                            </div>
                            <Pagination className="mb-0 pagination-sm">
                                <Pagination.Prev disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} />
                                {[...Array(totalPages)].map((_, i) => (
                                    <Pagination.Item key={i+1} active={i+1 === currentPage} onClick={() => setCurrentPage(i+1)}>
                                        {i+1}
                                    </Pagination.Item>
                                ))}
                                <Pagination.Next disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} />
                            </Pagination>
                        </Card.Footer>
                    )}
                </Card>
            </div>

            {/* Modal Detalle de Residentes (Solo Lectura) */}
            <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} centered>
                <Modal.Header closeButton className="border-0 p-4 pb-0">
                    <Modal.Title className="fw-bold text-primary-theme">
                        Detalle de Residentes
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    <div className="mb-4 d-flex align-items-center gap-3 p-3 bg-light rounded-4">
                        <div className="p-3 bg-white rounded-3 shadow-sm text-primary">
                            <FaHome size={24} />
                        </div>
                        <div>
                            <div className="fw-bold text-dark">Unidad {currentApto?.numero}</div>
                            <div className="small text-muted">{currentApto?.condoNombre} • {currentApto?.torreNombre}</div>
                        </div>
                    </div>

                    <h6 className="fw-bold text-secondary mb-3 small text-uppercase">Propietario Legal</h6>
                    <div className="p-2 px-3 border rounded-pill mb-4 small fw-medium text-dark bg-white">
                        <FaUser className="me-2 text-muted x-small" /> {currentApto?.ownerName}
                    </div>

                    <h6 className="fw-bold text-secondary mb-3 small text-uppercase">Residentes / Inquilinos</h6>
                    <div className="list-group list-group-flush border rounded-4 overflow-hidden">
                        {currentApto?.residents.length > 0 ? (
                            currentApto.residents.map(r => (
                                <div key={r.id} className="list-group-item border-0 py-3 bg-transparent d-flex justify-content-between align-items-center border-bottom border-light">
                                    <div>
                                        <div className="fw-bold small">{r.nombre}</div>
                                        <div className="x-small text-muted">DNI: {r.dni}</div>
                                    </div>
                                    <Badge bg="light" className="text-muted border rounded-pill fw-normal">Inquilino</Badge>
                                </div>
                            ))
                        ) : (
                            <div className="p-4 text-center text-muted small italic">
                                No hay inquilinos registrados para esta unidad.
                            </div>
                        )}
                    </div>
                </Modal.Body>
                <Modal.Footer className="border-0 p-4 pt-0">
                    <Button variant="primary" className="btn-primary-theme rounded-pill px-4 w-100 fw-bold" onClick={() => setShowDetailModal(false)}>
                        Entendido
                    </Button>
                </Modal.Footer>
            </Modal>

            <style>
                {`
                .custom-table th {
                    font-size: 0.7rem;
                    letter-spacing: 0.05rem;
                }
                `}
            </style>
        </AnimatedPage>
    );
};

export default SAUnidadesPage;
