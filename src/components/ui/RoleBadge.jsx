import { Badge } from "react-bootstrap";

const RoleBadge = ({ roleId }) => {
  const roles = {
    1: { className: "badge-role-super", label: "Super Admin" },
    2: { className: "badge-role-admin", label: "Admin Condo" },
    3: { className: "badge-role-owner", label: "Propietario" },
    4: { className: "badge-role-guard", label: "Seguridad" },
  };
  
  const role = roles[roleId] || { className: "bg-secondary", label: "Usuario" };
  
  return (
    <Badge className={`${role.className} rounded-pill px-3 py-2 border-0`}>
      {role.label}
    </Badge>
  );
};

export default RoleBadge;
