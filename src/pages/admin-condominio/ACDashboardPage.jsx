import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "react-bootstrap";

import {
  FaBuilding,
  FaHome,
  FaUserFriends,
  FaCar,
  FaShoppingCart,
  FaUser,
  FaEnvelope,
  FaCircle,
  FaClock,
  FaExclamationTriangle,
} from "react-icons/fa";

import { useData } from "../../hooks/useData";
import { useAuth } from "../../hooks/useAuth";

import DashboardHeader from "../../components/dashboard/DashboardHeader";
import StatCard from "../../components/dashboard/StatCard";
import DashboardTable from "../../components/dashboard/DashboardTable";
import AnimatedPage from "../../components/animations/AnimatedPage";
import EmptyState from "../../components/ui/EmptyState";
import NoCondoWarning from "../../components/ui/NoCondoWarning";

const ACDashboardPage = () => {
  const navigate = useNavigate();

  const { getTable } = useData();
  const { authUser } = useAuth();

  const apartamentos = getTable("apartamentos");
  const usuarios = getTable("usuarios");
  const roles = getTable("roles");
  const logs_acceso_vehicular = getTable("logs_acceso_vehicular");
  const logs_prestamo_carrito = getTable("logs_prestamo_carrito");
  const condominios = getTable("condominios");

  const currentCondoId = authUser?.id_condominio;
  const condominio = condominios.find((c) => c.id === currentCondoId);

  const configuraciones = getTable("configuraciones");
  const config = useMemo(
    () => configuraciones.find((c) => c.id_condominio === currentCondoId),
    [configuraciones, currentCondoId],
  );

  if (!condominio) return <NoCondoWarning />;

  const torres = getTable("torres").filter(
    (t) => t.id_condominio === currentCondoId,
  );
  const torresIds = torres.map((t) => t.id);
  const pisosIds = getTable("pisos")
    .filter((p) => torresIds.includes(p.id_torre))
    .map((p) => p.id);
  const aptosCondo = apartamentos.filter((a) => pisosIds.includes(a.id_piso));
  const aptosIds = aptosCondo.map((a) => a.id);
  const estIds = getTable("estacionamientos")
    .filter((e) => aptosIds.includes(e.id_apartamento))
    .map((e) => e.id);

  const condoUsers = currentCondoId
    ? usuarios.filter((u) => u.id_condominio === currentCondoId)
    : [];
  const totalAptos = aptosCondo.length;
  const totalPropietarios = condoUsers.filter((u) => u.id_rol === 3).length;

  const filteredVehiculoLogs = logs_acceso_vehicular.filter((log) =>
    estIds.includes(log.id_estacionamiento),
  );
  const filteredCarritoLogs = logs_prestamo_carrito.filter((log) =>
    aptosIds.includes(log.id_apartamento),
  );

  const activeVehicles = filteredVehiculoLogs.filter(
    (log) => !log.fecha_salida,
  ).length;
  const activeCarLoans = filteredCarritoLogs.filter(
    (log) => !log.fecha_salida,
  ).length;

  const recentAccess = [...filteredVehiculoLogs]
    .sort((a, b) => new Date(b.fecha_entrada) - new Date(a.fecha_entrada))
    .slice(0, 5);
  const recentLoans = [...filteredCarritoLogs]
    .sort((a, b) => new Date(b.fecha_entrada) - new Date(a.fecha_entrada))
    .slice(0, 5);
  const recentCondoUsers = [...condoUsers].slice(0, 5);

  const estacionamientos = getTable("estacionamientos");
  const estacionamientosCondo = estacionamientos
    .filter((e) => aptosIds.includes(e.id_apartamento))
    .map((e) => {
      const apto = aptosCondo.find((a) => a.id === e.id_apartamento);
      return { ...e, aptoNumero: apto?.numero };
    });
  const recentEstacionamientos = [...estacionamientosCondo].slice(0, 5);

  const getRoleName = (roleId) => {
    const role = roles.find((r) => r.id === roleId);
    return role ? role.nombre : "N/A";
  };

  return (
    <AnimatedPage>
      <div className="page-container">
        <DashboardHeader
          icon={FaBuilding}
          title={condominio?.nombre || "Panel de Administración"}
          badgeText="Admin Condominio"
          welcomeText={`Bienvenido, ${authUser?.nombre || "Admin"}. Gestión operativa y usuarios.`}
        ></DashboardHeader>

        <div className="row g-4 mb-5">
          <StatCard
            icon={FaHome}
            label="Apartamentos"
            value={totalAptos}
            colorClass="primary-theme"
          />
          <StatCard
            icon={FaUserFriends}
            label="Propietarios"
            value={totalPropietarios}
            colorClass="primary-theme"
          />
          <StatCard
            icon={FaCar}
            label="Vehículos Hoy"
            value={activeVehicles}
            colorClass="primary-theme"
          />
          <StatCard
            icon={FaShoppingCart}
            label="Carritos en Uso"
            value={activeCarLoans}
            colorClass="primary-theme"
          />
        </div>

        <div className="row g-4">
          <DashboardTable
            title="Accesos Vehiculares"
            buttonText="Historial"
            onButtonClick={() => navigate("/admin-condominio/historial?tab=estacionamiento")}
            headers={["Vehículo", "Ocupante", "Ingreso", "Estado"]}
          >
            {recentAccess.length > 0 ? (
              recentAccess.map((log) => (
                <tr key={log.id} className="border-bottom border-light">
                  <td className="px-4 py-3">
                    <div className="fw-bold text-primary-theme">{log.placa}</div>
                    <div className="x-small text-muted">{log.metodo}</div>
                  </td>
                  <td className="py-3">
                    <div className="small fw-medium text-dark">
                      {log.tipo_ocupante}
                    </div>
                    <div className="x-small text-muted">
                      {log.datos_inquilino || "Propietario"}
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="small fw-medium text-dark">
                      {new Date(log.fecha_entrada).toLocaleDateString()}
                    </div>
                    <div className="x-small text-muted">
                      <FaClock className="me-1" />
                      {new Date(log.fecha_entrada).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-end">
                    {log.fecha_salida ? (
                      <span className="badge bg-light text-muted fw-normal px-3 py-2 rounded-pill">
                        Salió
                      </span>
                    ) : (
                      <span className="badge badge-status-active">
                        En recinto
                      </span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <EmptyState
                colSpan={4}
                message="No hay actividad vehicular reciente."
                icon={FaCar}
              />
            )}
          </DashboardTable>

          <DashboardTable
            title="Préstamos de Carritos"
            buttonText="Historial"
            onButtonClick={() => navigate("/admin-condominio/historial?tab=carritos")}
            headers={["Carrito / Usuario", "Apartamento", "Solicitud", "Estado"]}
          >
            {recentLoans.length > 0 ? (
              recentLoans.map((loan) => (
                <tr key={loan.id} className="border-bottom border-light">
                  <td className="px-4 py-3">
                    <div className="fw-bold text-dark">
                      Carrito #{loan.id_carrito}
                    </div>
                    <div className="x-small text-muted">
                      <FaUser className="me-1 x-small" /> {loan.solicitante}
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="small fw-medium text-dark">
                      Apto: {loan.id_apartamento}
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="small fw-medium text-dark">
                      {new Date(loan.fecha_entrada).toLocaleDateString()}
                    </div>
                    <div className="x-small text-muted">
                      <FaClock className="me-1" />
                      {new Date(loan.fecha_entrada).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-end">
                    {loan.fecha_salida ? (
                      <span className="badge bg-light text-muted fw-normal px-3 py-2 rounded-pill">
                        Finalizado
                      </span>
                    ) : (
                      <span className="badge badge-status-inactive">
                        En uso
                      </span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <EmptyState
                colSpan={4}
                message="No hay préstamos de carritos recientes."
                icon={FaShoppingCart}
              />
            )}
          </DashboardTable>

          <DashboardTable
            title="Gestión de Estacionamientos"
            buttonText="Gestionar Espacios"
            onButtonClick={() => navigate("/admin-condominio/estacionamientos")}
            headers={["Nro. Espacio", "Unidad", "Estado", "Capacidad"]}
          >
            {recentEstacionamientos.length > 0 ? (
              recentEstacionamientos.map((est) => {
                const isFull =
                  est.cantidad_vehiculos > 0 &&
                  ((est.tipo_vehiculo === "Auto" &&
                    est.cantidad_vehiculos >= (config?.max_autos || 0)) ||
                    (est.tipo_vehiculo === "Moto" &&
                      est.cantidad_vehiculos >= (config?.max_motos || 0)));

                return (
                  <tr key={est.id} className="border-bottom border-light">
                    <td className="px-4 py-3">
                      <div className="fw-bold text-dark">{est.numero}</div>
                      <div className="x-small text-muted">
                        {est.cantidad_vehiculos > 0
                          ? est.tipo_vehiculo
                          : "Sin vehículos"}
                      </div>
                    </td>
                    <td className="py-3">
                      <Badge
                        bg="light"
                        className="text-primary-theme border border-primary border-opacity-10 rounded-pill px-3 fw-medium x-small"
                      >
                        Apto {est.aptoNumero}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <div className="d-flex align-items-center gap-2">
                        <FaCircle
                          className={isFull ? "text-danger" : "text-success"}
                          style={{ fontSize: "8px" }}
                        />
                        <span className="small text-muted fw-medium">
                          {isFull ? "Lleno" : "Disponible"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-end">
                      <div className="fw-bold text-dark small">
                        {est.cantidad_vehiculos} /{" "}
                        {est.tipo_vehiculo === "Auto"
                          ? config?.max_autos || "-"
                          : config?.max_motos || "-"}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <EmptyState
                colSpan={4}
                message="No hay estacionamientos registrados."
                icon={FaCar}
              />
            )}
          </DashboardTable>

          <DashboardTable
            title="Personal y Residentes del Condominio"
            buttonText="Gestionar Usuarios"
            onButtonClick={() => navigate("/admin-condominio/usuarios")}
            headers={[
              "Nombre del Usuario",
              "Contacto",
              "Rol en Condominio",
              "Estado",
            ]}
          >
            {recentCondoUsers.length > 0 ? (
              recentCondoUsers.map((u) => (
                <tr key={u.id} className="border-bottom border-light">
                  <td className="px-4 py-3">
                    <div className="fw-bold text-dark">{u.nombre}</div>
                    <div className="x-small text-muted">
                      ID: {u.id.toString().padStart(3, "0")}
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="small text-dark d-flex align-items-center gap-2">
                      <FaEnvelope className="text-muted x-small" /> {u.email}
                    </div>
                  </td>
                  <td className="py-3">
                    <span className="small fw-semibold text-secondary">
                      {getRoleName(u.id_rol)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-end">
                    <div className="d-flex align-items-center justify-content-end gap-2">
                      <FaCircle
                        className={u.activo ? "text-success" : "text-danger"}
                        style={{ fontSize: "8px" }}
                      />
                      <span className="small text-muted fw-medium">
                        {u.activo ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <EmptyState
                colSpan={4}
                message="No hay personal registrado en este condominio."
                icon={FaUserFriends}
              />
            )}
          </DashboardTable>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default ACDashboardPage;
