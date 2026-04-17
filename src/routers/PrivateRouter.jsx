import { Navigate } from "react-router-dom";

const PrivateRouter = ({ children }) => {
    const isAuthenticated = true;

    return isAuthenticated ? children : <Navigate to="/login" />
};

export default PrivateRouter;