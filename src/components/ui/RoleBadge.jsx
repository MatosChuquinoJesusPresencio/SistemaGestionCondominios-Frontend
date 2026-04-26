import { Badge } from "react-bootstrap";

const RoleBadge = ({ roleId }) => {
  const roles = {
    1: { bg: "danger", label: "Super Admin" },
    2: { bg: "primary", label: "Admin Condo" },
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

export default RoleBadge;
