import DashboardHeader from "../../components/dashboard/DashboardHeader";
import StatCard from "../../components/dashboard/StatCard";
import DashboardTable from "../../components/dashboard/DashboardTable";
import { useData } from "../../hooks/useData";
import { useAuth } from "../../hooks/useAuth";
import { FaUserShield, FaPlusCircle, FaBuilding, FaUsers, FaMapMarkerAlt, FaEnvelope, FaCircle } from "react-icons/fa";

const SADashboardPage = () => {
    const { getTable } = useData();
    const { authUser } = useAuth();

    const condominios = getTable('condominios');
    const usuarios = getTable('usuarios');
    const roles = getTable('roles');

    const totalCondominios = condominios.length;
    const totalUsuarios = usuarios.length;
    const totalRoles = roles.length;

    const recentCondominios = [...condominios].sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion)).slice(0, 5);
    const recentUsuarios = [...usuarios].slice(-5).reverse();

    const getRoleName = (roleId) => {
        const role = roles.find(r => r.id === roleId);
        return role ? role.nombre : "N/A";
    };

    return (
        <div className="container-fluid py-4 bg-light min-vh-100">
            <DashboardHeader 
                icon={FaUserShield}
                title="Panel de Control Global"
                badgeText="Super Admin"
                welcomeText={`Bienvenido, ${authUser?.nombre || "Administrador"}. Control total de la plataforma.`}
            >
                <button className="btn btn-primary-theme d-inline-flex align-items-center gap-2 shadow-sm px-4 py-2 rounded-3 fw-semibold">
                    <FaPlusCircle />
                    <span>Nuevo Condominio</span>
                </button>
            </DashboardHeader>

            <div className="row g-4 mb-5">
                <StatCard icon={FaBuilding} label="Total Condominios" value={totalCondominios} colorClass="primary" />
                <StatCard icon={FaUsers} label="Usuarios Activos" value={totalUsuarios} colorClass="success" />
                <StatCard icon={FaUserShield} label="Roles del Sistema" value={totalRoles} colorClass="warning" />
            </div>

            <div className="row g-4">
                <DashboardTable 
                    title="Condominios"
                    buttonText="Ver todos"
                    headers={["Información", "Ubicación", "Acción"]}
                >
                    {recentCondominios.map((condo) => (
                        <tr key={condo.id} className="border-bottom border-light">
                            <td className="px-4 py-3">
                                <div className="fw-bold text-dark mb-0">{condo.nombre}</div>
                                <div className="x-small text-muted">ID: {condo.id.toString().padStart(3, '0')}</div>
                            </td>
                            <td className="py-3">
                                <div className="small fw-medium text-dark">{condo.direccion}</div>
                                <div className="x-small text-muted"><FaMapMarkerAlt className="me-1" />{condo.ciudad}</div>
                            </td>
                            <td className="px-4 py-3 text-end">
                                <button className="btn btn-sm btn-outline-secondary rounded-pill px-3 border-opacity-25 transition">
                                    Detalles
                                </button>
                            </td>
                        </tr>
                    ))}
                </DashboardTable>

                <DashboardTable 
                    title="Usuarios"
                    buttonText="Ver todos"
                    headers={["Usuario", "Rol", "Acción"]}
                >
                    {recentUsuarios.map((u) => (
                        <tr key={u.id} className="border-bottom border-light">
                            <td className="px-4 py-3">
                                <div className="fw-bold text-dark mb-0">{u.nombre}</div>
                                <div className="x-small text-muted"><FaEnvelope className="me-1" />{u.email}</div>
                            </td>
                            <td className="py-3">
                                <div className="small fw-medium text-dark">{getRoleName(u.id_rol)}</div>
                                <div className="x-small d-flex align-items-center gap-1">
                                    <FaCircle className={u.activo ? 'text-success' : 'text-danger'} style={{ fontSize: "6px" }} />
                                    <span className="text-muted">{u.activo ? "Activo" : "Inactivo"}</span>
                                </div>
                            </td>
                            <td className="px-4 py-3 text-end">
                                <button className="btn btn-sm btn-outline-secondary rounded-pill px-3 border-opacity-25 transition">
                                    Gestionar
                                </button>
                            </td>
                        </tr>
                    ))}
                </DashboardTable>
            </div>
        </div>
    );
};

export default SADashboardPage;