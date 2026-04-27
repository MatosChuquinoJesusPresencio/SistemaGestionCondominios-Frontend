import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { Card, Row, Col, Pagination, Tabs, Tab, Badge } from "react-bootstrap";
import {
  FaHistory,
  FaShoppingCart,
  FaCar,
  FaCheckCircle,
  FaHome,
  FaUser,
  FaClock,
  FaCalendarAlt,
} from "react-icons/fa";

import { useAuth } from "../../hooks/useAuth";
import { useData } from "../../hooks/useData";

import DashboardHeader from "../../components/dashboard/DashboardHeader";
import StatCard from "../../components/dashboard/StatCard";
import AnimatedPage from "../../components/animations/AnimatedPage";
import MainTable from "../../components/ui/MainTable";
import SearchBar from "../../components/ui/SearchBar";
import { usePagination } from "../../hooks/usePagination";
import { formatDateTime } from "../../utils/formatters";

const PRHistorialPage = () => {
  const { authUser } = useAuth();
  const { getTable } = useData();
  const [searchParams] = useSearchParams();

  const logsCarritos = getTable("logs_prestamo_carrito");
  const logsVehiculos = getTable("logs_acceso_vehicular");
  const carritos = getTable("carritos_carga");
  const vehiculosTable = getTable("vehiculos");
  const apartamentos = getTable("apartamentos");
  const usuarios = getTable("usuarios");
  const inquilinos = getTable("inquilinos_temporales");
  const estacionamientos = getTable("estacionamientos");
  const configuraciones = getTable("configuraciones");

  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const miApto = useMemo(
    () => apartamentos.find((a) => a.id_usuario === authUser?.id),
    [apartamentos, authUser],
  );

  const initialTab = searchParams.get("tab") || "carritos";

  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && (tab === "carritos" || tab === "estacionamiento")) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const [searchTerm, setSearchTerm] = useState("");

  const mappedLogsCarritos = useMemo(() => {
    if (!miApto) return [];

    const config = configuraciones.find(
      (c) => c.id_condominio === miApto.id_condominio,
    );

    return logsCarritos
      .filter((log) => log.id_apartamento === miApto.id)
      .map((log) => {
        const carrito = carritos.find((c) => c.id === log.id_carrito);
        const user = log.id_usuario ? usuarios.find((u) => u.id === log.id_usuario) : null;
        const inquilino = log.id_inquilino_temporal ? inquilinos.find((i) => i.id === log.id_inquilino_temporal) : null;

        let liveFine = log.penalizacion || 0;

        if (!log.fecha_salida && config) {
          const startDate = new Date(log.fecha_entrada);
          const diffMs = now - startDate;
          const diffMins = Math.floor(diffMs / 60000);

          if (diffMins > config.tiempo_max_prestamo_min) {
            liveFine =
              (diffMins - config.tiempo_max_prestamo_min) *
              config.penalizacion_por_minuto;
          }
        }

        return {
          ...log,
          carritoNombre: carrito?.nombre || `Carrito ${log.id_carrito}`,
          usuarioNombre: user?.nombre || inquilino?.nombre || "N/A",
          estado: log.fecha_salida ? "Devuelto" : "En uso",
          penalizacionCalculada: liveFine,
        };
      })
      .sort((a, b) => new Date(b.fecha_entrada) - new Date(a.fecha_entrada));
  }, [logsCarritos, carritos, miApto, usuarios, configuraciones, now]);

  const mappedLogsEstacionamiento = useMemo(() => {
    if (!miApto) return [];

    const misEstacionamientosIds = estacionamientos
      .filter((e) => e.id_apartamento === miApto.id)
      .map((e) => e.id);

    return logsVehiculos
      .filter((log) => misEstacionamientosIds.includes(log.id_estacionamiento))
      .map((log) => {
        const vehiculo = vehiculosTable.find((v) => v.id === log.id_vehiculo);
        const estacionamiento = estacionamientos.find(
          (e) => e.id === log.id_estacionamiento,
        );

        return {
          ...log,
          vehiculoInfo: vehiculo
            ? `${vehiculo.marca} ${vehiculo.modelo} (${vehiculo.color})`
            : "Vehículo externo",
          estacionamientoNumero: estacionamiento?.numero || "N/A",
          estado: log.fecha_salida ? "Fuera" : "En recinto",
        };
      })
      .sort((a, b) => new Date(b.fecha_entrada) - new Date(a.fecha_entrada));
  }, [logsVehiculos, vehiculosTable, estacionamientos, miApto]);

  const filteredData = useMemo(() => {
    const source =
      activeTab === "carritos" ? mappedLogsCarritos : mappedLogsEstacionamiento;

    return source.filter((item) => {
      const matchesSearch =
        activeTab === "carritos"
          ? item.carritoNombre.toLowerCase().includes(searchTerm.toLowerCase())
          : item.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.vehiculoInfo.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [activeTab, mappedLogsCarritos, mappedLogsEstacionamiento, searchTerm]);

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData,
    itemsPerPage,
  } = usePagination(filteredData);

  if (!miApto) {
    return (
      <AnimatedPage>
        <div className="page-container d-flex align-items-center justify-content-center">
          <Card className="card-custom p-5 text-center">
            <FaHistory size={60} className="text-muted mb-3 mx-auto" />
            <h3 className="fw-bold text-dark">Actividad no disponible</h3>
            <p className="text-muted">
              Necesitas una unidad asignada para ver tu historial.
            </p>
          </Card>
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <div className="page-container">
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
            colorClass="primary-theme"
          />
          <StatCard
            icon={FaShoppingCart}
            label="Uso de Carritos"
            value={mappedLogsCarritos.length}
            colorClass="primary-theme"
          />
          <StatCard
            icon={FaCheckCircle}
            label="Registros Totales"
            value={filteredData.length}
            colorClass="primary-theme"
          />
        </Row>

        <MainTable
          headers={
            activeTab === "carritos"
              ? ["#", "Unidad", "Carrito", "Solicitante", "Salida", "Retorno", "Multa", "Estado"]
              : [
                  "#",
                  "Vehículo / Placa",
                  "Espacio",
                  "Entrada",
                  "Salida",
                  "Estado",
                ]
          }
          isEmpty={paginatedData.length === 0}
          emptyMessage={
            activeTab === "carritos"
              ? "No hay registros de carritos."
              : "No hay registros de acceso vehicular."
          }
          emptyIcon={activeTab === "carritos" ? FaShoppingCart : FaCar}
          searchBar={
            <>
              <div className="mb-4 d-inline-block">
                <Tabs
                  activeKey={activeTab}
                  onSelect={(k) => {
                    setActiveTab(k);
                    setSearchTerm("");
                    setCurrentPage(1);
                  }}
                  className="custom-tabs border-0"
                  variant="pills"
                >
                  <Tab
                    eventKey="carritos"
                    title={
                      <span>
                        <FaShoppingCart className="me-2" /> Historial Carritos
                      </span>
                    }
                  />
                  <Tab
                    eventKey="estacionamiento"
                    title={
                      <span>
                        <FaCar className="me-2" /> Historial Accesos
                      </span>
                    }
                  />
                </Tabs>
              </div>

              <Row className="align-items-center g-3">
                <Col md={12}>
                  <SearchBar
                    searchTerm={searchTerm}
                    onSearchChange={(val) => {
                      setSearchTerm(val);
                      setCurrentPage(1);
                    }}
                    placeholder={
                      activeTab === "carritos"
                        ? "Buscar por nombre de carrito..."
                        : "Buscar por placa o modelo..."
                    }
                    colSize={{ search: 12, filter: 0 }}
                  />
                </Col>
              </Row>
            </>
          }
          paginationProps={{
            currentPage,
            totalPages,
            onPageChange: setCurrentPage,
            totalItems: filteredData.length,
            itemsShowing: paginatedData.length,
          }}
        >
          {paginatedData.map((log, index) => {
            const actualIndex = (currentPage - 1) * itemsPerPage + index + 1;

            if (activeTab === "carritos") {
              return (
                <tr key={log.id} className="border-bottom border-light">
                  <td className="px-4 py-3 text-center">
                    <span className="text-secondary fw-bold">
                      {actualIndex.toString().padStart(2, "0")}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="small">
                      <FaHome className="me-1 text-muted" />{" "}
                      {log.aptoNumero || log.id_apartamento}
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="small fw-medium">
                      {log.carritoNombre || `Carrito ${log.id_carrito}`}
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="small text-muted">
                      <FaUser className="me-1" />{" "}
                      {log.usuarioNombre || log.solicitante}
                    </div>
                  </td>
                   <td className="py-3">
                    <div className="x-small">
                      <FaClock className="me-1 text-muted" />{" "}
                      {formatDateTime(log.fecha_entrada)}
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="x-small">
                      <FaClock className="me-1 text-muted" />{" "}
                      {log.fecha_salida ? formatDateTime(log.fecha_salida) : "---"}
                    </div>
                  </td>
                  <td className="py-3">
                    {log.penalizacionCalculada > 0 ? (
                      <span className="text-danger fw-bold small">
                        S/. {log.penalizacionCalculada.toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-muted small">S/. 0.00</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-end">
                    <Badge
                      className={`${log.fecha_salida ? "badge-status-active" : "badge-status-warning"} rounded-pill px-3 py-1 border-0`}
                    >
                      {log.fecha_salida ? "Devuelto" : "En uso"}
                    </Badge>
                  </td>
                </tr>
              );
            } else {
              return (
                <tr key={log.id} className="border-bottom border-light">
                  <td className="px-4 py-3 text-center">
                    <span className="text-secondary fw-bold">
                      {actualIndex.toString().padStart(2, "0")}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="fw-bold small">{log.placa}</div>
                    <div className="x-small text-muted">{log.vehiculoInfo}</div>
                  </td>
                  <td className="py-3 text-center">
                    <Badge bg="dark" className="rounded-2">
                      {log.estacionamientoNumero || log.id_estacionamiento}
                    </Badge>
                  </td>
                  <td className="py-3">
                    <div className="x-small">
                      <FaCalendarAlt className="me-1 text-muted" />{" "}
                      {formatDateTime(log.fecha_entrada)}
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="x-small">
                      <FaCalendarAlt className="me-1 text-muted" />{" "}
                      {formatDateTime(log.fecha_salida)}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-end">
                    <Badge
                      className={`${log.fecha_salida ? "badge-status-inactive" : "badge-status-info"} rounded-pill px-3 py-1 border-0`}
                    >
                      {log.estado}
                    </Badge>
                  </td>
                </tr>
              );
            }
          })}
        </MainTable>
      </div>
    </AnimatedPage>
  );
};

export default PRHistorialPage;
