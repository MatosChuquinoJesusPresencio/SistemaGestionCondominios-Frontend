import { FaHome, FaUserShield, FaBuilding } from "react-icons/fa";

export const MENU_BY_ROLE = {
    ADMIN_CONDOMINIO: [
        { path: "/admin-condominio", label: "Inicio", icon: <FaBuilding /> },
        { path: "/admin-condominio/apartamentos", label: "Apartamentos", icon: <FaBuilding /> },
    ],

    SUPER_ADMIN: [
        { path: "/super-admin", label: "Inicio", icon: <FaUserShield /> },
        { path: "/super-admin/apartamentos", label: "Apartamentos", icon: <FaBuilding /> },
    ],

    PROPIETARIO: [
        { path: "/propietario", label: "Inicio", icon: <FaHome /> },
        { path: "/propietario/apartamentos", label: "Mi Apartamento", icon: <FaHome /> },
    ],
};