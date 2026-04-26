import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { FaUserPlus, FaEdit, FaSave } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import AuthInput from "../auth/AuthInput";

const UserFormModal = ({
  show,
  onHide,
  onSubmit,
  editingUser,
  condominios,
  authUser,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nombre: "",
      email: "",
      activo: true,
      id_rol: 2,
      id_condominio: "",
    },
  });

  useEffect(() => {
    if (show) {
      clearErrors();
      if (editingUser) {
        reset({
          nombre: editingUser.nombre,
          email: editingUser.email,
          id_rol: editingUser.id_rol,
          id_condominio: editingUser.id_condominio || "",
          activo: editingUser.activo,
        });
      } else {
        reset({
          nombre: "",
          email: "",
          activo: true,
          id_rol: 2,
          id_condominio: "",
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
          <div className="p-2 rounded-3 bg-primary bg-opacity-10 text-primary">
            {editingUser ? <FaEdit /> : <FaUserPlus />}
          </div>
          {editingUser ? "Editar Usuario" : "Crear Nuevo Usuario"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        <Form onSubmit={handleSubmit(handleFormSubmit)}>
          <Row>
            <Col md={6}>
              <AuthInput
                label="Nombre Completo"
                name="nombre"
                register={register}
                validation={{ required: "El nombre es requerido" }}
                error={errors.nombre}
                placeholder="Nombre y Apellidos"
              />
            </Col>
            <Col md={6}>
              <AuthInput
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
                  Rol en el Sistema
                </label>
                <Form.Select
                  {...register("id_rol", { required: "Selecciona un rol" })}
                  className={`form-control input-no-shadow ${errors.id_rol ? "is-invalid" : ""}`}
                >
                  <option value="1">Super Admin</option>
                  <option value="2">Admin Condominio</option>
                  <option value="3">Propietario</option>
                  <option value="4">Seguridad</option>
                </Form.Select>
                {errors.id_rol && (
                  <div className="invalid-feedback">{errors.id_rol.message}</div>
                )}
              </div>
            </Col>
            <Col md={6}>
              <div className="mb-4">
                <label className="form-label text-secondary fw-semibold small mb-1">
                  Condominio Asignado
                </label>
                <Form.Select
                  {...register("id_condominio")}
                  className="form-control input-no-shadow"
                >
                  <option value="">Ninguno (Acceso Global)</option>
                  {condominios.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre}
                    </option>
                  ))}
                </Form.Select>
                <div className="x-small text-muted mt-1">
                  Obligatorio para Admins de Condo y Residentes.
                </div>
              </div>
            </Col>
          </Row>

          <div className="p-3 mb-4 rounded-4 bg-light border-0 d-flex justify-content-between align-items-center">
            <div>
              <span className="fw-bold text-dark d-block">
                Estado de la cuenta
              </span>
              <span className="text-muted small">
                {editingUser?.id === authUser?.id
                  ? "No puedes desactivar tu propia cuenta."
                  : "Los usuarios inactivos no podrán iniciar sesión."}
              </span>
            </div>
            <Form.Check
              type="switch"
              id="user-status-switch"
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
              {editingUser ? "Actualizar Datos" : "Registrar Usuario"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default UserFormModal;
