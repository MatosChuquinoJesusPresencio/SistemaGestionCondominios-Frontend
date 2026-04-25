import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaUserShield,
  FaBuilding,
  FaUsers,
  FaMapMarkerAlt,
  FaEnvelope,
  FaCircle,
  FaCar,
  FaShoppingCart,
  FaClock,
} from "react-icons/fa";

import { useData } from "../../hooks/useData";
import { useAuth } from "../../hooks/useAuth";

import DashboardHeader from "../../components/dashboard/DashboardHeader";
import StatCard from "../../components/dashboard/StatCard";
import DashboardTable from "../../components/dashboard/DashboardTable";
import CondoDetailModal from "../../components/modals/CondoDetailModal";
import AnimatedPage from "../../components/animations/AnimatedPage";
import EmptyState from "../../components/ui/EmptyState";

const SADashboardPage = () => {
  const navigate = useNavigate();
  const { getTable } = useData();
  const { authUser } = useAuth();

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCondo, setSelectedCondo] = useState(null);

  const condominios = getTable("condominios");
  const usuarios = getTable("usuarios");
  const roles = getTable("roles");
  const logsVehicular = getTable("logs_acceso_vehicular");
  const logsCarrito = getTable("logs_prestamo_carrito");

  const totalCondominios = condominios.length;
  const totalUsuarios = usuarios.length;
  const totalRoles = roles.length;

  const recentCondominios = [...condominios]
    .sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion))
    .slice(0, 5);
  const recentUsuarios = [...usuarios].slice(-5).reverse();

  const recentAccess = [...logsVehicular]
    .sort((a, b) => new Date(b.fecha_entrada) - new Date(a.fecha_entrada))
    .slice(0, 5);

  const recentLoans = [...logsCarrito]
    .sort((a, b) => new Date(b.fecha_entrada) - new Date(a.fecha_entrada))
    .slice(0, 5);

  const getRoleName = (roleId) => {
    const role = roles.find((r) => r.id === roleId);
    return role ? role.nombre : "N/A";
  };

  const handleDetailClick = (condo) => {
    setSelectedCondo(condo);
    setShowDetailModal(true);
  };

  return (
    <AnimatedPage>
      <div className="container-fluid py-4 bg-light min-vh-100">
        <DashboardHeader
          icon={FaUserShield}
          title="Panel de Control Global"
          badgeText="Super Admin"
          welcomeText={`Bienvenido, ${authUser?.nombre || "Administrador"}. Control total de la plataforma.`}
        ></DashboardHeader>

        <div className="row g-4 mb-5">
          <StatCard
            icon={FaBuilding}
            label="Total Condominios"
            value={totalCondominios}
            colorClass="primary-theme"
          />
          <StatCard
            icon={FaUsers}
            label="Usuarios Activos"
            value={totalUsuarios}
            colorClass="primary-theme"
          />
          <StatCard
            icon={FaUserShield}
            label="Roles del Sistema"
            value={totalRoles}
            colorClass="primary-theme"
          />
        </div>

        <div className="row g-4">
          <DashboardTable
            title="Condominios"
            buttonText="Ver todos"
            onButtonClick={() => navigate("/super-admin/condominios")}
            headers={["Información", "Ubicación", "Acción"]}
          >
            {recentCondominios.length > 0 ? (
              recentCondominios.map((condo) => (
                <tr key={condo.id}>
                  <td className="px-4 py-3">
                    <div className="fw-bold text-dark mb-0">{condo.nombre}</div>
                    <div className="x-small text-muted">
                      ID: {condo.id.toString().padStart(3, "0")}
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="small fw-medium text-dark">
                      {condo.direccion}
                    </div>
                    <div className="x-small text-muted">
                      <FaMapMarkerAlt className="me-1" />
                      {condo.ciudad}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-end">
                    <button
                      className="btn btn-sm btn-primary-theme rounded-pill px-3 border-opacity-25 transition fw-bold"
                      onClick={() => handleDetailClick(condo)}
                    >
                      Detalles
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <EmptyState 
                colSpan={3} 
                message="No hay condominios registrados." 
                icon={FaBuilding} 
              />
            )}
          </DashboardTable>

          <DashboardTable
            title="Usuarios"
            buttonText="Ver todos"
            onButtonClick={() => navigate("/super-admin/usuarios")}
            headers={["Usuario", "Rol", "Acción"]}
          >
            {recentUsuarios.length > 0 ? (
              recentUsuarios.map((u) => (
                <tr key={u.id}>
                  <td className="px-4 py-3">
                    <div className="fw-bold text-dark mb-0">{u.nombre}</div>
                    <div className="x-small text-muted">
                      <FaEnvelope className="me-1" />
                      {u.email}
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="small fw-medium text-dark">
                      {getRoleName(u.id_rol)}
                    </div>
                    <div className="x-small d-flex align-items-center gap-1">
                      <FaCircle
                        className={u.activo ? "text-success" : "text-danger"}
                        style={{ fontSize: "6px" }}
                      />
                      <span className="text-muted">
                        {u.activo ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-end">
                    <button
                      className="btn btn-sm btn-primary-theme rounded-pill px-3 border-opacity-25 transition fw-bold"
                      onClick={() =>
                        navigate(
                          `/super-admin/usuarios?search=${encodeURIComponent(u.nombre)}`,
                        )
                      }
                    >
                      Gestionar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <EmptyState 
                colSpan={3} 
                message="No hay usuarios registrados recientemente." 
                icon={FaUsers} 
              />
            )}
          </DashboardTable>
        </div>

        <div className="row g-4 mt-2">
          <DashboardTable
            title="Accesos Vehiculares (Global)"
            buttonText="Ver historial"
            onButtonClick={() => navigate("/super-admin/historial?tab=estacionamiento")}
            headers={["Vehículo", "Condominio", "Ingreso", "Estado"]}
          >
            {recentAccess.length > 0 ? (
              recentAccess.map((log) => (
                <tr key={log.id}>
                  <td className="px-4 py-3">
                    <div className="fw-bold text-dark">{log.placa}</div>
                    <div className="x-small text-muted">{log.metodo}</div>
                  </td>
                  <td className="py-3">
                    <div className="small fw-medium text-dark">
                      {condominios.find((c) => c.id === usuarios.find(u => u.id_condominio)?.id_condominio)?.nombre || "N/A"}
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
                message="No hay registros de acceso vehicular global."
                icon={FaCar}
              />
            )}
          </DashboardTable>

          <DashboardTable
            title="Préstamos de Carritos (Global)"
            buttonText="Ver historial"
            onButtonClick={() => navigate("/super-admin/historial?tab=carritos")}
            headers={["Carrito / Usuario", "Departamento", "Estado"]}
          >
            {recentLoans.length > 0 ? (
              recentLoans.map((loan) => (
                <tr key={loan.id}>
                  <td className="px-4 py-3">
                    <div className="fw-bold text-dark">
                      Carrito #{loan.id_carrito}
                    </div>
                    <div className="x-small text-muted">
                      <FaUsers className="me-1 x-small" /> {loan.solicitante}
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="small fw-medium text-dark">
                      ID Apto: {loan.id_apartamento}
                    </div>
                    <div className="x-small text-muted">
                      Inicio:{" "}
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
                colSpan={3}
                message="No hay préstamos de carritos activos."
                icon={FaShoppingCart}
              />
            )}
          </DashboardTable>
        </div>
      </div>

      <CondoDetailModal
        show={showDetailModal}
        onHide={() => setShowDetailModal(false)}
        condo={selectedCondo}
      />
    </AnimatedPage>
  );
};

export default SADashboardPage;
