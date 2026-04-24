import { useState } from "react";
import { condominiosData } from "../../data/condominios";
import { FaEdit, FaTrash, FaBan, FaCheck, FaPlus, FaSearch } from "react-icons/fa";

const formularioVacio = {
    id: null,
    nombre: "",
    direccion: "",
    ciudad: "",
    pais: ""
};

const SACondominiosPage = () => {
    const [condominios, setCondominios] = useState(condominiosData);
    const [busqueda, setBusqueda] = useState("");
    const [mostrarModal, setMostrarModal] = useState(false);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [formData, setFormData] = useState(formularioVacio);

    const glassCardStyle = {
        background: "#ffffff",
        border: "1px solid rgba(0, 0, 0, 0.05)",
        borderRadius: "0.8rem",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)"
    };

    const tableHeaderStyle = {
        fontWeight: "600",
        borderBottom: "2px solid #e2e8f0",
        letterSpacing: "0.5px",
        fontSize: "0.9rem"
    };

    const abrirModalCrear = () => { setFormData(formularioVacio); setModoEdicion(false); setMostrarModal(true); };
    const abrirModalEditar = (condominio) => { setFormData(condominio); setModoEdicion(true); setMostrarModal(true); };
    const cerrarModal = () => setMostrarModal(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (modoEdicion) {
            setCondominios(condominios.map((c) => c.id === formData.id ? { ...c, ...formData } : c));
        } else {
            const nuevoId = condominios.length > 0 ? Math.max(...condominios.map(c => c.id)) + 1 : 1;
            const fechaHoy = new Date().toISOString().split("T")[0];
            setCondominios([...condominios, { ...formData, id: nuevoId, fecha_creacion: fechaHoy, activo: true }]);
        }
        cerrarModal();
    };

    const handleToggleEstado = (id) => setCondominios(condominios.map((c) => c.id === id ? { ...c, activo: !c.activo } : c));
    const handleEliminar = (id) => {
        if (window.confirm("¿Seguro que quieres eliminar este condominio? Esta acción no se puede deshacer.")) {
            setCondominios(condominios.filter((c) => c.id !== id));
        }
    };

    const condominiosFiltrados = condominios.filter((c) =>
        c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        c.ciudad.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <div className="container-fluid py-4 position-relative" style={{ minHeight: "90vh" }}>
            <style>
                {`
                    .custom-hover-row:hover {
                        background-color: #f8fafc !important;
                        transition: background-color 0.2s ease;
                    }
                `}
            </style>

            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-0 text-dark">Condominios</h2>
                    <p className="text-muted mb-0">Gestiona los complejos residenciales del sistema</p>
                </div>
                <button
                    className="btn text-white d-flex align-items-center gap-2 rounded-pill px-4 shadow-sm bg-main"
                    onClick={abrirModalCrear}
                    style={{ fontWeight: "500" }}
                >
                    <FaPlus /> Nuevo
                </button>
            </div>

            <div className="card border-0" style={glassCardStyle}>
                <div className="card-header bg-transparent border-0 pt-4 pb-3 px-4 d-flex justify-content-between align-items-center">
                    <div className="input-group" style={{ maxWidth: "350px", borderRadius: "0.5rem", border: "1px solid #e2e8f0", overflow: "hidden" }}>
                        <span className="input-group-text bg-black border-0 px-3 text-main"><FaSearch /></span>
                        <input
                            type="text"
                            className="form-control border-0 shadow-none bg-white"
                            placeholder="Buscar por nombre o ciudad..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                        />
                    </div>
                </div>

                <div className="card-body px-4 pb-4">
                    <div className="table-responsive">
                        <table className="table table-borderless align-middle mb-0" style={{ borderCollapse: "separate", borderSpacing: "0" }}>
                            <thead>
                                <tr>
                                    <th style={{ ...tableHeaderStyle, borderTopLeftRadius: "0.5rem" }} className="ps-4 py-3 text-main">ID</th>
                                    <th style={tableHeaderStyle} className="py-3 text-main">Nombre</th>
                                    <th style={tableHeaderStyle} className="py-3 text-main">Dirección</th>
                                    <th style={tableHeaderStyle} className="py-3 text-main">Ciudad</th>
                                    <th style={tableHeaderStyle} className="py-3 text-main">País</th>
                                    <th style={tableHeaderStyle} className="py-3 text-main">Estado</th>
                                    <th style={{ ...tableHeaderStyle, borderTopRightRadius: "0.5rem" }} className="text-center pe-4 py-3 text-main">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {condominiosFiltrados.map((condominio) => (
                                    <tr key={condominio.id} className="custom-hover-row" style={{ borderBottom: "1px solid #e2e8f0" }}>
                                        <td className="ps-4 fw-bold py-3 text-main" style={{ fontSize: "0.95rem" }}>
                                            #{condominio.id}
                                        </td>
                                        <td className="fw-bold text-dark" style={{ fontSize: "1.05rem" }}>{condominio.nombre}</td>
                                        <td className="text-secondary">{condominio.direccion}</td>
                                        <td className="text-secondary">{condominio.ciudad}</td>
                                        <td className="text-secondary">{condominio.pais}</td>
                                        <td>
                                            <span className={`badge rounded-pill px-3 py-2 ${condominio.activo ? 'bg-success bg-opacity-10 text-success' : 'bg-danger bg-opacity-10 text-danger'}`} style={{ fontWeight: "600", letterSpacing: "0.5px" }}>
                                                {condominio.activo ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>
                                        <td className="text-center pe-4">
                                            <button className="btn btn-sm btn-light text-primary rounded-circle shadow-sm mx-1 p-2" title="Editar" onClick={() => abrirModalEditar(condominio)}>
                                                <FaEdit />
                                            </button>
                                            <button className={`btn btn-sm btn-light rounded-circle shadow-sm mx-1 p-2 ${condominio.activo ? 'text-warning' : 'text-success'}`} title={condominio.activo ? 'Desactivar' : 'Activar'} onClick={() => handleToggleEstado(condominio.id)}>
                                                {condominio.activo ? <FaBan /> : <FaCheck />}
                                            </button>
                                            <button className="btn btn-sm btn-light text-danger rounded-circle shadow-sm mx-1 p-2" title="Eliminar" onClick={() => handleEliminar(condominio.id)}>
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {condominiosFiltrados.length === 0 && (
                                    <tr>
                                        <td colSpan="7" className="text-center py-5 text-muted">
                                            <div className="d-flex flex-column align-items-center">
                                                <FaSearch className="fs-1 text-light mb-3" />
                                                <p className="mb-0 fs-5">No se encontraron resultados</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {mostrarModal && (
                <>
                    <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ zIndex: 1055 }}>
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content border-0" style={{ borderRadius: "0.8rem", overflow: "hidden", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}>

                                <div className="modal-header border-bottom-0 pb-3 mt-0 px-4 bg-main text-white">
                                    <h5 className="modal-title fw-bold fs-5 mt-2">
                                        {modoEdicion ? "Editar Condominio" : "Nuevo Condominio"}
                                    </h5>
                                    <button type="button" className="btn-close btn-close-white shadow-none mt-2" onClick={cerrarModal}></button>
                                </div>

                                <form onSubmit={handleSubmit}>
                                    <div className="modal-body px-4 pt-4">
                                        <div className="mb-3">
                                            <label className="form-label text-muted fw-medium small">Nombre del Condominio</label>
                                            <input type="text" className="form-control form-control-lg border-1 shadow-sm bg-light" name="nombre" value={formData.nombre} onChange={handleChange} required maxLength="100" />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label text-muted fw-medium small">Dirección</label>
                                            <input type="text" className="form-control border-1 shadow-sm bg-light" name="direccion" value={formData.direccion} onChange={handleChange} required />
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label text-muted fw-medium small">Ciudad</label>
                                                <input type="text" className="form-control border-1 shadow-sm bg-light" name="ciudad" value={formData.ciudad} onChange={handleChange} required />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label text-muted fw-medium small">País</label>
                                                <input type="text" className="form-control border-1 shadow-sm bg-light" name="pais" value={formData.pais} onChange={handleChange} required />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal-footer border-top-0 px-4 pb-4 pt-2">
                                        <button type="button" className="btn btn-light rounded-pill px-4 shadow-sm" onClick={cerrarModal}>Cancelar</button>
                                        <button type="submit" className="btn bg-main text-white rounded-pill px-4 shadow-sm">
                                            {modoEdicion ? "Guardar Cambios" : "Crear Condominio"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="modal-backdrop show" style={{ backgroundColor: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(2px)" }}></div>
                </>
            )}
        </div>
    );
};

export default SACondominiosPage;