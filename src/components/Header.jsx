import { Link, useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";

import { useAuth } from "../hooks/useAuth";
import logo from "../assets/logo.svg";

const Header = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <div>
            <header className="bg-main d-flex justify-content-between align-items-center px-3 px-md-4 py-2 shadow-sm">

                <div className="d-flex align-items-center gap-2">

                    <button
                        className="btn btn-outline-light"
                        type="button"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#sidebarMenu"
                    >
                        ☰
                    </button>

                    <Link to="/" className="d-flex align-items-center gap-2 text-decoration-none">

                        <img src={logo} alt="Logo" className="header-logo" />

                        <span className="text-main fw-bold fs-4 d-none d-md-inline">
                            Gestión de Condominios
                        </span>

                    </Link>
                </div>

                <button
                    onClick={handleLogout}
                    className="btn btn-outline-light d-flex align-items-center justify-content-center header-icon-btn"
                >
                    <FaSignOutAlt />
                    <span className="d-none d-md-inline ms-2">
                        Cerrar sesión
                    </span>
                </button>

            </header>
        </div>
    );
};

export default Header;