import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { FaSave, FaTimes, FaEdit, FaPlus, FaCar, FaMotorcycle } from "react-icons/fa";
import { useForm } from "react-hook-form";
import AuthInput from "../auth/AuthInput";
import { useEffect } from "react";

const VehicleModal = ({ show, onHide, onSubmit, editingVehicle = null, residents = [] }) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const selectedType = watch("tipo");

  useEffect(() => {
    if (editingVehicle) {
      setValue("marca", editingVehicle.marca);
      setValue("modelo", editingVehicle.modelo);
      setValue("color", editingVehicle.color);
      setValue("placa", editingVehicle.placa);
      setValue("tipo", editingVehicle.tipo || "Auto");
      
      if (editingVehicle.id_inquilino_temporal) {
        setValue("ownerType", "inquilino");
        setValue("id_inquilino_temporal", editingVehicle.id_inquilino_temporal);
      } else {
        setValue("ownerType", "propietario");
      }
    } else {
      reset({
        tipo: "Auto",
        ownerType: "propietario"
      });
    }
  }, [editingVehicle, setValue, reset, show]);

  const handleFormSubmit = (data) => {
    // Transform data for the database
    const submissionData = {
      marca: data.marca,
      modelo: data.modelo,
      color: data.color,
      placa: data.placa,
      tipo: data.tipo,
      id_usuario: data.ownerType === "propietario" ? true : null, // Handled in Page onSubmit
      id_inquilino_temporal: data.ownerType === "inquilino" ? parseInt(data.id_inquilino_temporal) : null
    };
    onSubmit(submissionData);
  };

  const ownerType = watch("ownerType");

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton className="border-0">
        <Modal.Title className="fw-bold text-primary-theme d-flex align-items-center gap-2">
          <div className="p-2 rounded-3 bg-primary bg-opacity-10 text-primary">
            {editingVehicle ? <FaEdit /> : <FaPlus />}
          </div>
          {editingVehicle ? "Editar Vehículo" : "Nuevo Vehículo"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="py-4">
        <Form onSubmit={handleSubmit(handleFormSubmit)}>
          <Row className="mb-3">
             <Col md={12}>
                <Form.Label className="fw-bold small text-secondary mb-3">Tipo de Vehículo</Form.Label>
                <div className="d-flex gap-3">
                   <div 
                      className={`flex-grow-1 p-3 border rounded-4 text-center cursor-pointer transition-all ${selectedType === 'Auto' ? 'border-primary bg-primary bg-opacity-10 text-primary fw-bold' : 'bg-light text-muted opacity-75'}`}
                      onClick={() => setValue("tipo", "Auto")}
                      style={{ cursor: 'pointer' }}
                   >
                      <FaCar size={20} className="mb-2 d-block mx-auto" />
                      Auto
                   </div>
                   <div 
                      className={`flex-grow-1 p-3 border rounded-4 text-center cursor-pointer transition-all ${selectedType === 'Moto' ? 'border-primary bg-primary bg-opacity-10 text-primary fw-bold' : 'bg-light text-muted opacity-75'}`}
                      onClick={() => setValue("tipo", "Moto")}
                      style={{ cursor: 'pointer' }}
                   >
                      <FaMotorcycle size={20} className="mb-2 d-block mx-auto" />
                      Moto
                   </div>
                   <input type="hidden" {...register("tipo")} />
                </div>
             </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold small text-secondary">¿A quién pertenece?</Form.Label>
                <Form.Select 
                   {...register("ownerType")}
                   className="rounded-pill border-light py-2 px-3 small"
                >
                  <option value="propietario">A mí (Propietario)</option>
                  {residents.length > 0 && <option value="inquilino">A un Inquilino</option>}
                </Form.Select>
              </Form.Group>
            </Col>
            {ownerType === "inquilino" && (
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold small text-secondary">Seleccionar Inquilino</Form.Label>
                  <Form.Select 
                    {...register("id_inquilino_temporal", { required: ownerType === "inquilino" })}
                    className="rounded-pill border-light py-2 px-3 small"
                    isInvalid={!!errors.id_inquilino_temporal}
                  >
                    <option value="">Seleccione...</option>
                    {residents.map(r => (
                      <option key={r.id} value={r.id}>{r.nombre}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            )}
          </Row>

          <Row>
            <Col md={6}>
              <AuthInput
                label="Marca"
                name="marca"
                register={register}
                validation={{ required: "Requerido" }}
                error={errors.marca}
                placeholder="Ej: Toyota"
              />
            </Col>
            <Col md={6}>
              <AuthInput
                label="Modelo"
                name="modelo"
                register={register}
                validation={{ required: "Requerido" }}
                error={errors.modelo}
                placeholder="Ej: Corolla"
              />
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <AuthInput
                label="Color"
                name="color"
                register={register}
                validation={{ required: "Requerido" }}
                error={errors.color}
                placeholder="Ej: Blanco"
              />
            </Col>
            <Col md={6}>
              <AuthInput
                label="Placa / Matrícula"
                name="placa"
                register={register}
                validation={{ required: "Requerido" }}
                error={errors.placa}
                placeholder="Ej: ABC-123"
              />
            </Col>
          </Row>

          <div className="d-flex justify-content-end gap-2 mt-4">
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
              {editingVehicle ? "Guardar Cambios" : "Registrar Vehículo"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
      <style>
        {`
                .text-primary-theme { color: #112d4d; }
                .btn-primary-theme { background-color: #112d4d; color: white; border: none; }
                .btn-primary-theme:hover { background-color: #1a3a5f; color: white; }
                .cursor-pointer { cursor: pointer; }
                .transition-all { transition: all 0.2s ease-in-out; }
                `}
      </style>
    </Modal>
  );
};

export default VehicleModal;
