import { Modal, Button } from "react-bootstrap";
import { FaTrashAlt } from "react-icons/fa";

const CondoDeleteModal = ({ show, onHide, onConfirm, condoName }) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      className="border-0"
    >
      <Modal.Body className="p-4 text-center">
        <div className="p-3 rounded-circle bg-danger bg-opacity-10 text-danger d-inline-block mb-4">
          <FaTrashAlt size={40} />
        </div>
        <h4 className="fw-bold text-dark mb-3">¿Estás seguro?</h4>
        <p className="text-secondary mb-4">
          Estás a punto de eliminar el condominio{" "}
          <strong>{condoName}</strong>. Esta acción no se puede
          deshacer.
        </p>
        <div className="d-flex justify-content-center gap-2 mt-4">
          <Button
            variant="light"
            onClick={onHide}
            className="rounded-pill px-4 fw-bold text-secondary border-0"
          >
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={onConfirm}
            className="rounded-pill px-4 fw-bold shadow-sm border-0"
          >
            Sí, Eliminar
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default CondoDeleteModal;
