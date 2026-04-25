import { Modal, Button, Form } from "react-bootstrap";
import { FaUserPlus, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import { useForm } from "react-hook-form";
import AuthInput from "../auth/AuthInput";
import { useEffect } from "react";

const ResidentModal = ({ show, onHide, onSubmit, editingResident = null }) => {
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

    useEffect(() => {
        if (editingResident) {
            setValue("nombre", editingResident.nombre);
            setValue("dni", editingResident.dni);
        } else {
            reset();
        }
    }, [editingResident, setValue, reset, show]);

    const handleFormSubmit = (data) => {
        onSubmit(data);
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton className="border-0">
                <Modal.Title className="fw-bold text-primary-theme d-flex align-items-center gap-2">
                    <div className="p-2 rounded-3 bg-primary bg-opacity-10 text-primary">
                        {editingResident ? <FaEdit /> : <FaUserPlus />}
                    </div>
                    {editingResident ? "Editar Residente" : "Nuevo Residente"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="py-4">
                <Form onSubmit={handleSubmit(handleFormSubmit)}>
                    <AuthInput 
                        label="Nombre Completo"
                        name="nombre"
                        register={register}
                        validation={{ required: "El nombre es obligatorio" }}
                        error={errors.nombre}
                        placeholder="Ej: Juan Pérez..."
                    />
                    <AuthInput 
                        label="DNI / Documento de Identidad"
                        name="dni"
                        register={register}
                        validation={{ 
                            required: "El DNI es obligatorio",
                            pattern: { value: /^[0-9]+$/, message: "Solo números permitidos" }
                        }}
                        error={errors.dni}
                        placeholder="Ej: 77112233..."
                    />

                    <div className="d-flex justify-content-end gap-2 mt-4">
                        <Button variant="light" onClick={onHide} className="rounded-pill px-4 fw-bold text-secondary border-0">
                            <FaTimes className="me-2" /> Cancelar
                        </Button>
                        <Button type="submit" className="btn-primary-theme rounded-pill px-4 fw-bold shadow-sm border-0">
                            <FaSave className="me-2" /> {editingResident ? "Guardar Cambios" : "Registrar"}
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

export default ResidentModal;
