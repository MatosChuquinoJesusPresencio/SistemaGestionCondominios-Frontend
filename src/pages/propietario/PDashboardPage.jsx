import { useData } from "../../hooks/useData";
import { useAuth } from "../../hooks/useAuth";
import { FaBuilding, FaCarSide, FaCartPlus, FaUser, FaClock, FaUsers } from "react-icons/fa";

const PDashboardPage = () => {
    const { getTable } = useData();
    const { authUser } = useAuth();

    const apartamentos = getTable('apartamentos');
    const vehiculos = getTable('vehiculos');
    const logs_acceso_vehicular = getTable('logs_acceso_vehicular');
    const logs_prestamo_carrito = getTable('logs_prestamo_carrito');
    const inquilinos_temporales = getTable('inquilinos_temporales');
    
    const currentUserId = authUser?.id;
    const currentUser = authUser || { nombre: "Usuario", id: 0 };
    
    const myApartments = apartamentos.filter(a => a.id_usuario === currentUserId);
    const myApartmentIds = myApartments.map(a => a.id);
    
    const myVehicles = vehiculos.filter(v => v.id_usuario === currentUserId);
    const myVehiclePlates = myVehicles.map(v => v.placa);

    const myRecentAccess = logs_acceso_vehicular.filter(log => myVehiclePlates.includes(log.placa)).slice(0, 5);

    const myLoans = logs_prestamo_carrito.filter(log => log.id_usuario === currentUserId);
    const activeLoan = myLoans.find(log => !log.fecha_salida);
    const recentLoans = [...myLoans].reverse().slice(0, 5);

    const myTenants = inquilinos_temporales.filter(it => myApartmentIds.includes(it.id_apartamento));

    return (
        <div className="container-fluid py-4 bg-light min-vh-100">
            <div className="row mb-5 align-items-center">
                <div className="col-12 col-md-8">
                    <div className="d-flex align-items-center gap-3 mb-2">
                        <div className="p-2 rounded-3 bg-white shadow-sm border border-primary border-opacity-10">
                            <FaUser className="fs-4" style={{ color: "var(--primary-color)" }} />
                        </div>
                        <h2 className="fw-bold mb-0 tracking-tight" style={{ color: "var(--primary-color)", fontSize: "1.75rem" }}>
                            ¡Hola, {currentUser.nombre.split(' ')[0]}!
                        </h2>
                    </div>
                    <p className="text-muted mb-0 ms-1 d-flex align-items-center gap-2">
                        <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-10 px-2 py-1 rounded-1 small">Propietario</span>
                        <span className="text-secondary opacity-75">Bienvenido a tu portal personal de residente.</span>
                    </p>
                </div>
            </div>

            <div className="row g-4 mb-5">
                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="card border-0 shadow-sm rounded-4 p-3 h-100 border-start border-primary border-5">
                        <div className="d-flex align-items-center">
                            <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3">
                                <FaBuilding className="text-primary fs-4" />
                            </div>
                            <div>
                                <h6 className="text-muted fw-semibold mb-1 small text-uppercase">Propiedades</h6>
                                <h4 className="fw-bold mb-0">{myApartments.length}</h4>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="card border-0 shadow-sm rounded-4 p-3 h-100 border-start border-success border-5">
                        <div className="d-flex align-items-center">
                            <div className="bg-success bg-opacity-10 p-3 rounded-circle me-3">
                                <FaCarSide className="text-success fs-4" />
                            </div>
                            <div>
                                <h6 className="text-muted fw-semibold mb-1 small text-uppercase">Mis Vehículos</h6>
                                <h4 className="fw-bold mb-0">{myVehicles.length}</h4>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="card border-0 shadow-sm rounded-4 p-3 h-100 border-start border-warning border-5">
                        <div className="d-flex align-items-center">
                            <div className="bg-warning bg-opacity-10 p-3 rounded-circle me-3">
                                <FaUsers className="text-warning fs-4" />
                            </div>
                            <div>
                                <h6 className="text-muted fw-semibold mb-1 small text-uppercase">Mis Inquilinos</h6>
                                <h4 className="fw-bold mb-0">{myTenants.length}</h4>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="card border-0 shadow-sm rounded-4 p-3 h-100 border-start border-info border-5">
                        <div className="d-flex align-items-center">
                            <div className="bg-info bg-opacity-10 p-3 rounded-circle me-3">
                                <FaCartPlus className="text-info fs-4" />
                            </div>
                            <div>
                                <h6 className="text-muted fw-semibold mb-1 small text-uppercase">Servicios Activos</h6>
                                <h4 className="fw-bold mb-0">{activeLoan ? 1 : 0}</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-4">
                <div className="col-12 col-xl-6">
                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100 bg-white">
                        <div className="card-header border-0 py-4 px-4 bg-white d-flex justify-content-between align-items-center">
                            <h5 className="fw-bold mb-0" style={{ color: "var(--secondary-color)" }}>Mis Accesos Recientes</h5>
                            <button className="btn btn-secondary-theme btn-sm px-4 rounded-pill fw-bold shadow-sm">
                                Ver todos
                            </button>
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0">
                                    <thead className="bg-light">
                                        <tr className="text-secondary x-small text-uppercase fw-bold">
                                            <th className="px-4 py-3 border-0">Vehículo</th>
                                            <th className="py-3 border-0">Ingreso</th>
                                            <th className="px-4 py-3 border-0 text-end">Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {myRecentAccess.length > 0 ? (
                                            myRecentAccess.map((log) => (
                                                <tr key={log.id} className="border-bottom border-light">
                                                    <td className="px-4 py-3">
                                                        <div className="fw-bold text-dark">{log.placa}</div>
                                                        <div className="x-small text-muted">Apto: {myApartments.find(a => true)?.numero || "N/A"}</div>
                                                    </td>
                                                    <td className="py-3">
                                                        <div className="small fw-medium text-dark">{new Date(log.fecha_entrada).toLocaleDateString()}</div>
                                                        <div className="x-small text-muted"><FaClock className="me-1" />{new Date(log.fecha_entrada).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                                    </td>
                                                    <td className="px-4 py-3 text-end">
                                                        {log.fecha_salida ? (
                                                            <span className="badge bg-light text-muted fw-normal px-3 py-2 rounded-pill">Salió</span>
                                                        ) : (
                                                            <span className="badge bg-success bg-opacity-10 text-success fw-bold px-3 py-2 rounded-pill border border-success border-opacity-10">En recinto</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="3" className="text-center py-5 text-muted italic small">No hay registros de acceso recientes.</td>
                                            </tr>
                                        )}
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
                                            <th className="py-3 border-0">Solicitud</th>
                                            <th className="px-4 py-3 border-0 text-end">Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentLoans.length > 0 ? (
                                            recentLoans.map((loan) => (
                                                <tr key={loan.id} className="border-bottom border-light">
                                                    <td className="px-4 py-3">
                                                        <div className="fw-bold text-dark">Carrito #{loan.id_carrito}</div>
                                                        <div className="x-small text-muted"><FaUser className="me-1 x-small" /> {currentUser.nombre}</div>
                                                    </td>
                                                    <td className="py-3">
                                                        <div className="small fw-medium text-dark">{new Date(loan.fecha_entrada).toLocaleDateString()}</div>
                                                        <div className="x-small text-muted"><FaClock className="me-1" />{new Date(loan.fecha_entrada).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                                    </td>
                                                    <td className="px-4 py-3 text-end">
                                                        {loan.fecha_salida ? (
                                                            <span className="badge bg-light text-muted fw-normal px-3 py-2 rounded-pill">Finalizado</span>
                                                        ) : (
                                                            <span className="badge bg-danger bg-opacity-10 text-danger fw-bold px-3 py-2 rounded-pill border border-danger border-opacity-10">En uso</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="3" className="text-center py-5 text-muted italic small">No hay préstamos recientes.</td>
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

export default PDashboardPage;