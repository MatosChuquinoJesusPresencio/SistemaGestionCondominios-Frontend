// src/pages/super-admin/SACondominiosPage.jsx
import { useState } from "react";
import { condominiosData } from "../../data/condominios";
import { FaEdit, FaTrash, FaBan, FaCheck, FaPlus, FaSearch } from "react-icons/fa";

const SACondominiosPage = () => {
    const [condominios, setCondominios] = useState(condominiosData);
    const [busqueda, setBusqueda] = useState("");


    const handleToggleEstado = (id) => {
        const nuevosCondominios = condominios.map((condominio) => {
            if (condominio.id === id) {
                return { ...condominio, activo: !condominio.activo };
            }
            return condominio;
        });
        setCondominios(nuevosCondominios);
    };

    const handleEliminar = (id) => {
        const confirmar = window.confirm("¿Seguro que quieres eliminar este condominio? Esta acción no se puede deshacer.");
        if (confirmar) {
            const nuevosCondominios = condominios.filter((condominio) => condominio.id !== id);
            setCondominios(nuevosCondominios);
        }
    };

    const condominiosFiltrados = condominios.filter((condominio) =>
        condominio.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        condominio.ciudad.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <div className="container-fluid mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Gestión de Condominios</h2>
                <button className="btn btn-primary d-flex align-items-center gap-2">
                    <FaPlus /> Nuevo Condominio
                </button>
            </div>

            <div className="card shadow-sm">
                <div className="card-header bg-white py-3">
                    <div className="input-group" style={{ maxWidth: "400px" }}>
                        <span className="input-group-text bg-light"><FaSearch /></span>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Buscar por nombre o ciudad..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                        />
                    </div>
                </div>

                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="ps-4">ID</th>
                                    <th>Nombre</th>
                                    <th>Dirección</th>
                                    <th>Ciudad</th>
                                    <th>País</th>
                                    <th>Estado</th>
                                    <th className="text-center pe-4">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {condominiosFiltrados.map((condominio) => (
                                    <tr key={condominio.id}>
                                        <td className="ps-4">{condominio.id}</td>
                                        <td className="fw-bold">{condominio.nombre}</td>
                                        <td>{condominio.direccion}</td>
                                        <td>{condominio.ciudad}</td>
                                        <td>{condominio.pais}</td>
                                        <td>
                                            <span className={`badge ${condominio.activo ? 'bg-success' : 'bg-danger'}`}>
                                                {condominio.activo ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>
                                        <td className="text-center pe-4">
                                            <button className="btn btn-sm btn-outline-primary mx-1" title="Editar">
                                                <FaEdit />
                                            </button>
                                            
                                            <button 
                                                className={`btn btn-sm ${condominio.activo ? 'btn-outline-warning' : 'btn-outline-success'} mx-1`} 
                                                title={condominio.activo ? 'Desactivar' : 'Activar'}
                                                onClick={() => handleToggleEstado(condominio.id)}
                                            >
                                                {condominio.activo ? <FaBan /> : <FaCheck />}
                                            </button>

                                            <button 
                                                className="btn btn-sm btn-outline-danger mx-1" 
                                                title="Eliminar"
                                                onClick={() => handleEliminar(condominio.id)}
                                            >
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {condominiosFiltrados.length === 0 && (
                                    <tr>
                                        <td colSpan="7" className="text-center py-5 text-muted">
                                            No se encontraron condominios que coincidan con tu búsqueda.
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