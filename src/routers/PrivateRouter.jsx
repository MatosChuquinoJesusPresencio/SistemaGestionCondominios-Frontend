import { Navigate } from "react-router-dom";

const PrivateRouter = ({ children }) => {
    const { isAuthenticated } = false;

    return isAuthenticated ? children : <Navigate to="/login" />
};

export default PrivateRouter;