import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaUserShield,
  FaBuilding,
  FaUsers,
  FaMapMarkerAlt,
  FaEnvelope,
  FaCircle,
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

  const totalCondominios = condominios.length;
  const totalUsuarios = usuarios.length;
  const totalRoles = roles.length;

  const recentCondominios = [...condominios]
    .sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion))
    .slice(0, 5);
  const recentUsuarios = [...usuarios].slice(-5).reverse();

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
