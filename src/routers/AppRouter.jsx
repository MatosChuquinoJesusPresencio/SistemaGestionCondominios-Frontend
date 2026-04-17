import { Routes, Route } from "react-router-dom";

import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import NotFoundPage from "../pages/NotFoundPage";

import PrivateRouter from "./PrivateRouter";
import PublicRouter from "./PublicRouter";

import PrivateLayout from "../layouts/PrivateLayout";

const AppRouter = () => {
    return (
        <Routes>

            <Route
                path="/login"
                element={
                    <PublicRouter>
                        <LoginPage />
                    </PublicRouter>
                }
            />

            <Route
                element={
                    <PrivateRouter>
                        <PrivateLayout />
                    </PrivateRouter>
                }
            >
                <Route path="/" element={<HomePage />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />

        </Routes>
    );
};

export default AppRouter;