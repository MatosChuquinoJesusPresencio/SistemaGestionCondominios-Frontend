import { Routes, Route } from "react-router-dom";

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
    return (
        <Routes>

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

                <Route
                    path="/super-admin"
                    element={
                        <RoleRoute allowedRoles={["SUPER_ADMIN"]}>
                            <SADashboardPage />
                        </RoleRoute>
                    }
                />

                <Route
                    path="/admin"
                    element={
                        <RoleRoute allowedRoles={["ADMIN_CONDOMINIO", "SUPER_ADMIN"]}>
                            <ACDashboardPage />
                        </RoleRoute>
                    }
                />

                <Route
                    path="/propietario"
                    element={
                        <RoleRoute allowedRoles={["PROPIETARIO"]}>
                            <PDashboardPage />
                        </RoleRoute>
                    }
                />

            </Route>

            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="*" element={<NotFoundPage />} />

        </Routes>
    );
};

export default AppRouter;