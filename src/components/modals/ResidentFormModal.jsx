import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { FaUserPlus, FaEdit, FaSave } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import FormInput from "../form/FormInput";

const ResidentFormModal = ({
  show,
  onHide,
  onSubmit,
  editingUser,
  condominio,
  authUser,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (show) {
      clearErrors();
      if (editingUser) {
        reset({
          nombre: editingUser.nombre,
          email: editingUser.email,
          id_rol: editingUser.id_rol,
          activo: editingUser.activo,
        });
      } else {
        reset({
          nombre: "",
          email: "",
          activo: true,
          id_rol: 3,
        });
      }
    }
  }, [show, editingUser, reset, clearErrors]);

  const handleFormSubmit = (data) => {
    onSubmit(data);
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton className="border-0 pb-0 px-4 pt-4">
        <Modal.Title className="fw-bold text-primary-theme d-flex align-items-center gap-2">
          <div className="p-2 rounded-3 bg-primary bg-opacity-10 text-primary-theme">
            {editingUser ? <FaEdit /> : <FaUserPlus />}
          </div>
          {editingUser ? "Editar Usuario" : "Registrar Nuevo Usuario"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        <Form onSubmit={handleSubmit(handleFormSubmit)}>
          <Row>
            <Col md={6}>
              <FormInput
                label="Nombre Completo"
                name="nombre"
                register={register}
                validation={{ required: "El nombre es requerido" }}
                error={errors.nombre}
                placeholder="Ej: Juan Pérez"
              />
            </Col>
            <Col md={6}>
              <FormInput
                label="Correo Electrónico"
                name="email"
                type="email"
                register={register}
                validation={{
                  required: "El correo es requerido",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Correo inválido",
                  },
                }}
                error={errors.email}
                placeholder="ejemplo@correo.com"
              />
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <div className="mb-4">
                <label className="form-label text-secondary fw-semibold small mb-1">
                  Tipo de Usuario
                </label>
                <Form.Select
                  {...register("id_rol", { required: "Selecciona un rol" })}
                  className={`form-control input-no-shadow ${errors.id_rol ? "is-invalid" : ""}`}
                >
                  <option value="3">Propietario / Residente</option>
                  <option value="4">Agente de Seguridad</option>
                  <option value="2">Administrador</option>
                </Form.Select>
                {errors.id_rol && (
                  <div className="invalid-feedback">
                    {errors.id_rol.message}
                  </div>
                )}
              </div>
            </Col>
            <Col md={6}>
              <div className="mb-4">
                <label className="form-label text-secondary fw-semibold small mb-1">
                  Condominio
                </label>
                <Form.Control
                  value={condominio?.nombre || ""}
                  disabled
                  className="form-control input-no-shadow bg-light border-0"
                />
                <div className="x-small text-muted mt-1">
                  El usuario se registrará automáticamente en este condominio.
                </div>
              </div>
            </Col>
          </Row>

          <div className="p-3 mb-4 rounded-4 bg-light border-0 d-flex justify-content-between align-items-center">
            <div>
              <span className="fw-bold text-dark d-block">
                Acceso al Sistema
              </span>
              <span className="text-muted small">
                {editingUser?.id === authUser?.id
                  ? "No puedes suspender tu propio acceso."
                  : "Desactiva esta opción para suspender el acceso de este usuario."}
              </span>
            </div>
            <Form.Check
              type="switch"
              id="residente-status-switch"
              {...register("activo")}
              disabled={editingUser?.id === authUser?.id}
            />
          </div>

          <div className="d-flex justify-content-end gap-2 mt-4">
            <Button
              variant="light"
              onClick={onHide}
              className="rounded-pill px-4 fw-bold text-secondary border-0"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="btn-primary-theme rounded-pill px-4 fw-bold shadow-sm border-0"
            >
              <FaSave className="me-2" />{" "}
              {editingUser ? "Guardar Cambios" : "Completar Registro"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ResidentFormModal;
