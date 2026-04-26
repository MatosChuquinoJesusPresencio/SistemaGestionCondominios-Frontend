import { Modal, Button } from "react-bootstrap";
import { FaExclamationTriangle } from "react-icons/fa";

const ResidentDeleteModal = ({
  show,
  onHide,
  onConfirm,
  userToDelete,
}) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      size="sm"
    >
      <Modal.Body className="text-center p-4">
        <FaExclamationTriangle size={40} className="text-danger mb-3" />
        <h5 className="fw-bold text-dark">Eliminar Residente</h5>
        <p className="text-secondary small">
          ¿Estás seguro de eliminar a <b>{userToDelete?.nombre}</b>?
        </p>
        <div className="d-flex justify-content-center gap-2 mt-3">
          <Button
            variant="light"
            onClick={onHide}
            className="rounded-pill px-3 small fw-bold"
          >
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={onConfirm}
            className="rounded-pill px-3 small fw-bold shadow-sm border-0"
          >
            Eliminar
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ResidentDeleteModal;
