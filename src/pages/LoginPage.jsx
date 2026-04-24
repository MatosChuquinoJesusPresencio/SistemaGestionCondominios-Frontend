import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

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
        <div className="container-fluid min-vh-100 d-flex align-items-stretch p-0" style={{ backgroundColor: "#f4f7f6" }}>
            <div className="row w-100 m-0">
                
                {/* ---------- COLUMNA IZQUIERDA: IMAGEN VISUAL ---------- */}
                <div 
                    className="col-md-6 d-none d-md-flex flex-column justify-content-between p-5 text-light"
                    style={{ 
                        backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2000&auto=format&fit=crop')",
                        backgroundSize: "cover",
                        backgroundPosition: "center"
                    }}
                >
                    <div className="d-flex align-items-center pt-3">
                        <span className="fs-4 fw-bold">GRI<span className="fw-light text-white-50">CO</span></span>
                        <span className="ms-2 small text-white-50">| Gestión Residencial</span>
                    </div>

                    <div className="pb-4" style={{ textShadow: "1px 1px 3px rgba(0,0,0,0.3)" }}>
                        <h2 className="display-6 fw-bold">Tu comunidad, conectada.</h2>
                        <p className="lead fw-light opacity-75">Administración eficiente para un estilo de vida tranquilo.</p>
                    </div>
                </div>

                {/* ---------- COLUMNA DERECHA: FORMULARIO ---------- */}
                <div className="col-md-6 d-flex align-items-center justify-content-center bg-white p-4 p-lg-5">
                    <div style={{ width: "100%", maxWidth: "400px" }}>
                        
                        <div className="d-md-none text-center mb-5">
                             <h1 className="h3 text-dark fw-bold mb-1">GRI<span style={{color: "var(--secondary-color)"}}>CO</span></h1>
                        </div>

                        <div className="mb-4">
                            <h2 className="h3 fw-bold text-dark">Bienvenido de nuevo</h2>
                            <p className="text-muted">Ingresa tus credenciales para acceder al portal.</p>
                        </div>

                        <form noValidate onSubmit={handleSubmit(onSubmit)}>
                            
                            {/* Campo Correo */}
                            <div className="mb-3">
                                <label className="form-label small fw-semibold text-secondary">Correo Electrónico</label>
                                <input
                                    type="email"
                                    className={`form-control form-control-lg ${errors.email ? "is-invalid" : ""}`}
                                    style={{ borderRadius: "8px" }}
                                    placeholder="nombre@ejemplo.com"
                                    {...register("email", {
                                        required: "El correo es obligatorio",
                                        pattern: {
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                            message: "Ingresa un correo válido"
                                        }
                                    })}
                                />
                                {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                            </div>

                            {/* Campo Contraseña */}
                            <div className="mb-4">
                                <div className="d-flex justify-content-between mb-1">
                                    <label className="form-label small fw-semibold text-secondary m-0">Contraseña</label>
                                    <Link 
                                        to="/forgot-password" 
                                        className="text-decoration-none small"
                                        style={{ color: "var(--secondary-color)", fontWeight: "600" }}
                                    >
                                        ¿Olvidaste tu contraseña?
                                    </Link>
                                </div>
                                <input
                                    type="password"
                                    className={`form-control form-control-lg ${errors.password ? "is-invalid" : ""}`}
                                    style={{ borderRadius: "8px" }}
                                    placeholder="••••••••"
                                    {...register("password", {
                                        required: "La contraseña es necesaria",
                                        minLength: { value: 6, message: "Mínimo 6 caracteres" }
                                    })}
                                />
                                {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
                            </div>

                            {/* Botón Ingresar */}
                            <button
                                type="submit"
                                className="btn btn-lg w-100 py-2 mb-3 text-light shadow-sm"
                                style={{ 
                                    backgroundColor: "var(--secondary-color)", 
                                    border: "none", 
                                    fontWeight: "600",
                                    borderRadius: "8px"
                                }}
                                disabled={authLoading}
                            >
                                {authLoading ? (
                                    <span className="spinner-border spinner-border-sm"></span>
                                ) : (
                                    "Iniciar Sesión"
                                )}
                            </button>

                            {/* Enlace Registro */}
                            <div className="text-center mt-3">
                                <p className="text-muted small">
                                    ¿Aún no tienes una cuenta?{" "}
                                    <Link 
                                        to="/register" 
                                        className="text-decoration-none fw-bold"
                                        style={{ color: "var(--secondary-color)" }}
                                    >
                                        Regístrate aquí
                                    </Link>
                                </p>
                            </div>

                            {/* Error Alert */}
                            {authError && (
                                <div className="alert alert-danger py-2 text-center mt-3" style={{ borderRadius: "8px" }}>
                                    {authError}
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;