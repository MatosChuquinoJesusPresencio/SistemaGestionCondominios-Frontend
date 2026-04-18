import { FaHome, FaUserShield, FaBuilding } from "react-icons/fa";

export const MENU_BY_ROLE = {
    ADMIN_CONDOMINIO: [
        { path: "/admin-condominio", label: "Inicio", icon: <FaHome /> },
    ],

    SUPER_ADMIN: [
        { path: "/super-admin", label: "Inicio", icon: <FaUserShield /> },
    ],

    PROPIETARIO: [
        { path: "/propietario", label: "Inicio", icon: <FaBuilding /> },
    ],
};