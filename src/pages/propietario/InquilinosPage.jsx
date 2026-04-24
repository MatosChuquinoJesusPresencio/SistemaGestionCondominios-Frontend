import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

const InquilinosPage = () => {
    const { authUser } = useAuth();
const [inquilinos] = useState([]);
    // Función para manejar la eliminación
    const handleDelete = (id) => {
        // Implementar lógica de eliminación
        console.log("Eliminando inquilino:", id);
    };

    return (
        <div className="container-fluid p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="h3 fw-bold">Gestión de Inquilinos Temporales</h1>
                
                {/* Botón restringido por rol */}
                {(authUser.role === 'PROPIETARIO' || authUser.role === 'SUPER_ADMIN') && (
                    <button className="btn btn-primary">
                        <i className="bi bi-plus-lg me-2"></i> Registrar Inquilino
                    </button>
                )}
            </div>

            <div className="card border-0 shadow-sm p-3">
                <table className="table table-hover align-middle">
                    <thead className="table-light">
                        <tr>
                            <th>Nombre</th>
                            <th>Apartamento</th>
                            <th>Fecha Inicio</th>
                            <th>Fecha Fin</th>
                            <th className="text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inquilinos.length > 0 ? (
                            inquilinos.map(inquilino => (
                                <tr key={inquilino.id}>
                                    <td>{inquilino.nombre}</td>
                                    <td>{inquilino.apartamento}</td>
                                    <td>{inquilino.fechaInicio}</td>
                                    <td>{inquilino.fechaFin}</td>
                                    <td className="text-center">
                                        {/* Acciones restringidas por rol */}
                                        {(authUser.role === 'PROPIETARIO' || authUser.role === 'SUPER_ADMIN') && (
                                            <>
                                                <button className="btn btn-sm btn-outline-warning me-2">Editar</button>
                                                <button 
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => handleDelete(inquilino.id)}
                                                >
                                                    Eliminar
                                                </button>
                                            </>
                                        )}
                                        {authUser.role === 'ADMIN_CONDOMINIO' && (
                                            <span className="text-muted small">Solo lectura</span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center py-4">No hay inquilinos registrados.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InquilinosPage;