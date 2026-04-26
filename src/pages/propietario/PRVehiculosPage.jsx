import { useState, useMemo } from "react";

import { Card, Col, Row, Button, Badge, Modal } from "react-bootstrap";
import {
  FaCar,
  FaPlus,
  FaPalette,
  FaParking,
  FaTrash,
  FaEdit,
  FaExclamationTriangle,
} from "react-icons/fa";

import { useAuth } from "../../hooks/useAuth";
import { useData } from "../../hooks/useData";

import DashboardHeader from "../../components/dashboard/DashboardHeader";
import StatCard from "../../components/dashboard/StatCard";
import AnimatedPage from "../../components/animations/AnimatedPage";
import VehicleModal from "../../components/modals/VehicleModal";
import MainTable from "../../components/ui/MainTable";

const PRVehiculosPage = () => {
  const { authUser } = useAuth();
  const { getTable, updateTable } = useData();

  const [showModal, setShowModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState(null);

  const vehiculos = getTable("vehiculos");
  const apartamentos = getTable("apartamentos");
  const estacionamientos = getTable("estacionamientos");
  const residentes = getTable("inquilinos_temporales");

  const miApto = useMemo(
    () => apartamentos.find((a) => a.id_usuario === authUser?.id),
    [apartamentos, authUser],
  );
  const miEstacionamiento = useMemo(
    () => estacionamientos.find((e) => e.id_apartamento === miApto?.id),
    [estacionamientos, miApto],
  );
  const misResidentesIds = useMemo(
    () =>
      residentes
        .filter((r) => r.id_apartamento === miApto?.id)
        .map((r) => r.id),
    [residentes, miApto],
  );

  const misVehiculos = useMemo(() => {
    return vehiculos
      .filter(
        (v) =>
          v.id_usuario === authUser?.id ||
          (v.id_inquilino_temporal &&
            misResidentesIds.includes(v.id_inquilino_temporal)),
      )
      .map((v) => {
        const residente = residentes.find(
          (r) => r.id === v.id_inquilino_temporal,
        );
        return {
          ...v,
          propietarioNombre:
            v.id_usuario === authUser?.id
              ? "Mío"
              : residente?.nombre || "Residente",
        };
      });
  }, [vehiculos, authUser, misResidentesIds, residentes]);

  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(misVehiculos.length / ITEMS_PER_PAGE);
  const paginatedVehiculos = misVehiculos.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleOpenModal = (vehicle = null) => {
    setEditingVehicle(vehicle);
    setShowModal(true);
  };

  const onSubmit = (data) => {
    if (editingVehicle) {
      const updated = vehiculos.map((v) =>
        v.id === editingVehicle.id ? { ...v, ...data } : v,
      );
      updateTable("vehiculos", updated);
    } else {
      const newId =
        vehiculos.length > 0 ? Math.max(...vehiculos.map((v) => v.id)) + 1 : 1;
      const newVehicle = {
        id: newId,
        id_usuario: authUser.id,
        id_inquilino_temporal: null,
        ...data,
      };
      updateTable("vehiculos", [...vehiculos, newVehicle]);
    }
    setShowModal(false);
  };

  const handleDeleteClick = (vehicle) => {
    setVehicleToDelete(vehicle);
    setShowConfirmDelete(true);
  };

  const handleConfirmDelete = () => {
    const filtered = vehiculos.filter((v) => v.id !== vehicleToDelete.id);
    updateTable("vehiculos", filtered);
    setShowConfirmDelete(false);
    setVehicleToDelete(null);
  };

  if (!miApto) {
    return (
      <AnimatedPage>
        <div className="container-fluid py-4 bg-light min-vh-100 d-flex align-items-center justify-content-center">
          <Card className="border-0 shadow-sm rounded-4 p-5 text-center">
            <FaCar size={60} className="text-muted mb-3 mx-auto" />
            <h3 className="fw-bold text-dark">Sin Unidad Asignada</h3>
            <p className="text-muted">
              No puedes gestionar vehículos sin una unidad vinculada.
            </p>
          </Card>
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <div className="container-fluid py-4 bg-light min-vh-100">
        <DashboardHeader
          icon={FaCar}
          title="Gestión de Mis Vehículos"
          badgeText={miApto.numero}
          welcomeText="Registra y administra los vehículos autorizados para tu estacionamiento."
        />

        <Row className="g-4 mb-5">
          <Col lg={4}>
            <StatCard
              icon={FaCar}
              label="Vehículos Registrados"
              value={misVehiculos.length}
              colorClass="primary-theme"
            />
          </Col>
          <Col lg={8}>
            <Card className="border-0 shadow-sm rounded-4 bg-white h-100 d-flex flex-row align-items-center px-4">
              <div className="p-3 rounded-circle bg-info bg-opacity-10 text-info me-4">
                <FaParking size={24} />
              </div>
              <div>
                <h6 className="fw-bold text-dark mb-1">
                  Estacionamiento Asignado
                </h6>
                <p className="mb-0 text-muted small">
                  {miEstacionamiento ? (
                    <>
                      Tu unidad cuenta con el espacio:{" "}
                      <Badge bg="dark" className="ms-2">
                        {miEstacionamiento.numero}
                      </Badge>
                    </>
                  ) : (
                    "No tienes un espacio de estacionamiento asignado actualmente."
                  )}
                </p>
              </div>
            </Card>
          </Col>
        </Row>

        <MainTable
          headers={["#", "Vehículo", "Placa", "Asignado a", "Color", "Acciones"]}
          isEmpty={misVehiculos.length === 0}
          emptyMessage="No tienes vehículos registrados."
          emptyIcon={FaCar}
          searchBar={
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h5 className="fw-bold text-dark mb-1">Lista de Vehículos</h5>
                <p className="text-muted small mb-0">
                  Vehículos que tienen permitido el ingreso al condominio.
                </p>
              </div>
              <Button
                className="btn-primary-theme rounded-pill px-4 fw-bold shadow-sm border-0 d-flex align-items-center gap-2"
                onClick={() => handleOpenModal()}
              >
                <FaPlus /> Registrar Vehículo
              </Button>
            </div>
          }
          paginationProps={{
            currentPage,
            totalPages,
            onPageChange: setCurrentPage,
            totalItems: misVehiculos.length,
            itemsShowing: paginatedVehiculos.length,
          }}
        >
          {paginatedVehiculos.map((v, index) => {
            const actualIndex = (currentPage - 1) * ITEMS_PER_PAGE + index + 1;
            return (
              <tr key={v.id} className="border-bottom border-light">
                <td className="px-4 py-3 text-center">
                  <span className="text-secondary fw-bold">
                    {actualIndex.toString().padStart(2, "0")}
                  </span>
                </td>
                <td className="py-3">
                  <div className="d-flex align-items-center gap-3">
                    <div className="p-2 rounded-3 bg-light text-primary">
                      <FaCar />
                    </div>
                    <div>
                      <div className="fw-bold text-dark">{v.marca}</div>
                      <div className="x-small text-muted">{v.modelo}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3">
                  <Badge bg="dark" className="px-3 py-2 fw-bold letter-spacing-1">
                    {v.placa}
                  </Badge>
                </td>
                <td className="py-3">
                  <Badge
                    bg={v.id_usuario === authUser?.id ? "primary" : "info"}
                    className="fw-normal"
                  >
                    {v.propietarioNombre}
                  </Badge>
                </td>
                <td className="py-3">
                  <div className="d-flex align-items-center gap-2 small">
                    <FaPalette className="text-muted" /> {v.color}
                  </div>
                </td>
                <td className="px-4 py-3 text-end">
                  <div className="d-flex justify-content-end gap-2">
                    <Button
                      variant="light"
                      className="btn btn-primary-theme d-inline-flex align-items-center gap-2 shadow-sm px-4 py-2 rounded-3 fw-semibold transition-all"
                      onClick={() => handleOpenModal(v)}
                    >
                      <FaEdit /> <span>Editar</span>
                    </Button>
                    <Button
                      variant="light"
                      className="btn btn-primary-theme d-inline-flex align-items-center gap-2 shadow-sm px-4 py-2 rounded-3 fw-semibold transition-all"
                      onClick={() => handleDeleteClick(v)}
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

      <VehicleModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSubmit={onSubmit}
        editingVehicle={editingVehicle}
      />

      <Modal
        show={showConfirmDelete}
        onHide={() => setShowConfirmDelete(false)}
        centered
        size="sm"
      >
        <Modal.Body className="text-center p-4">
          <div className="p-3 rounded-circle bg-danger bg-opacity-10 text-danger d-inline-block mb-3">
            <FaExclamationTriangle size={30} />
          </div>
          <h5 className="fw-bold text-dark">Eliminar Vehículo</h5>
          <p className="text-secondary small mb-1">
            ¿Estás seguro de eliminar el vehículo
          </p>
          <p className="fw-bold text-dark mb-3">
            {vehicleToDelete?.marca} {vehicleToDelete?.modelo} &mdash;{" "}
            <span className="badge bg-dark px-2">{vehicleToDelete?.placa}</span>
          </p>
          <p className="x-small text-muted">
            Esta acción no se puede deshacer.
          </p>
          <div className="d-flex justify-content-center gap-2 mt-3">
            <Button
              variant="light"
              onClick={() => setShowConfirmDelete(false)}
              className="rounded-pill px-4 fw-bold text-secondary border-0"
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmDelete}
              className="rounded-pill px-4 fw-bold shadow-sm border-0"
            >
              Eliminar
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </AnimatedPage>
  );
};

export default PRVehiculosPage;
