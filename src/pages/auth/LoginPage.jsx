import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import AnimatedPage from "../../components/animations/AnimatedPage";
import AuthCard from "../../components/auth/AuthCard";
import AuthLogo from "../../components/auth/AuthLogo";
import FormInput from "../../components/form/FormInput";
import AuthButton from "../../components/auth/AuthButton";
import AuthAlert from "../../components/auth/AuthAlert";

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
            <div className="container-fluid vh-100 d-flex justify-content-center align-items-center position-relative bg-login-image">
                <AuthCard>
                    <AuthLogo
                        title="Bienvenido"
                        subtitle="Ingresa tus credenciales para continuar"
                    />

                    <form noValidate onSubmit={handleSubmit(onSubmit)}>
                        <FormInput
                            label="Correo Electrónico"
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

                        <FormInput
                            label="Contraseña"
                            type="password"
                            placeholder="********"
                            register={register}
                            name="password"
                            validation={{
                                required: "La contraseña es obligatoria",
                                minLength: {
                                    value: 6,
                                    message: "Mínimo 6 caracteres"
                                }
                            }}
                            error={errors.password}
                        />

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
                            <Link to="/forgot-password" className="btn btn-link p-0 text-decoration-none small fw-semibold forgot-password-link">
                                ¿Olvidaste tu contraseña?
                            </Link>
                        </div>

                        <AuthButton
                            type="submit"
                            text="Ingresar"
                            loadingText="Ingresando..."
                            loading={authLoading}
                        />

                        {authError && (
                            <div className="mt-3">
                                <AuthAlert type="danger" message={authError} onClose={clearAuthError} />
                            </div>
                        )}
                    </form>
                </AuthCard>
            </div>
        </AnimatedPage>
    );
};

export default LoginPage;