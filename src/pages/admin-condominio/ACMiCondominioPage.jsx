import { useState } from "react";
import { useForm } from "react-hook-form";

import { Modal, Button, Card, Row, Col, Form } from "react-bootstrap";

import {
  FaBuilding,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaCog,
  FaPlusCircle,
  FaUsers,
  FaTools,
  FaExclamationTriangle,
  FaInfoCircle,
  FaEdit,
  FaSave,
  FaTimes,
} from "react-icons/fa";

import { useAuth } from "../../hooks/useAuth";
import { useData } from "../../hooks/useData";

import DashboardHeader from "../../components/dashboard/DashboardHeader";
import StatCard from "../../components/dashboard/StatCard";
import AnimatedPage from "../../components/animations/AnimatedPage";
import FormInput from "../../components/form/FormInput";
import NoCondoWarning from "../../components/ui/NoCondoWarning";

const ACMiCondominioPage = () => {
  const { authUser } = useAuth();
  const { getTable, updateTable } = useData();
  const [showEditModal, setShowEditModal] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const condominio = getTable("condominios").find(
    (c) => c.id === authUser?.id_condominio,
  );
  const configuraciones = getTable("configuraciones");
  const config = configuraciones.find(
    (c) => c.id_condominio === condominio?.id,
  );

  const handleShowEdit = () => {
    if (config) {
      setValue("max_autos", config.max_autos);
      setValue("max_motos", config.max_motos);
      setValue("tiempo_max_prestamo_min", config.tiempo_max_prestamo_min);
      setValue("penalizacion_por_minuto", config.penalizacion_por_minuto);
    } else {
      reset({
        max_autos: 2,
        max_motos: 2,
        tiempo_max_prestamo_min: 30,
        penalizacion_por_minuto: 0.5,
      });
    }
    setShowEditModal(true);
  };

  const onSubmit = (data) => {
    const numericData = {
      max_autos: parseInt(data.max_autos),
      max_motos: parseInt(data.max_motos),
      tiempo_max_prestamo_min: parseInt(data.tiempo_max_prestamo_min),
      penalizacion_por_minuto: parseFloat(data.penalizacion_por_minuto),
    };

    if (config) {
      const updatedConfigs = configuraciones.map((c) =>
        c.id === config.id ? { ...c, ...numericData } : c,
      );
      updateTable("configuraciones", updatedConfigs);
    } else {
      const newId =
        configuraciones.length > 0
          ? Math.max(...configuraciones.map((c) => c.id)) + 1
          : 1;
      const newConfig = {
        id: newId,
        id_condominio: condominio.id,
        ...numericData,
      };
      updateTable("configuraciones", [...configuraciones, newConfig]);
    }
    setShowEditModal(false);
  };

  if (!condominio) return <NoCondoWarning />;

  const torres = getTable("torres").filter(
    (t) => t.id_condominio === condominio.id,
  );
  const torreIds = torres.map((t) => t.id);
  const pisos = getTable("pisos").filter((p) => torreIds.includes(p.id_torre));
  const pisoIds = pisos.map((p) => p.id);
  const aptos = getTable("apartamentos").filter((a) =>
    pisoIds.includes(a.id_piso),
  );
  const usersInCondo = getTable("usuarios").filter(
    (u) => u.id_condominio === condominio.id,
  );
  const carts = getTable("carritos_carga").filter(
    (c) => c.id_condominio === condominio.id,
  );

  return (
    <AnimatedPage>
      <div className="page-container">
        <DashboardHeader
          icon={FaBuilding}
          title="Mi Condominio"
          badgeText="Administrador"
          welcomeText={`Gestión y vista general de ${condominio.nombre}.`}
        />

        <div className="row g-4 mb-5">
          <StatCard
            icon={FaBuilding}
            label="Torres / Bloques"
            value={torres.length}
            colorClass="primary-theme"
          />
          <StatCard
            icon={FaPlusCircle}
            label="Total Apartamentos"
            value={aptos.length}
            colorClass="primary-theme"
          />
          <StatCard
            icon={FaUsers}
            label="Usuarios Registrados"
            value={usersInCondo.length}
            colorClass="primary-theme"
          />
          <StatCard
            icon={FaTools}
            label="Carritos de Carga"
            value={carts.length}
            colorClass="primary-theme"
          />
        </div>

        <div className="row g-4">
          <Col lg={5}>
            <Card className="card-custom h-100 overflow-hidden bg-white">
              <Card.Header className="border-0 bg-white pt-4 px-4 pb-0">
                <h5 className="fw-bold text-dark d-flex align-items-center gap-2">
                  <div className="p-2 rounded-3 bg-primary bg-opacity-10 text-primary">
                    <FaInfoCircle />
                  </div>
                  Información General
                </h5>
              </Card.Header>
              <Card.Body className="p-4">
                <div className="p-4 rounded-4 bg-light mb-4">
                  <h3 className="fw-bold text-primary-theme mb-1">
                    {condominio.nombre}
                  </h3>
                  <p className="text-secondary mb-3 d-flex align-items-center gap-2">
                    <FaMapMarkerAlt className="text-danger opacity-75" />
                    {condominio.direccion}, {condominio.ciudad} (
                    {condominio.pais})
                  </p>
                  <div className="badge bg-white text-dark border px-3 py-2 rounded-pill shadow-sm small fw-bold">
                    <FaCalendarAlt className="me-2 text-primary" />
                    Registrado el{" "}
                    {new Date(condominio.fecha_creacion).toLocaleDateString(
                      "es-ES",
                      { day: "2-digit", month: "long", year: "numeric" },
                    )}
                  </div>
                </div>

                <h6 className="text-muted small text-uppercase fw-bold mb-3 ls-1">
                  Detalles de Infraestructura
                </h6>
                <div className="list-group list-group-flush bg-transparent">
                  <div className="list-group-item bg-transparent px-0 border-light d-flex justify-content-between align-items-center">
                    <span className="text-secondary small">Total de Pisos</span>
                    <span className="fw-bold text-dark">{pisos.length}</span>
                  </div>
                  <div className="list-group-item bg-transparent px-0 border-light d-flex justify-content-between align-items-center">
                    <span className="text-secondary small">
                      Apartamentos Activos
                    </span>
                    <span className="fw-bold text-dark">{aptos.length}</span>
                  </div>
                  <div className="list-group-item bg-transparent px-0 border-light d-flex justify-content-between align-items-center">
                    <span className="text-secondary small">
                      Puntos de Acceso Vehicular
                    </span>
                    <span className="fw-bold text-dark">
                      2 (Entrada/Salida)
                    </span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={7}>
            <Card className="card-custom h-100 overflow-hidden bg-white">
              <Card.Header className="border-0 bg-white pt-4 px-4 pb-0">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="fw-bold text-dark d-flex align-items-center gap-2">
                    <div className="p-2 rounded-3 bg-warning bg-opacity-10 text-warning">
                      <FaCog />
                    </div>
                    Configuración del Sistema
                  </h5>
                  <button
                    className="btn btn-sm btn-light rounded-pill px-3 fw-bold text-primary transition-all border shadow-sm d-flex align-items-center gap-2"
                    onClick={handleShowEdit}
                  >
                    <FaEdit size={14} /> {config ? "Editar" : "Configurar"}
                  </button>
                </div>
              </Card.Header>
              <Card.Body className="p-4">
                {config ? (
                  <div className="row g-4">
                    <Col md={6}>
                      <div className="p-4 rounded-4 border bg-white shadow-sm hover-up transition-all h-100">
                        <div className="text-muted small text-uppercase fw-bold mb-3">
                          Límites de Vehículos
                        </div>
                        <div className="row text-center">
                          <Col>
                            <div className="fs-3 fw-bold text-dark">
                              {config.max_autos}
                            </div>
                            <div className="x-small text-muted fw-bold">
                              AUTOS
                            </div>
                          </Col>
                          <div className="vr p-0 opacity-10"></div>
                          <Col>
                            <div className="fs-3 fw-bold text-dark">
                              {config.max_motos}
                            </div>
                            <div className="x-small text-muted fw-bold">
                              MOTOS
                            </div>
                          </Col>
                        </div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="p-4 rounded-4 border bg-white shadow-sm hover-up transition-all h-100">
                        <div className="text-muted small text-uppercase fw-bold mb-3">
                          Servicio de Carritos
                        </div>
                        <div className="d-flex align-items-baseline gap-2">
                          <span className="fs-3 fw-bold text-dark">
                            {config.tiempo_max_prestamo_min}
                          </span>
                          <span className="small text-muted fw-bold">
                            minutos máx.
                          </span>
                        </div>
                        <div className="mt-2 pt-2 border-top small text-secondary">
                          Penalización:{" "}
                          <strong>
                            S/ {config.penalizacion_por_minuto.toFixed(2)}
                          </strong>{" "}
                          / min.
                        </div>
                      </div>
                    </Col>
                    <Col xs={12}>
                      <div className="alert alert-info bg-info bg-opacity-10 border-info border-opacity-25 rounded-4 p-4 d-flex align-items-center gap-3 mb-0">
                        <FaInfoCircle className="text-info fs-4" />
                        <div>
                          <h6 className="fw-bold text-dark mb-1">
                            Personalización
                          </h6>
                          <p className="small text-secondary mb-0">
                            Como administrador, puedes ajustar estos parámetros
                            para que se adapten a las reglas internas de tu
                            condominio.
                          </p>
                        </div>
                      </div>
                    </Col>
                  </div>
                ) : (
                  <div className="text-center py-5">
                    <div className="p-4 rounded-circle bg-warning bg-opacity-10 text-warning d-inline-block mb-3">
                      <FaExclamationTriangle size={30} />
                    </div>
                    <h5 className="fw-bold text-dark">
                      Pendiente de Configuración
                    </h5>
                    <p className="text-secondary small px-5">
                      Establece los límites de vehículos y reglas de carritos
                      para comenzar la gestión operativa.
                    </p>
                    <Button
                      variant="warning"
                      className="rounded-pill px-4 fw-bold shadow-sm mt-2 border-0 text-white"
                      onClick={handleShowEdit}
                    >
                      Establecer Configuración
                    </Button>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </div>
      </div>

      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        centered
        className="border-0"
      >
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold text-primary-theme d-flex align-items-center gap-2">
            <div className="p-2 rounded-3 bg-warning bg-opacity-10 text-warning">
              <FaCog />
            </div>
            Configuración del Sistema
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-4">
          <Form onSubmit={handleSubmit(onSubmit)}>
            <h6 className="text-muted small text-uppercase fw-bold mb-3 ls-1">
              Límites de Estacionamiento
            </h6>
            <Row>
              <Col md={6}>
                <FormInput
                  label="Máx. Autos por Apto."
                  type="number"
                  name="max_autos"
                  register={register}
                  validation={{
                    required: "Requerido",
                    min: { value: 0, message: "Mínimo 0" },
                  }}
                  error={errors.max_autos}
                />
              </Col>
              <Col md={6}>
                <FormInput
                  label="Máx. Motos por Apto."
                  type="number"
                  name="max_motos"
                  register={register}
                  validation={{
                    required: "Requerido",
                    min: { value: 0, message: "Mínimo 0" },
                  }}
                  error={errors.max_motos}
                />
              </Col>
            </Row>

            <h6 className="text-muted small text-uppercase fw-bold mb-3 mt-2 ls-1">
              Reglas de Carritos de Carga
            </h6>
            <Row>
              <Col md={6}>
                <FormInput
                  label="Tiempo Máx (Minutos)"
                  type="number"
                  name="tiempo_max_prestamo_min"
                  register={register}
                  validation={{
                    required: "Requerido",
                    min: { value: 1, message: "Mínimo 1" },
                  }}
                  error={errors.tiempo_max_prestamo_min}
                />
              </Col>
              <Col md={6}>
                <FormInput
                  label="Penalidad por Minuto (S/)"
                  type="number"
                  step="0.01"
                  name="penalizacion_por_minuto"
                  register={register}
                  validation={{
                    required: "Requerido",
                    min: { value: 0, message: "Mínimo 0" },
                  }}
                  error={errors.penalizacion_por_minuto}
                />
              </Col>
            </Row>

            <div className="d-flex justify-content-end gap-2 mt-3">
              <Button
                variant="light"
                onClick={() => setShowEditModal(false)}
                className="rounded-pill px-4 fw-bold text-secondary border-0"
              >
                <FaTimes className="me-2" /> Cancelar
              </Button>
              <Button
                type="submit"
                className="btn-primary-theme rounded-pill px-4 fw-bold shadow-sm border-0"
              >
                <FaSave className="me-2" /> Guardar Cambios
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </AnimatedPage>
  );
};

export default ACMiCondominioPage;
