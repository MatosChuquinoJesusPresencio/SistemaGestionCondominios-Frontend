import { useState, useMemo } from "react";

import { Button, Row, Badge, Modal } from "react-bootstrap";
import {
  FaHome,
  FaUser,
  FaUsers,
  FaBuilding,
  FaSitemap,
  FaInfoCircle,
  FaMapMarkerAlt,
  FaEye,
} from "react-icons/fa";

import { useData } from "../../hooks/useData";

import DashboardHeader from "../../components/dashboard/DashboardHeader";
import StatCard from "../../components/dashboard/StatCard";
import AnimatedPage from "../../components/animations/AnimatedPage";
import SearchBar from "../../components/ui/SearchBar";
import MainTable from "../../components/ui/MainTable";
import { usePagination } from "../../hooks/usePagination";

const SAApartamentosPage = () => {
  const { getTable } = useData();

  const apartamentos = getTable("apartamentos");
  const pisos = getTable("pisos");
  const torres = getTable("torres");
  const usuarios = getTable("usuarios");
  const condominios = getTable("condominios");
  const inquilinosTemporales = getTable("inquilinos_temporales");

  const [searchTerm, setSearchTerm] = useState("");
  const [condoFilter, setCondoFilter] = useState("all");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedAptoId, setSelectedAptoId] = useState(null);

  const allAptos = useMemo(() => {
    return apartamentos.map((a) => {
      const piso = pisos.find((p) => p.id === a.id_piso);
      const torre = torres.find((t) => t.id === piso?.id_torre);
      const condo = condominios.find((c) => c.id === torre?.id_condominio);
      const owner = usuarios.find((u) => u.id === a.id_usuario);
      const residents = inquilinosTemporales.filter(
        (i) => i.id_apartamento === a.id,
      );

      return {
        ...a,
        condoId: condo?.id,
        condoNombre: condo?.nombre || "N/A",
        torreNombre: torre?.nombre || "N/A",
        pisoNumero: piso?.numero_piso || "?",
        ownerName: owner?.nombre || "Sin Propietario",
        residents: residents,
      };
    });
  }, [
    apartamentos,
    pisos,
    torres,
    condominios,
    usuarios,
    inquilinosTemporales,
  ]);

  const stats = useMemo(
    () => ({
      totalUnidades: allAptos.length,
      totalCondos: condominios.length,
      ocupacion:
        allAptos.length > 0
          ? Math.round(
              (allAptos.filter((a) => a.id_usuario !== null).length /
                allAptos.length) *
                100,
            )
          : 0,
      totalPoblacion: inquilinosTemporales.length,
    }),
    [allAptos, condominios, inquilinosTemporales],
  );

  const filteredAptos = useMemo(() => {
    return allAptos.filter((apto) => {
      const matchesSearch =
        apto.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apto.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apto.condoNombre.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCondo =
        condoFilter === "all" || apto.condoId?.toString() === condoFilter;

      return matchesSearch && matchesCondo;
    });
  }, [allAptos, searchTerm, condoFilter]);

  const { currentPage, setCurrentPage, totalPages, paginatedData: paginatedAptos, itemsPerPage } = usePagination(filteredAptos);

  const handleViewDetails = (aptoId) => {
    setSelectedAptoId(aptoId);
    setShowDetailModal(true);
  };

  const currentApto = useMemo(() => {
    return allAptos.find((a) => a.id === selectedAptoId);
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
          <StatCard
            icon={FaBuilding}
            label="Total Unidades"
            value={stats.totalUnidades}
            colorClass="primary-theme"
          />
          <StatCard
            icon={FaMapMarkerAlt}
            label="Condominios"
            value={stats.totalCondos}
            colorClass="primary-theme"
          />
          <StatCard
            icon={FaInfoCircle}
            label="Ocupación Global"
            value={`${stats.ocupacion}%`}
            colorClass="primary-theme"
          />
          <StatCard
            icon={FaUsers}
            label="Inquilinos Totales"
            value={stats.totalPoblacion}
            colorClass="primary-theme"
          />
        </Row>

        <MainTable
          headers={[
            "#",
            "Condominio",
            "Unidad",
            "Ubicación",
            "Propietario",
            "Residentes",
            "Acción",
          ]}
          isEmpty={paginatedAptos.length === 0}
          emptyMessage="No hay unidades que coincidan con los criterios de búsqueda global."
          emptyIcon={FaHome}
          searchBar={
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={(val) => {
                setSearchTerm(val);
                setCurrentPage(1);
              }}
              placeholder="Buscar por unidad, propietario o condo..."
              filterValue={condoFilter}
              onFilterChange={(val) => {
                setCondoFilter(val);
                setCurrentPage(1);
              }}
              filterOptions={[
                { value: "all", label: "Todos los Condominios" },
                ...condominios.map((c) => ({
                  value: c.id.toString(),
                  label: c.nombre,
                })),
              ]}
              colSize={{ search: 4, filter: 3 }}
            />
          }
          paginationProps={{
            currentPage: currentPage,
            totalPages: totalPages,
            onPageChange: setCurrentPage,
            totalItems: filteredAptos.length,
            itemsShowing: paginatedAptos.length,
          }}
        >
          {paginatedAptos.map((apto, index) => {
            const actualIndex = (currentPage - 1) * itemsPerPage + index + 1;
            return (
              <tr key={apto.id} className="border-bottom border-light">
                <td className="px-4 py-3 text-center">
                  <span className="text-secondary fw-bold">
                    {actualIndex.toString().padStart(2, "0")}
                  </span>
                </td>
                <td className="py-3">
                  <div className="fw-bold text-primary-theme small">
                    {apto.condoNombre}
                  </div>
                  <div className="x-small text-muted">
                    ID Condo: {apto.condoId}
                  </div>
                </td>
                <td className="py-3">
                  <Badge bg="dark" className="rounded-3 px-2 py-1 small">
                    {apto.numero}
                  </Badge>
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
                  {apto.residents.length > 0 ? (
                    <div className="d-flex align-items-center justify-content-center gap-2">
                      <div className="text-start">
                        <div className="small fw-medium text-muted">
                          {apto.residents.length}{" "}
                          {apto.residents.length === 1
                            ? "Residente"
                            : "Residentes"}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="d-flex align-items-center justify-content-center gap-2">
                      <div className="text-start">
                        <div className="small fw-medium text-muted">Vacío</div>
                      </div>
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-end">
                  <Button
                    variant="light"
                    className="btn btn-sm btn-primary-theme rounded-pill px-3 border-opacity-25 transition fw-bold"
                    onClick={() => handleViewDetails(apto.id)}
                  >
                    <FaEye size={14} /> <span>Detalles</span>
                  </Button>
                </td>
              </tr>
            );
          })}
        </MainTable>
      </div>

      <Modal
        show={showDetailModal}
        onHide={() => setShowDetailModal(false)}
        centered
      >
        <Modal.Header closeButton className="border-0 p-4 pb-0">
          <Modal.Title className="fw-bold text-primary-theme">
            Detalle de Residentes
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <div className="mb-4 d-flex align-items-center gap-3 p-3 bg-light rounded-4">
            <div className="p-3 bg-white rounded-3 shadow-sm text-primary-theme">
              <FaHome size={24} />
            </div>
            <div>
              <div className="fw-bold text-dark">
                Unidad {currentApto?.numero}
              </div>
              <div className="small text-muted">
                {currentApto?.condoNombre} • {currentApto?.torreNombre}
              </div>
            </div>
          </div>

          <h6 className="fw-bold text-secondary mb-3 small text-uppercase">
            Propietario Legal
          </h6>
          <div className="p-2 px-3 border rounded-pill mb-4 small fw-medium text-dark bg-white">
            <FaUser className="me-2 text-muted x-small" />{" "}
            {currentApto?.ownerName}
          </div>

          <h6 className="fw-bold text-secondary mb-3 small text-uppercase">
            Residentes / Inquilinos
          </h6>
          <div className="list-group list-group-flush border rounded-4 overflow-hidden">
            {currentApto?.residents.length > 0 ? (
              currentApto.residents.map((r) => (
                <div
                  key={r.id}
                  className="list-group-item border-0 py-3 bg-transparent d-flex justify-content-between align-items-center border-bottom border-light"
                >
                  <div>
                    <div className="fw-bold small">{r.nombre}</div>
                    <div className="x-small text-muted">DNI: {r.dni}</div>
                  </div>
                  <Badge
                    bg="light"
                    className="text-muted border rounded-pill fw-normal"
                  >
                    Inquilino
                  </Badge>
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
          <Button
            variant="primary"
            className="btn-primary-theme rounded-pill px-4 w-100 fw-bold"
            onClick={() => setShowDetailModal(false)}
          >
            Entendido
          </Button>
        </Modal.Footer>
      </Modal>
    </AnimatedPage>
  );
};

export default SAApartamentosPage;
