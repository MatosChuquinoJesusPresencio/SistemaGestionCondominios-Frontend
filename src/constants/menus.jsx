import { FaHome, FaUserShield, FaBuilding, FaSitemap, FaUsers, FaListAlt, FaCar, FaHistory, FaLock, FaShoppingCart } from "react-icons/fa";

export const MENU_BY_ROLE = {
    ADMIN_CONDOMINIO: [
        { path: "/admin-condominio", label: "Inicio", icon: <FaBuilding />, exact: true },
        { path: "/admin-condominio/mi-condominio", label: "Mi Condominio", icon: <FaBuilding /> },
        { path: "/admin-condominio/infraestructura", label: "Infraestructura", icon: <FaSitemap /> },
        { path: "/admin-condominio/usuarios", label: "Usuarios", icon: <FaUsers /> },
        { path: "/admin-condominio/apartamentos", label: "Apartamentos", icon: <FaHome /> },
        { path: "/admin-condominio/estacionamientos", label: "Estacionamientos", icon: <FaCar /> },
        { path: "/admin-condominio/carritos", label: "Carritos", icon: <FaShoppingCart /> },
        { path: "/admin-condominio/historial", label: "Historial", icon: <FaListAlt /> },
        { path: "/perfil/cambiar-contraseña", label: "Contraseña", icon: <FaLock /> },
    ],

    SUPER_ADMIN: [
        { path: "/super-admin", label: "Inicio", icon: <FaUserShield />, exact: true },
        { path: "/super-admin/condominios", label: "Condominios", icon: <FaBuilding /> },
        { path: "/super-admin/apartamentos", label: "Apartamentos", icon: <FaSitemap /> },
        { path: "/super-admin/estacionamientos", label: "Estacionamientos", icon: <FaCar /> },
        { path: "/super-admin/usuarios", label: "Usuarios", icon: <FaUsers /> },
        { path: "/super-admin/historial", label: "Historial", icon: <FaListAlt /> },
        { path: "/perfil/cambiar-contraseña", label: "Contraseña", icon: <FaLock /> },
    ],

    PROPIETARIO: [
        { path: "/propietario", label: "Inicio", icon: <FaHome />, exact: true },
        { path: "/propietario/mi-apartamento", label: "Apartamento", icon: <FaHome /> },
        { path: "/propietario/vehiculos", label: "Vehículos", icon: <FaCar /> },
        { path: "/propietario/carritos", label: "Carritos", icon: <FaShoppingCart /> },
        { path: "/propietario/historial", label: "Historial", icon: <FaHistory /> },
        { path: "/perfil/cambiar-contraseña", label: "Contraseña", icon: <FaLock /> },
    ],
};