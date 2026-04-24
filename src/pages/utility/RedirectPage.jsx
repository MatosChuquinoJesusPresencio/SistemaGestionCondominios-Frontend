import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { ROLES } from "../../constants/roles";

const RedirectPage = () => {
    const { authUser } = useAuth();

    switch (authUser.role) {
        case ROLES.SUPER_ADMIN:
            return <Navigate to="/super-admin" />;

        case ROLES.ADMIN_CONDOMINIO:
            return <Navigate to="/admin-condominio" />;

        case ROLES.PROPIETARIO:
            return <Navigate to="/propietario" />;

        default:
            return <Navigate to="/unauthorized" />;
    }
};

export default RedirectPage;