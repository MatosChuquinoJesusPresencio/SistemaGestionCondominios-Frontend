import { useNavigate } from "react-router-dom";

import {
  FaBuilding,
  FaCarSide,
  FaCartPlus,
  FaUser,
  FaClock,
  FaUsers,
} from "react-icons/fa";

import { useData } from "../../hooks/useData";
import { useAuth } from "../../hooks/useAuth";

import DashboardHeader from "../../components/dashboard/DashboardHeader";
import StatCard from "../../components/dashboard/StatCard";
import DashboardTable from "../../components/dashboard/DashboardTable";
import AnimatedPage from "../../components/animations/AnimatedPage";
import EmptyState from "../../components/ui/EmptyState";

const PRDashboardPage = () => {
  const navigate = useNavigate();

  const { getTable } = useData();
  const { authUser } = useAuth();

  const apartamentos = getTable("apartamentos");
  const vehiculos = getTable("vehiculos");
  const logs_acceso_vehicular = getTable("logs_acceso_vehicular");
  const logs_prestamo_carrito = getTable("logs_prestamo_carrito");
  const inquilinos_temporales = getTable("inquilinos_temporales");

  const currentUserId = authUser?.id;
  const currentUser = authUser || { nombre: "Usuario", id: 0 };

  const myApartments = apartamentos.filter(
    (a) => a.id_usuario === currentUserId,
  );
  const myApartmentIds = myApartments.map((a) => a.id);

  const myVehicles = vehiculos.filter((v) => v.id_usuario === currentUserId);
  const myVehiclePlates = myVehicles.map((v) => v.placa);

  const myRecentAccess = logs_acceso_vehicular
    .filter((log) => myVehiclePlates.includes(log.placa))
    .slice(0, 5);

  const myLoans = logs_prestamo_carrito.filter(
    (log) => log.id_usuario === currentUserId,
  );
  const activeLoan = myLoans.find((log) => !log.fecha_salida);
  const recentLoans = [...myLoans].reverse().slice(0, 5);

  const myTenants = inquilinos_temporales.filter((it) =>
    myApartmentIds.includes(it.id_apartamento),
  );

  return (
    <AnimatedPage>
      <div className="page-container">
        <DashboardHeader
          icon={FaUser}
          title={`¡Hola, ${currentUser.nombre.split(" ")[0]}!`}
          badgeText="Propietario"
          welcomeText="Bienvenido a tu portal personal de residente."
        />

        <div className="row g-4 mb-5">
          <StatCard
            icon={FaBuilding}
            label="Propiedades"
            value={myApartments.length}
            colorClass="primary-theme"
          />
          <StatCard
            icon={FaCarSide}
            label="Mis Vehículos"
            value={myVehicles.length}
            colorClass="primary-theme"
          />
          <StatCard
            icon={FaUsers}
            label="Mis Inquilinos"
            value={myTenants.length}
            colorClass="primary-theme"
          />
          <StatCard
            icon={FaCartPlus}
            label="Servicios Activos"
            value={activeLoan ? 1 : 0}
            colorClass="primary-theme"
          />
        </div>

        <div className="row g-4">
          <DashboardTable
            title="Mis Accesos Recientes"
            buttonText="Ver historial"
            onButtonClick={() =>
              navigate("/propietario/historial?tab=estacionamiento")
            }
            headers={["Vehículo", "Método", "Ingreso", "Estado"]}
          >
            {myRecentAccess.length > 0 ? (
              myRecentAccess.map((log) => (
                <tr key={log.id} className="border-bottom border-light">
                  <td className="px-4 py-3">
                    <div className="fw-bold text-primary-theme">
                      {log.placa}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="small fw-medium text-dark">
                      {log.metodo}
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
                colSpan={3}
                message="No hay registros de acceso recientes."
                icon={FaCarSide}
              />
            )}
          </DashboardTable>

          <DashboardTable
            title="Préstamos de Carritos"
            buttonText="Ver historial"
            onButtonClick={() =>
              navigate("/propietario/historial?tab=carritos")
            }
            headers={["Carrito / Usuario", "Solicitud", "Estado"]}
          >
            {recentLoans.length > 0 ? (
              recentLoans.map((loan) => (
                <tr key={loan.id} className="border-bottom border-light">
                  <td className="px-4 py-3">
                    <div className="fw-bold text-dark">
                      Carrito #{loan.id_carrito}
                    </div>
                    <div className="x-small text-muted">
                      <FaUser className="me-1 x-small" /> {currentUser.nombre}
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
                colSpan={3}
                message="No hay préstamos recientes."
                icon={FaCartPlus}
              />
            )}
          </DashboardTable>

          <DashboardTable
            title="Mis Inquilinos"
            buttonText="Gestionar"
            onButtonClick={() => navigate("/propietario/mi-apartamento")}
            headers={[
              "Nombre del Inquilino",
              "Documento (DNI)",
              "Departamento",
            ]}
          >
            {myTenants.length > 0 ? (
              myTenants.map((tenant) => (
                <tr key={tenant.id} className="border-bottom border-light">
                  <td className="px-4 py-3">
                    <div className="fw-bold text-dark">{tenant.nombre}</div>
                    <div className="x-small text-muted">
                      ID: {tenant.id.toString().padStart(3, "0")}
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="small fw-medium text-dark">
                      {tenant.dni}
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="small fw-medium text-dark">
                      Apto:{" "}
                      {apartamentos.find((a) => a.id === tenant.id_apartamento)
                        ?.numero || "N/A"}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <EmptyState
                colSpan={3}
                message="No tienes inquilinos registrados en tus unidades."
                icon={FaUsers}
              />
            )}
          </DashboardTable>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default PRDashboardPage;
