import { useData } from "../../hooks/useData";
import { useAuth } from "../../hooks/useAuth";
import { FaHome, FaCar, FaShoppingCart, FaUserFriends, FaHistory, FaPlus, FaBuilding, FaSearch, FaArrowRight, FaUser, FaEnvelope, FaCircle } from "react-icons/fa";

const ACDashboard = () => {
    const { getTable } = useData();
    const { authUser } = useAuth();

    const apartamentos = getTable('apartamentos');
    const usuarios = getTable('usuarios');
    const roles = getTable('roles');
    const logs_acceso_vehicular = getTable('logs_acceso_vehicular');
    const logs_prestamo_carrito = getTable('logs_prestamo_carrito');
    const condominios = getTable('condominios');
    
    const currentCondoId = authUser?.id_condominio;
    const condo = condominios.find(c => c.id === currentCondoId);

    const condoUsers = usuarios.filter(u => u.id_condominio === currentCondoId);
    
    const totalAptos = apartamentos.length; 
    const totalPropietarios = condoUsers.filter(u => u.id_rol === 3).length;
    

    const activeVehicles = logs_acceso_vehicular.filter(log => !log.fecha_salida).length;
    const activeCarLoans = logs_prestamo_carrito.filter(log => !log.fecha_salida).length;

    const recentAccess = [...logs_acceso_vehicular].slice(0, 4);
    const recentLoans = [...logs_prestamo_carrito].slice(0, 4);
    const recentCondoUsers = [...condoUsers].slice(0, 4);

    const getRoleName = (roleId) => {
        const role = roles.find(r => r.id === roleId);
        return role ? role.nombre : "N/A";
    };

    return (
        <div className="container-fluid py-4 bg-light min-vh-100">
            <div className="row mb-5 align-items-center">
                <div className="col-12 col-md-8">
                    <div className="d-flex align-items-center gap-3 mb-2">
                        <div className="p-2 rounded-3 bg-white shadow-sm border border-primary border-opacity-10">
                            <FaBuilding className="fs-4" style={{ color: "var(--primary-color)" }} />
                        </div>
                        <h2 className="fw-bold mb-0 tracking-tight" style={{ color: "var(--primary-color)", fontSize: "1.75rem" }}>
                            {condo?.nombre || "Panel de Administración"}
                        </h2>
                    </div>
                    <p className="text-muted mb-0 ms-1 d-flex align-items-center gap-2">
                        <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-10 px-2 py-1 rounded-1 small">Admin Condominio</span>
                        <span className="text-secondary opacity-75">Bienvenido, {authUser?.nombre || "Admin"}. Gestión operativa y residentes.</span>
                    </p>
                </div>
                <div className="col-12 col-md-4 text-md-end mt-3 mt-md-0 d-flex gap-2 justify-content-md-end">
                    <button className="btn btn-secondary-theme d-inline-flex align-items-center gap-2 shadow-sm px-4 py-2 rounded-3 fw-semibold text-nowrap">
                        <FaSearch className="small" />
                        <span>Logs</span>
                    </button>
                    <button className="btn btn-primary-theme d-inline-flex align-items-center gap-2 shadow-sm px-4 py-2 rounded-3 fw-semibold text-nowrap">
                        <FaPlus />
                        <span>Registrar</span>
                    </button>
                </div>
            </div>

            <div className="row g-4 mb-5">
                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="card border-0 shadow-sm rounded-4 p-3 h-100 border-start border-primary border-5">
                        <div className="d-flex align-items-center">
                            <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3">
                                <FaHome className="text-primary fs-4" />
                            </div>
                            <div>
                                <h6 className="text-muted fw-semibold mb-1 small text-uppercase">Departamentos</h6>
                                <h4 className="fw-bold mb-0">{totalAptos}</h4>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="card border-0 shadow-sm rounded-4 p-3 h-100 border-start border-success border-5">
                        <div className="d-flex align-items-center">
                            <div className="bg-success bg-opacity-10 p-3 rounded-circle me-3">
                                <FaUserFriends className="text-success fs-4" />
                            </div>
                            <div>
                                <h6 className="text-muted fw-semibold mb-1 small text-uppercase">Propietarios</h6>
                                <h4 className="fw-bold mb-0">{totalPropietarios}</h4>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="card border-0 shadow-sm rounded-4 p-3 h-100 border-start border-warning border-5">
                        <div className="d-flex align-items-center">
                            <div className="bg-warning bg-opacity-10 p-3 rounded-circle me-3">
                                <FaCar className="text-warning fs-4" />
                            </div>
                            <div>
                                <h6 className="text-muted fw-semibold mb-1 small text-uppercase">Vehículos Hoy</h6>
                                <h4 className="fw-bold mb-0">{activeVehicles}</h4>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="card border-0 shadow-sm rounded-4 p-3 h-100 border-start border-info border-5">
                        <div className="d-flex align-items-center">
                            <div className="bg-info bg-opacity-10 p-3 rounded-circle me-3">
                                <FaShoppingCart className="text-info fs-4" />
                            </div>
                            <div>
                                <h6 className="text-muted fw-semibold mb-1 small text-uppercase">Carritos en Uso</h6>
                                <h4 className="fw-bold mb-0">{activeCarLoans}</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-4 mb-4">
                <div className="col-12 col-xl-6">
                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100 bg-white">
                        <div className="card-header border-0 py-4 px-4 bg-white d-flex justify-content-between align-items-center">
                            <h5 className="fw-bold mb-0" style={{ color: "var(--secondary-color)" }}>Accesos Vehiculares</h5>
                            <button className="btn btn-secondary-theme btn-sm px-4 rounded-pill fw-bold shadow-sm">
                                Historial
                            </button>
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0">
                                    <thead className="bg-light">
                                        <tr className="text-secondary x-small text-uppercase fw-bold">
                                            <th className="px-4 py-3 border-0">Placa / Método</th>
                                            <th className="py-3 border-0">Ocupante</th>
                                            <th className="px-4 py-3 border-0 text-end">Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentAccess.map((log) => (
                                            <tr key={log.id} className="border-bottom border-light">
                                                <td className="px-4 py-3">
                                                    <div className="fw-bold text-primary">{log.placa}</div>
                                                    <div className="x-small text-muted">{log.metodo}</div>
                                                </td>
                                                <td className="py-3">
                                                    <div className="small fw-medium text-dark">{log.tipo_ocupante}</div>
                                                    <div className="x-small text-muted">{log.datos_inquilino || "Propietario"}</div>
                                                </td>
                                                <td className="px-4 py-3 text-end">
                                                    {log.fecha_salida ? (
                                                        <span className="badge bg-light text-muted fw-normal px-3 py-2 rounded-pill">Salió</span>
                                                    ) : (
                                                        <span className="badge bg-success bg-opacity-10 text-success fw-bold px-3 py-2 rounded-pill border border-success border-opacity-10">En recinto</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-xl-6">
                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100 bg-white">
                        <div className="card-header border-0 py-4 px-4 bg-white d-flex justify-content-between align-items-center">
                            <h5 className="fw-bold mb-0" style={{ color: "var(--secondary-color)" }}>Préstamos de Carritos</h5>
                            <button className="btn btn-secondary-theme btn-sm px-4 rounded-pill fw-bold shadow-sm">
                                Gestionar
                            </button>
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0">
                                    <thead className="bg-light">
                                        <tr className="text-secondary x-small text-uppercase fw-bold">
                                            <th className="px-4 py-3 border-0">Carrito / Usuario</th>
                                            <th className="py-3 border-0">Departamento</th>
                                            <th className="px-4 py-3 border-0 text-end">Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentLoans.map((loan) => (
                                            <tr key={loan.id} className="border-bottom border-light">
                                                <td className="px-4 py-3">
                                                    <div className="fw-bold text-dark">Carrito #{loan.id_carrito}</div>
                                                    <div className="x-small text-muted"><FaUser className="me-1 x-small" /> {loan.solicitante}</div>
                                                </td>
                                                <td className="py-3">
                                                    <div className="small fw-medium text-dark">Apto: {loan.id_apartamento}</div>
                                                    <div className="x-small text-muted">Solicitud: {new Date(loan.fecha_entrada).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                                </td>
                                                <td className="px-4 py-3 text-end">
                                                    {loan.fecha_salida ? (
                                                        <span className="badge bg-light text-muted fw-normal px-3 py-2 rounded-pill">Finalizado</span>
                                                    ) : (
                                                        <span className="badge bg-danger bg-opacity-10 text-danger fw-bold px-3 py-2 rounded-pill border border-danger border-opacity-10">En uso</span>
                                                    )}
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

            <div className="row g-4">
                <div className="col-12">
                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
                        <div className="card-header border-0 py-4 px-4 bg-white d-flex justify-content-between align-items-center">
                            <h5 className="fw-bold mb-0" style={{ color: "var(--secondary-color)" }}>Residentes y Personal</h5>
                            <button className="btn btn-secondary-theme btn-sm px-4 rounded-pill fw-bold shadow-sm">
                                Gestionar Usuarios
                            </button>
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0">
                                    <thead className="bg-light">
                                        <tr className="text-secondary x-small text-uppercase fw-bold">
                                            <th className="px-4 py-3 border-0">Nombre del Usuario</th>
                                            <th className="py-3 border-0">Contacto</th>
                                            <th className="py-3 border-0">Rol en Condominio</th>
                                            <th className="px-4 py-3 border-0 text-end">Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentCondoUsers.length > 0 ? (
                                            recentCondoUsers.map((u) => (
                                                <tr key={u.id} className="border-bottom border-light">
                                                    <td className="px-4 py-3">
                                                        <div className="fw-bold text-dark">{u.nombre}</div>
                                                        <div className="x-small text-muted">ID: {u.id.toString().padStart(3, '0')}</div>
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
                                                            <FaCircle className={u.activo ? 'text-success' : 'text-danger'} style={{ fontSize: "8px" }} />
                                                            <span className="small text-muted fw-medium">{u.activo ? "Activo" : "Inactivo"}</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="text-center py-5 text-muted small italic">No hay usuarios registrados en este condominio.</td>
                                            </tr>
                                        )}
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

export default ACDashboard;