import AnimatedPage from "../animations/AnimatedPage";
import { FaExclamationTriangle } from "react-icons/fa";

const NoCondoWarning = () => {
  return (
    <AnimatedPage>
      <div className="container-fluid py-4 bg-light min-vh-100 d-flex align-items-center justify-content-center">
        <div
          className="text-center p-5 bg-white rounded-4 shadow-sm"
          style={{ maxWidth: "500px" }}
        >
          <div className="p-4 rounded-circle bg-warning bg-opacity-10 text-warning d-inline-block mb-4">
            <FaExclamationTriangle size={50} />
          </div>
          <h3 className="fw-bold text-dark">Sin condominio asignado</h3>
          <p className="text-secondary">
            Actualmente no tienes un condominio bajo tu administración. Contacta
            con el Super Administrador para que se te asigne uno.
          </p>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default NoCondoWarning;
