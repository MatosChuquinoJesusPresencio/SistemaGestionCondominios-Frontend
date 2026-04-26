import AnimatedPage from "../animations/AnimatedPage";
import { FaExclamationTriangle } from "react-icons/fa";
import { Card } from "react-bootstrap";

const NoCondoWarning = () => {
  return (
    <AnimatedPage>
      <div className="page-container d-flex align-items-center justify-content-center">
        <Card
          className="card-custom p-5 text-center"
          style={{ maxWidth: "500px", width: "100%" }}
        >
          <div className="p-4 rounded-circle bg-warning bg-opacity-10 text-warning d-inline-block mb-4">
            <FaExclamationTriangle size={50} />
          </div>
          <h3 className="fw-bold text-dark">Sin condominio asignado</h3>
          <p className="text-secondary">
            Actualmente no tienes un condominio bajo tu administración. Contacta
            con el Super Administrador para que se te asigne uno.
          </p>
        </Card>
      </div>
    </AnimatedPage>
  );
};

export default NoCondoWarning;
