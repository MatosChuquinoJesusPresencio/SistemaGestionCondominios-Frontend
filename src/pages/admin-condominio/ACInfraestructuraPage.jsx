import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";

import {
  Card,
  Col,
  Row,
  Button,
  Modal,
  Form,
  Tabs,
  Tab,
} from "react-bootstrap";
import {
  FaBuilding,
  FaLayerGroup,
  FaHome,
  FaPlus,
  FaSave,
  FaExclamationTriangle,
} from "react-icons/fa";

import { useAuth } from "../../hooks/useAuth";
import { useData } from "../../hooks/useData";

import DashboardHeader from "../../components/dashboard/DashboardHeader";
import StatCard from "../../components/dashboard/StatCard";
import AnimatedPage from "../../components/animations/AnimatedPage";
import FormInput from "../../components/form/FormInput";
import TowerTable from "../../components/tables/TowerTable";
import FloorTable from "../../components/tables/FloorTable";
import AptoTable from "../../components/tables/AptoTable";
import NoCondoWarning from "../../components/ui/NoCondoWarning";

const ACInfraestructuraPage = () => {
  const { authUser } = useAuth();
  const { getTable, updateTable } = useData();

  const torres = getTable("torres");
  const pisos = getTable("pisos");
  const apartamentos = getTable("apartamentos");
  const usuarios = getTable("usuarios");
  const condominio = getTable("condominios").find(
    (c) => c.id === authUser?.id_condominio,
  );

  if (!condominio) return <NoCondoWarning />;

  const [activeTab, setActiveTab] = useState("torres");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const torresCondo = useMemo(() => {
    if (!authUser?.id_condominio) return [];
    return torres.filter((t) => t.id_condominio === authUser.id_condominio);
  }, [torres, authUser]);

  const pisosCondo = useMemo(
    () =>
      pisos.filter((p) => torresCondo.map((t) => t.id).includes(p.id_torre)),
    [pisos, torresCondo],
  );
  const aptosCondo = useMemo(
    () =>
      apartamentos.filter((a) =>
        pisosCondo.map((p) => p.id).includes(a.id_piso),
      ),
    [apartamentos, pisosCondo],
  );

  const propietarios = useMemo(() => {
    if (!authUser?.id_condominio) return [];
    return usuarios.filter(
      (u) =>
        u.id_rol === 3 &&
        (u.id_condominio === authUser.id_condominio || !u.id_condominio),
    );
  }, [usuarios, authUser]);

  const handleOpenModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
    if (item) {
      if (type === "torre") setValue("nombre", item.nombre);
      if (type === "piso") {
        setValue("numero_piso", item.numero_piso);
        setValue("id_torre", item.id_torre);
      }
      if (type === "apto") {
        setValue("numero", item.numero);
        setValue("metraje", item.metraje);
        setValue("id_piso", item.id_piso);
        setValue("id_usuario", item.id_usuario || "");
      }
    } else {
      reset();
    }
    setShowModal(true);
  };

  const onSubmit = (data) => {
    if (modalType === "torre") {
      if (editingItem) {
        updateTable(
          "torres",
          torres.map((t) => (t.id === editingItem.id ? { ...t, ...data } : t)),
        );
      } else {
        const newId =
          torres.length > 0 ? Math.max(...torres.map((t) => t.id)) + 1 : 1;
        updateTable("torres", [
          ...torres,
          { id: newId, id_condominio: authUser.id_condominio, ...data },
        ]);
      }
    } else if (modalType === "piso") {
      const floorData = {
        ...data,
        numero_piso: parseInt(data.numero_piso),
        id_torre: parseInt(data.id_torre),
      };
      if (editingItem) {
        updateTable(
          "pisos",
          pisos.map((p) =>
            p.id === editingItem.id ? { ...p, ...floorData } : p,
          ),
        );
      } else {
        const newId =
          pisos.length > 0 ? Math.max(...pisos.map((p) => p.id)) + 1 : 1;
        updateTable("pisos", [...pisos, { id: newId, ...floorData }]);
      }
    } else if (modalType === "apto") {
      const aptoData = {
        ...data,
        metraje: parseFloat(data.metraje),
        id_piso: parseInt(data.id_piso),
        id_usuario: data.id_usuario ? parseInt(data.id_usuario) : null,
      };
      if (editingItem) {
        updateTable(
          "apartamentos",
          apartamentos.map((a) =>
            a.id === editingItem.id ? { ...a, ...aptoData } : a,
          ),
        );
      } else {
        const newId =
          apartamentos.length > 0
            ? Math.max(...apartamentos.map((a) => a.id)) + 1
            : 1;
        updateTable("apartamentos", [
          ...apartamentos,
          { id: newId, ...aptoData },
        ]);
      }
    }
    setShowModal(false);
  };

  const handleDeleteClick = (type, item) => {
    setModalType(type);
    setItemToDelete(item);
    setShowConfirmDelete(true);
  };

  const confirmDelete = () => {
    if (modalType === "torre")
      updateTable(
        "torres",
        torres.filter((t) => t.id !== itemToDelete.id),
      );
    if (modalType === "piso")
      updateTable(
        "pisos",
        pisos.filter((p) => p.id !== itemToDelete.id),
      );
    if (modalType === "apto")
      updateTable(
        "apartamentos",
        apartamentos.filter((a) => a.id !== itemToDelete.id),
      );
    setShowConfirmDelete(false);
  };

  return (
    <AnimatedPage>
      <div className="page-container">
        <DashboardHeader
          icon={FaBuilding}
          title="Infraestructura y Unidades"
          badgeText={condominio?.nombre || "Admin"}
          welcomeText="Define la estructura de torres, pisos y apartamentos de tu condominio."
        />

        <Row className="g-4 mb-5">
          <StatCard
            icon={FaBuilding}
            label="Torres"
            value={torresCondo.length}
            colorClass="primary-theme"
          />
          <StatCard
            icon={FaLayerGroup}
            label="Pisos Totales"
            value={pisosCondo.length}
            colorClass="primary-theme"
          />
          <StatCard
            icon={FaHome}
            label="Apartamentos"
            value={aptosCondo.length}
            colorClass="primary-theme"
          />
        </Row>

        <Card className="card-custom overflow-hidden">
          <Card.Header className="bg-white border-0 pt-4 px-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-3">
              <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="custom-tabs border-0"
                variant="pills"
              >
                <Tab
                  eventKey="torres"
                  title={
                    <span>
                      <FaBuilding className="me-2" /> Torres
                    </span>
                  }
                />
                <Tab
                  eventKey="pisos"
                  title={
                    <span>
                      <FaLayerGroup className="me-2" /> Pisos
                    </span>
                  }
                />
                <Tab
                  eventKey="apartamentos"
                  title={
                    <span>
                      <FaHome className="me-2" /> Apartamentos
                    </span>
                  }
                />
              </Tabs>
              <Button
                className="btn-primary-theme rounded-pill px-4 fw-bold shadow-sm border-0 d-flex align-items-center gap-2"
                onClick={() =>
                  handleOpenModal(
                    activeTab === "torres"
                      ? "torre"
                      : activeTab === "pisos"
                        ? "piso"
                        : "apto",
                  )
                }
              >
                <FaPlus />{" "}
                {activeTab === "torres"
                  ? "Nueva Torre"
                  : activeTab === "pisos"
                    ? "Nuevo Piso"
                    : "Nuevo Apartamento"}
              </Button>
            </div>
          </Card.Header>
          <Card.Body className="p-4 pt-2">
            {activeTab === "torres" && (
              <TowerTable
                data={torresCondo}
                onEdit={(item) => handleOpenModal("torre", item)}
                onDelete={(item) => handleDeleteClick("torre", item)}
              />
            )}
            {activeTab === "pisos" && (
              <FloorTable
                data={pisosCondo}
                torres={torresCondo}
                onEdit={(item) => handleOpenModal("piso", item)}
                onDelete={(item) => handleDeleteClick("piso", item)}
              />
            )}
            {activeTab === "apartamentos" && (
              <AptoTable
                data={aptosCondo}
                pisos={pisosCondo}
                torres={torresCondo}
                usuarios={propietarios}
                onEdit={(item) => handleOpenModal("apto", item)}
                onDelete={(item) => handleDeleteClick("apto", item)}
              />
            )}
          </Card.Body>
        </Card>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="border-0 pb-0 px-4 pt-4">
          <Modal.Title className="fw-bold text-primary-theme">
            {editingItem ? "Editar" : "Crear"}{" "}
            {modalType === "torre"
              ? "Torre"
              : modalType === "piso"
                ? "Piso"
                : "Apartamento"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form onSubmit={handleSubmit(onSubmit)}>
            {modalType === "torre" && (
              <FormInput
                label="Nombre de la Torre"
                name="nombre"
                register={register}
                validation={{ required: "Requerido" }}
                error={errors.nombre}
                placeholder="Ej: Torre A, Bloque 1..."
              />
            )}

            {modalType === "piso" && (
              <>
                <FormInput
                  label="Número de Piso"
                  name="numero_piso"
                  type="number"
                  register={register}
                  validation={{ required: "Requerido" }}
                  error={errors.numero_piso}
                />
                <div className="mb-4">
                  <label className="form-label text-secondary fw-semibold small mb-1">
                    Torre
                  </label>
                  <Form.Select
                    {...register("id_torre", { required: "Requerido" })}
                    className="form-control input-no-shadow"
                  >
                    <option value="">Selecciona torre...</option>
                    {torresCondo.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.nombre}
                      </option>
                    ))}
                  </Form.Select>
                </div>
              </>
            )}

            {modalType === "apto" && (
              <>
                <FormInput
                  label="Número de Apartamento"
                  name="numero"
                  register={register}
                  validation={{ required: "Requerido" }}
                  error={errors.numero}
                  placeholder="Ej: 101, A-301..."
                />
                <Row className="g-3">
                  <Col md={6}>
                    <FormInput
                      label="Superficie (m²)"
                      type="number"
                      step="0.01"
                      name="metraje"
                      register={register}
                      validation={{ required: "Requerido" }}
                      error={errors.metraje}
                    />
                  </Col>
                  <Col md={6}>
                    <div className="mb-4">
                      <label className="form-label text-secondary fw-semibold small mb-1">
                        Piso
                      </label>
                      <Form.Select
                        {...register("id_piso", { required: "Requerido" })}
                        className="form-control input-no-shadow"
                      >
                        <option value="">Selecciona piso...</option>
                        {pisosCondo.map((p) => {
                          const t = torresCondo.find(
                            (torre) => torre.id === p.id_torre,
                          );
                          return (
                            <option key={p.id} value={p.id}>
                              {t?.nombre} - Piso {p.numero_piso}
                            </option>
                          );
                        })}
                      </Form.Select>
                    </div>
                  </Col>
                </Row>
                <div className="mb-4">
                  <label className="form-label text-secondary fw-semibold small mb-1">
                    Propietario
                  </label>
                  <Form.Select
                    {...register("id_usuario")}
                    className="form-control input-no-shadow"
                  >
                    <option value="">Sin asignar</option>
                    {propietarios.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.nombre}
                      </option>
                    ))}
                  </Form.Select>
                </div>
              </>
            )}

            <div className="d-flex justify-content-end gap-2 mt-4">
              <Button
                variant="light"
                onClick={() => setShowModal(false)}
                className="rounded-pill px-4 fw-bold text-secondary border-0"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="btn-primary-theme rounded-pill px-4 fw-bold shadow-sm border-0"
              >
                <FaSave className="me-2" /> Guardar
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal
        show={showConfirmDelete}
        onHide={() => setShowConfirmDelete(false)}
        centered
        size="sm"
      >
        <Modal.Body className="text-center p-4">
          <FaExclamationTriangle size={40} className="text-danger mb-3" />
          <h5 className="fw-bold text-dark">¿Confirmar eliminación?</h5>
          <p className="text-secondary small">
            Esta acción es irreversible y podría afectar a elementos vinculados.
          </p>
          <div className="d-flex justify-content-center gap-2 mt-3">
            <Button
              variant="light"
              onClick={() => setShowConfirmDelete(false)}
              className="rounded-pill px-3 small fw-bold"
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={confirmDelete}
              className="rounded-pill px-3 small fw-bold shadow-sm border-0"
            >
              Eliminar
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </AnimatedPage>
  );
};

export default ACInfraestructuraPage;
