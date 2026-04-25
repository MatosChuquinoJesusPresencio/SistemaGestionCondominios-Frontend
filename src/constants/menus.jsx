import { FaHome, FaUserShield, FaBuilding, FaSitemap, FaUsers } from "react-icons/fa";

export const MENU_BY_ROLE = {
    ADMIN_CONDOMINIO: [
        { path: "/admin-condominio", label: "Inicio", icon: <FaBuilding />, exact: true },
        { path: "/admin-condominio/mi-condominio", label: "Mi Condominio", icon: <FaBuilding /> },
        { path: "/admin-condominio/infraestructura", label: "Infraestructura", icon: <FaSitemap /> },
        { path: "/admin-condominio/residentes", label: "Residentes", icon: <FaUsers /> },
    ],

    SUPER_ADMIN: [
        { path: "/super-admin", label: "Inicio", icon: <FaUserShield />, exact: true },
        { path: "/super-admin/condominios", label: "Condominios", icon: <FaBuilding /> },
        { path: "/super-admin/usuarios", label: "Usuarios", icon: <FaUsers /> },
    ],

    PROPIETARIO: [
        { path: "/propietario", label: "Inicio", icon: <FaHome />, exact: true },
    ],
};