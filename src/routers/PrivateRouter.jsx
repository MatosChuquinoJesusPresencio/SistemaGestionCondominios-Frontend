import { Navigate } from "react-router-dom";

import { useAuth } from '../hooks/useAuth';

const PrivateRouter = ({ children }) => {
    const  { isAuthenticated } = useAuth();

    return isAuthenticated ? children : <Navigate to="/login" />
};

export default PrivateRouter;