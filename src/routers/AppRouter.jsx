import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";


import RedirectPage from "../pages/RedirectPage";
import LoginPage from "../pages/LoginPage";
import NotFoundPage from "../pages/NotFoundPage";
import UnauthorizedPage from "../pages/UnauthorizedPage";

import ACDashboardPage from "../pages/admin-condominio/ACDashboard";

import PDashboardPage from "../pages/propietario/PDashboardPage";

import SADashboardPage from "../pages/super-admin/SADashboardPage";

import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import RoleRoute from "./RoleRoute";

import PrivateLayout from "../layouts/PrivateLayout";

const AppRouter = () => {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>


            <Route
                path="/login"
                element={
                    <PublicRoute>
                        <LoginPage />
                    </PublicRoute>
                }
            />

            <Route
                element={
                    <PrivateRoute>
                        <PrivateLayout />
                    </PrivateRoute>
                }
            >

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