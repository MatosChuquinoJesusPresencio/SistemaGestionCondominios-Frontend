import { Modal, Button, ListGroup } from "react-bootstrap";
import { FaExclamationTriangle, FaInfoCircle } from "react-icons/fa";

const CondoRelationsModal = ({ show, onHide, condoName, relations }) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      className="border-0"
    >
      <Modal.Body className="p-4 text-center">
        <div className="p-3 rounded-circle bg-warning bg-opacity-10 text-warning d-inline-block mb-4">
          <FaExclamationTriangle size={40} />
        </div>
        <h4 className="fw-bold text-dark mb-3">No se puede eliminar</h4>
        <p className="text-secondary mb-4">
          El condominio <strong>{condoName}</strong> tiene
          relaciones activas que impiden su borrado:
        </p>
        <ListGroup
          variant="flush"
          className="text-start mb-4 bg-light rounded-3 p-2"
        >
          {relations.map((rel, idx) => (
            <ListGroup.Item
              key={idx}
              className="bg-transparent border-0 d-flex align-items-center gap-2 small fw-medium text-secondary"
            >
              <FaInfoCircle className="text-warning" /> {rel}
            </ListGroup.Item>
          ))}
        </ListGroup>
        <p className="small text-muted mb-4">
          Por favor, elimina primero estas dependencias antes de intentar
          borrar el condominio.
        </p>
        <Button
          variant="secondary"
          onClick={onHide}
          className="rounded-pill px-5 fw-bold border-0 shadow-sm"
        >
          Entendido
        </Button>
      </Modal.Body>
    </Modal>
  );
};

export default CondoRelationsModal;
