import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import AnimatedPage from "../../components/animations/AnimatedPage";
import AuthCard from "../../components/auth/AuthCard";
import AuthLogo from "../../components/auth/AuthLogo";
import AuthInput from "../../components/auth/AuthInput";
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

        // 1. Limpieza de datos: Eliminamos espacios accidentales
        const cleanData = {
            ...data,
            email: data.email.trim().toLowerCase(),
            password: data.password // La contraseña no se limpia por si tiene espacios intencionales
        };

        // 2. Debug: Verificamos en consola qué estamos enviando
        console.log("Intentando login con:", cleanData);

        const result = await login(cleanData);

        if (result.success) {
            console.log("Login exitoso, redirigiendo...");
            navigate("/");
        } else {
            // Esto nos ayudará a ver si el error viene con un mensaje específico del backend
            console.error("Fallo en la autenticación:", result.message || "Credenciales incorrectas");
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
                        <AuthInput
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

                        <AuthInput
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
                                <AuthAlert 
                                    type="danger" 
                                    message={authError} 
                                    onClose={clearAuthError} 
                                />
                            </div>
                        )}
                    </form>
                </AuthCard>
            </div>
        </AnimatedPage>
    );
};

export default LoginPage;