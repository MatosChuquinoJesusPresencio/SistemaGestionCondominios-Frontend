import { Routes, Route } from "react-router-dom";

import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import NotFoundPage from "../pages/NotFoundPage";

import PrivateRouter from "./PrivateRouter";
import PublicRouter from "./PublicRouter";

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
                path="/"
                element={
                    <PrivateRouter>
                        <HomePage />
                    </PrivateRouter>
                }
            />

            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
};

export default AppRouter;