import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { Col, Row, Form, Tabs, Tab, Badge } from "react-bootstrap";
import {
  FaListAlt,
  FaShoppingCart,
  FaCar,
  FaCheckCircle,
  FaExclamationTriangle,
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

const ACHistorialPage = () => {
  const { authUser } = useAuth();
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

  const condominio = condominios.find((c) => c.id === authUser?.id_condominio);

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

  const initialTab = searchParams.get("tab") || "carritos";
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && (tab === "carritos" || tab === "estacionamiento")) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const mappedLogsCarritos = useMemo(() => {
    return logsCarritos
      .filter((log) => {
        const apto = apartamentos.find((a) => a.id === log.id_apartamento);
        const piso = pisos.find((p) => p.id === apto?.id_piso);
        const torre = torres.find((t) => t.id === piso?.id_torre);
        return (
          authUser?.id_condominio &&
          torre?.id_condominio === authUser.id_condominio
        );
      })
      .map((log) => {
        const carrito = carritos.find((c) => c.id === log.id_carrito);
        const apto = apartamentos.find((a) => a.id === log.id_apartamento);
        const user = usuarios.find((u) => u.id === log.id_usuario);

        return {
          ...log,
          carritoNombre: carrito?.nombre || `Carrito ${log.id_carrito}`,
          aptoNumero: apto?.numero || "N/A",
          usuarioNombre: user?.nombre || "N/A",
          estado: log.fecha_salida ? "Devuelto" : "En uso",
        };
      })
      .sort((a, b) => new Date(b.fecha_entrada) - new Date(a.fecha_entrada));
  }, [logsCarritos, carritos, apartamentos, usuarios, pisos, torres, authUser]);

  const mappedLogsEstacionamiento = useMemo(() => {
    return logsVehiculos
      .filter((log) => {
        const estacionamiento = estacionamientos.find(
          (e) => e.id === log.id_estacionamiento,
        );
        const apto = apartamentos.find(
          (a) => a.id === estacionamiento?.id_apartamento,
        );
        const piso = pisos.find((p) => p.id === apto?.id_piso);
        const torre = torres.find((t) => t.id === piso?.id_torre);
        return (
          authUser?.id_condominio &&
          torre?.id_condominio === authUser.id_condominio
        );
      })
      .map((log) => {
        const vehiculo = vehiculos.find((v) => v.id === log.id_vehiculo);
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
  }, [
    logsVehiculos,
    vehiculos,
    estacionamientos,
    apartamentos,
    pisos,
    torres,
    authUser,
  ]);

  const filteredData = useMemo(() => {
    const source =
      activeTab === "carritos" ? mappedLogsCarritos : mappedLogsEstacionamiento;
    setCurrentPage(1);

    return source.filter((item) => {
      const matchesSearch =
        activeTab === "carritos"
          ? item.carritoNombre
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            item.aptoNumero.toLowerCase().includes(searchTerm.toLowerCase())
          : item.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.vehiculoInfo.toLowerCase().includes(searchTerm.toLowerCase());

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

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <AnimatedPage>
      <div className="container-fluid py-4 bg-light min-vh-100">
        <DashboardHeader
          icon={FaListAlt}
          title="Historial"
          badgeText={condominio?.nombre || "Condominio"}
          welcomeText="Monitorea el historial de préstamos de carritos y el flujo de estacionamiento."
        />

        <Row className="g-4 mb-5">
          <StatCard
            icon={FaShoppingCart}
            label="Carritos en Uso"
            value={mappedLogsCarritos.filter((l) => !l.fecha_salida).length}
            colorClass="primary-theme"
          />
          <StatCard
            icon={FaCar}
            label="Vehículos en Recinto"
            value={
              mappedLogsEstacionamiento.filter((l) => !l.fecha_salida).length
            }
            colorClass="primary-theme"
          />
          <StatCard
            icon={FaCheckCircle}
            label="Total Operaciones"
            value={filteredData.length}
            colorClass="primary-theme"
          />
        </Row>

        <MainTable
          headers={
            activeTab === "carritos"
              ? ["#", "Unidad", "Carrito", "Solicitante", "Entrada", "Estado"]
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
                        <FaCar className="me-2" /> Historial de Estacionamiento
                      </span>
                    }
                  />
                </Tabs>
              </div>

              <Row className="align-items-center g-3">
                <Col md={9}>
                  <SearchBar
                    searchTerm={searchTerm}
                    onSearchChange={(val) => {
                      setSearchTerm(val);
                      setCurrentPage(1);
                    }}
                    placeholder={
                      activeTab === "carritos"
                        ? "Buscar por carrito o unidad..."
                        : "Buscar por placa o vehículo..."
                    }
                  />
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
                    <option value="all">Todos los registros</option>
                    <option value="active">
                      {activeTab === "carritos"
                        ? "En uso actualmente"
                        : "Dentro del recinto"}
                    </option>
                    <option value="finished">
                      {activeTab === "carritos"
                        ? "Completados/Devueltos"
                        : "Salidas registradas"}
                    </option>
                  </Form.Select>
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
            const actualIndex = (currentPage - 1) * ITEMS_PER_PAGE + index + 1;
            const formatDateTime = (isoString) => {
              if (!isoString) return "---";
              const date = new Date(isoString);
              return date.toLocaleString("es-ES", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });
            };

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
                  <td className="px-4 py-3 text-center">
                    <Badge
                      bg={log.fecha_salida ? "success" : "warning"}
                      className="rounded-pill px-3 py-1"
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
                  <td className="px-4 py-3 text-center">
                    <Badge
                      bg={log.fecha_salida ? "secondary" : "info"}
                      className="rounded-pill px-3 py-1"
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

export default ACHistorialPage;
