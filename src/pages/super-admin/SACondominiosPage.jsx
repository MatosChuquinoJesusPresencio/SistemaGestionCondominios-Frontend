import { useState } from "react";
import { condominiosData } from "../../data/condominios";
import { FaEdit, FaTrash, FaBan, FaCheck, FaPlus } from "react-icons/fa";

const SACondominiosPage = () => {
    // Estado para manejar la lista de condominios
    const [condominios, setCondominios] = useState(condominiosData);

    return (
        <div className="container-fluid mt-4">
            {/* Encabezado de la página */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Gestión de Condominios</h2>
                <button className="btn btn-primary d-flex align-items-center gap-2">
                    <FaPlus /> Nuevo Condominio
                </button>
            </div>

            {/* Tabla de listado */}
            <div className="card shadow-sm">
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Dirección</th>
                                    <th>Ciudad</th>
                                    <th>País</th>
                                    <th>Estado</th>
                                    <th className="text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {condominios.map((condominio) => (
                                    <tr key={condominio.id}>
                                        <td>{condominio.id}</td>
                                        <td className="fw-bold">{condominio.nombre}</td>
                                        <td>{condominio.direccion}</td>
                                        <td>{condominio.ciudad}</td>
                                        <td>{condominio.pais}</td>
                                        <td>
                                            <span className={`badge ${condominio.activo ? 'bg-success' : 'bg-danger'}`}>
                                                {condominio.activo ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>
                                        <td className="text-center">
                                            {/* Botones de acción sin funcionalidad aún */}
                                            <button className="btn btn-sm btn-outline-primary mx-1" title="Editar">
                                                <FaEdit />
                                            </button>
                                            <button className={`btn btn-sm ${condominio.activo ? 'btn-outline-warning' : 'btn-outline-success'} mx-1`} title={condominio.activo ? 'Desactivar' : 'Activar'}>
                                                {condominio.activo ? <FaBan /> : <FaCheck />}
                                            </button>
                                            <button className="btn btn-sm btn-outline-danger mx-1" title="Eliminar">
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {condominios.length === 0 && (
                                    <tr>
                                        <td colSpan="7" className="text-center py-4 text-muted">
                                            No hay condominios registrados.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SACondominiosPage;