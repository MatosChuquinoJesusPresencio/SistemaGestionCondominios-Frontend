import { useState, useMemo } from "react";
import {
  Button,
  Card,
  Col,
  Row,
  Table,
  Badge,
  Modal,
  Form,
} from "react-bootstrap";
import { useForm } from "react-hook-form";
import {
  FaHome,
  FaUser,
  FaUsers,
  FaPlus,
  FaTrash,
  FaInfoCircle,
  FaBuilding,
  FaChevronRight,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";
import { useData } from "../../hooks/useData";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import StatCard from "../../components/dashboard/StatCard";
import AnimatedPage from "../../components/animations/AnimatedPage";
import AuthInput from "../../components/auth/AuthInput";
import SearchBar from "../../components/ui/SearchBar";
import TablePagination from "../../components/ui/TablePagination";
import EmptyState from "../../components/ui/EmptyState";

const ACApartamentosPage = () => {
  const { authUser } = useAuth();
  const { getTable, updateTable } = useData();

  // Datos
  const apartamentos = getTable("apartamentos");
  const pisos = getTable("pisos");
  const torres = getTable("torres");
  const condominio = getTable("condominios").find(
    (c) => c.id === authUser?.id_condominio,
  );

  if (!condominio) {
    return (
      <AnimatedPage>
        <div className="container-fluid py-4 bg-light min-vh-100 d-flex align-items-center justify-content-center">
          <div
            className="text-center p-5 bg-white rounded-4 shadow-sm"
            style={{ maxWidth: "500px" }}
          >
            <div className="p-4 rounded-circle bg-warning bg-opacity-10 text-warning d-inline-block mb-4">
              <FaExclamationTriangle size={50} />
            </div>
            <h3 className="fw-bold text-dark">Sin condominio asignado</h3>
            <p className="text-secondary">
              Actualmente no tienes un condominio bajo tu administración.
              Contacta con el Super Administrador para que se te asigne uno.
            </p>
          </div>
        </div>
      </AnimatedPage>
    );
  }

  // Estados
  const [searchTerm, setSearchTerm] = useState("");
  const [towerFilter, setTowerFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const [showResidentModal, setShowResidentModal] = useState(false);
  const [selectedAptoId, setSelectedAptoId] = useState(null);

  const usuarios = getTable("usuarios");
  const inquilinosTemporales = getTable("inquilinos_temporales");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Filtrar torres del condominio
  const torresCondo = useMemo(() => {
    if (!authUser?.id_condominio) return [];
    return torres.filter((t) => t.id_condominio === authUser.id_condominio);
  }, [torres, authUser]);

  // Filtrar apartamentos del condominio
  const aptosCondo = useMemo(() => {
    const torresIds = torresCondo.map((t) => t.id);
    const pisosIds = pisos
      .filter((p) => torresIds.includes(p.id_torre))
      .map((p) => p.id);

    return apartamentos
      .filter((a) => pisosIds.includes(a.id_piso))
      .map((a) => {
        const piso = pisos.find((p) => p.id === a.id_piso);
        const torre = torres.find((t) => t.id === piso?.id_torre);
        const owner = usuarios.find((u) => u.id === a.id_usuario);

        // Inquilinos temporales vinculados a este apartamento
        const residents = inquilinosTemporales.filter(
          (i) => i.id_apartamento === a.id,
        );

        return {
          ...a,
          torreNombre: torre?.nombre,
          pisoNumero: piso?.numero_piso,
          ownerName: owner?.nombre || "Sin Propietario",
          residents: residents,
        };
      });
  }, [apartamentos, pisos, torresCondo, usuarios, inquilinosTemporales]);

  // Apartamento actualmente seleccionado (fresco)
  const currentApto = useMemo(() => {
    return aptosCondo.find((a) => a.id === selectedAptoId);
  }, [aptosCondo, selectedAptoId]);

  // Estadísticas
  const stats = useMemo(
    () => ({
      total: aptosCondo.length,
      ocupados: aptosCondo.filter((a) => a.id_usuario !== null).length,
      sinPropietario: aptosCondo.filter((a) => a.id_usuario === null).length,
      totalResidentes: inquilinosTemporales.filter((i) => {
        const apto = apartamentos.find((a) => a.id === i.id_apartamento);
        const piso = pisos.find((p) => p.id === apto?.id_piso);
        const torre = torres.find((t) => t.id === piso?.id_torre);
        return torre?.id_condominio === authUser?.id_condominio;
      }).length,
    }),
    [aptosCondo, inquilinosTemporales, apartamentos, pisos, torres, authUser],
  );

  // Filtrado para la tabla
  const filteredAptos = useMemo(() => {
    return aptosCondo.filter((apto) => {
      const matchesSearch =
        apto.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apto.ownerName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTower =
        towerFilter === "all" || apto.torreNombre === towerFilter;

      return matchesSearch && matchesTower;
    });
  }, [aptosCondo, searchTerm, towerFilter]);

  // Paginación
  const totalPages = Math.ceil(filteredAptos.length / ITEMS_PER_PAGE);
  const paginatedAptos = filteredAptos.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  // Handlers para Residentes (Inquilinos)
  const handleManageResidents = (aptoId) => {
    setSelectedAptoId(aptoId);
    setShowResidentModal(true);
  };

  const handleAddResident = (data) => {
    const newId =
      inquilinosTemporales.length > 0
        ? Math.max(...inquilinosTemporales.map((i) => i.id)) + 1
        : 1;
    const newInquilino = {
      id: newId,
      id_apartamento: selectedAptoId,
      nombre: data.nombre,
      dni: data.dni,
    };

    updateTable("inquilinos_temporales", [
      ...inquilinosTemporales,
      newInquilino,
    ]);
    reset();
  };

  const handleRemoveResident = (residentId) => {
    const updated = inquilinosTemporales.filter((i) => i.id !== residentId);
    updateTable("inquilinos_temporales", updated);
  };

  return (
    <AnimatedPage>
      <div className="container-fluid py-4 bg-light min-vh-100">
        <DashboardHeader
          icon={FaHome}
          title="Control de Apartamentos"
          badgeText={condominio?.nombre || "Condominio"}
          welcomeText="Visualiza y gestiona los propietarios e inquilinos de cada unidad habitacional."
        />

        <Row className="g-4 mb-5">
          <StatCard
            icon={FaBuilding}
            label="Total Unidades"
            value={stats.total}
            colorClass="primary"
          />
          <StatCard
            icon={FaCheckCircle}
            label="Ocupados"
            value={stats.ocupados}
            colorClass="success"
          />
          <StatCard
            icon={FaInfoCircle}
            label="Sin Propietario"
            value={stats.sinPropietario}
            colorClass="warning"
          />
          <StatCard
            icon={FaUsers}
            label="Población Estimada"
            value={stats.totalResidentes}
            colorClass="info"
          />
        </Row>

        <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
          <Card.Header className="bg-white border-0 py-4 px-4">
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              placeholder="Buscar por número o propietario..."
              filterValue={towerFilter}
              onFilterChange={setTowerFilter}
              filterOptions={[
                { value: "all", label: "Todas las Torres" },
                ...torresCondo.map((t) => ({
                  value: t.nombre,
                  label: t.nombre,
                })),
              ]}
              colSize={{ search: 5, filter: 3 }}
            />
          </Card.Header>
          <Card.Body className="p-0">
            <div className="table-responsive">
              <Table hover className="align-middle mb-0 custom-table">
                <thead className="bg-light text-muted small text-uppercase">
                  <tr>
                    <th className="px-4 py-3 border-0">Unidad</th>
                    <th className="py-3 border-0">Ubicación</th>
                    <th className="py-3 border-0">Propietario Legal</th>
                    <th className="py-3 border-0">Inquilinos/Residentes</th>
                    <th className="px-4 py-3 border-0 text-end">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedAptos.length > 0 ? (
                    paginatedAptos.map((apto) => (
                      <tr key={apto.id} className="border-bottom border-light">
                        <td className="px-4 py-3">
                          <div className="d-flex align-items-center gap-3">
                            <div className="apto-badge">{apto.numero}</div>
                            <div>
                              <div className="fw-bold text-dark">
                                Apto {apto.numero}
                              </div>
                              <div className="x-small text-muted">
                                {apto.metraje} m²
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3">
                          <div className="small fw-medium text-secondary">
                            {apto.torreNombre} • Piso {apto.pisoNumero}
                          </div>
                        </td>
                        <td className="py-3">
                          <div className="d-flex align-items-center gap-2">
                            <FaUser className="text-muted x-small" />
                            <span
                              className={`small ${apto.id_usuario ? "text-dark fw-semibold" : "text-danger italic"}`}
                            >
                              {apto.ownerName}
                            </span>
                          </div>
                        </td>
                        <td className="py-3">
                          <div className="d-flex flex-wrap gap-1">
                            {apto.residents.length > 0 ? (
                              apto.residents.map((r) => (
                                <Badge
                                  key={r.id}
                                  bg="light"
                                  className="text-primary border border-primary border-opacity-10 fw-normal"
                                >
                                  {r.nombre.split(" ")[0]}
                                </Badge>
                              ))
                            ) : (
                              <span className="x-small text-muted">
                                Sin residentes
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-end">
                          <Button
                            variant="outline-primary"
                            className="btn-sm rounded-pill px-3 fw-bold x-small"
                            onClick={() => handleManageResidents(apto.id)}
                          >
                            Gestionar Inquilinos
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <EmptyState
                      colSpan={5}
                      message="No se encontraron unidades con los filtros aplicados."
                      icon={FaHome}
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
            totalItems={filteredAptos.length}
            itemsShowing={paginatedAptos.length}
          />
        </Card>
      </div>

      {/* Modal Gestionar Residentes */}
      <Modal
        show={showResidentModal}
        onHide={() => setShowResidentModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton className="border-0 p-4 pb-0">
          <Modal.Title className="fw-bold text-primary-theme">
            Residentes - Unidad {currentApto?.numero}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <div className="mb-4">
            <h6 className="fw-bold text-secondary mb-3">Residentes Actuales</h6>
            <div className="bg-light rounded-4 p-3">
              {currentApto?.residents.length > 0 ? (
                <Table borderless hover size="sm" className="mb-0">
                  <thead>
                    <tr className="small text-muted">
                      <th>Nombre</th>
                      <th>DNI</th>
                      <th className="text-end">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentApto.residents.map((r) => (
                      <tr
                        key={r.id}
                        className="align-middle border-bottom border-white"
                      >
                        <td className="py-2 fw-medium">{r.nombre}</td>
                        <td className="py-2 text-muted small">{r.dni}</td>
                        <td className="py-2 text-end">
                          <Button
                            variant="link"
                            className="text-danger p-0"
                            onClick={() => handleRemoveResident(r.id)}
                          >
                            <FaTrash size={12} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="text-center py-3 text-muted small italic">
                  No hay inquilinos registrados para esta unidad.
                </div>
              )}
            </div>
          </div>

          <hr className="my-4 opacity-10" />

          <div>
            <h6 className="fw-bold text-secondary mb-3">
              Agregar Nuevo Inquilino / Residente
            </h6>
            <Form onSubmit={handleSubmit(handleAddResident)}>
              <Row className="g-3">
                <Col md={6}>
                  <AuthInput
                    label="Nombre del Inquilino"
                    name="nombre"
                    register={register}
                    validation={{ required: "Requerido" }}
                    error={errors.nombre}
                    placeholder="Ej: Sofía Pérez"
                  />
                </Col>
                <Col md={6}>
                  <AuthInput
                    label="DNI / Identificación"
                    name="dni"
                    register={register}
                    validation={{ required: "Requerido" }}
                    error={errors.dni}
                    placeholder="Número de documento"
                  />
                </Col>
              </Row>
              <div className="d-flex justify-content-end mt-3">
                <Button
                  type="submit"
                  className="btn-primary-theme rounded-pill px-4 btn-sm"
                >
                  <FaPlus className="me-2" /> Agregar Residente
                </Button>
              </div>
            </Form>
          </div>
        </Modal.Body>
        <Modal.Footer className="border-0 p-4 pt-0">
          <Button
            variant="light"
            onClick={() => setShowResidentModal(false)}
            className="rounded-pill px-4 fw-bold text-secondary"
          >
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      <style>
        {`
                .apto-badge {
                    width: 45px;
                    height: 45px;
                    background-color: var(--primary-color);
                    color: white;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 800;
                    font-size: 0.9rem;
                    box-shadow: 0 4px 10px rgba(17, 45, 77, 0.15);
                }
                .custom-table th {
                    font-size: 0.75rem;
                    letter-spacing: 0.05rem;
                }
                `}
      </style>
    </AnimatedPage>
  );
};

export default ACApartamentosPage;
