import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Form from "react-bootstrap/Form";

import { Button, Col, Row, Badge } from "react-bootstrap";

import {
  FaUsers,
  FaUserPlus,
  FaEdit,
  FaTrash,
  FaUserShield,
  FaBuilding,
  FaCheckCircle,
} from "react-icons/fa";

import { useAuth } from "../../hooks/useAuth";
import { useData } from "../../hooks/useData";

import DashboardHeader from "../../components/dashboard/DashboardHeader";
import StatCard from "../../components/dashboard/StatCard";
import AnimatedPage from "../../components/animations/AnimatedPage";
import SearchBar from "../../components/ui/SearchBar";
import MainTable from "../../components/ui/MainTable";
import UserFormModal from "../../components/modals/UserFormModal";
import UserDeleteModal from "../../components/modals/UserDeleteModal";
import { usePagination } from "../../hooks/usePagination";
import RoleBadge from "../../components/ui/RoleBadge";

const SAUsuariosPage = () => {
  const { authUser } = useAuth();
  const { getTable, updateTable } = useData();
  const [searchParams] = useSearchParams();

  const usuarios = getTable("usuarios");
  const condominios = getTable("condominios");

  const initialSearch = searchParams.get("search") || "";

  const [searchTerm, setSearchTerm] = useState(initialSearch);

  useEffect(() => {
    const search = searchParams.get("search");
    if (search) {
      setSearchTerm(search);
    }
  }, [searchParams]);

  const [roleFilter, setRoleFilter] = useState("all");
  const [condoFilter, setCondoFilter] = useState("all");

  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const stats = useMemo(
    () => ({
      total: usuarios.length,
      admins: usuarios.filter((u) => u.id_rol === 2).length,
      propietarios: usuarios.filter((u) => u.id_rol === 3).length,
      activos: usuarios.filter((u) => u.activo).length,
    }),
    [usuarios],
  );

  const filteredUsers = useMemo(() => {
    return usuarios.filter((user) => {
      const matchesSearch =
        user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole =
        roleFilter === "all" || user.id_rol.toString() === roleFilter;
      const matchesCondo =
        condoFilter === "all" ||
        (condoFilter === "none"
          ? user.id_condominio === null
          : user.id_condominio?.toString() === condoFilter);

      return matchesSearch && matchesRole && matchesCondo;
    });
  }, [usuarios, searchTerm, roleFilter, condoFilter]);

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData: paginatedUsers,
    itemsPerPage,
  } = usePagination(filteredUsers);

  const handleShowModal = (user = null) => {
    setEditingUser(user || null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
  };

  const onSubmit = (data) => {
    if (editingUser) {
      const updated = usuarios.map((u) =>
        u.id === editingUser.id
          ? {
              ...u,
              ...data,
              id_rol: parseInt(data.id_rol),
              id_condominio: data.id_condominio
                ? parseInt(data.id_condominio)
                : null,
            }
          : u,
      );
      updateTable("usuarios", updated);
    } else {
      const newId =
        usuarios.length > 0 ? Math.max(...usuarios.map((u) => u.id)) + 1 : 1;
      const newUser = {
        id: newId,
        ...data,
        id_rol: parseInt(data.id_rol),
        id_condominio: data.id_condominio ? parseInt(data.id_condominio) : null,
        contraseña: "123123",
      };
      updateTable("usuarios", [...usuarios, newUser]);

      console.group("Simulación: Correo Enviado (Residente)");
      console.log(`Para: ${data.email}`);
      console.log(
        `Asunto: Acceso al Sistema de Gestión - ${condominio?.nombre}`,
      );
      console.log(
        `Mensaje: Hola ${data.nombre}, el administrador te ha registrado.`,
      );
      console.log(`Tus credenciales son:`);
      console.log(`- Email: ${data.email}`);
      console.log(`- Contraseña: 123123`);
      console.log("¡Cambie la contraseña en cuanto inicie sesión!");
      console.groupEnd();
    }
    handleCloseModal();
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowConfirmDelete(true);
  };

  const handleConfirmDelete = () => {
    const updated = usuarios.filter((u) => u.id !== userToDelete.id);
    updateTable("usuarios", updated);
    setShowConfirmDelete(false);
    setUserToDelete(null);
  };

  return (
    <AnimatedPage>
      <div className="page-container">
        <DashboardHeader
          icon={FaUsers}
          title="Gestión de Usuarios"
          badgeText="Administración"
          welcomeText="Gestiona todos los usuarios del sistema, sus roles y condominios asignados."
        >
          <button
            className="btn-primary-theme btn-action"
            onClick={() => handleShowModal()}
          >
            <FaUserPlus />
            <span>Nuevo Usuario</span>
          </button>
        </DashboardHeader>

        <Row className="g-4 mb-5">
          <StatCard
            icon={FaUsers}
            label="Total Usuarios"
            value={stats.total}
            colorClass="primary-theme"
          />
          <StatCard
            icon={FaUserShield}
            label="Administradores"
            value={stats.admins}
            colorClass="primary-theme"
          />
          <StatCard
            icon={FaBuilding}
            label="Propietarios"
            value={stats.propietarios}
            colorClass="primary-theme"
          />
          <StatCard
            icon={FaCheckCircle}
            label="Cuentas Activas"
            value={stats.activos}
            colorClass="primary-theme"
          />
        </Row>

        <MainTable
          headers={["#", "Usuario", "Rol", "Condominio", "Estado", "Acciones"]}
          isEmpty={paginatedUsers.length === 0}
          emptyMessage="No se encontraron usuarios con los criterios de búsqueda."
          emptyIcon={FaUsers}
          searchBar={
            <Row className="align-items-center g-3">
              <Col md={6}>
                <SearchBar
                  searchTerm={searchTerm}
                  onSearchChange={(val) => {
                    setSearchTerm(val);
                    setCurrentPage(1);
                  }}
                  placeholder="Buscar por nombre o email..."
                />
              </Col>
              <Col md={3}>
                <Form.Select
                  className="form-control rounded-pill border-light shadow-sm py-2 px-3 small"
                  value={roleFilter}
                  onChange={(e) => {
                    setRoleFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="all">Todos los Roles</option>
                  <option value="1">Super Admin</option>
                  <option value="2">Admin Condo</option>
                  <option value="3">Propietario</option>
                  <option value="4">Seguridad</option>
                </Form.Select>
              </Col>
              <Col md={3}>
                <Form.Select
                  className="form-control rounded-pill border-light shadow-sm py-2 px-3 small"
                  value={condoFilter}
                  onChange={(e) => {
                    setCondoFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="all">Todos los Condominios</option>
                  <option value="none">Sin Condominio</option>
                  {condominios.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Row>
          }
          paginationProps={{
            currentPage: currentPage,
            totalPages: totalPages,
            onPageChange: setCurrentPage,
            totalItems: filteredUsers.length,
            itemsShowing: paginatedUsers.length,
          }}
        >
          {paginatedUsers.map((user, index) => {
            const actualIndex = (currentPage - 1) * itemsPerPage + index + 1;
            return (
              <tr key={user.id} className="border-bottom border-light">
                <td className="px-4 py-3 text-center">
                  <span className="text-secondary fw-bold">
                    {actualIndex.toString().padStart(2, "0")}
                  </span>
                </td>
                <td className="py-3">
                  <div className="d-flex align-items-center gap-3">
                    <div>
                      <div className="fw-bold text-dark">{user.nombre}</div>
                      <div className="x-small text-muted">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3">
                  <RoleBadge roleId={user.id_rol} />
                </td>
                <td className="py-3">
                  <div className="small fw-medium text-secondary">
                    {user.id_condominio
                      ? condominios.find((c) => c.id === user.id_condominio)
                          ?.nombre
                      : "Plataforma Global"}
                  </div>
                </td>
                <td className="py-3 text-center">
                  {user.activo ? (
                    <Badge className="badge-status-active rounded-pill px-2 border-0">
                      Activo
                    </Badge>
                  ) : (
                    <Badge className="badge-status-inactive rounded-pill px-2 border-0">
                      Inactivo
                    </Badge>
                  )}
                </td>
                <td className="px-4 py-3 text-end">
                  <div className="d-flex justify-content-end gap-2">
                    <Button
                      variant="light"
                      className="btn btn-sm btn-primary-theme btn-action-sm"
                      onClick={() => handleShowModal(user)}
                    >
                      <FaEdit /> <span>Editar</span>
                    </Button>
                    <Button
                      variant="light"
                      className="btn btn-sm btn-primary-theme btn-action-sm"
                      onClick={() => handleDeleteClick(user)}
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

      <UserFormModal
        show={showModal}
        onHide={handleCloseModal}
        onSubmit={onSubmit}
        editingUser={editingUser}
        condominios={condominios}
        authUser={authUser}
      />

      <UserDeleteModal
        show={showConfirmDelete}
        onHide={() => setShowConfirmDelete(false)}
        onConfirm={handleConfirmDelete}
        user={userToDelete}
      />
    </AnimatedPage>
  );
};

export default SAUsuariosPage;
