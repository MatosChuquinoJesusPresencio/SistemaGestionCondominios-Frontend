import { Outlet, Navigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../hooks/useAuth";
import { MENU_BY_ROLE } from "../constants/menus";

const PrivateLayout = () => {
    const { authUser, authLoading } = useAuth();

    // 1. Manejo de estado de carga: Evita renderizar contenido incompleto
    if (authLoading) {
        return <div className="text-center mt-5">Cargando sistema...</div>;
    }

    // 2. Protección de ruta: Si no hay usuario, redirige al login inmediatamente
    if (!authUser) {
        return <Navigate to="/login" replace />;
    }

    // 3. Lógica limpia: Obtenemos el menú solo cuando sabemos que el usuario existe
    const menuItems = MENU_BY_ROLE[authUser?.role] || [];

    return (
        <div className="d-flex flex-column min-vh-100">
            <Header />
            
            <div className="d-flex flex-grow-1">
                <Sidebar menuItems={menuItems} />
                
                {/* Contenedor principal con padding para mejorar la estética */}
                <main className="flex-grow-1 p-4 bg-light">
                    <Outlet />
                </main>
            </div>
            
            <Footer />
        </div>
    );
};

export default PrivateLayout;