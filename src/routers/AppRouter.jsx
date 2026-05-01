import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// Layouts y Protecciones
import PrivateLayout from "../layouts/PrivateLayout";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import RoleRoute from "./RoleRoute";

// Páginas Públicas y Landing
// Asegúrate de que esta ruta sea la correcta en tu proyecto
import LandingPage from "../PaginaPrincipal/LandingPage"; 
import LoginPage from "../pages/auth/LoginPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";
import ChangePasswordPage from "../pages/auth/ChangePasswordPage";

// Páginas de Error y Utilidad
import UnauthorizedPage from "../pages/error/UnauthorizedPage";
import RedirectPage from "../pages/utility/RedirectPage";

// Páginas Super Admin
import SADashboardPage from "../pages/super-admin/SADashboardPage";
import SACondominiosPage from "../pages/super-admin/SACondominiosPage";
import SAUsuariosPage from "../pages/super-admin/SAUsuariosPage";
import SAApartamentosPage from "../pages/super-admin/SAApartamentosPage";
import SAHistorialPage from "../pages/super-admin/SAHistorialPage";
import SAEstacionamientosPage from "../pages/super-admin/SAEstacionamientosPage";

// Páginas Admin Condominio
import ACDashboardPage from "../pages/admin-condominio/ACDashboardPage";
import ACMiCondominioPage from "../pages/admin-condominio/ACMiCondominioPage";
import ACInfraestructuraPage from "../pages/admin-condominio/ACInfraestructuraPage";
import ACApartamentosPage from "../pages/admin-condominio/ACApartamentosPage";
import ACUsuariosPage from "../pages/admin-condominio/ACUsuariosPage";
import ACHistorialPage from "../pages/admin-condominio/ACHistorialPage";
import ACEstacionamientosPage from "../pages/admin-condominio/ACEstacionamientosPage";
import ACCarritosPage from "../pages/admin-condominio/ACCarritosPage";

// Páginas Propietario
import PRDashboardPage from "../pages/propietario/PRDashboardPage";
import PRMiApartamentoPage from "../pages/propietario/PRMiApartamentoPage";
import PRVehiculosPage from "../pages/propietario/PRVehiculosPage";
import PRHistorialPage from "../pages/propietario/PRHistorialPage";
import PRCarritosPage from "../pages/propietario/PRCarritosPage";

const AppRouter = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        
        {/* 1. LA LANDING PAGE ES LA RAÍZ ACCESIBLE PARA TODOS */}
        <Route path="/" element={<LandingPage />} />

        {/* 2. RUTAS DE AUTH (PROTEGIDAS PARA QUE LOGUEADOS NO VUELVAN AL LOGIN) */}
        <Route
          path="/login"
          element={<PublicRoute><LoginPage /></PublicRoute>}
        />
        <Route
          path="/forgot-password"
          element={<PublicRoute><ForgotPasswordPage /></PublicRoute>}
        />
        <Route
          path="/reset-password"
          element={<PublicRoute><ResetPasswordPage /></PublicRoute>}
        />

        {/* 3. RUTAS PRIVADAS (REQUIEREN LOGIN) */}
        <Route
          element={
            <PrivateRoute>
              <PrivateLayout />
            </PrivateRoute>
          }
        >
          {/* Al loguearse, el sistema los manda a /home y RedirectPage decide a qué dashboard ir según su ROL */}
          <Route path="/home" element={<RedirectPage />} />
          <Route path="/perfil/cambiar-contraseña" element={<ChangePasswordPage />} />

          {/* Módulo Super Admin */}
          <Route path="/super-admin" element={<RoleRoute allowedRoles={["SUPER_ADMIN"]} />}>
            <Route index element={<SADashboardPage />} />
            <Route path="condominios" element={<SACondominiosPage />} />
            <Route path="usuarios" element={<SAUsuariosPage />} />
            <Route path="apartamentos" element={<SAApartamentosPage />} />
            <Route path="estacionamientos" element={<SAEstacionamientosPage />} />
            <Route path="historial" element={<SAHistorialPage />} />
          </Route>

          {/* Módulo Admin Condominio */}
          <Route path="/admin-condominio" element={<RoleRoute allowedRoles={["ADMIN_CONDOMINIO"]} />}>
            <Route index element={<ACDashboardPage />} />
            <Route path="mi-condominio" element={<ACMiCondominioPage />} />
            <Route path="infraestructura" element={<ACInfraestructuraPage />} />
            <Route path="apartamentos" element={<ACApartamentosPage />} />
            <Route path="estacionamientos" element={<ACEstacionamientosPage />} />
            <Route path="usuarios" element={<ACUsuariosPage />} />
            <Route path="carritos" element={<ACCarritosPage />} />
            <Route path="historial" element={<ACHistorialPage />} />
          </Route>

          {/* Módulo Propietario */}
          <Route path="/propietario" element={<RoleRoute allowedRoles={["PROPIETARIO"]} />}>
            <Route index element={<PRDashboardPage />} />
            <Route path="mi-apartamento" element={<PRMiApartamentoPage />} />
            <Route path="vehiculos" element={<PRVehiculosPage />} />
            <Route path="carritos" element={<PRCarritosPage />} />
            <Route path="historial" element={<PRHistorialPage />} />
          </Route>
        </Route>

        {/* 4. MANEJO DE ERRORES Y RETORNO A LA LANDING */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        
        {/* Cualquier ruta que no exista te manda a la Landing Page (/) */}
        <Route path="*" element={<Navigate to="/" replace />} />
        
      </Routes>
    </AnimatePresence>
  );
};

export default AppRouter;