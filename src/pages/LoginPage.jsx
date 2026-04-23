import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import AnimatedPage from "../components/animations/AnimatedPage";

import logoSinFondo from "../assets/logo-sin-fondo.svg";

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

        const result = await login(data);

        if (result.success) {
            navigate("/");
        }
    };

    return (
        <AnimatedPage>
            <div
                className="container-fluid vh-100 d-flex justify-content-center align-items-center position-relative bg-login-image"
            >

                <div
                    className="card border-0 shadow-lg position-relative p-4 rounded-4 login-glass-card login-card-container"
                >

                    <div className="text-center mb-4">
                        <img
                            src={logoSinFondo}
                            alt="Logo Condominio"
                            className="mb-3 rounded-circle shadow-sm login-logo"
                        />
                        <h3 className="fw-bold text-dark mb-0 login-title">
                            Bienvenido
                        </h3>
                        <p className="text-muted small">Ingresa tus credenciales para continuar</p>
                    </div>

                    <form noValidate onSubmit={handleSubmit(onSubmit)}>

                        <div className="mb-4">
                            <label className="form-label text-secondary fw-semibold small mb-1">Correo Electrónico</label>
                            <div className="input-group">
                                <span className={`input-group-text bg-white border-end-0 ${errors.email ? "border-danger text-danger" : "text-muted"}`}>
                                    <i className="bi bi-envelope"></i>
                                </span>
                                <input
                                    type="email"
                                    placeholder="ejemplo@correo.com"
                                    className={`form-control border-start-0 ps-0 input-no-shadow ${errors.email ? "is-invalid" : ""}`}
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
                                <span className={`input-group-text bg-white border-end-0 ${errors.password ? "border-danger text-danger" : "text-muted"}`}>
                                    <i className="bi bi-lock"></i>
                                </span>
                                <input
                                    type="password"
                                    placeholder="********"
                                    className={`form-control border-start-0 ps-0 input-no-shadow ${errors.password ? "is-invalid" : ""}`}
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

                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <div className="form-check">
                                <input
                                    className="form-check-input custom-checkbox"
                                    type="checkbox"
                                    id="rememberMe"
                                    {...register("rememberMe")}
                                />
                                <label className="form-check-label small text-secondary fw-semibold" htmlFor="rememberMe">
                                    Recuérdame
                                </label>
                            </div>
                            <button 
                                type="button" 
                                className="btn btn-link p-0 text-decoration-none small fw-semibold forgot-password-link"
                                onClick={() => {/* Redirigir a recuperación */}}
                            >
                                ¿Olvidaste tu contraseña?
                            </button>
                        </div>

                        <button
                            type="submit"
                            className="btn w-100 text-light py-2 rounded-3 fw-semibold shadow-sm transition btn-login"
                            disabled={authLoading}
                        >
                            {authLoading ? (
                                <span className="spinner-border spinner-border-sm me-2"></span>
                            ) : null}
                            {authLoading ? "Ingresando..." : "Ingresar"}
                        </button>

                        {authError && (
                            <div className="alert alert-danger d-flex align-items-center justify-content-center position-relative mt-3 py-2 border-0 rounded-3 shadow-sm text-center">
                                <span className="small"><i className="bi bi-exclamation-triangle-fill me-2"></i>{authError}</span>
                                <button
                                    type="button"
                                    className="btn-close alert-close-small position-absolute end-0 me-3"
                                    onClick={clearAuthError}
                                />
                            </div>
                        )}

                    </form>

                </div>
            </div>
        </AnimatedPage>
    );
};

export default LoginPage;
