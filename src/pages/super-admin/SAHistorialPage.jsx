import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { Col, Row, Badge, Form, Tabs, Tab } from "react-bootstrap";
import {
  FaListAlt,
  FaShoppingCart,
  FaCar,
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaUser,
  FaHome,
  FaBuilding,
} from "react-icons/fa";

import { useData } from "../../hooks/useData";

import DashboardHeader from "../../components/dashboard/DashboardHeader";
import StatCard from "../../components/dashboard/StatCard";
import AnimatedPage from "../../components/animations/AnimatedPage";
import MainTable from "../../components/ui/MainTable";
import SearchBar from "../../components/ui/SearchBar";
import { usePagination } from "../../hooks/usePagination";
import { formatDateTime } from "../../utils/formatters";

const SAHistorialPage = () => {
  const { getTable } = useData();
  const [searchParams] = useSearchParams();

  const logsCarritos = getTable("logs_prestamo_carrito");
  const logsVehiculos = getTable("logs_acceso_vehicular");
  const carritos = getTable("carritos_carga");
  const vehiculos = getTable("vehiculos");
  const apartamentos = getTable("apartamentos");
  const usuarios = getTable("usuarios");
  const estacionamientos = getTable("estacionamientos");
  const condominios = getTable("condominios");
  const pisos = getTable("pisos");
  const torres = getTable("torres");

  const initialTab = searchParams.get("tab") || "carritos";

  const [selectedCondo, setSelectedCondo] = useState("all");
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && (tab === "carritos" || tab === "estacionamiento")) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const mappedLogsCarritos = useMemo(() => {
    return logsCarritos
      .map((log) => {
        const apto = apartamentos.find((a) => a.id === log.id_apartamento);
        const piso = pisos.find((p) => p.id === apto?.id_piso);
        const torre = torres.find((t) => t.id === piso?.id_torre);
        const condo = condominios.find((c) => c.id === torre?.id_condominio);

        const carrito = carritos.find((c) => c.id === log.id_carrito);
        const user = usuarios.find((u) => u.id === log.id_usuario);

        return {
          ...log,
          condoId: condo?.id,
          condoNombre: condo?.nombre || "N/A",
          carritoNombre: carrito?.nombre || `Carrito ${log.id_carrito}`,
          aptoNumero: apto?.numero || "N/A",
          usuarioNombre: user?.nombre || "N/A",
          estado: log.fecha_salida ? "Devuelto" : "En uso",
        };
      })
      .filter(
        (log) =>
          selectedCondo === "all" || log.condoId === parseInt(selectedCondo),
      )
      .sort((a, b) => new Date(b.fecha_entrada) - new Date(a.fecha_entrada));
  }, [
    logsCarritos,
    carritos,
    apartamentos,
    usuarios,
    pisos,
    torres,
    condominios,
    selectedCondo,
  ]);

  const mappedLogsEstacionamiento = useMemo(() => {
    return logsVehiculos
      .map((log) => {
        const estacionamiento = estacionamientos.find(
          (e) => e.id === log.id_estacionamiento,
        );
        const apto = apartamentos.find(
          (a) => a.id === estacionamiento?.id_apartamento,
        );
        const piso = pisos.find((p) => p.id === apto?.id_piso);
        const torre = torres.find((t) => t.id === piso?.id_torre);
        const condo = condominios.find((c) => c.id === torre?.id_condominio);

        const vehiculo = vehiculos.find((v) => v.id === log.id_vehiculo);

        return {
          ...log,
          condoId: condo?.id,
          condoNombre: condo?.nombre || "N/A",
          vehiculoInfo: vehiculo
            ? `${vehiculo.marca} ${vehiculo.modelo} (${vehiculo.color})`
            : "Vehículo externo",
          estacionamientoNumero: estacionamiento?.numero || "N/A",
          estado: log.fecha_salida ? "Fuera" : "En recinto",
        };
      })
      .filter(
        (log) =>
          selectedCondo === "all" || log.condoId === parseInt(selectedCondo),
      )
      .sort((a, b) => new Date(b.fecha_entrada) - new Date(a.fecha_entrada));
  }, [
    logsVehiculos,
    vehiculos,
    estacionamientos,
    apartamentos,
    pisos,
    torres,
    condominios,
    selectedCondo,
  ]);

  const filteredData = useMemo(() => {
    const source =
      activeTab === "carritos" ? mappedLogsCarritos : mappedLogsEstacionamiento;

    return source.filter((item) => {
      const matchesSearch =
        activeTab === "carritos"
          ? item.carritoNombre
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            item.aptoNumero.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.condoNombre.toLowerCase().includes(searchTerm.toLowerCase())
          : item.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.vehiculoInfo
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            item.condoNombre.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" ? !item.fecha_salida : item.fecha_salida);

      return matchesSearch && matchesStatus;
    });
  }, [
    activeTab,
    mappedLogsCarritos,
    mappedLogsEstacionamiento,
    searchTerm,
    statusFilter,
  ]);

  const { currentPage, setCurrentPage, totalPages, paginatedData, itemsPerPage } = usePagination(filteredData);

  return (
    <AnimatedPage>
      <div className="page-container">
        <DashboardHeader
          icon={FaListAlt}
          title="Historial Global"
          badgeText="Super Admin"
          welcomeText="Supervisa el flujo de operaciones en todos los condominios registrados."
        />

        <Row className="g-4 mb-5">
          <StatCard
            icon={FaBuilding}
            label="Condominios Activos"
            value={condominios.length}
            colorClass="primary-theme"
          />
          <StatCard
            icon={FaShoppingCart}
            label="Préstamos Totales"
            value={mappedLogsCarritos.length}
            colorClass="primary-theme"
          />
          <StatCard
            icon={FaCheckCircle}
            label="Total Auditoría"
            value={filteredData.length}
            colorClass="primary-theme"
          />
        </Row>

        <MainTable
          headers={
            activeTab === "carritos"
              ? [
                  "#",
                  "Condominio",
                  "Unidad",
                  "Carrito",
                  "Solicitante",
                  "Entrada",
                  "Estado",
                ]
              : [
                  "#",
                  "Condominio",
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
                    setStatusFilter("all");
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
                        <FaShoppingCart className="me-2" /> Préstamo de Carritos
                      </span>
                    }
                  />
                  <Tab
                    eventKey="estacionamiento"
                    title={
                      <span>
                        <FaCar className="me-2" /> Accesos al Condominio
                      </span>
                    }
                  />
                </Tabs>
              </div>

              <Row className="align-items-center g-3">
                <Col md={6}>
                  <SearchBar
                    searchTerm={searchTerm}
                    onSearchChange={(val) => {
                      setSearchTerm(val);
                      setCurrentPage(1);
                    }}
                    placeholder="Buscar por placa, unidad, condominio..."
                  />
                </Col>
                <Col md={3}>
                  <Form.Select
                    className="form-control rounded-pill border-light shadow-sm py-2 px-3 small"
                    value={selectedCondo}
                    onChange={(e) => {
                      setSelectedCondo(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    <option value="all">Todos los Condominios</option>
                    {condominios.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nombre}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={3}>
                  <Form.Select
                    className="form-control rounded-pill border-light shadow-sm py-2 px-3 small"
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    <option value="all">Todos los estados</option>
                    <option value="active">
                      {activeTab === "carritos" ? "En uso" : "En recinto"}
                    </option>
                    <option value="finished">Finalizados</option>
                  </Form.Select>
                </Col>
              </Row>
            </>
          }
          paginationProps={{
            currentPage: currentPage,
            totalPages: totalPages,
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
                    <div className="fw-bold text-dark small">
                      {log.condoNombre || "N/A"}
                    </div>
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
                  <td className="px-4 py-3 text-center">
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
                    <div className="fw-bold text-dark small">
                      {log.condoNombre || "N/A"}
                    </div>
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
                      {log.fecha_salida
                        ? formatDateTime(log.fecha_salida)
                        : "---"}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge
                      className={`${log.fecha_salida ? "badge-status-inactive" : "badge-status-info"} rounded-pill px-3 py-1 border-0`}
                    >
                      {log.fecha_salida ? "Fuera" : "En recinto"}
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

export default SAHistorialPage;
