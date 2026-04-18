import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const RoleRoute = ({ children, allowedRoles }) => {
    const { authUser } = useAuth();

    if (!allowedRoles.includes(authUser.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default RoleRoute;