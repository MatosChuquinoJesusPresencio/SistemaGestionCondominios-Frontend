import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth"

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
        <div className="container-fluid vh-100 d-flex justify-content-center align-items-center bg-main">

            <div className="card shadow p-4" style={{ width: "100%", maxWidth: "400px" }}>

                <h3 className="text-center mb-4">Iniciar Sesión</h3>

                <form noValidate onSubmit={handleSubmit(onSubmit)}>

                    <div className="mb-3">
                        <label className="form-label">Correo</label>
                        <input
                            type="email"
                            className={`form-control ${errors.email ? "is-invalid" : ""}`}
                            {...register("email", {
                                required: "El correo es obligatorio",
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: "Correo no válido"
                                }
                            })}
                        />
                        {errors.email && (
                            <div className="invalid-feedback">
                                {errors.email.message}
                            </div>
                        )}
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Contraseña</label>
                        <input
                            type="password"
                            className={`form-control ${errors.password ? "is-invalid" : ""}`}
                            {...register("password", {
                                required: "La contraseña es obligatoria",
                                minLength: {
                                    value: 6,
                                    message: "Mínimo 6 caracteres"
                                }
                            })}
                        />
                        {errors.password && (
                            <div className="invalid-feedback">
                                {errors.password.message}
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="btn w-100 text-light"
                        style={{ backgroundColor: "var(--secondary-color)", border: "none" }}
                        disabled={authLoading}
                    >
                        {authLoading ? (
                            <span className="spinner-border spinner-border-sm"></span>
                        ) : (
                            "Ingresar"
                        )}
                    </button>

                    {authError && (
                        <div className="alert alert-danger d-flex align-items-center justify-content-between mt-3 py-2">
                            <span>{authError}</span>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={clearAuthError}
                            />
                        </div>
                    )}

                </form>

            </div>
        </div>
    );
};

export default LoginPage;