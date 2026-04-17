import { Navigate } from 'react-router-dom';

const PublicRouter = ({ children }) => {
  const  { isAuthenticated } = false;

  return !isAuthenticated ? children : <Navigate to="/" />;
};

export default PublicRouter;