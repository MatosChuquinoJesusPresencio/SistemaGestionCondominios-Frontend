import { Navigate } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';

const PublicRouter = ({ children }) => {
  const { isAuthenticated } = useAuth();

  return !isAuthenticated ? children : <Navigate to="/" />;
};

export default PublicRouter;