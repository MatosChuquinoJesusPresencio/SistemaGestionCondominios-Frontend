import { useState, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";

import {
  Button,
  Col,
  Row,
  Badge,
  Modal,
  Form,
  Tooltip,
  OverlayTrigger,
} from "react-bootstrap";
import {
  FaCar,
  FaTrash,
  FaInfoCircle,
  FaCheckCircle,
  FaExclamationTriangle,
  FaEdit,
  FaEye,
} from "react-icons/fa";

import { useAuth } from "../../hooks/useAuth";
import { useData } from "../../hooks/useData";

import DashboardHeader from "../../components/dashboard/DashboardHeader";
import StatCard from "../../components/dashboard/StatCard";
import AnimatedPage from "../../components/animations/AnimatedPage";
import AuthInput from "../../components/auth/AuthInput";
import SearchBar from "../../components/ui/SearchBar";
import MainTable from "../../components/ui/MainTable";
import NoCondoWarning from "../../components/ui/NoCondoWarning";
import { usePagination } from "../../hooks/usePagination";

const ACEstacionamientosPage = () => {
  const { authUser } = useAuth();
  const { getTable, updateTable } = useData();

  const estacionamientos = getTable("estacionamientos");
  const apartamentos = getTable("apartamentos");
  const pisos = getTable("pisos");
  const torres = getTable("torres");
  const usuarios = getTable("usuarios");
  const vehiculos = getTable("vehiculos");
  const condominio = getTable("condominios").find(
    (c) => c.id === authUser?.id_condominio,
  );

  if (!condominio) return <NoCondoWarning />;

  const [searchTerm, setSearchTerm] = useState("");
  const [towerFilter, setTowerFilter] = useState("all");

  const [showFormModal, setShowFormModal] = useState(false);
  const [showVehiclesModal, setShowVehiclesModal] = useState(false);
  const [editingEstacionamiento, setEditingEstacionamiento] = useState(null);
  const [selectedEstacionamiento, setSelectedEstacionamiento] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const configuraciones = getTable("configuraciones");
  const config = useMemo(
    () =>
      configuraciones.find((c) => c.id_condominio === authUser?.id_condominio),
    [configuraciones, authUser],
  );

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [estacionamientoToDelete, setEstacionamientoToDelete] = useState(null);

  const torresCondo = useMemo(() => {
    if (!authUser?.id_condominio) return [];
    return torres.filter((t) => t.id_condominio === authUser.id_condominio);
  }, [torres, authUser]);

  const torresIds = useMemo(() => torresCondo.map((t) => t.id), [torresCondo]);
  const pisosIds = useMemo(
    () => pisos.filter((p) => torresIds.includes(p.id_torre)).map((p) => p.id),
    [pisos, torresIds],
  );

  const apartamentosCondo = useMemo(
    () => apartamentos.filter((a) => pisosIds.includes(a.id_piso)),
    [apartamentos, pisosIds],
  );

  const estacionamientosCondo = useMemo(() => {
    const aptosIds = apartamentosCondo.map((a) => a.id);

    return estacionamientos
      .filter((e) => aptosIds.includes(e.id_apartamento))
      .map((e) => {
        const apto = apartamentos.find((a) => a.id === e.id_apartamento);
        const piso = pisos.find((p) => p.id === apto?.id_piso);
        const torre = torres.find((t) => t.id === piso?.id_torre);
        const owner = usuarios.find((u) => u.id === apto?.id_usuario);

        const residents = getTable("inquilinos_temporales").filter(
          (i) => i.id_apartamento === e.id_apartamento,
        );
        const residentIds = residents.map((r) => r.id);

        const ownerVehicles = owner
          ? vehiculos.filter((v) => v.id_usuario === owner.id)
          : [];
        const residentVehicles = vehiculos.filter((v) =>
          residentIds.includes(v.id_inquilino_temporal),
        );

        const allVehicles = [...ownerVehicles, ...residentVehicles];

        const isFull =
          e.cantidad_vehiculos > 0 &&
          ((e.tipo_vehiculo === "Auto" &&
            e.cantidad_vehiculos >= (config?.max_autos || 0)) ||
            (e.tipo_vehiculo === "Moto" &&
              e.cantidad_vehiculos >= (config?.max_motos || 0)));

        return {
          ...e,
          ocupado: isFull,
          aptoNumero: apto?.numero,
          torreNombre: torre?.nombre,
          ownerName: owner?.nombre || "Sin Propietario",
          ownerVehicles: allVehicles,
        };
      });
  }, [
    estacionamientos,
    apartamentosCondo,
    apartamentos,
    pisos,
    torres,
    usuarios,
    vehiculos,
    config,
  ]);

  const stats = useMemo(
    () => ({
      total: estacionamientosCondo.length,
      ocupados: estacionamientosCondo.filter((e) => e.ocupado).length,
      disponibles: estacionamientosCondo.filter((e) => !e.ocupado).length,
      conVehiculos: estacionamientosCondo.filter(
        (e) => e.cantidad_vehiculos > 0,
      ).length,
    }),
    [estacionamientosCondo],
  );

  const filteredEstacionamientos = useMemo(() => {
    return estacionamientosCondo.filter((e) => {
      const matchesSearch =
        e.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.aptoNumero.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.ownerName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTower =
        towerFilter === "all" || e.torreNombre === towerFilter;

      return matchesSearch && matchesTower;
    });
  }, [estacionamientosCondo, searchTerm, towerFilter]);

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData,
    itemsPerPage,
  } = usePagination(filteredEstacionamientos);

  const handleOpenCreate = () => {
    setEditingEstacionamiento(null);
    reset({
      numero: "",
      id_apartamento: "",
    });
    setShowFormModal(true);
  };

  const handleOpenEdit = (est) => {
    if (est.cantidad_vehiculos > 0) return;
    setEditingEstacionamiento(est);
    reset({
      numero: est.numero,
      id_apartamento: est.id_apartamento,
    });
    setShowFormModal(true);
  };

  const handleOpenVehicles = (est) => {
    setSelectedEstacionamiento(est);
    setShowVehiclesModal(true);
  };

  const handleOpenDelete = (est) => {
    if (est.cantidad_vehiculos > 0) return;
    setEstacionamientoToDelete(est);
    setShowDeleteModal(true);
  };

  const onSubmit = (data) => {
    const aptoId = parseInt(data.id_apartamento);
    if (editingEstacionamiento) {
      const updated = estacionamientos.map((e) =>
        e.id === editingEstacionamiento.id
          ? {
              ...e,
              numero: data.numero,
              id_apartamento: aptoId,
            }
          : e,
      );
      updateTable("estacionamientos", updated);
    } else {
      const newId =
        estacionamientos.length > 0
          ? Math.max(...estacionamientos.map((e) => e.id)) + 1
          : 1;
      const newEst = {
        id: newId,
        numero: data.numero,
        id_apartamento: aptoId,
        tipo_vehiculo: "Auto",
        cantidad_vehiculos: 0,
        ocupado: false,
      };
      updateTable("estacionamientos", [...estacionamientos, newEst]);
    }
    setShowFormModal(false);
  };

  const confirmDelete = () => {
    if (estacionamientoToDelete) {
      const updated = estacionamientos.filter(
        (e) => e.id !== estacionamientoToDelete.id,
      );
      updateTable("estacionamientos", updated);
      setShowDeleteModal(false);
      setEstacionamientoToDelete(null);
    }
  };

  return (
    <AnimatedPage>
      <div className="page-container">
        <DashboardHeader
          icon={FaCar}
          title="Gestión de Estacionamientos"
          badgeText={condominio?.nombre || "Condominio"}
          welcomeText="Administra los espacios de parqueo, asígnatos a unidades y visualiza la ocupación vehicular."
        >
          <Button
            className="btn-primary-theme btn-action"
            onClick={handleOpenCreate}
          >
            <FaCar />
            <span>Nuevo Estacionamiento</span>
          </Button>
        </DashboardHeader>

        <Row className="g-4 mb-5">
          <StatCard
            icon={FaCar}
            label="Total Espacios"
            value={stats.total}
            colorClass="primary-theme"
          />
          <StatCard
            icon={FaCheckCircle}
            label="Ocupados"
            value={stats.ocupados}
            colorClass="primary-theme"
          />
          <StatCard
            icon={FaInfoCircle}
            label="Disponibles"
            value={stats.disponibles}
            colorClass="primary-theme"
          />
          <StatCard
            icon={FaExclamationTriangle}
            label="Con Vehículos"
            value={stats.conVehiculos}
            colorClass="primary-theme"
          />
        </Row>

        <MainTable
          headers={[
            "#",
            "Nro. Estacionamiento",
            "Unidad Asignada",
            "Propietario",
            "Estado",
            "Vehículos",
            "Acciones",
          ]}
          isEmpty={paginatedData.length === 0}
          emptyMessage="No se encontraron estacionamientos."
          emptyIcon={FaCar}
          searchBar={
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              placeholder="Buscar por número, apto o propietario..."
              filterValue={towerFilter}
              onFilterChange={setTowerFilter}
              filterOptions={[
                { value: "all", label: "Todas las Torres" },
                ...torresCondo.map((t) => ({
                  value: t.nombre,
                  label: t.nombre,
                })),
              ]}
              colSize={{ search: 5, filter: 3 }}
            />
          }
          paginationProps={{
            currentPage: currentPage,
            totalPages: totalPages,
            onPageChange: setCurrentPage,
            totalItems: filteredEstacionamientos.length,
            itemsShowing: paginatedData.length,
          }}
        >
          {paginatedData.map((est, index) => {
            const actualIndex = (currentPage - 1) * itemsPerPage + index + 1;
            return (
              <tr key={est.id} className="border-bottom border-light">
                <td className="px-4 py-3 text-center">
                  <span className="text-secondary fw-bold">
                    {actualIndex.toString().padStart(2, "0")}
                  </span>
                </td>
                <td className="py-3">
                  <div className="fw-bold text-dark">{est.numero}</div>
                  <div className="x-small text-muted">
                    {est.cantidad_vehiculos > 0
                      ? est.tipo_vehiculo
                      : "Sin vehículos"}
                  </div>
                </td>
                <td className="py-3">
                  <Badge
                    bg="light"
                    className="text-primary-theme border border-primary border-opacity-10 rounded-pill px-3 fw-medium"
                  >
                    Apto {est.aptoNumero}
                  </Badge>
                  <div className="x-small text-muted mt-1 ms-2">
                    {est.torreNombre}
                  </div>
                </td>
                <td className="py-3">
                  <div className="small fw-medium text-secondary">
                    {est.ownerName}
                  </div>
                </td>
                <td className="py-3">
                  <Badge
                    bg={est.ocupado ? "danger" : "success"}
                    className={`rounded-pill px-3 fw-normal ${est.ocupado ? "bg-opacity-10 text-danger border border-danger border-opacity-25" : "bg-opacity-10 text-success border border-success border-opacity-25"}`}
                  >
                    {est.ocupado ? "Ocupado" : "Disponible"}
                  </Badge>
                </td>
                <td className="py-3 text-center">
                    <div className="text-center">
                      {est.cantidad_vehiculos > 0 ? (
                        <>
                          <span className="fw-bold text-primary-theme">
                            {est.cantidad_vehiculos}
                          </span>
                          <span className="text-muted x-small">
                            {" "}
                            /{" "}
                            {est.tipo_vehiculo === "Auto"
                              ? config?.max_autos || "-"
                              : config?.max_motos || "-"}
                          </span>
                        </>
                      ) : (
                        <span className="text-muted fw-bold">0</span>
                      )}
                    </div>
                </td>
                <td className="px-4 py-3 text-end">
                  <div className="d-flex justify-content-end gap-2">
                    <OverlayTrigger overlay={<Tooltip>Ver Vehículos</Tooltip>}>
                      <Button
                        variant="light"
                        className="btn btn-sm btn-primary-theme btn-action-sm"
                        onClick={() => handleOpenVehicles(est)}
                        disabled={est.cantidad_vehiculos === 0}
                      >
                        <FaEye /> <span>Detalles</span>
                      </Button>
                    </OverlayTrigger>
                    <OverlayTrigger
                      overlay={
                        <Tooltip>
                          {est.cantidad_vehiculos > 0
                            ? "No se puede editar con vehículos"
                            : "Editar"}
                        </Tooltip>
                      }
                    >
                      <span className="d-inline-block">
                        <Button
                          variant="light"
                          className="btn btn-sm btn-primary-theme btn-action-sm"
                          onClick={() => handleOpenEdit(est)}
                          disabled={est.cantidad_vehiculos > 0}
                          style={
                            est.cantidad_vehiculos > 0
                              ? { pointerEvents: "none" }
                              : {}
                          }
                        >
                          <FaEdit /> <span>Editar</span>
                        </Button>
                      </span>
                    </OverlayTrigger>
                    <OverlayTrigger
                      overlay={
                        <Tooltip>
                          {est.cantidad_vehiculos > 0
                            ? "No se puede eliminar con vehículos"
                            : "Eliminar"}
                        </Tooltip>
                      }
                    >
                      <span className="d-inline-block">
                        <Button
                          variant="light"
                          className="btn btn-sm btn-primary-theme btn-action-sm"
                          onClick={() => handleOpenDelete(est)}
                          disabled={est.cantidad_vehiculos > 0}
                          style={
                            est.cantidad_vehiculos > 0
                              ? { pointerEvents: "none" }
                              : {}
                          }
                        >
                          <FaTrash /> <span>Eliminar</span>
                        </Button>
                      </span>
                    </OverlayTrigger>
                  </div>
                </td>
              </tr>
            );
          })}
        </MainTable>
      </div>

      <Modal
        show={showFormModal}
        onHide={() => setShowFormModal(false)}
        centered
      >
        <Modal.Header closeButton className="border-0 p-4 pb-0">
          <Modal.Title className="fw-bold text-primary-theme">
            {editingEstacionamiento
              ? "Editar Estacionamiento"
              : "Nuevo Estacionamiento"}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Body className="p-4">
            <Row className="g-3">
              <Col md={12}>
                <AuthInput
                  label="Número de Estacionamiento"
                  name="numero"
                  register={register}
                  validation={{ required: "El número es requerido" }}
                  error={errors.numero}
                  placeholder="Ej: E-101"
                />
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold small text-secondary">
                    Apartamiento Asignado
                  </Form.Label>
                  <Form.Select
                    {...register("id_apartamento", {
                      required: "Debe asignar un apartamento",
                    })}
                    isInvalid={!!errors.id_apartamento}
                    className="rounded-pill border-light bg-light"
                  >
                    <option value="">Seleccionar apartamento...</option>
                    {apartamentosCondo.map((a) => (
                      <option key={a.id} value={a.id}>
                        Apto {a.numero} -{" "}
                        {
                          torres.find(
                            (t) =>
                              t.id ===
                              pisos.find((p) => p.id === a.id_piso)?.id_torre,
                          )?.nombre
                        }
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.id_apartamento?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer className="border-0 p-4 pt-0">
            <Button
              variant="light"
              onClick={() => setShowFormModal(false)}
              className="rounded-pill px-4"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="btn-primary-theme rounded-pill px-4"
            >
              {editingEstacionamiento
                ? "Guardar Cambios"
                : "Crear Estacionamiento"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal
        show={showVehiclesModal}
        onHide={() => setShowVehiclesModal(false)}
        centered
        size="md"
      >
        <Modal.Header closeButton className="border-0 p-4 pb-0">
          <Modal.Title className="fw-bold text-primary-theme d-flex align-items-center gap-2">
            <FaCar /> Vehículos en {selectedEstacionamiento?.numero}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <div className="mb-3">
            <span className="text-muted small">Propietario: </span>
            <span className="fw-bold text-dark">
              {selectedEstacionamiento?.ownerName}
            </span>
          </div>
          <div className="bg-light rounded-4 p-3">
            {selectedEstacionamiento?.ownerVehicles.length > 0 ? (
              <div className="d-flex flex-column gap-3">
                {selectedEstacionamiento.ownerVehicles.map((v) => (
                  <div
                    key={v.id}
                    className="d-flex align-items-center gap-3 p-2 bg-white rounded-3 border border-light shadow-sm"
                  >
                    <div className="bg-primary bg-opacity-10 p-2 rounded-3 text-primary">
                      <FaCar size={20} />
                    </div>
                    <div className="flex-grow-1">
                      <div className="fw-bold text-dark">
                        {v.marca} {v.modelo}
                      </div>
                      <div className="x-small text-muted">
                        Color: {v.color} • Placa:{" "}
                        <span className="fw-bold">{v.placa}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <FaExclamationTriangle
                  className="text-warning mb-2"
                  size={24}
                />
                <div className="text-muted small italic">
                  No hay vehículos registrados para este propietario.
                </div>
                <div className="x-small text-secondary">
                  La cantidad indicada (
                  {selectedEstacionamiento?.cantidad_vehiculos}) puede ser
                  informativa o de inquilinos.
                </div>
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer className="border-0 p-4 pt-0">
          <Button
            variant="primary-theme"
            onClick={() => setShowVehiclesModal(false)}
            className="rounded-pill px-4 w-100"
          >
            Entendido
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton className="border-0 p-4 pb-0">
          <Modal.Title className="fw-bold text-danger">
            Confirmar Eliminación
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <div className="text-center mb-4">
            <div
              className="bg-danger bg-opacity-10 text-danger rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
              style={{ width: "60px", height: "60px" }}
            >
              <FaExclamationTriangle size={30} />
            </div>
            <p className="mb-0 text-secondary fw-medium">
              ¿Estás seguro de que deseas eliminar el estacionamiento{" "}
              <span className="text-dark fw-bold">
                {estacionamientoToDelete?.numero}
              </span>
              ?
            </p>
            <p className="small text-muted mt-2">
              Esta acción no se puede deshacer.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer className="border-0 p-4 pt-0 d-flex gap-2">
          <Button
            variant="light"
            onClick={() => setShowDeleteModal(false)}
            className="rounded-pill px-4 flex-grow-1"
          >
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={confirmDelete}
            className="rounded-pill px-4 flex-grow-1"
          >
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </AnimatedPage>
  );
};

export default ACEstacionamientosPage;
