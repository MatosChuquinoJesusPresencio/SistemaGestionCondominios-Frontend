import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const RedirectPage = () => {
    const { user } = useAuth();

    if (!user) return <Navigate to="/login" />;

    switch (user.role) {
        case "SUPER_ADMIN":
            return <Navigate to="/super-admin" />;

        case "ADMIN_CONDOMINIO":
            return <Navigate to="/admin" />;

        case "PROPIETARIO":
            return <Navigate to="/propietario" />;

        default:
            return <Navigate to="/unauthorized" />;
    }
};

export default RedirectPage;