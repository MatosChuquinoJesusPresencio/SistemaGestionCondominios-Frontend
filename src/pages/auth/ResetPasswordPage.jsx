import { useForm } from "react-hook-form";
import { useSearchParams, Link } from "react-router-dom";
import { useState, useRef } from "react";
import AnimatedPage from "../../components/animations/AnimatedPage";
import { useAuth } from "../../hooks/useAuth";
import AuthCard from "../../components/auth/AuthCard";
import AuthLogo from "../../components/auth/AuthLogo";
import AuthInput from "../../components/auth/AuthInput";
import AuthButton from "../../components/auth/AuthButton";
import AuthAlert from "../../components/auth/AuthAlert";

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
                <AuthCard>
                    <AuthLogo
                        title="Nueva Contraseña"
                        subtitle={
                            isSuccess
                                ? "¡Contraseña actualizada con éxito!"
                                : "Ingresa tu nueva contraseña a continuación"
                        }
                    />

                    {isSuccess ? (
                        <div className="text-center mb-4">
                            <div className="alert alert-success border-0 rounded-4 py-3 mb-4">
                                <i className="bi bi-shield-check fs-1 d-block mb-2 text-success"></i>
                                <p className="mb-0 small">
                                    Tu contraseña ha sido restablecida. Ya puedes iniciar sesión.
                                </p>
                            </div>
                            <Link to="/login" id="btn-go-to-login" className="btn btn-primary-theme w-100 py-2 rounded-3 fw-semibold">
                                <i className="bi bi-box-arrow-in-right me-2"></i>Ir al Login
                            </Link>
                        </div>
                    ) : !tokenStatus.valid ? (
                        <div className="text-center mb-4">
                            <div className="alert alert-danger border-0 rounded-4 py-3 mb-4">
                                <i className="bi bi-x-octagon fs-1 d-block mb-2"></i>
                                <p className="mb-0 small">{tokenStatus.reason}</p>
                            </div>
                            <Link to="/forgot-password" className="btn btn-primary-theme w-100 py-2 rounded-3 fw-semibold">
                                Solicitar nuevo enlace
                            </Link>
                        </div>
                    ) : (
                        <form noValidate onSubmit={handleSubmit(onSubmit)}>
                            <AuthInput
                                label="Nueva Contraseña"
                                icon="lock"
                                type="password"
                                placeholder="Mínimo 6 caracteres"
                                register={register}
                                name="password"
                                validation={{
                                    required: "La contraseña es obligatoria",
                                    minLength: { value: 6, message: "Mínimo 6 caracteres" }
                                }}
                                error={errors.password}
                            />

                            <AuthInput
                                label="Confirmar Contraseña"
                                icon="lock"
                                type="password"
                                placeholder="Repite tu contraseña"
                                register={register}
                                name="confirmPassword"
                                validation={{
                                    required: "Confirma tu contraseña",
                                    validate: value => value === password.current || "Las contraseñas no coinciden"
                                }}
                                error={errors.confirmPassword}
                            />

                            {authError && (
                                <div className="mb-3">
                                    <AuthAlert type="danger" message={authError} onClose={clearAuthError} />
                                </div>
                            )}

                            <AuthButton
                                type="submit"
                                id="btn-reset-password"
                                text="Cambiar contraseña"
                                loadingText="Restableciendo..."
                                loading={authLoading}
                            />

                            <div className="text-center">
                                <Link to="/login" className="btn btn-link p-0 text-decoration-none small fw-semibold forgot-password-link">
                                    Volver al inicio de sesión
                                </Link>
                            </div>
                        </form>
                    )}
                </AuthCard>
            </div>
        </AnimatedPage>
    );
};

export default ResetPasswordPage;