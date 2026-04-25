import { useData } from "../../hooks/useData";
import { useAuth } from "../../hooks/useAuth";
import { FaBuilding, FaSearch, FaPlus, FaHome, FaUserFriends, FaCar, FaShoppingCart, FaClock, FaUser, FaEnvelope, FaCircle } from "react-icons/fa";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import StatCard from "../../components/dashboard/StatCard";
import DashboardTable from "../../components/dashboard/DashboardTable";
import AnimatedPage from "../../components/animations/AnimatedPage";

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

    // --- FILTRADO JERÁRQUICO PARA DATA DINÁMICA ---
    const torres = getTable('torres').filter(t => t.id_condominio === currentCondoId);
    const torresIds = torres.map(t => t.id);
    const pisosIds = getTable('pisos').filter(p => torresIds.includes(p.id_torre)).map(p => p.id);
    const aptosCondo = apartamentos.filter(a => pisosIds.includes(a.id_piso));
    const aptosIds = aptosCondo.map(a => a.id);
    const estIds = getTable('estacionamientos').filter(e => aptosIds.includes(e.id_apartamento)).map(e => e.id);

    // Estadísticas
    const condoUsers = usuarios.filter(u => u.id_condominio === currentCondoId);
    const totalAptos = aptosCondo.length; 
    const totalPropietarios = condoUsers.filter(u => u.id_rol === 3).length;

    // Logs filtrados
    const filteredVehiculoLogs = logs_acceso_vehicular.filter(log => estIds.includes(log.id_estacionamiento));
    const filteredCarritoLogs = logs_prestamo_carrito.filter(log => aptosIds.includes(log.id_apartamento));

    const activeVehicles = filteredVehiculoLogs.filter(log => !log.fecha_salida).length;
    const activeCarLoans = filteredCarritoLogs.filter(log => !log.fecha_salida).length;

    const recentAccess = [...filteredVehiculoLogs].sort((a, b) => new Date(b.fecha_entrada) - new Date(a.fecha_entrada)).slice(0, 4);
    const recentLoans = [...filteredCarritoLogs].sort((a, b) => new Date(b.fecha_entrada) - new Date(a.fecha_entrada)).slice(0, 4);
    const recentCondoUsers = [...condoUsers].slice(0, 4);

    const getRoleName = (roleId) => {
        const role = roles.find(r => r.id === roleId);
        return role ? role.nombre : "N/A";
    };

    return (
        <AnimatedPage>
            <div className="container-fluid py-4 bg-light min-vh-100">
                <DashboardHeader 
                    icon={FaBuilding}
                    title={condo?.nombre || "Panel de Administración"}
                    badgeText="Admin Condominio"
                    welcomeText={`Bienvenido, ${authUser?.nombre || "Admin"}. Gestión operativa y residentes.`}
                >
                </DashboardHeader>

                <div className="row g-4 mb-5">
                    <StatCard icon={FaHome} label="Departamentos" value={totalAptos} colorClass="primary" />
                    <StatCard icon={FaUserFriends} label="Propietarios" value={totalPropietarios} colorClass="success" />
                    <StatCard icon={FaCar} label="Vehículos Hoy" value={activeVehicles} colorClass="warning" />
                    <StatCard icon={FaShoppingCart} label="Carritos en Uso" value={activeCarLoans} colorClass="info" />
                </div>

                <div className="row g-4 mb-4">
                    <DashboardTable 
                        title="Accesos Vehiculares"
                        buttonText="Historial"
                        headers={["Placa / Método", "Ocupante", "Estado"]}
                    >
                        {recentAccess.length > 0 ? recentAccess.map((log) => (
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
                        )) : (
                            <tr>
                                <td colSpan="3" className="text-center py-4 text-muted small italic">No hay actividad vehicular reciente.</td>
                            </tr>
                        )}
                    </DashboardTable>

                    <DashboardTable 
                        title="Préstamos de Carritos"
                        buttonText="Gestionar"
                        headers={["Carrito / Usuario", "Departamento", "Estado"]}
                    >
                        {recentLoans.length > 0 ? recentLoans.map((loan) => (
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
                        )) : (
                            <tr>
                                <td colSpan="3" className="text-center py-4 text-muted small italic">No hay préstamos de carritos recientes.</td>
                            </tr>
                        )}
                    </DashboardTable>
                </div>

                <div className="row g-4">
                    <DashboardTable 
                        title="Residentes y Personal"
                        buttonText="Gestionar Usuarios"
                        headers={["Nombre del Usuario", "Contacto", "Rol en Condominio", "Estado"]}
                        colSize="col-12"
                    >
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
                    </DashboardTable>
                </div>
            </div>
        </AnimatedPage>
    );
};

export default ACDashboard;