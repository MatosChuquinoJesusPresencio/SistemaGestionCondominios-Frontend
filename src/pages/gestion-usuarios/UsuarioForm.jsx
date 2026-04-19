import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { VALID_ROLES } from "../../constants/roles";

const UsuarioForm = ({ initialData, onSubmit, onClose }) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: initialData || { name: "", email: "", password: "", role: VALID_ROLES[2] }
    });

    useEffect(() => {
        if (initialData) reset(initialData);
    }, [initialData, reset]);

    const submitHandler = (data) => {
        onSubmit(data);
        reset();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>{initialData ? "Editar Usuario" : "Nuevo Usuario"}</h3>
                
                <form onSubmit={handleSubmit(submitHandler)} noValidate>
                    <div className="form-group">
                        <label>Nombre Completo</label>
                        <input 
                            type="text" 
                            className="form-input" 
                            {...register("name", { required: "El nombre es obligatorio" })} 
                        />
                        {errors.name && <span className="form-error">{errors.name.message}</span>}
                    </div>

                    <div className="form-group">
                        <label>Correo Electrónico</label>
                        <input 
                            type="email" 
                            className="form-input" 
                            {...register("email", { 
                                required: "El correo es obligatorio",
                                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Correo no válido" }
                            })} 
                        />
                        {errors.email && <span className="form-error">{errors.email.message}</span>}
                    </div>

                    <div className="form-group">
                        <label>Contraseña {initialData && "(Dejar en blanco para no cambiar)"}</label>
                        <input 
                            type="password" 
                            className="form-input" 
                            {...register("password", { 
                                required: !initialData ? "La contraseña es obligatoria" : false,
                                minLength: { value: 6, message: "Mínimo 6 caracteres" }
                            })} 
                        />
                        {errors.password && <span className="form-error">{errors.password.message}</span>}
                    </div>

                    <div className="form-group">
                        <label>Rol en el Sistema</label>
                        <select className="form-input" {...register("role", { required: "Selecciona un rol" })}>
                            {VALID_ROLES.map(rol => (
                                <option key={rol} value={rol}>{rol.replace("_", " ")}</option>
                            ))}
                        </select>
                        {errors.role && <span className="form-error">{errors.role.message}</span>}
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
                        <button type="submit" className="btn-custom">Guardar Usuario</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UsuarioForm;