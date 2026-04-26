import { useState, useMemo } from "react";
import { Button, Row, Badge, Modal } from "react-bootstrap";
import {
  FaCar,
  FaBuilding,
  FaMapMarkerAlt,
  FaInfoCircle,
  FaEye,
  FaUser,
  FaExclamationTriangle,
  FaCheckCircle,
} from "react-icons/fa";

import { useData } from "../../hooks/useData";

import DashboardHeader from "../../components/dashboard/DashboardHeader";
import StatCard from "../../components/dashboard/StatCard";
import AnimatedPage from "../../components/animations/AnimatedPage";
import SearchBar from "../../components/ui/SearchBar";
import MainTable from "../../components/ui/MainTable";
import { usePagination } from "../../hooks/usePagination";

const SAEstacionamientosPage = () => {
  const { getTable } = useData();

  const estacionamientos = getTable("estacionamientos");
  const apartamentos = getTable("apartamentos");
  const pisos = getTable("pisos");
  const torres = getTable("torres");
  const condominios = getTable("condominios");
  const usuarios = getTable("usuarios");
  const vehiculos = getTable("vehiculos");
  const inquilinosTemporales = getTable("inquilinos_temporales");
  const configuraciones = getTable("configuraciones");

  const [searchTerm, setSearchTerm] = useState("");
  const [condoFilter, setCondoFilter] = useState("all");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedEstacionamiento, setSelectedEstacionamiento] = useState(null);

  const allEstacionamientos = useMemo(() => {
    return estacionamientos.map((e) => {
      const apto = apartamentos.find((a) => a.id === e.id_apartamento);
      const piso = pisos.find((p) => p.id === apto?.id_piso);
      const torre = torres.find((t) => t.id === piso?.id_torre);
      const condo = condominios.find((c) => c.id === torre?.id_condominio);
      const owner = usuarios.find((u) => u.id === apto?.id_usuario);
      const config = configuraciones.find((c) => c.id_condominio === condo?.id);

      // Find residents (tenants) of the apartment
      const residents = inquilinosTemporales.filter(
        (i) => i.id_apartamento === e.id_apartamento
      );
      const residentIds = residents.map((r) => r.id);

      // Find vehicles
      const ownerVehicles = owner
        ? vehiculos.filter((v) => v.id_usuario === owner.id)
        : [];
      const residentVehicles = vehiculos.filter((v) =>
        residentIds.includes(v.id_inquilino_temporal)
      );
      const allVehicles = [...ownerVehicles, ...residentVehicles];

      const maxVehiculos = e.tipo_vehiculo === "Auto" 
        ? (config?.max_autos || 0) 
        : (config?.max_motos || 0);

      const isFull = e.cantidad_vehiculos > 0 && e.cantidad_vehiculos >= maxVehiculos;

      return {
        ...e,
        condoId: condo?.id,
        condoNombre: condo?.nombre || "N/A",
        torreNombre: torre?.nombre || "N/A",
        aptoNumero: apto?.numero || "N/A",
        ownerName: owner?.nombre || "Sin Propietario",
        vehicles: allVehicles,
        maxVehiculos: maxVehiculos,
        isFull: isFull
      };
    });
  }, [estacionamientos, apartamentos, pisos, torres, condominios, usuarios, vehiculos, inquilinosTemporales, configuraciones]);

  const stats = useMemo(
    () => ({
      total: allEstacionamientos.length,
      ocupados: allEstacionamientos.filter((e) => e.isFull).length,
      conVehiculos: allEstacionamientos.filter((e) => e.cantidad_vehiculos > 0).length,
      totalCondos: condominios.length,
    }),
    [allEstacionamientos, condominios]
  );

  const filteredEst = useMemo(() => {
    return allEstacionamientos.filter((est) => {
      const matchesSearch =
        est.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
        est.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        est.condoNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        est.aptoNumero.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCondo =
        condoFilter === "all" || est.condoId?.toString() === condoFilter;

      return matchesSearch && matchesCondo;
    });
  }, [allEstacionamientos, searchTerm, condoFilter]);

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData: paginatedEst,
    itemsPerPage,
  } = usePagination(filteredEst);

  const handleViewDetails = (est) => {
    setSelectedEstacionamiento(est);
    setShowDetailModal(true);
  };

  return (
    <AnimatedPage>
      <div className="page-container">
        <DashboardHeader
          icon={FaCar}
          title="Explorador Global de Estacionamientos"
          badgeText="Vista de Auditoría"
          welcomeText="Monitorea la ocupación y distribución de los espacios de parqueo en todos los condominios del sistema."
        />

        <Row className="g-4 mb-5">
          <StatCard
            icon={FaCar}
            label="Total Espacios"
            value={stats.total}
            colorClass="primary-theme"
          />
          <StatCard
            icon={FaBuilding}
            label="Condominios"
            value={stats.totalCondos}
            colorClass="primary-theme"
          />
          <StatCard
            icon={FaCheckCircle}
            label="Espacios Llenos"
            value={stats.ocupados}
            colorClass="primary-theme"
          />
          <StatCard
            icon={FaInfoCircle}
            label="En Uso"
            value={stats.conVehiculos}
            colorClass="primary-theme"
          />
        </Row>

        <MainTable
          headers={[
            "#",
            "Condominio",
            "Estacionamiento",
            "Asignación",
            "Estado",
            "Ocupación",
            "Acción",
          ]}
          isEmpty={paginatedEst.length === 0}
          emptyMessage="No hay estacionamientos que coincidan con la búsqueda global."
          emptyIcon={FaCar}
          searchBar={
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={(val) => {
                setSearchTerm(val);
                setCurrentPage(1);
              }}
              placeholder="Buscar por nro, apto, propietario o condo..."
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
            totalItems: filteredEst.length,
            itemsShowing: paginatedEst.length,
          }}
        >
          {paginatedEst.map((est, index) => {
            const actualIndex = (currentPage - 1) * itemsPerPage + index + 1;
            return (
              <tr key={est.id} className="border-bottom border-light">
                <td className="px-4 py-3 text-center">
                  <span className="text-secondary fw-bold">
                    {actualIndex.toString().padStart(2, "0")}
                  </span>
                </td>
                <td className="py-3">
                  <div className="fw-bold text-primary-theme small">
                    {est.condoNombre}
                  </div>
                  <div className="x-small text-muted">ID Condo: {est.condoId}</div>
                </td>
                <td className="py-3">
                  <div className="fw-bold text-dark">{est.numero}</div>
                  <div className="x-small text-muted">
                    {est.cantidad_vehiculos > 0 ? est.tipo_vehiculo : "Disponible"}
                  </div>
                </td>
                <td className="py-3">
                  <Badge bg="light" className="text-primary-theme border border-primary border-opacity-10 rounded-pill px-3 fw-medium x-small">
                    Apto {est.aptoNumero}
                  </Badge>
                  <div className="x-small text-muted mt-1">{est.ownerName}</div>
                </td>
                <td className="py-3">
                  <Badge
                    bg={est.isFull ? "danger" : "success"}
                    className={`rounded-pill px-3 fw-normal ${est.isFull ? "bg-opacity-10 text-danger border border-danger border-opacity-25" : "bg-opacity-10 text-success border border-success border-opacity-25"}`}
                  >
                    {est.isFull ? "Lleno" : est.cantidad_vehiculos > 0 ? "Con Espacio" : "Disponible"}
                  </Badge>
                </td>
                <td className="py-3 text-center">
                  <div className="small fw-bold text-dark">
                    {est.cantidad_vehiculos} / {est.cantidad_vehiculos > 0 ? est.maxVehiculos : "-"}
                  </div>
                </td>
                <td className="px-4 py-3 text-end">
                  <Button
                    variant="light"
                    className="btn btn-sm btn-primary-theme btn-action-sm"
                    onClick={() => handleViewDetails(est)}
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
        size="md"
      >
        <Modal.Header closeButton className="border-0 p-4 pb-0">
          <Modal.Title className="fw-bold text-primary-theme d-flex align-items-center gap-2">
            <FaCar /> Vehículos Registrados
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <div className="mb-4 d-flex align-items-center gap-3 p-3 bg-light rounded-4">
            <div className="p-3 bg-white rounded-3 shadow-sm text-primary-theme">
              <FaCar size={24} />
            </div>
            <div>
              <div className="fw-bold text-dark">
                Espacio {selectedEstacionamiento?.numero}
              </div>
              <div className="small text-muted">
                {selectedEstacionamiento?.condoNombre} • Apto {selectedEstacionamiento?.aptoNumero}
              </div>
            </div>
          </div>

          <h6 className="fw-bold text-secondary mb-3 small text-uppercase">
            Propietario Asignado
          </h6>
          <div className="p-2 px-3 border rounded-pill mb-4 small fw-medium text-dark bg-white">
            <FaUser className="me-2 text-muted x-small" />{" "}
            {selectedEstacionamiento?.ownerName}
          </div>

          <h6 className="fw-bold text-secondary mb-3 small text-uppercase">
            Lista de Vehículos ({selectedEstacionamiento?.vehicles.length})
          </h6>
          <div className="bg-light rounded-4 p-2">
            {selectedEstacionamiento?.vehicles.length > 0 ? (
              <div className="d-flex flex-column gap-2">
                {selectedEstacionamiento.vehicles.map((v) => (
                  <div
                    key={v.id}
                    className="d-flex align-items-center gap-3 p-3 bg-white rounded-3 border border-light shadow-sm"
                  >
                    <div className="bg-primary bg-opacity-10 p-2 rounded-3 text-primary">
                      <FaCar size={20} />
                    </div>
                    <div className="flex-grow-1">
                      <div className="fw-bold text-dark small">
                        {v.marca} {v.modelo}
                      </div>
                      <div className="x-small text-muted">
                        Placa: <span className="fw-bold">{v.placa}</span> • Color: {v.color}
                      </div>
                    </div>
                    <Badge bg="light" className="text-muted border rounded-pill fw-normal x-small">
                      {v.id_usuario ? "Propietario" : "Inquilino"}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <FaExclamationTriangle
                  className="text-warning mb-2"
                  size={24}
                />
                <div className="text-muted small italic">
                  No hay vehículos registrados para esta unidad en el sistema.
                </div>
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

export default SAEstacionamientosPage;
