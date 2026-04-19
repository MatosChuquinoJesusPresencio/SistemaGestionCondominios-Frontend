import { FaHome, FaUserShield, FaBuilding, FaUsers } from "react-icons/fa";

export const MENU_BY_ROLE = {
    ADMIN_CONDOMINIO: [
        { path: "/admin-condominio", label: "Inicio", icon: <FaBuilding /> },
    ],

    SUPER_ADMIN: [
        { path: "/super-admin", label: "Inicio", icon: <FaUserShield /> },
        //anade el label a la barra lateral quedo xd
        { path: "/super-admin/usuarios", label: "Gestión de Usuarios", icon: <FaUsers /> },
    ],

    PROPIETARIO: [
        { path: "/propietario", label: "Inicio", icon: <FaHome /> },
    ],
};