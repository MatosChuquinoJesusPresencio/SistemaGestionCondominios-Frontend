import { useState, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";

import { Button, Col, Row, Badge, Modal, Form } from "react-bootstrap";
import {
  FaShoppingCart,
  FaTrash,
  FaInfoCircle,
  FaCheckCircle,
  FaExclamationTriangle,
  FaEdit,
  FaTools,
  FaPlusCircle,
  FaEye,
  FaUser,
  FaClock,
} from "react-icons/fa";

import { useAuth } from "../../hooks/useAuth";
import { useData } from "../../hooks/useData";

import DashboardHeader from "../../components/dashboard/DashboardHeader";
import StatCard from "../../components/dashboard/StatCard";
import AnimatedPage from "../../components/animations/AnimatedPage";
import FormInput from "../../components/form/FormInput";
import SearchBar from "../../components/ui/SearchBar";
import MainTable from "../../components/ui/MainTable";
import NoCondoWarning from "../../components/ui/NoCondoWarning";
import { usePagination } from "../../hooks/usePagination";

const ACCarritosPage = () => {
  const { authUser } = useAuth();
  const { getTable, updateTable } = useData();

  const carritos = getTable("carritos_carga");
  const logsPrestamos = getTable("logs_prestamo_carrito");
  const usuarios = getTable("usuarios");
  const apartamentos = getTable("apartamentos");
  const inquilinos = getTable("inquilinos_temporales");
  const configuraciones = getTable("configuraciones");

  const condominio = getTable("condominios").find(
    (c) => c.id === authUser?.id_condominio,
  );

  const config = useMemo(
    () =>
      configuraciones.find((c) => c.id_condominio === authUser?.id_condominio),
    [configuraciones, authUser],
  );

  if (!condominio) return <NoCondoWarning />;

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [editingCarrito, setEditingCarrito] = useState(null);
  const [carritoToDelete, setCarritoToDelete] = useState(null);
  const [selectedCarrito, setSelectedCarrito] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const carritosCondo = useMemo(() => {
    return carritos
      .filter((c) => c.id_condominio === condominio.id)
      .map((c) => {
        const activeLoan = logsPrestamos.find(
          (log) => log.id_carrito === c.id && log.fecha_salida === null,
        );

        let currentUser = null;
        let fine = 0;

        if (activeLoan) {
          if (activeLoan.id_usuario) {
            currentUser = usuarios.find((u) => u.id === activeLoan.id_usuario);
          } else if (activeLoan.id_inquilino_temporal) {
            currentUser = inquilinos.find(
              (i) => i.id === activeLoan.id_inquilino_temporal,
            );
          }
          const apto = apartamentos.find(
            (a) => a.id === activeLoan.id_apartamento,
          );

          // Calculate real-time fine
          if (config) {
            const startDate = new Date(activeLoan.fecha_entrada);
            const diffMs = now - startDate;
            const diffMins = Math.floor(diffMs / 60000);

            if (diffMins > config.tiempo_max_prestamo_min) {
              fine =
                (diffMins - config.tiempo_max_prestamo_min) *
                config.penalizacion_por_minuto;
            }
          }

          currentUser = {
            ...currentUser,
            aptoNumero: apto?.numero,
            fechaEntrada: activeLoan.fecha_entrada,
            solicitante: activeLoan.solicitante,
            fine,
          };
        }

        return {
          ...c,
          currentUser,
          activeLoan,
          fine,
        };
      });
  }, [
    carritos,
    condominio,
    logsPrestamos,
    usuarios,
    apartamentos,
    inquilinos,
    config,
    now,
  ]);

  const stats = useMemo(
    () => ({
      total: carritosCondo.length,
      disponibles: carritosCondo.filter((c) => c.estado === "Disponible")
        .length,
      enUso: carritosCondo.filter((c) => c.estado === "En uso").length,
      mantenimiento: carritosCondo.filter((c) => c.estado === "Mantenimiento")
        .length,
    }),
    [carritosCondo],
  );

  const filteredCarritos = useMemo(() => {
    return carritosCondo.filter((c) => {
      const matchesSearch = c.codigo
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || c.estado === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [carritosCondo, searchTerm, statusFilter]);

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData,
    itemsPerPage,
  } = usePagination(filteredCarritos);

  const handleOpenCreate = () => {
    setEditingCarrito(null);
    reset({
      codigo: "",
      estado: "Disponible",
    });
    setShowFormModal(true);
  };

  const handleOpenEdit = (carrito) => {
    setEditingCarrito(carrito);
    reset({
      codigo: carrito.codigo,
      estado: carrito.estado,
    });
    setShowFormModal(true);
  };

  const handleOpenDetails = (carrito) => {
    setSelectedCarrito(carrito);
    setShowDetailsModal(true);
  };

  const handleOpenDelete = (carrito) => {
    if (carrito.estado === "En uso") return;
    setCarritoToDelete(carrito);
    setShowDeleteModal(true);
  };

  const onSubmit = (data) => {
    if (editingCarrito) {
      const updated = carritos.map((c) =>
        c.id === editingCarrito.id
          ? {
            ...c,
            codigo: data.codigo,
            estado: data.estado,
          }
          : c,
      );
      updateTable("carritos_carga", updated);
    } else {
      const newId =
        carritos.length > 0 ? Math.max(...carritos.map((c) => c.id)) + 1 : 1;
      const newCarrito = {
        id: newId,
        id_condominio: condominio.id,
        codigo: data.codigo,
        estado: data.estado,
      };
      updateTable("carritos_carga", [...carritos, newCarrito]);
    }
    setShowFormModal(false);
  };

  const confirmDelete = () => {
    if (carritoToDelete) {
      const updated = carritos.filter((c) => c.id !== carritoToDelete.id);
      updateTable("carritos_carga", updated);
      setShowDeleteModal(false);
      setCarritoToDelete(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Disponible":
        return (
          <Badge
            bg="success"
            className="bg-opacity-10 text-success border border-success border-opacity-25 rounded-pill px-3 fw-normal"
          >
            Disponible
          </Badge>
        );
      case "En uso":
        return (
          <Badge
            bg="primary"
            className="bg-opacity-10 text-primary border border-primary border-opacity-25 rounded-pill px-3 fw-normal"
          >
            En uso
          </Badge>
        );
      case "Mantenimiento":
        return (
          <Badge
            bg="warning"
            className="bg-opacity-10 text-warning border border-warning border-opacity-25 rounded-pill px-3 fw-normal"
          >
            Mantenimiento
          </Badge>
        );
      default:
        return (
          <Badge bg="secondary" className="rounded-pill px-3 fw-normal">
            {status}
          </Badge>
        );
    }
  };

  return (
    <AnimatedPage>
      <div className="page-container">
        <DashboardHeader
          icon={FaShoppingCart}
          title="Gestión de Carritos de Carga"
          badgeText={condominio?.nombre || "Condominio"}
          welcomeText="Administra la flota de carritos disponibles para los residentes y monitorea su estado operativo."
        >
          <Button
            className="btn-primary-theme btn-action"
            onClick={handleOpenCreate}
          >
            <FaPlusCircle />
            <span>Nuevo Carrito</span>
          </Button>
        </DashboardHeader>

        <Row className="g-4 mb-5">
          <StatCard
            icon={FaShoppingCart}
            label="Total Carritos"
            value={stats.total}
            colorClass="primary-theme"
          />
          <StatCard
            icon={FaCheckCircle}
            label="Disponibles"
            value={stats.disponibles}
            colorClass="primary-theme"
          />
          <StatCard
            icon={FaInfoCircle}
            label="En Uso"
            value={stats.enUso}
            colorClass="primary-theme"
          />
          <StatCard
            icon={FaTools}
            label="En Mantenimiento"
            value={stats.mantenimiento}
            colorClass="primary-theme"
          />
        </Row>

        <MainTable
          headers={[
            "#",
            "Código de Carrito",
            "Estado Actual",
            "Usuario Actual",
            "Multa (S/)",
            "Acciones",
          ]}
          isEmpty={paginatedData.length === 0}
          emptyMessage="No se encontraron carritos registrados."
          emptyIcon={FaShoppingCart}
          searchBar={
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              placeholder="Buscar por código (Ej: C001)..."
              filterValue={statusFilter}
              onFilterChange={setStatusFilter}
              filterOptions={[
                { value: "all", label: "Todos los Estados" },
                { value: "Disponible", label: "Disponible" },
                { value: "En uso", label: "En uso" },
                { value: "Mantenimiento", label: "Mantenimiento" },
              ]}
              colSize={{ search: 5, filter: 3 }}
            />
          }
          paginationProps={{
            currentPage: currentPage,
            totalPages: totalPages,
            onPageChange: setCurrentPage,
            totalItems: filteredCarritos.length,
            itemsShowing: paginatedData.length,
          }}
        >
          {paginatedData.map((carrito, index) => {
            const actualIndex = (currentPage - 1) * itemsPerPage + index + 1;
            return (
              <tr key={carrito.id} className="border-bottom border-light">
                <td className="px-4 py-3 text-center">
                  <span className="text-secondary fw-bold">
                    {actualIndex.toString().padStart(2, "0")}
                  </span>
                </td>
                <td className="py-3">
                  <div className="d-flex align-items-center gap-3">
                    <div className="p-2 rounded-3 bg-light text-primary-theme">
                      <FaShoppingCart />
                    </div>
                    <div>
                      <div className="fw-bold text-dark">{carrito.codigo}</div>
                      <div className="x-small text-muted">ID: {carrito.id}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3">{getStatusBadge(carrito.estado)}</td>
                <td className="py-3">
                  {carrito.currentUser ? (
                    <div>
                      <div className="small fw-bold text-dark">
                        {carrito.currentUser.nombre}
                      </div>
                      <div className="x-small text-muted">
                        Apto {carrito.currentUser.aptoNumero}
                      </div>
                    </div>
                  ) : (
                    <span className="text-muted small">—</span>
                  )}
                </td>
                <td className="py-3">
                  {carrito.fine > 0 ? (
                    <Badge
                      bg="danger"
                      className="bg-opacity-10 text-danger border border-danger border-opacity-25 rounded-pill px-3 fw-bold"
                    >
                      S/. {carrito.fine.toFixed(2)}
                    </Badge>
                  ) : (
                    <span className="text-muted small">S/ 0.00</span>
                  )}
                </td>
                <td className="px-4 py-3 text-end">
                  <div className="d-flex justify-content-end gap-2">
                    <Button
                      variant="light"
                      className="btn btn-sm btn-primary-theme btn-action-sm"
                      onClick={() => handleOpenDetails(carrito)}
                      disabled={!carrito.currentUser}
                    >
                      <FaEye /> <span>Detalles</span>
                    </Button>

                    <Button
                      variant="light"
                      className="btn btn-sm btn-primary-theme btn-action-sm"
                      onClick={() => handleOpenEdit(carrito)}
                    >
                      <FaEdit /> <span>Editar</span>
                    </Button>

                    <Button
                      variant="light"
                      className="btn btn-sm btn-primary-theme btn-action-sm"
                      onClick={() => handleOpenDelete(carrito)}
                      disabled={carrito.estado === "En uso"}
                      style={
                        carrito.estado === "En uso"
                          ? { pointerEvents: "none" }
                          : {}
                      }
                    >
                      <FaTrash /> <span>Eliminar</span>
                    </Button>
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
            {editingCarrito ? "Editar Carrito" : "Nuevo Carrito"}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Body className="p-4">
            <Row className="g-3">
              <Col md={12}>
                <FormInput
                  label="Código del Carrito"
                  name="codigo"
                  register={register}
                  validation={{ required: "El código es requerido" }}
                  error={errors.codigo}
                  placeholder="Ej: C-101"
                />
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold small text-secondary">
                    Estado Inicial
                  </Form.Label>
                  <Form.Select
                    {...register("estado", {
                      required: "El estado es requerido",
                    })}
                    isInvalid={!!errors.estado}
                    className="rounded-pill border-light bg-light"
                  >
                    <option value="Disponible">Disponible</option>
                    <option value="En uso">En uso</option>
                    <option value="Mantenimiento">Mantenimiento</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.estado?.message}
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
              {editingCarrito ? "Guardar Cambios" : "Crear Carrito"}
            </Button>
          </Modal.Footer>
        </Form>
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
              ¿Estás seguro de que deseas eliminar el carrito{" "}
              <span className="text-dark fw-bold">
                {carritoToDelete?.codigo}
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

      <Modal
        show={showDetailsModal}
        onHide={() => setShowDetailsModal(false)}
        centered
        size="md"
      >
        <Modal.Header closeButton className="border-0 p-4 pb-0">
          <Modal.Title className="fw-bold text-primary-theme d-flex align-items-center gap-2">
            <FaInfoCircle /> Detalle de Uso
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <div className="mb-4 d-flex align-items-center gap-3 p-3 bg-light rounded-4">
            <div className="p-3 bg-white rounded-3 shadow-sm text-primary-theme">
              <FaShoppingCart size={24} />
            </div>
            <div>
              <div className="fw-bold text-dark">
                Carrito {selectedCarrito?.codigo}
              </div>
              <div className="small text-muted">
                ID Sistema: {selectedCarrito?.id}
              </div>
            </div>
          </div>

          {selectedCarrito?.currentUser ? (
            <div className="d-flex flex-column gap-4">
              <section>
                <h6 className="fw-bold text-secondary mb-3 small text-uppercase">
                  Usuario en Posesión
                </h6>
                <div className="d-flex align-items-center gap-3 p-3 border rounded-4 bg-white shadow-sm">
                  <div className="p-2 rounded-circle bg-primary bg-opacity-10 text-primary">
                    <FaUser />
                  </div>
                  <div className="flex-grow-1">
                    <div className="fw-bold text-dark">
                      {selectedCarrito.currentUser.nombre}
                    </div>
                    <div className="small text-muted">
                      {selectedCarrito.currentUser.solicitante} • Apto{" "}
                      {selectedCarrito.currentUser.aptoNumero}
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h6 className="fw-bold text-secondary mb-3 small text-uppercase">
                  Detalles del Préstamo
                </h6>
                <div className="p-3 border rounded-4 bg-white shadow-sm">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div className="small text-muted d-flex align-items-center gap-2">
                      <FaClock className="text-primary" /> Fecha de Salida
                    </div>
                    <div className="small fw-bold">
                      {new Date(
                        selectedCarrito.currentUser.fechaEntrada,
                      ).toLocaleString("es-ES", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                  {selectedCarrito.fine > 0 && (
                    <div className="d-flex justify-content-between align-items-center mb-2 text-danger">
                      <div className="small d-flex align-items-center gap-2">
                        <FaExclamationTriangle /> Multa Acumulada
                      </div>
                      <div className="small fw-bold">
                        S/ {selectedCarrito.fine.toFixed(2)}
                      </div>
                    </div>
                  )}
                  <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                    <div className="small text-muted">Estado del Préstamo</div>
                    <Badge
                      bg="primary"
                      className="bg-opacity-10 text-primary border border-primary border-opacity-25 rounded-pill px-3 fw-normal"
                    >
                      Activo
                    </Badge>
                  </div>
                </div>
              </section>
            </div>
          ) : (
            <div className="text-center py-4">
              <FaCheckCircle className="text-success mb-2" size={32} />
              <div className="fw-bold text-dark">Carrito Disponible</div>
              <p className="text-muted small">
                Este carrito no se encuentra en uso actualmente.
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0 p-4 pt-0">
          <Button
            variant="primary"
            className="btn-primary-theme rounded-pill px-4 w-100 fw-bold shadow-sm"
            onClick={() => setShowDetailsModal(false)}
          >
            Entendido
          </Button>
        </Modal.Footer>
      </Modal>
    </AnimatedPage>
  );
};

export default ACCarritosPage;
