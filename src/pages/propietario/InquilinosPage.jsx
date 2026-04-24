import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { FaPlus, FaTrashAlt, FaPencilAlt, FaUsers } from "react-icons/fa";

const InquilinosPage = () => {
    const { authUser } = useAuth();

    // eslint-disable-next-line no-unused-vars
    const [inquilinos, setInquilinos] = useState([]); 

    // eslint-disable-next-line no-unused-vars
    const propietarioId = authUser.id;

    // Función para manejar la eliminación
    const handleDelete = (id) => {
        console.log("Eliminando inquilino:", id);
    };

    return (
        <div className="container-fluid px-4 py-5">
            
            {/* Cabecera de la sección */}
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
                    <button className="btn btn-primary btn-lg d-flex align-items-center shadow-sm">
                        <FaPlus className="me-2" /> Registrar Inquilino
                    </button>
                )}
            </div>

            {/* Contenedor principal de la tabla */}
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
                            {inquilinos.length > 0 ? (
                                inquilinos.map(inquilino => (
                                    <tr key={inquilino.id} className="align-middle">
                                        <td className="ps-4 py-3 fw-medium text-dark">{inquilino.nombre}</td>
                                        <td className="py-3 text-secondary">{inquilino.apartamento}</td>
                                        <td className="py-3 text-secondary">{inquilino.fechaInicio}</td>
                                        <td className="py-3 text-secondary">{inquilino.fechaFin}</td>
                                        <td className="text-center py-3 pe-4">
                                            {(authUser.role === 'PROPIETARIO' || authUser.role === 'SUPER_ADMIN') && (
                                                <div className="d-flex justify-content-center gap-2">
                                                    <button className="btn btn-sm btn-outline-warning d-flex align-items-center">
                                                        <FaPencilAlt />
                                                    </button>
                                                    <button 
                                                        className="btn btn-sm btn-outline-danger d-flex align-items-center"
                                                        onClick={() => handleDelete(inquilino.id)}
                                                    >
                                                        <FaTrashAlt />
                                                    </button>
                                                </div>
                                            )}
                                            {authUser.role === 'ADMIN_CONDOMINIO' && (
                                                <span className="badge bg-light text-muted fw-normal">Solo lectura</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-5">
                                        <div className="text-muted">
                                            <FaUsers size={48} className="mb-3 opacity-50" />
                                            <p className="fw-medium">No hay inquilinos registrados.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
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