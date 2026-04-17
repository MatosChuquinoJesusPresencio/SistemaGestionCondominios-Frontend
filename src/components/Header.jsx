import { Link, useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";

import { FaSignOutAlt } from "react-icons/fa";

import { useAuth } from '../hooks/useAuth';

import logo from "../assets/logo.svg";

const Header = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <header className="bg-main d-flex justify-content-between align-items-center px-4 py-2 shadow-sm">

            <Link
                to="/"
                className="d-flex align-items-center gap-2 text-decoration-none"
            >
                <img src={logo} alt="Logo" style={{ height: "50px" }} />
                <span className="text-main fw-bold fs-2">
                    Gestión de Condominios
                </span>
            </Link>

            <button
                onClick={handleLogout}
                className="btn btn-outline-light d-flex align-items-center gap-2">
                <FaSignOutAlt />
                <span>Cerrar sesión</span>
            </button>

        </header>
    );
};

export default Header;