import { Modal, Button, Form } from "react-bootstrap";
import { FaBuilding, FaTimes, FaSave, FaInfoCircle } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import FormInput from "../form/FormInput";

const CondoFormModal = ({
  show,
  onHide,
  onSubmit,
  editingCondo,
  adminUsers,
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
      direccion: "",
      ciudad: "",
      pais: "",
      id_administrador: "",
    },
  });

  useEffect(() => {
    if (show) {
      clearErrors();
      if (editingCondo) {
        const currentAdmin = adminUsers.find(
          (u) => u.id_condominio === editingCondo.id,
        );
        reset({
          nombre: editingCondo.nombre,
          direccion: editingCondo.direccion,
          ciudad: editingCondo.ciudad,
          pais: editingCondo.pais,
          id_administrador: currentAdmin ? currentAdmin.id.toString() : "",
        });
      } else {
        reset({
          nombre: "",
          direccion: "",
          ciudad: "",
          pais: "",
          id_administrador: "",
        });
      }
    }
  }, [show, editingCondo, reset, clearErrors, adminUsers]);

  const handleFormSubmit = (data) => {
    onSubmit(data);
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg" className="border-0">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold text-primary-theme d-flex align-items-center gap-2">
          <div className="p-2 rounded-3 bg-primary bg-opacity-10 text-primary-theme">
            <FaBuilding />
          </div>
          {editingCondo ? "Editar Condominio" : "Nuevo Condominio"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="py-4">
        <Form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="row">
            <div className="col-12">
              <FormInput
                label="Nombre del Condominio"
                type="text"
                placeholder="Ej. Residencial Las Flores"
                name="nombre"
                register={register}
                validation={{ required: "El nombre es obligatorio" }}
                error={errors.nombre}
              />
            </div>
            <div className="col-12">
              <FormInput
                label="Dirección"
                type="text"
                placeholder="Av. Principal 123"
                name="direccion"
                register={register}
                validation={{ required: "La dirección es obligatoria" }}
                error={errors.direccion}
              />
            </div>
            <div className="col-md-6">
              <FormInput
                label="Ciudad"
                type="text"
                placeholder="Lima"
                name="ciudad"
                register={register}
                validation={{ required: "La ciudad es obligatoria" }}
                error={errors.ciudad}
              />
            </div>
            <div className="col-md-6">
              <FormInput
                label="País"
                type="text"
                placeholder="Perú"
                name="pais"
                register={register}
                validation={{ required: "El país es obligatorio" }}
                error={errors.pais}
              />
            </div>

            <div className="col-12">
              <div className="mb-4">
                <label className="form-label text-secondary fw-semibold small mb-1">
                  Asignar Administrador de Condominio
                </label>
                <Form.Select
                  className={`form-control input-no-shadow ${errors.id_administrador ? "is-invalid" : ""}`}
                  {...register("id_administrador")}
                >
                  <option value="">
                    Sin asignar (puedes hacerlo después)...
                  </option>
                  {adminUsers
                    .filter(
                      (u) =>
                        u.id_condominio === null ||
                        (editingCondo && u.id_condominio === editingCondo.id),
                    )
                    .map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.nombre} ({u.email})
                      </option>
                    ))}
                </Form.Select>
                {errors.id_administrador && (
                  <div className="invalid-feedback d-block mt-1">
                    {errors.id_administrador.message}
                  </div>
                )}
                <div className="x-small text-muted mt-1">
                  <FaInfoCircle className="me-1" /> Solo se muestran
                  administradores que no tienen un condominio asignado.
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2 mt-2">
            <Button
              variant="light"
              onClick={onHide}
              className="rounded-pill px-4 fw-bold text-secondary border-0"
            >
              <FaTimes className="me-2" /> Cancelar
            </Button>
            <Button
              type="submit"
              className="btn-primary-theme rounded-pill px-4 fw-bold shadow-sm border-0"
            >
              <FaSave className="me-2" />{" "}
              {editingCondo ? "Actualizar Cambios" : "Guardar Condominio"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CondoFormModal;
