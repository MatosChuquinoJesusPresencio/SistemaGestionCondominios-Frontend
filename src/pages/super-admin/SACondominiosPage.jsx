import { useState } from "react";

import { Button, Row, Col } from "react-bootstrap";
import {
  FaBuilding,
  FaEye,
  FaEdit,
  FaPlusCircle,
  FaGlobe,
  FaMapMarkerAlt,
  FaUsersCog,
  FaCalendarAlt,
  FaTrashAlt,
} from "react-icons/fa";

import { useAuth } from "../../hooks/useAuth";
import { useData } from "../../hooks/useData";

import DashboardHeader from "../../components/dashboard/DashboardHeader";
import AnimatedPage from "../../components/animations/AnimatedPage";
import CondoDetailModal from "../../components/modals/CondoDetailModal";
import CondoFormModal from "../../components/modals/CondoFormModal";
import CondoRelationsModal from "../../components/modals/CondoRelationsModal";
import CondoDeleteModal from "../../components/modals/CondoDeleteModal";
import SearchBar from "../../components/ui/SearchBar";
import MainTable from "../../components/ui/MainTable";
import { usePagination } from "../../hooks/usePagination";

const SACondominiosPage = () => {
  const { authUser } = useAuth();
  const { getTable, updateTable } = useData();
  const [showModal, setShowModal] = useState(false);
  const [editingCondo, setEditingCondo] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCondo, setSelectedCondo] = useState(null);

  const [showRelationsModal, setShowRelationsModal] = useState(false);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [condoToDelete, setCondoToDelete] = useState(null);
  const [relations, setRelations] = useState([]);

  const condominios = getTable("condominios");
  const usuarios = getTable("usuarios");

  const adminUsers = usuarios.filter((u) => u.id_rol === 2);

  const filteredCondominios = condominios.filter(
    (condo) =>
      condo.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      condo.pais.toLowerCase().includes(searchTerm.toLowerCase()) ||
      condo.ciudad.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData: currentItems,
    itemsPerPage,
  } = usePagination(filteredCondominios);

  const handleClose = () => {
    setShowModal(false);
    setEditingCondo(null);
  };

  const handleDetailClose = () => {
    setShowDetailModal(false);
    setSelectedCondo(null);
  };

  const handleRelationsClose = () => {
    setShowRelationsModal(false);
    setRelations([]);
    setCondoToDelete(null);
  };

  const handleConfirmDeleteClose = () => {
    setShowConfirmDeleteModal(false);
    setCondoToDelete(null);
  };

  const handleShow = (condo = null) => {
    if (condo) {
      setEditingCondo(condo);
    }
    setShowModal(true);
  };

  const handleDetailClick = (condo) => {
    setSelectedCondo(condo);
    setShowDetailModal(true);
  };

  const handleDeleteClick = (condo) => {
    const foundRelations = [];

    const users = getTable("usuarios").filter(
      (u) => u.id_condominio === condo.id,
    );
    if (users.length > 0)
      foundRelations.push(`${users.length} Usuario(s) registrados`);

    const towers = getTable("torres").filter(
      (t) => t.id_condominio === condo.id,
    );
    if (towers.length > 0)
      foundRelations.push(`${towers.length} Torre(s) / Bloque(s)`);

    const configs = getTable("configuraciones").filter(
      (c) => c.id_condominio === condo.id,
    );
    if (configs.length > 0)
      foundRelations.push(`Configuración del sistema activa`);

    const carts = getTable("carritos_carga").filter(
      (c) => c.id_condominio === condo.id,
    );
    if (carts.length > 0)
      foundRelations.push(`${carts.length} Carrito(s) de carga`);

    setCondoToDelete(condo);
    setRelations(foundRelations);

    if (foundRelations.length > 0) {
      setShowRelationsModal(true);
    } else {
      setShowConfirmDeleteModal(true);
    }
  };

  const confirmDelete = () => {
    const updatedCondominios = condominios.filter(
      (c) => c.id !== condoToDelete.id,
    );
    updateTable("condominios", updatedCondominios);
    handleConfirmDeleteClose();
  };

  const onSubmit = (data) => {
    const { id_administrador, ...condoData } = data;
    let condoId;

    if (editingCondo) {
      condoId = editingCondo.id;
      const updatedCondominios = condominios.map((c) =>
        c.id === editingCondo.id ? { ...c, ...condoData } : c,
      );
      updateTable("condominios", updatedCondominios);
    } else {
      condoId =
        condominios.length > 0
          ? Math.max(...condominios.map((c) => c.id)) + 1
          : 1;
      const nuevoCondominio = {
        ...condoData,
        id: condoId,
        fecha_creacion: new Date().toISOString().split("T")[0],
      };
      const updatedCondominios = [...condominios, nuevoCondominio];
      updateTable("condominios", updatedCondominios);
    }

    if (id_administrador) {
      const updatedUsers = usuarios.map((u) => {
        if (
          u.id_condominio === condoId &&
          u.id_rol === 2 &&
          u.id.toString() !== id_administrador
        ) {
          return { ...u, id_condominio: null };
        }
        if (u.id.toString() === id_administrador) {
          return { ...u, id_condominio: condoId };
        }
        return u;
      });
      updateTable("usuarios", updatedUsers);
    }
    handleClose();
  };

  return (
    <AnimatedPage>
      <div className="page-container">
        <DashboardHeader
          icon={FaBuilding}
          title="Gestión de Condominios"
          badgeText="Super Admin"
          welcomeText={`Bienvenido, ${authUser?.nombre || "Administrador"}. Aquí puedes gestionar todos los condominios del sistema.`}
        >
          <button
            className="btn-primary-theme btn-action"
            onClick={() => handleShow()}
          >
            <FaPlusCircle />
            <span>Nuevo Condominio</span>
          </button>
        </DashboardHeader>

        <MainTable
          headers={[
            "#",
            "Condominio",
            "Ubicación",
            "Administrador",
            "Registro",
            "Acciones",
          ]}
          isEmpty={currentItems.length === 0}
          emptyMessage={
            searchTerm
              ? `No se encontraron condominios que coincidan con "${searchTerm}"`
              : "No hay condominios registrados."
          }
          emptyIcon={FaBuilding}
          searchBar={
            <Row className="align-items-center g-3">
              <Col md={8}>
                <SearchBar
                  searchTerm={searchTerm}
                  onSearchChange={(val) => {
                    setSearchTerm(val);
                    setCurrentPage(1);
                  }}
                  placeholder="Buscar por nombre, país o dirección..."
                />
              </Col>
            </Row>
          }
          paginationProps={{
            currentPage: currentPage,
            totalPages: totalPages,
            onPageChange: setCurrentPage,
            totalItems: filteredCondominios.length,
            itemsShowing: currentItems.length,
          }}
        >
          {currentItems.map((condo, index) => {
            const actualIndex = (currentPage - 1) * itemsPerPage + index + 1;
            const admin = adminUsers.find((u) => u.id_condominio === condo.id);
            return (
              <tr key={condo.id} className="border-bottom border-light">
                <td className="px-4 py-3 text-center">
                  <span className="text-secondary fw-bold">
                    {actualIndex.toString().padStart(2, "0")}
                  </span>
                </td>
                <td className="py-3">
                  <div className="fw-bold text-dark mb-0">{condo.nombre}</div>
                  <div className="x-small text-muted d-flex align-items-center gap-1">
                    <FaGlobe className="m-2" /> {condo.pais}
                  </div>
                </td>
                <td className="py-3">
                  <div className="small fw-medium text-dark">
                    {condo.direccion}
                  </div>
                  <div className="x-small text-muted d-flex align-items-center gap-1">
                    <FaMapMarkerAlt className="m-2" /> {condo.ciudad}
                  </div>
                </td>
                <td className="py-3">
                  {admin ? (
                    <div className="d-flex align-items-center gap-2">
                      <div className="p-2 rounded-circle bg-primary bg-opacity-10 small">
                        <FaUsersCog className="m-2" />
                      </div>
                      <div>
                        <div className="small fw-bold text-dark">
                          {admin.nombre}
                        </div>
                        <div className="x-small text-muted">{admin.email}</div>
                      </div>
                    </div>
                  ) : (
                    <span className="badge badge-status-inactive fw-normal">
                      Sin asignar
                    </span>
                  )}
                </td>
                <td className="py-3">
                  <div className="small text-dark d-flex align-items-center gap-2">
                    <FaCalendarAlt className="m-2" />
                    {new Date(condo.fecha_creacion).toLocaleDateString(
                      "es-ES",
                      { day: "2-digit", month: "short", year: "numeric" },
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-end">
                  <div className="d-flex justify-content-end gap-2">
                    <Button
                      variant="light"
                      className="btn btn-sm btn-primary-theme btn-action-sm"
                      onClick={() => handleDetailClick(condo)}
                    >
                      <FaEye size={14} /> <span>Detalles</span>
                    </Button>
                    <Button
                      variant="light"
                      className="btn btn-sm btn-primary-theme btn-action-sm"
                      onClick={() => handleShow(condo)}
                    >
                      <FaEdit size={14} /> <span>Editar</span>
                    </Button>
                    <Button
                      variant="light"
                      className="btn btn-sm btn-primary-theme btn-action-sm"
                      onClick={() => handleDeleteClick(condo)}
                    >
                      <FaTrashAlt size={14} /> <span>Borrar</span>
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </MainTable>
      </div>

      <CondoDetailModal
        show={showDetailModal}
        onHide={handleDetailClose}
        condo={selectedCondo}
      />

      <CondoFormModal
        show={showModal}
        onHide={handleClose}
        onSubmit={onSubmit}
        editingCondo={editingCondo}
        adminUsers={adminUsers}
      />

      <CondoRelationsModal
        show={showRelationsModal}
        onHide={handleRelationsClose}
        condoName={condoToDelete?.nombre}
        relations={relations}
      />

      <CondoDeleteModal
        show={showConfirmDeleteModal}
        onHide={handleConfirmDeleteClose}
        onConfirm={confirmDelete}
        condoName={condoToDelete?.nombre}
      />
    </AnimatedPage>
  );
};

export default SACondominiosPage;
