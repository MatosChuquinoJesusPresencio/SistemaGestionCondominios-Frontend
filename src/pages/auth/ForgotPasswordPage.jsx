import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useState } from "react";
import AnimatedPage from "../../components/animations/AnimatedPage";
import { useAuth } from "../../hooks/useAuth";
import AuthCard from "../../components/auth/AuthCard";
import AuthLogo from "../../components/auth/AuthLogo";
import AuthInput from "../../components/auth/AuthInput";
import AuthButton from "../../components/auth/AuthButton";
import AuthAlert from "../../components/auth/AuthAlert";

const ForgotPasswordPage = () => {
    const { forgotPassword, authLoading, authError, clearAuthError } = useAuth();
    const [isSubmitted, setIsSubmitted] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        clearAuthError();
        const result = await forgotPassword(data.email);
        if (result.success) setIsSubmitted(true);
    };

    return (
        <AnimatedPage>
            <div className="container-fluid vh-100 d-flex justify-content-center align-items-center position-relative bg-login-image">
                <AuthCard>
                    <AuthLogo
                        title="Recuperar Contraseña"
                        subtitle={
                            isSubmitted
                                ? "Revisa tu bandeja de entrada"
                                : "Ingresa tu correo para recibir un enlace de recuperación"
                        }
                    />

                    {!isSubmitted ? (
                        <form noValidate onSubmit={handleSubmit(onSubmit)}>
                            <AuthInput
                                label="Correo Electrónico"
                                icon="envelope"
                                type="email"
                                placeholder="ejemplo@correo.com"
                                register={register}
                                name="email"
                                validation={{
                                    required: "El correo es obligatorio",
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: "Correo no válido"
                                    }
                                }}
                                error={errors.email}
                            />

                            <AuthButton
                                type="submit"
                                id="btn-send-reset-link"
                                text="Enviar enlace"
                                loadingText="Enviando..."
                                loading={authLoading}
                            />

                            {authError && (
                                <div className="mt-1">
                                    <AuthAlert type="danger" message={authError} onClose={clearAuthError} />
                                </div>
                            )}
                        </form>
                    ) : (
                        <div className="text-center mb-4">
                            <div className="alert alert-success border-0 rounded-4 py-3 mb-3">
                                <i className="bi bi-check-circle-fill fs-1 d-block mb-2 text-success"></i>
                                <p className="mb-1 small">
                                    Si el correo está registrado, recibirás las instrucciones de recuperación.
                                </p>
                            </div>
                            <p className="text-muted" style={{ fontSize: "0.75rem" }}>
                                <i className="bi bi-terminal me-1"></i>
                                Revisa la consola del navegador para ver el enlace simulado.
                            </p>
                        </div>
                    )}

                    <div className="text-center">
                        <Link to="/login" className="btn btn-link p-0 text-decoration-none small fw-semibold forgot-password-link">
                            <i className="bi bi-arrow-left me-1"></i> Volver al inicio de sesión
                        </Link>
                    </div>
                </AuthCard>
            </div>
        </AnimatedPage>
    );
};

export default ForgotPasswordPage;