import { Link } from "react-router-dom";
import AnimatedPage from "../components/animations/AnimatedPage";

const UnauthorizedPage = () => {
    return (
        <AnimatedPage>
            <div className="container-fluid vh-100 d-flex justify-content-center align-items-center bg-main text-light">

                <div className="text-center">

                    <h1 className="display-1 fw-bold">
                        403
                    </h1>

                    <h3 className="mb-3">
                        Acceso no autorizado
                    </h3>

                    <p className="mb-4">
                        No tienes permisos para acceder a esta sección del sistema.
                    </p>

                    <Link to="/" className="btn btn-warning fw-bold">
                        Volver al inicio
                    </Link>

                </div>

            </div>
        </AnimatedPage>
    );
};

export default UnauthorizedPage;