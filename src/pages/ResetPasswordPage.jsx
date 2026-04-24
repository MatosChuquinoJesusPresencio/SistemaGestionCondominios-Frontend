import { useForm } from "react-hook-form";
import { useSearchParams, Link } from "react-router-dom";
import { useState, useRef } from "react";
import AnimatedPage from "../components/animations/AnimatedPage";
import logoSinFondo from "../assets/logo-sin-fondo.svg";
import { useAuth } from "../hooks/useAuth";

const ResetPasswordPage = () => {
    const [searchParams] = useSearchParams();
    const { resetPassword, validateResetToken, authLoading, authError, clearAuthError } = useAuth();

    const [isSuccess, setIsSuccess] = useState(false);

    const tokenFromUrl = searchParams.get("token");
    const tokenStatus = validateResetToken(tokenFromUrl);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const password = useRef({});
    password.current = watch("password", "");

    const onSubmit = async (data) => {
        clearAuthError();
        const result = await resetPassword(tokenFromUrl, data.password);
        if (result.success) setIsSuccess(true);
    };

    return (
        <AnimatedPage>
            <div className="container-fluid vh-100 d-flex justify-content-center align-items-center position-relative bg-login-image">
                <div className="card border-0 shadow-lg position-relative p-4 rounded-4 login-glass-card login-card-container">

                    <div className="text-center mb-4">
                        <img
                            src={logoSinFondo}
                            alt="Logo Condominio"
                            className="mb-3 rounded-circle shadow-sm login-logo"
                        />
                        <h3 className="fw-bold text-dark mb-0 login-title">
                            Nueva Contraseña
                        </h3>
                        <p className="text-muted small">
                            {isSuccess
                                ? "¡Contraseña actualizada con éxito!"
                                : "Ingresa tu nueva contraseña a continuación"}
                        </p>
                    </div>

                    {isSuccess ? (
                        // ── Estado: éxito ──────────────────────────────────
                        <div className="text-center mb-4">
                            <div className="alert alert-success border-0 rounded-4 py-3 mb-4">
                                <i className="bi bi-shield-check fs-1 d-block mb-2 text-success"></i>
                                <p className="mb-0 small">
                                    Tu contraseña ha sido restablecida. Ya puedes iniciar sesión.
                                </p>
                            </div>
                            <Link
                                to="/login"
                                id="btn-go-to-login"
                                className="btn btn-primary-theme w-100 py-2 rounded-3 fw-semibold"
                            >
                                <i className="bi bi-box-arrow-in-right me-2"></i>Ir al Login
                            </Link>
                        </div>

                    ) : !tokenStatus.valid ? (
                        // ── Estado: token inválido ─────────────────────────
                        <div className="text-center mb-4">
                            <div className="alert alert-danger border-0 rounded-4 py-3 mb-4">
                                <i className="bi bi-x-octagon fs-1 d-block mb-2"></i>
                                <p className="mb-0 small">{tokenStatus.reason}</p>
                            </div>
                            <Link
                                to="/forgot-password"
                                className="btn btn-primary-theme w-100 py-2 rounded-3 fw-semibold"
                            >
                                Solicitar nuevo enlace
                            </Link>
                        </div>

                    ) : (
                        // ── Estado: formulario ─────────────────────────────
                        <form noValidate onSubmit={handleSubmit(onSubmit)}>

                            <div className="mb-4">
                                <label className="form-label text-secondary fw-semibold small mb-1">
                                    Nueva Contraseña
                                </label>
                                <div className="input-group">
                                    <span className={`input-group-text bg-white border-end-0 ${errors.password ? "border-danger text-danger" : "text-muted"}`}>
                                        <i className="bi bi-lock"></i>
                                    </span>
                                    <input
                                        type="password"
                                        placeholder="Mínimo 6 caracteres"
                                        className={`form-control border-start-0 ps-0 input-no-shadow ${errors.password ? "is-invalid" : ""}`}
                                        {...register("password", {
                                            required: "La contraseña es obligatoria",
                                            minLength: { value: 6, message: "Mínimo 6 caracteres" }
                                        })}
                                    />
                                    {errors.password && (
                                        <div className="invalid-feedback d-block mt-1">
                                            {errors.password.message}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="form-label text-secondary fw-semibold small mb-1">
                                    Confirmar Contraseña
                                </label>
                                <div className="input-group">
                                    <span className={`input-group-text bg-white border-end-0 ${errors.confirmPassword ? "border-danger text-danger" : "text-muted"}`}>
                                        <i className="bi bi-lock-fill"></i>
                                    </span>
                                    <input
                                        type="password"
                                        placeholder="Repite tu contraseña"
                                        className={`form-control border-start-0 ps-0 input-no-shadow ${errors.confirmPassword ? "is-invalid" : ""}`}
                                        {...register("confirmPassword", {
                                            required: "Confirma tu contraseña",
                                            validate: value =>
                                                value === password.current || "Las contraseñas no coinciden"
                                        })}
                                    />
                                    {errors.confirmPassword && (
                                        <div className="invalid-feedback d-block mt-1">
                                            {errors.confirmPassword.message}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {authError && (
                                <div className="alert alert-danger d-flex align-items-center justify-content-center position-relative py-2 mb-3 border-0 rounded-3 shadow-sm text-center">
                                    <span className="small"><i className="bi bi-exclamation-triangle-fill me-2"></i>{authError}</span>
                                    <button
                                        type="button"
                                        className="btn-close alert-close-small position-absolute end-0 me-3"
                                        onClick={clearAuthError}
                                    />
                                </div>
                            )}

                            <button
                                type="submit"
                                id="btn-reset-password"
                                className="btn w-100 text-light py-2 rounded-3 fw-semibold shadow-sm transition btn-login mb-3"
                                disabled={authLoading}
                            >
                                {authLoading && <span className="spinner-border spinner-border-sm me-2"></span>}
                                {authLoading ? "Restableciendo..." : "Cambiar contraseña"}
                            </button>

                            <div className="text-center">
                                <Link to="/login" className="btn btn-link p-0 text-decoration-none small fw-semibold forgot-password-link">
                                    Volver al inicio de sesión
                                </Link>
                            </div>
                        </form>
                    )}

                </div>
            </div>
        </AnimatedPage>
    );
};

export default ResetPasswordPage;
