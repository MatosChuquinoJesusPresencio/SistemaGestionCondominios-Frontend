import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Mientras se verifica si hay un token válido, no renderizamos nada (o un spinner)
  // Esto evita que isAuthenticated sea 'false' por defecto y cause parpadeos
  if (loading) return null; 

  // Si ya está logueado, lo mandamos a /home (donde RedirectPage decidirá su dashboard)
  // Si NO está logueado, permitimos que vea el Login/Children
  return !isAuthenticated ? children : <Navigate to="/home" replace />;
};

export default PublicRoute;