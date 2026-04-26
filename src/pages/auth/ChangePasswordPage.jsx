import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Card, Row, Col, Button, Form } from "react-bootstrap";
import { FaLock, FaSave, FaShieldAlt, FaInfoCircle } from "react-icons/fa";

import { useAuth } from "../../hooks/useAuth";
import { useData } from "../../hooks/useData";

import AnimatedPage from "../../components/animations/AnimatedPage";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import AuthInput from "../../components/auth/AuthInput";
import AuthAlert from "../../components/auth/AuthAlert";

const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const { authUser } = useAuth();
  const { getTable, updateTable } = useData();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const newPassword = watch("newPassword");

  const onSubmit = async (data) => {
    setError(null);
    setLoading(true);

    try {
      const usuarios = getTable("usuarios");
      const userIndex = usuarios.findIndex((u) => u.id === authUser.id);

      if (userIndex === -1) {
        throw new Error("Usuario no encontrado en la base de datos.");
      }

      if (usuarios[userIndex].contraseña !== data.currentPassword) {
        throw new Error("La contraseña actual es incorrecta.");
      }

      const updatedUsuarios = [...usuarios];
      updatedUsuarios[userIndex] = {
        ...updatedUsuarios[userIndex],
        contraseña: data.newPassword,
      };

      updateTable("usuarios", updatedUsuarios);

      setSuccess(true);
      reset();

      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedPage>
      <div className="page-container">
        <DashboardHeader
          icon={FaLock}
          title="Configuración de Seguridad"
          badgeText="Perfil"
          welcomeText="Actualiza tus credenciales de acceso para mantener tu cuenta protegida."
        />

        <Row className="justify-content-center">
          <Col lg={6}>
            <Card className="card-custom border-0 shadow-sm overflow-hidden bg-white">
              <Card.Header className="border-0 bg-white pt-4 px-4 pb-0">
                <h5 className="fw-bold text-dark d-flex align-items-center gap-2">
                  <div className="p-2 rounded-3 bg-primary bg-opacity-10 text-primary-theme">
                    <FaShieldAlt />
                  </div>
                  Cambiar Contraseña
                </h5>
              </Card.Header>
              <Card.Body className="p-4">
                <Form noValidate onSubmit={handleSubmit(onSubmit)}>
                  <div className="p-4 rounded-4 bg-light mb-4 border border-light">
                    <div className="d-flex align-items-start gap-3">
                      <div className="p-2 rounded-circle bg-white text-info shadow-sm">
                        <FaInfoCircle />
                      </div>
                      <div>
                        <h6 className="fw-bold text-dark mb-1">
                          Recomendación
                        </h6>
                        <p className="small text-muted mb-0">
                          Usa al menos 6 caracteres y combina letras con números
                          para una mayor seguridad.
                        </p>
                      </div>
                    </div>
                  </div>

                  <AuthInput
                    label="Contraseña Actual"
                    type="password"
                    placeholder="Escribe tu contraseña actual"
                    register={register}
                    name="currentPassword"
                    validation={{
                      required: "La contraseña actual es obligatoria",
                    }}
                    error={errors.currentPassword}
                  />

                  <AuthInput
                    label="Nueva Contraseña"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    register={register}
                    name="newPassword"
                    validation={{
                      required: "La nueva contraseña es obligatoria",
                      minLength: {
                        value: 6,
                        message: "Mínimo 6 caracteres",
                      },
                    }}
                    error={errors.newPassword}
                  />

                  <AuthInput
                    label="Confirmar Nueva Contraseña"
                    type="password"
                    placeholder="Repite la nueva contraseña"
                    register={register}
                    name="confirmPassword"
                    validation={{
                      required: "Debe confirmar la nueva contraseña",
                      validate: (value) =>
                        value === newPassword || "Las contraseñas no coinciden",
                    }}
                    error={errors.confirmPassword}
                  />

                  <div className="d-grid mt-4">
                    <Button
                      type="submit"
                      className="btn-primary-theme rounded-pill py-2 fw-bold d-flex align-items-center justify-content-center gap-2 border-0"
                      disabled={loading}
                    >
                      {loading ? (
                        "Actualizando..."
                      ) : (
                        <>
                          <FaSave /> Actualizar Contraseña
                        </>
                      )}
                    </Button>
                  </div>

                  {error && (
                    <div className="mt-3">
                      <AuthAlert
                        type="danger"
                        message={error}
                        onClose={() => setError(null)}
                      />
                    </div>
                  )}

                  {success && (
                    <div className="mt-3">
                      <AuthAlert
                        type="success"
                        message="¡Contraseña actualizada con éxito! Redirigiendo al inicio..."
                      />
                    </div>
                  )}
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </AnimatedPage>
  );
};

export default ChangePasswordPage;
