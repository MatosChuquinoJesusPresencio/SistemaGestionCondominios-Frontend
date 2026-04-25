import { FaHome, FaUserShield, FaBuilding } from "react-icons/fa";

export const MENU_BY_ROLE = {
    ADMIN_CONDOMINIO: [
        { path: "/admin-condominio", label: "Inicio", icon: <FaBuilding />, exact: true },
        { path: "/admin-condominio/mi-condominio", label: "Mi Condominio", icon: <FaBuilding /> },
    ],

    SUPER_ADMIN: [
        { path: "/super-admin", label: "Inicio", icon: <FaUserShield />, exact: true },
        { path: "/super-admin/condominios", label: "Condominios", icon: <FaBuilding /> },
    ],

    PROPIETARIO: [
        { path: "/propietario", label: "Inicio", icon: <FaHome />, exact: true },
    ],
};