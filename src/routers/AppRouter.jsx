import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import PrivateLayout from "../layouts/PrivateLayout";

import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import RoleRoute from "./RoleRoute";

import LoginPage from "../pages/LoginPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";

import UnauthorizedPage from "../pages/UnauthorizedPage";
import NotFoundPage from "../pages/NotFoundPage";

import RedirectPage from "../pages/RedirectPage";
import SADashboardPage from "../pages/super-admin/SADashboardPage";
import ACDashboardPage from "../pages/admin-condominio/ACDashboard";
import PDashboardPage from "../pages/propietario/PDashboardPage";

const AppRouter = () => {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>

                <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
                <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
                <Route path="/reset-password" element={<PublicRoute><ResetPasswordPage /></PublicRoute>} />

                <Route element={<PrivateRoute><PrivateLayout /></PrivateRoute>}>
                    <Route path="/" element={<RedirectPage />} />

                    <Route path="/super-admin" element={<RoleRoute allowedRoles={["SUPER_ADMIN"]} />}>
                        <Route index element={<SADashboardPage />} />
                    </Route>

                    <Route path="/admin-condominio" element={<RoleRoute allowedRoles={["ADMIN_CONDOMINIO"]} />}>
                        <Route index element={<ACDashboardPage />} />
                    </Route>

                    <Route path="/propietario" element={<RoleRoute allowedRoles={["PROPIETARIO"]} />}>
                        <Route index element={<PDashboardPage />} />
                    </Route>
                </Route>

                <Route path="/unauthorized" element={<UnauthorizedPage />} />
                <Route path="*" element={<NotFoundPage />} />

            </Routes>
        </AnimatePresence>
    );
};

export default AppRouter;