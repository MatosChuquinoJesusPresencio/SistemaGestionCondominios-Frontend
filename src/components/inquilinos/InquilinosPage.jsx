import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { FaPlus, FaTrashAlt, FaPencilAlt, FaUsers, FaTimes } from "react-icons/fa";
import InquilinoForm from "./InquilinoForm";

const InquilinosPage = () => {
    const { authUser } = useAuth();
    
    // Estado inicial con datos de prueba
    const [inquilinos, setInquilinos] = useState([
        { id: 1, nombre: "Juan Pérez", apartamento: "101-A", fechaInicio: "2026-04-01", fechaFin: "2026-04-30" },
        { id: 2, nombre: "María García", apartamento: "202-B", fechaInicio: "2026-04-10", fechaFin: "2026-05-10" }
    ]);
    
    const [showModal, setShowModal] = useState(false);
    const [inquilinoEditando, setInquilinoEditando] = useState(null);

    // Función para eliminar
    const handleDelete = (id) => {
        if (window.confirm("¿Estás seguro de eliminar este registro?")) {
            setInquilinos(inquilinos.filter(inquilino => inquilino.id !== id));
        }
    };

    // Función para abrir modal en modo edición
    const handleEdit = (inquilino) => {
        setInquilinoEditando(inquilino);
        setShowModal(true);
    };

    // Función para cerrar y resetear
    const closeModal = () => {
        setInquilinoEditando(null);
        setShowModal(false);
    };

    return (
        <div className="container-fluid px-4 py-5">
            {/* Cabecera */}
            <div className="d-flex justify-content-between align-items-center mb-5 p-4 bg-white rounded-3 shadow-sm border">
                <div className="d-flex align-items-center">
                    <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3 text-primary">
                        <FaUsers size={24} />
                    </div>
                    <div>
                        <h1 className="h3 fw-bold mb-1 text-dark">Gestión de Inquilinos Temporales</h1>
                        <p className="text-muted mb-0">Administra el historial y registro de tus inquilinos.</p>
                    </div>
                </div>
                {(authUser.role === 'PROPIETARIO' || authUser.role === 'SUPER_ADMIN') && (
                    <button className="btn btn-primary btn-lg shadow-sm" onClick={() => setShowModal(true)}>
                        <FaPlus className="me-2" /> Registrar Inquilino
                    </button>
                )}
            </div>

            {/* MODAL (Reutilizable para Crear/Editar) */}
            {showModal && (
                <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content border-0 shadow-lg rounded-4 p-3">
                            <div className="modal-header border-0 pb-0">
                                <h5 className="modal-title fw-bold fs-4">
                                    {inquilinoEditando ? "Editar inquilino" : "Registrar nuevo inquilino"}
                                </h5>
                                <button className="btn btn-sm btn-light" onClick={closeModal}><FaTimes /></button>
                            </div>
                            <div className="modal-body">
                                <InquilinoForm 
                                    onClose={closeModal} 
                                    inquilinoAEditar={inquilinoEditando} 
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Tabla */}
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
                <div className="card-header bg-white border-0 pt-4 pb-0 px-4">
                    <h5 className="card-title fw-bold text-uppercase text-muted small mb-0">Listado de Inquilinos</h5>
                </div>
                <div className="card-body p-0">
                    <table className="table table-hover table-striped align-middle mb-0">
                        <thead className="table-light text-uppercase fs-7 text-muted border-bottom">
                            <tr>
                                <th className="ps-4 py-3">Nombre</th>
                                <th className="py-3">Apartamento</th>
                                <th className="py-3">Fecha Inicio</th>
                                <th className="py-3">Fecha Fin</th>
                                <th className="text-center py-3 pe-4">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inquilinos.map(inquilino => (
                                <tr key={inquilino.id} className="align-middle">
                                    <td className="ps-4 py-3 fw-medium text-dark">{inquilino.nombre}</td>
                                    <td className="py-3 text-secondary">{inquilino.apartamento}</td>
                                    <td className="py-3 text-secondary">{inquilino.fechaInicio}</td>
                                    <td className="py-3 text-secondary">{inquilino.fechaFin}</td>
                                    <td className="text-center py-3 pe-4">
                                        <div className="d-flex justify-content-center gap-2">
                                            <button className="btn btn-sm btn-outline-warning" onClick={() => handleEdit(inquilino)}><FaPencilAlt /></button>
                                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(inquilino.id)}><FaTrashAlt /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="card-footer bg-white border-0 py-3 px-4 text-end text-muted small">
                    Total: {inquilinos.length} inquilinos
                </div>
            </div>
        </div>
    );
};

export default InquilinosPage;