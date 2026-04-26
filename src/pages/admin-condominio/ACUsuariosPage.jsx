import { useState, useMemo } from "react";
import { Button, Row, Badge } from "react-bootstrap";
import {
  FaUsers,
  FaUserPlus,
  FaEdit,
  FaTrash,
  FaUserShield,
  FaCheckCircle,
  FaExclamationTriangle,
  FaHome,
} from "react-icons/fa";

import { useAuth } from "../../hooks/useAuth";
import { useData } from "../../hooks/useData";

import DashboardHeader from "../../components/dashboard/DashboardHeader";
import StatCard from "../../components/dashboard/StatCard";
import AnimatedPage from "../../components/animations/AnimatedPage";
import MainTable from "../../components/ui/MainTable";
import SearchBar from "../../components/ui/SearchBar";
import ResidentFormModal from "../../components/modals/ResidentFormModal";
import ResidentDeleteModal from "../../components/modals/ResidentDeleteModal";

const ACUsuariosPage = () => {
  const { authUser } = useAuth();
  const { getTable, updateTable } = useData();

  const usuarios = getTable("usuarios");
  const apartamentos = getTable("apartamentos");
  const condominio = getTable("condominios").find(
    (c) => c.id === authUser?.id_condominio,
  );

  if (!condominio) {
    return (
      <AnimatedPage>
        <div className="container-fluid py-4 bg-light min-vh-100 d-flex align-items-center justify-content-center">
          <div
            className="text-center p-5 bg-white rounded-4 shadow-sm"
            style={{ maxWidth: "500px" }}
          >
            <div className="p-4 rounded-circle bg-warning bg-opacity-10 text-warning d-inline-block mb-4">
              <FaExclamationTriangle size={50} />
            </div>
            <h3 className="fw-bold text-dark">Sin condominio asignado</h3>
            <p className="text-secondary">
              Actualmente no tienes un condominio bajo tu administración.
              Contacta con el Super Administrador para que se te asigne uno.
            </p>
          </div>
        </div>
      </AnimatedPage>
    );
  }

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const residentes = useMemo(() => {
    if (!authUser?.id_condominio) return [];
    return usuarios.filter((u) => u.id_condominio === authUser.id_condominio);
  }, [usuarios, authUser]);

  const stats = useMemo(
    () => ({
      total: residentes.length,
      propietarios: residentes.filter((u) => u.id_rol === 3).length,
      seguridad: residentes.filter((u) => u.id_rol === 4).length,
      activos: residentes.filter((u) => u.activo).length,
    }),
    [residentes],
  );

  const filteredResidentes = useMemo(() => {
    setCurrentPage(1);
    return residentes.filter((user) => {
      const matchesSearch =
        user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole =
        roleFilter === "all" || user.id_rol.toString() === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [residentes, searchTerm, roleFilter]);

  const totalPages = Math.ceil(filteredResidentes.length / ITEMS_PER_PAGE);
  const paginatedResidentes = filteredResidentes.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleShowModal = (user = null) => {
    setEditingUser(user);
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
        id_condominio: authUser.id_condominio,
        contraseña: "123123",
        activo: true,
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
    const hasAptos = apartamentos.some((a) => a.id_usuario === user.id);
    if (hasAptos)
      return alert(
        "No puedes eliminar a este propietario porque tiene departamentos asignados. Desvincúlalo de la infraestructura primero.",
      );

    setUserToDelete(user);
    setShowConfirmDelete(true);
  };

  const handleConfirmDelete = () => {
    const updated = usuarios.filter((u) => u.id !== userToDelete.id);
    updateTable("usuarios", updated);
    setShowConfirmDelete(false);
    setUserToDelete(null);
  };

  const getRoleBadge = (roleId) => {
    const roles = {
      2: { bg: "primary", label: "Admin" },
      3: { bg: "success", label: "Propietario" },
      4: { bg: "info", label: "Seguridad" },
    };
    const role = roles[roleId] || { bg: "secondary", label: "Usuario" };
    return (
      <Badge bg={role.bg} className="rounded-pill px-3 py-2">
        {role.label}
      </Badge>
    );
  };

  const getAptosString = (userId) => {
    const userAptos = apartamentos.filter((a) => a.id_usuario === userId);
    if (userAptos.length === 0) return "Sin asignar";
    return userAptos.map((a) => a.numero).join(", ");
  };

  return (
    <AnimatedPage>
      <div className="container-fluid py-4 bg-light min-vh-100">
        <DashboardHeader
          icon={FaUsers}
          title="Gestión de Usuarios"
          badgeText={condominio?.nombre || "Condominio"}
          welcomeText="Administra a los propietarios, residentes y personal de seguridad de tu condominio."
        >
          <Button
            className="btn btn-primary-theme d-inline-flex align-items-center gap-2 shadow-sm px-4 py-2 rounded-3 fw-semibold transition-all"
            onClick={() => handleShowModal()}
          >
            <FaUserPlus />
            <span>Nuevo Usuario</span>
          </Button>
        </DashboardHeader>

        <Row className="g-4 mb-5">
          <StatCard
            icon={FaUsers}
            label="Total Usuarios"
            value={stats.total}
            colorClass="primary-theme"
          />
          <StatCard
            icon={FaHome}
            label="Propietarios"
            value={stats.propietarios}
            colorClass="primary-theme"
          />
          <StatCard
            icon={FaUserShield}
            label="Seguridad"
            value={stats.seguridad}
            colorClass="primary-theme"
          />
          <StatCard
            icon={FaCheckCircle}
            label="Activos"
            value={stats.activos}
            colorClass="primary-theme"
          />
        </Row>

        <MainTable
          headers={[
            "#",
            "Residente",
            "Rol",
            "Departamentos",
            "Estado",
            "Acciones",
          ]}
          isEmpty={paginatedResidentes.length === 0}
          emptyMessage="No se encontraron residentes en este condominio."
          emptyIcon={FaUsers}
          searchBar={
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={(val) => {
                setSearchTerm(val);
                setCurrentPage(1);
              }}
              placeholder="Buscar residente por nombre o email..."
              filterValue={roleFilter}
              onFilterChange={(val) => {
                setRoleFilter(val);
                setCurrentPage(1);
              }}
              filterOptions={[
                { value: "all", label: "Todos los Roles" },
                { value: "3", label: "Propietario" },
                { value: "4", label: "Seguridad" },
                { value: "2", label: "Administrador" },
              ]}
              colSize={{ search: 9, filter: 3 }}
            />
          }
          paginationProps={{
            currentPage,
            totalPages,
            onPageChange: setCurrentPage,
            totalItems: filteredResidentes.length,
            itemsShowing: paginatedResidentes.length,
          }}
        >
          {paginatedResidentes.map((user, index) => {
            const actualIndex = (currentPage - 1) * ITEMS_PER_PAGE + index + 1;
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
                <td className="py-3">{getRoleBadge(user.id_rol)}</td>
                <td className="py-3">
                  <div className="small fw-medium text-secondary">
                    {getAptosString(user.id)}
                  </div>
                </td>
                <td className="py-3 text-center">
                  {user.activo ? (
                    <Badge
                      bg="success"
                      className="bg-opacity-10 text-success rounded-pill px-3 py-1"
                    >
                      Activo
                    </Badge>
                  ) : (
                    <Badge
                      bg="danger"
                      className="bg-opacity-10 text-danger rounded-pill px-3 py-1"
                    >
                      Inactivo
                    </Badge>
                  )}
                </td>
                <td className="px-4 py-3 text-end">
                  <div className="d-flex justify-content-end gap-2">
                    <Button
                      variant="light"
                      className="btn btn-sm btn-primary-theme rounded-pill px-3 border-opacity-25 transition fw-bold"
                      onClick={() => handleShowModal(user)}
                    >
                      <FaEdit /> <span>Editar</span>
                    </Button>
                    <Button
                      variant="light"
                      className="btn btn-sm btn-primary-theme rounded-pill px-3 border-opacity-25 transition fw-bold"
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

      <ResidentFormModal
        show={showModal}
        onHide={handleCloseModal}
        onSubmit={onSubmit}
        editingUser={editingUser}
        condominio={condominio}
        authUser={authUser}
      />

      <ResidentDeleteModal
        show={showConfirmDelete}
        onHide={() => setShowConfirmDelete(false)}
        onConfirm={handleConfirmDelete}
        userToDelete={userToDelete}
      />
    </AnimatedPage>
  );
};

export default ACUsuariosPage;
