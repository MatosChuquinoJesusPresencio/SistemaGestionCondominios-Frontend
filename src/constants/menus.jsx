import { FaHome, FaUserShield, FaBuilding, FaUsers } from "react-icons/fa";

export const MENU_BY_ROLE = {
    ADMIN_CONDOMINIO: [
        { path: "/admin-condominio", label: "Inicio", icon: <FaBuilding /> },
    ],

    SUPER_ADMIN: [
        { path: "/super-admin", label: "Inicio", icon: <FaUserShield /> },
    ],

    PROPIETARIO: [
        { path: "/propietario", label: "Inicio", icon: <FaHome /> },
        { path: "/propietario/inquilinos", label: "Inquilinos", icon: <FaUsers /> },
    ],
};