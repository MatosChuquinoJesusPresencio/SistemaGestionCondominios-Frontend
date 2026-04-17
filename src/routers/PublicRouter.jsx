import { Navigate } from 'react-router-dom';

const PublicRouter = ({ children }) => {
  const isAuthenticated = true;

  return !isAuthenticated ? children : <Navigate to="/" />;
};

export default PublicRouter;