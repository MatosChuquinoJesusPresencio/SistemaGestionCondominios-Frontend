import { useAuth } from "../../hooks/useAuth";
import { FaHome, FaUsers, FaFileInvoiceDollar, FaCalendarCheck } from "react-icons/fa";

const PDashboardPage = () => {
    const { authUser } = useAuth();

    return (
        <div className="container-fluid px-4 py-5">
            {/* Saludo personalizado */}
            <div className="mb-4">
                <h2 className="fw-bold text-dark">¡Hola, {authUser?.nombre || 'Propietario'}! </h2>
                <p className="text-muted">Aquí tienes un resumen rápido de tus propiedades.</p>
            </div>

            {/* Tarjetas de Resumen (KPIs) */}
            <div className="row g-4">
                <DashboardCard title="Inquilinos Activos" value="03" icon={<FaUsers />} color="primary" />
                <DashboardCard title="Propiedades" value="01" icon={<FaHome />} color="success" />
                <DashboardCard title="Pagos Pendientes" value="$ 450" icon={<FaFileInvoiceDollar />} color="warning" />
                <DashboardCard title="Próximas Salidas" value="01" icon={<FaCalendarCheck />} color="info" />
            </div>

            {/* Sección inferior - Actividad */}
            <div className="row mt-5">
                <div className="col-12 col-lg-8">
                    <div className="card shadow-sm border-0 p-4 rounded-4">
                        <h5 className="fw-bold mb-3">Actividad Reciente</h5>
                        <p className="text-muted">No hay movimientos recientes en tus propiedades.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Componente auxiliar para las tarjetas
const DashboardCard = ({ title, value, icon, color }) => (
    <div className="col-12 col-md-6 col-lg-3">
        <div className="card border-0 shadow-sm rounded-4 p-4">
            <div className="d-flex justify-content-between align-items-center">
                <div>
                    <p className="text-muted mb-1 small text-uppercase fw-bold">{title}</p>
                    <h3 className="fw-bold text-dark mb-0">{value}</h3>
                </div>
                <div className={`bg-${color} bg-opacity-10 p-3 rounded-circle text-${color}`}>
                    {icon}
                </div>
            </div>
        </div>
    </div>
);

export default PDashboardPage;