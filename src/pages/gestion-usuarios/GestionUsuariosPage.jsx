import { useState } from 'react';
import { users as initialUsers } from '../../data/users'; 
import UsuarioForm from './UsuarioForm';
import './GestionUsuarios.css';

const GestionUsuariosPage = () => {
    const [listaUsuarios, setListaUsuarios] = useState(initialUsers);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [usuarioAEditar, setUsuarioAEditar] = useState(null);

    // Abrir modal para NUEVO
    const handleNuevo = () => {
        setUsuarioAEditar(null);
        setIsModalOpen(true);
    };

    // Abrir modal para EDITAR
    const handleEditar = (usuario) => {
        setUsuarioAEditar(usuario);
        setIsModalOpen(true);
    };

    // ELIMINAR riguroso (pide confirmación nativa)
    const handleEliminar = (id) => {
        if (window.confirm("¿Estás seguro de eliminar este usuario de forma permanente?")) {
            setListaUsuarios(listaUsuarios.filter(u => u.id !== id));
        }
    };

    // GUARDAR (Sirve tanto para crear como para editar)
    const handleGuardarUsuario = (data) => {
        if (usuarioAEditar) {
            // Actualizar existente
            setListaUsuarios(listaUsuarios.map(u => 
                u.id === usuarioAEditar.id ? { ...data, id: u.id } : u
            ));
        } else {
            // crear nuevo user (Genera id simulado alto para que no choque
            const nuevoId = Math.max(...listaUsuarios.map(u => u.id)) + 1;
            setListaUsuarios([...listaUsuarios, { ...data, id: nuevoId }]);
        }
        setIsModalOpen(false);
    };

    return (
        <div className="usuarios-container">
            <div className="usuarios-header">
                <h2>Gestión Rigurosa de Usuarios</h2>
                <button className="btn-custom" onClick={handleNuevo}>
                    + Nuevo Usuario
                </button>
            </div>
            
            <div style={{ overflowX: "auto" }}>
                <table className="table-custom">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Rol</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listaUsuarios.length === 0 ? (
                            <tr><td colSpan="5" style={{textAlign: "center"}}>No hay usuarios registrados.</td></tr>
                        ) : (
                            listaUsuarios.map(usuario => (
                                <tr key={usuario.id}>
                                    <td>{usuario.id}</td>
                                    <td>{usuario.name}</td>
                                    <td>{usuario.email}</td>
                                    <td>
                                        <span style={{ 
                                            backgroundColor: 'var(--primary-color)', 
                                            color: 'white', 
                                            padding: '4px 8px', 
                                            borderRadius: '12px',
                                            fontSize: '0.85em',
                                            fontWeight: 'bold'
                                        }}>
                                            {usuario.role.replace("_", " ")}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="action-btn btn-edit" onClick={() => handleEditar(usuario)}>Editar</button>
                                        <button className="action-btn btn-delete" onClick={() => handleEliminar(usuario.id)}>Eliminar</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Renderizado condicional del Modal */}
            {isModalOpen && (
                <UsuarioForm 
                    initialData={usuarioAEditar} 
                    onSubmit={handleGuardarUsuario} 
                    onClose={() => setIsModalOpen(false)} 
                />
            )}
        </div>
    );
};

export default GestionUsuariosPage;