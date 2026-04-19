import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

import loginBg from "../assets/login-bg.png";
import logo from "../assets/logo2.svg";

const LoginPage = () => {
    const navigate = useNavigate();
    const { login, authLoading, clearAuthError, authError } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        clearAuthError();

        await login(data);
        navigate("/");
    };

    return (
        <div 
            className="container-fluid vh-100 d-flex justify-content-center align-items-center position-relative"
            style={{
                backgroundImage: `url(${loginBg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            {/* Overlay oscuro */}
            <div 
                className="position-absolute top-0 start-0 w-100 h-100 bg-dark"
                style={{ opacity: 0.6 }}
            ></div>

            {/* Tarjeta de Login */}
            <div 
                className="card border-0 shadow-lg position-relative p-4 rounded-4 login-glass-card" 
                style={{ width: "100%", maxWidth: "420px", zIndex: 10 }}
            >
                
                <div className="text-center mb-4">
                    <img 
                        src={logo} 
                        alt="Logo Condominio" 
                        className="mb-3 rounded-circle shadow-sm"
                        style={{ width: "100px", height: "100px", backgroundColor: "white", objectFit: "cover", border: "3px solid white" }} 
                    />
                    <h3 className="fw-bold text-dark mb-0" style={{ letterSpacing: '0.5px' }}>
                        Bienvenido
                    </h3>
                    <p className="text-muted small">Ingresa tus credenciales para continuar</p>
                </div>

                <form noValidate onSubmit={handleSubmit(onSubmit)}>

                    <div className="mb-4">
                        <label className="form-label text-secondary fw-semibold small mb-1">Correo Electrónico</label>
                        <div className="input-group">
                            <span className="input-group-text bg-white border-end-0 text-muted">
                                <i className="bi bi-envelope"></i>
                            </span>
                            <input
                                type="email"
                                placeholder="ejemplo@correo.com"
                                className={`form-control border-start-0 ps-0 ${errors.email ? "is-invalid" : ""}`}
                                style={{ boxShadow: 'none' }}
                                {...register("email", {
                                    required: "El correo es obligatorio",
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: "Correo no válido"
                                    }
                                })}
                            />
                            {errors.email && (
                                <div className="invalid-feedback d-block mt-1">
                                    {errors.email.message}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="form-label text-secondary fw-semibold small mb-1">Contraseña</label>
                        <div className="input-group">
                            <span className="input-group-text bg-white border-end-0 text-muted">
                                <i className="bi bi-lock"></i>
                            </span>
                            <input
                                type="password"
                                placeholder="********"
                                className={`form-control border-start-0 ps-0 ${errors.password ? "is-invalid" : ""}`}
                                style={{ boxShadow: 'none' }}
                                {...register("password", {
                                    required: "La contraseña es obligatoria",
                                    minLength: {
                                        value: 6,
                                        message: "Mínimo 6 caracteres"
                                    }
                                })}
                            />
                            {errors.password && (
                                <div className="invalid-feedback d-block mt-1">
                                    {errors.password.message}
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn w-100 text-light py-2 rounded-3 fw-semibold shadow-sm transition"
                        style={{ backgroundColor: "var(--primary-color)", border: "none", fontSize: "1.05rem" }}
                        disabled={authLoading}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = "var(--secondary-color)"}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = "var(--primary-color)"}
                    >
                        {authLoading ? (
                            <span className="spinner-border spinner-border-sm me-2"></span>
                        ) : null}
                        {authLoading ? "Ingresando..." : "Ingresar"}
                    </button>

                    {authError && (
                        <div className="alert alert-danger d-flex align-items-center justify-content-between mt-3 py-2 border-0 rounded-3 shadow-sm">
                            <span className="small"><i className="bi bi-exclamation-triangle-fill me-2"></i>{authError}</span>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={clearAuthError}
                                style={{ fontSize: '0.8rem' }}
                            />
                        </div>
                    )}

                </form>

            </div>
        </div>
    );
};

export default LoginPage;