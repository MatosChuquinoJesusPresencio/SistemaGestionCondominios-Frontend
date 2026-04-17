import { Link } from "react-router-dom";

const NotFoundPage = () => {
    return (
        <div className="container-fluid vh-100 d-flex justify-content-center align-items-center bg-main text-light">
            
            <div className="text-center">
                
                <h1 className="display-1 fw-bold">
                    404
                </h1>

                <h2 className="mb-3">
                    Página no encontrada
                </h2>

                <p className="mb-4">
                    La página que estás buscando no existe o fue movida.
                </p>

                <Link to="/" className="btn btn-warning fw-bold">
                    Volver al inicio
                </Link>

            </div>

        </div>
    );
};

export default NotFoundPage;