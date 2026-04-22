import { useData } from "../../hooks/useData";
import { FaBuilding, FaUsers, FaUserShield, FaPlusCircle, FaArrowRight, FaMapMarkerAlt, FaGlobeAmericas, FaEnvelope, FaCircle } from "react-icons/fa";

const SADashboardPage = () => {
    const { getTable } = useData();

    const condominios = getTable('condominios');
    const usuarios = getTable('usuarios');
    const roles = getTable('roles');
    
    const totalCondominios = condominios.length;
    const totalUsuarios = usuarios.length;
    const totalRoles = roles.length;

    // Recent data
    const recentCondominios = [...condominios].sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion)).slice(0, 5);
    const recentUsuarios = [...usuarios].slice(-5).reverse();

    const getRoleName = (roleId) => {
        const role = roles.find(r => r.id === roleId);
        return role ? role.nombre : "N/A";
    };

    return (
        <div className="container-fluid py-4 bg-light min-vh-100">
            {/* Header section */}
            <div className="row mb-5 align-items-center">
                <div className="col-12 col-md-8">
                    <div className="d-flex align-items-center gap-3 mb-2">
                        <div className="p-2 rounded-3 bg-white shadow-sm border border-primary border-opacity-10">
                            <FaUserShield className="fs-4" style={{ color: "var(--primary-color)" }} />
                        </div>
                        <h2 className="fw-bold mb-0 tracking-tight" style={{ color: "var(--primary-color)", fontSize: "1.75rem" }}>
                            Panel de Control Global
                        </h2>
                    </div>
                    <p className="text-muted mb-0 ms-1 d-flex align-items-center gap-2">
                        <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-10 px-2 py-1 rounded-1 small">Super Admin</span>
                        <span className="text-secondary opacity-75">Gestión centralizada de la plataforma y condominios.</span>
                    </p>
                </div>
                <div className="col-12 col-md-4 text-md-end mt-3 mt-md-0">
                    <button className="btn btn-primary-theme d-inline-flex align-items-center gap-2 shadow-sm px-4 py-2 rounded-3 fw-semibold">
                        <FaPlusCircle />
                        <span>Nuevo Condominio</span>
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="row g-4 mb-5">
                <div className="col-12 col-md-4">
                    <div className="card border-0 shadow-sm rounded-4 p-3 h-100 border-start border-primary border-5">
                        <div className="d-flex align-items-center">
                            <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3">
                                <FaBuilding className="text-primary fs-3" />
                            </div>
                            <div>
                                <h6 className="text-muted fw-semibold mb-1 small text-uppercase">Total Condominios</h6>
                                <h3 className="fw-bold mb-0">{totalCondominios}</h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-4">
                    <div className="card border-0 shadow-sm rounded-4 p-3 h-100 border-start border-success border-5">
                        <div className="d-flex align-items-center">
                            <div className="bg-success bg-opacity-10 p-3 rounded-circle me-3">
                                <FaUsers className="text-success fs-3" />
                            </div>
                            <div>
                                <h6 className="text-muted fw-semibold mb-1 small text-uppercase">Usuarios Activos</h6>
                                <h3 className="fw-bold mb-0">{totalUsuarios}</h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-4">
                    <div className="card border-0 shadow-sm rounded-4 p-3 h-100 border-start border-warning border-5">
                        <div className="d-flex align-items-center">
                            <div className="bg-warning bg-opacity-10 p-3 rounded-circle me-3">
                                <FaUserShield className="text-warning fs-3" />
                            </div>
                            <div>
                                <h6 className="text-muted fw-semibold mb-1 small text-uppercase">Roles del Sistema</h6>
                                <h3 className="fw-bold mb-0">{totalRoles}</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tables Section */}
            <div className="row g-4">
                {/* Condominios Table */}
                <div className="col-12 col-xl-6">
                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100 bg-white">
                        <div className="card-header border-0 py-4 px-4 bg-white d-flex justify-content-between align-items-center">
                            <h5 className="fw-bold mb-0" style={{ color: "var(--secondary-color)" }}>Condominios</h5>
                            <button className="btn btn-secondary-theme btn-sm px-4 rounded-pill fw-bold shadow-sm">
                                Ver todos
                            </button>
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0">
                                    <thead className="bg-light">
                                        <tr className="text-secondary x-small text-uppercase fw-bold">
                                            <th className="px-4 py-3 border-0">Información</th>
                                            <th className="py-3 border-0">Ubicación</th>
                                            <th className="px-4 py-3 border-0 text-end">Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody>
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
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                <div className="col-12 col-xl-6">
                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100 bg-white">
                        <div className="card-header border-0 py-4 px-4 bg-white d-flex justify-content-between align-items-center">
                            <h5 className="fw-bold mb-0" style={{ color: "var(--secondary-color)" }}>Usuarios</h5>
                            <button className="btn btn-secondary-theme btn-sm px-4 rounded-pill fw-bold shadow-sm">
                                Ver todos
                            </button>
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0">
                                    <thead className="bg-light">
                                        <tr className="text-secondary x-small text-uppercase fw-bold">
                                            <th className="px-4 py-3 border-0">Usuario</th>
                                            <th className="py-3 border-0">Rol</th>
                                            <th className="px-4 py-3 border-0 text-end">Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody>
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
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SADashboardPage;