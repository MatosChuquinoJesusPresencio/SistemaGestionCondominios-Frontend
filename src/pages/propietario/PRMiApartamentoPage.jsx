import { useState, useMemo } from "react";

import { Card, Col, Row, Button, Table, Badge } from "react-bootstrap";
import {
  FaHome,
  FaUsers,
  FaPlus,
  FaEdit,
  FaTrash,
  FaInfoCircle,
  FaUserTag,
  FaIdCard,
  FaBuilding,
  FaLayerGroup,
} from "react-icons/fa";

import { useAuth } from "../../hooks/useAuth";
import { useData } from "../../hooks/useData";

import DashboardHeader from "../../components/dashboard/DashboardHeader";
import StatCard from "../../components/dashboard/StatCard";
import AnimatedPage from "../../components/animations/AnimatedPage";
import ResidentModal from "../../components/modals/ResidentModal";
import MainTable from "../../components/ui/MainTable";
import { usePagination } from "../../hooks/usePagination";

const PRMiApartamentoPage = () => {
  const { authUser } = useAuth();
  const { getTable, updateTable } = useData();

  const [showModal, setShowModal] = useState(false);
  const [editingResident, setEditingResident] = useState(null);

  const apartamentos = getTable("apartamentos");
  const pisos = getTable("pisos");
  const torres = getTable("torres");
  const condominios = getTable("condominios");
  const residentes = getTable("inquilinos_temporales");

  const miApto = useMemo(
    () => apartamentos.find((a) => a.id_usuario === authUser?.id),
    [apartamentos, authUser],
  );
  const miPiso = useMemo(
    () => pisos.find((p) => p.id === miApto?.id_piso),
    [pisos, miApto],
  );
  const miTorre = useMemo(
    () => torres.find((t) => t.id === miPiso?.id_torre),
    [torres, miPiso],
  );
  const miCondo = useMemo(
    () => condominios.find((c) => c.id === miTorre?.id_condominio),
    [condominios, miTorre],
  );

  const misResidentes = useMemo(
    () => residentes.filter((r) => r.id_apartamento === miApto?.id),
    [residentes, miApto],
  );

  const { currentPage, setCurrentPage, totalPages, paginatedData: paginatedResidentes, itemsPerPage } = usePagination(misResidentes);

  const handleOpenModal = (resident = null) => {
    setEditingResident(resident);
    setShowModal(true);
  };

  const onSubmit = (data) => {
    if (!miApto) return;

    if (editingResident) {
      const updated = residentes.map((r) =>
        r.id === editingResident.id ? { ...r, ...data } : r,
      );
      updateTable("inquilinos_temporales", updated);
    } else {
      const newId =
        residentes.length > 0
          ? Math.max(...residentes.map((r) => r.id)) + 1
          : 1;
      const newResident = {
        id: newId,
        id_apartamento: miApto.id,
        ...data,
      };
      updateTable("inquilinos_temporales", [...residentes, newResident]);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Estás seguro de eliminar a este residente?")) {
      const filtered = residentes.filter((r) => r.id !== id);
      updateTable("inquilinos_temporales", filtered);
    }
  };

  if (!miApto) {
    return (
      <AnimatedPage>
        <div className="page-container d-flex align-items-center justify-content-center">
          <Card className="card-custom p-5 text-center">
            <FaHome size={60} className="text-muted mb-3 mx-auto" />
            <h3 className="fw-bold text-dark">Sin Unidad Asignada</h3>
            <p className="text-muted">
              No se encontró una unidad vinculada a tu cuenta. Contacta con
              administración.
            </p>
          </Card>
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <div className="page-container">
        <DashboardHeader
          icon={FaHome}
          title="Detalles de mi Unidad"
          badgeText={`Unidad ${miApto.numero}`}
          welcomeText={`Información general y gestión de residentes para tu unidad en ${miCondo?.nombre}.`}
        />

        <Row className="g-4 mb-5">
          <Col lg={8}>
            <Card className="card-custom overflow-hidden h-100">
              <Card.Header className="bg-white border-0 pt-4 px-4">
                <h5 className="fw-bold text-dark mb-0">
                  Información de la Propiedad
                </h5>
              </Card.Header>
              <Card.Body className="p-4">
                <Row className="g-4">
                  <Col md={6}>
                    <div className="d-flex align-items-center gap-3 p-3 rounded-4 bg-light">
                      <div className="p-3 text-primary-theme">
                        <FaBuilding />
                      </div>
                      <div>
                        <div className="x-small text-muted text-uppercase fw-bold">
                          Torre / Bloque
                        </div>
                        <div className="fw-bold text-dark">
                          {miTorre?.nombre || "N/A"}
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="d-flex align-items-center gap-3 p-3 rounded-4 bg-light">
                      <div className="p-3 text-primary-theme">
                        <FaLayerGroup />
                      </div>
                      <div>
                        <div className="x-small text-muted text-uppercase fw-bold">
                          Nivel / Piso
                        </div>
                        <div className="fw-bold text-dark">
                          Piso {miPiso?.numero_piso || "N/A"}
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="d-flex align-items-center gap-3 p-3 rounded-4 bg-light">
                      <div className="p-3 text-primary-theme">
                        <FaHome />
                      </div>
                      <div>
                        <div className="x-small text-muted text-uppercase fw-bold">
                          Número de Unidad
                        </div>
                        <div className="fw-bold text-dark">{miApto.numero}</div>
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="d-flex align-items-center gap-3 p-3 rounded-4 bg-light">
                      <div className="p-3 text-primary-theme">
                        <FaInfoCircle />
                      </div>
                      <div>
                        <div className="x-small text-muted text-uppercase fw-bold">
                          Superficie
                        </div>
                        <div className="fw-bold text-dark">
                          {miApto.metraje} m²
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <StatCard
            icon={FaUsers}
            label="Residentes Registrados"
            value={misResidentes.length}
            colorClass="primary-theme"
            colSize="col-12 col-md-5 col-lg-3"
            useFullHeight={false}
          />
        </Row>

        <MainTable
          headers={["#", "Residente", "Identificación", "Rol", "Acciones"]}
          isEmpty={misResidentes.length === 0}
          emptyMessage="No hay residentes registrados. Haz clic en 'Añadir Residente' para empezar."
          emptyIcon={FaUsers}
          searchBar={
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h5 className="fw-bold text-dark mb-1">Residentes Autorizados</h5>
                <p className="text-muted small mb-0">
                  Gestiona las personas que viven en tu unidad.
                </p>
              </div>
              <Button
                className="btn-primary-theme rounded-pill px-4 fw-bold shadow-sm border-0 d-flex align-items-center gap-2"
                onClick={() => handleOpenModal()}
              >
                <FaPlus /> Añadir Residente
              </Button>
            </div>
          }
          paginationProps={{
            currentPage,
            totalPages,
            onPageChange: setCurrentPage,
            totalItems: misResidentes.length,
            itemsShowing: paginatedResidentes.length,
          }}
        >
          {paginatedResidentes.map((resident, index) => {
            const actualIndex = (currentPage - 1) * itemsPerPage + index + 1;
            return (
              <tr key={resident.id} className="border-bottom border-light">
                <td className="px-4 py-3 text-center">
                  <span className="text-secondary fw-bold">
                    {actualIndex.toString().padStart(2, "0")}
                  </span>
                </td>
                <td className="py-3">
                  <div className="d-flex align-items-center gap-3">
                    <div className="p-2 rounded-circle bg-light text-primary">
                      <FaUserTag />
                    </div>
                    <div className="fw-bold text-dark">{resident.nombre}</div>
                  </div>
                </td>
                <td className="py-3">
                  <div className="small text-muted">
                    <FaIdCard className="me-2" />
                    {resident.dni}
                  </div>
                </td>
                <td className="py-3">
                  <Badge bg="light" className="text-primary-theme border">
                    Residente
                  </Badge>
                </td>
                <td className="px-4 py-3 text-end">
                  <div className="d-flex justify-content-end gap-2">
                    <Button
                      variant="light"
                      className="btn-primary-theme btn-action"
                      onClick={() => handleOpenModal(resident)}
                    >
                      <FaEdit /> <span>Editar</span>
                    </Button>
                    <Button
                      variant="light"
                      className="btn-primary-theme btn-action"
                      onClick={() => handleDelete(resident.id)}
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

      <ResidentModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSubmit={onSubmit}
        editingResident={editingResident}
      />
    </AnimatedPage>
  );
};

export default PRMiApartamentoPage;
