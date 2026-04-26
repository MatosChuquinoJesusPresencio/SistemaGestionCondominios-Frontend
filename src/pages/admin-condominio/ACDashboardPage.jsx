import { useNavigate } from "react-router-dom";

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

  const getRoleName = (roleId) => {
    const role = roles.find((r) => r.id === roleId);
    return role ? role.nombre : "N/A";
  };

  return (
    <AnimatedPage>
      <div className="container-fluid py-4 bg-light min-vh-100">
        <DashboardHeader
          icon={FaBuilding}
          title={condominio?.nombre || "Panel de Administración"}
          badgeText="Admin Condominio"
          welcomeText={`Bienvenido, ${authUser?.nombre || "Admin"}. Gestión operativa y usuarios.`}
        ></DashboardHeader>

        <div className="row g-4 mb-5">
          <StatCard
            icon={FaHome}
            label="Departamentos"
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
                      <span className="badge bg-success bg-opacity-10 text-success fw-bold px-3 py-2 rounded-pill border border-success border-opacity-10">
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
            headers={["Carrito / Usuario", "Departamento", "Solicitud", "Estado"]}
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
                      <span className="badge bg-danger bg-opacity-10 text-danger fw-bold px-3 py-2 rounded-pill border border-danger border-opacity-10">
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
