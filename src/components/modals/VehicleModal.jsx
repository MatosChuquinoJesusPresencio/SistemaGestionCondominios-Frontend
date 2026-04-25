import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { FaCar, FaSave, FaTimes, FaEdit, FaPlus } from "react-icons/fa";
import { useForm } from "react-hook-form";
import AuthInput from "../auth/AuthInput";
import { useEffect } from "react";

const VehicleModal = ({ show, onHide, onSubmit, editingVehicle = null }) => {
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

    useEffect(() => {
        if (editingVehicle) {
            setValue("marca", editingVehicle.marca);
            setValue("modelo", editingVehicle.modelo);
            setValue("color", editingVehicle.color);
            setValue("placa", editingVehicle.placa);
        } else {
            reset();
        }
    }, [editingVehicle, setValue, reset, show]);

    const handleFormSubmit = (data) => {
        onSubmit(data);
    };

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
                        <Button variant="light" onClick={onHide} className="rounded-pill px-4 fw-bold text-secondary border-0">
                            <FaTimes className="me-2" /> Cancelar
                        </Button>
                        <Button type="submit" className="btn-primary-theme rounded-pill px-4 fw-bold shadow-sm border-0">
                            <FaSave className="me-2" /> {editingVehicle ? "Guardar Cambios" : "Registrar Vehículo"}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
            <style>
                {`
                .text-primary-theme { color: #112d4d; }
                .btn-primary-theme { background-color: #112d4d; color: white; border: none; }
                .btn-primary-theme:hover { background-color: #1a3a5f; color: white; }
                `}
            </style>
        </Modal>
    );
};

export default VehicleModal;
