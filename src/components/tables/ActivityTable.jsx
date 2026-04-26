import { Table, Badge } from "react-bootstrap";
import {
  FaShoppingCart,
  FaCar,
  FaClock,
  FaCalendarAlt,
  FaUser,
  FaHome,
  FaBuilding,
} from "react-icons/fa";
import EmptyState from "../ui/EmptyState";

const ActivityTable = ({ data, type = "carritos", showCondo = false }) => {
  const formatDateTime = (isoString) => {
    if (!isoString) return "---";
    const date = new Date(isoString);
    return date.toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (type === "carritos") {
    return (
      <div className="table-responsive">
        <Table hover className="align-middle mb-0 custom-table">
          <thead className="bg-light text-muted small text-uppercase">
            <tr>
              {showCondo && <th className="px-4 py-3 border-0">Condominio</th>}
              <th
                className={showCondo ? "py-3 border-0" : "px-4 py-3 border-0"}
              >
                Unidad
              </th>
              <th className="py-3 border-0">Carrito</th>
              <th className="py-3 border-0">Solicitante</th>
              <th className="py-3 border-0">Entrada</th>
              <th className="px-4 py-3 border-0 text-center">Estado</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((log) => (
                <tr key={log.id} className="border-bottom border-light">
                  {showCondo && (
                    <td className="px-4 py-3">
                      <div className="fw-bold text-dark small">
                        {log.condoNombre || "N/A"}
                      </div>
                    </td>
                  )}
                  <td className={showCondo ? "py-3" : "px-4 py-3"}>
                    <div className="small">
                      <FaHome className="me-1 text-muted" />{" "}
                      {log.aptoNumero || log.id_apartamento}
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="small fw-medium">
                      {log.carritoNombre || `Carrito ${log.id_carrito}`}
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="small text-muted">
                      <FaUser className="me-1" />{" "}
                      {log.usuarioNombre || log.solicitante}
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="x-small">
                      <FaClock className="me-1 text-muted" />{" "}
                      {formatDateTime(log.fecha_entrada)}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge
                      bg={log.fecha_salida ? "success" : "warning"}
                      className="rounded-pill px-3 py-1"
                    >
                      {log.fecha_salida ? "Devuelto" : "En uso"}
                    </Badge>
                  </td>
                </tr>
              ))
            ) : (
              <EmptyState
                colSpan={showCondo ? 6 : 5}
                message="No hay registros de carritos."
                icon={FaShoppingCart}
              />
            )}
          </tbody>
        </Table>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <Table hover className="align-middle mb-0 custom-table">
        <thead className="bg-light text-muted small text-uppercase">
          <tr>
            {showCondo && <th className="px-4 py-3 border-0">Condominio</th>}
            <th className={showCondo ? "py-3 border-0" : "px-4 py-3 border-0"}>
              Vehículo / Placa
            </th>
            <th className="py-3 border-0 text-center">Espacio</th>
            <th className="py-3 border-0">Entrada</th>
            <th className="py-3 border-0">Salida</th>
            <th className="px-4 py-3 border-0 text-center">Estado</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((log) => (
              <tr key={log.id} className="border-bottom border-light">
                {showCondo && (
                  <td className="px-4 py-3">
                    <div className="fw-bold text-dark small">
                      {log.condoNombre || "N/A"}
                    </div>
                  </td>
                )}
                <td className={showCondo ? "py-3" : "px-4 py-3"}>
                  <div className="fw-bold small">{log.placa}</div>
                  <div className="x-small text-muted">{log.vehiculoInfo}</div>
                </td>
                <td className="py-3 text-center">
                  <Badge bg="dark" className="rounded-2">
                    {log.estacionamientoNumero || log.id_estacionamiento}
                  </Badge>
                </td>
                <td className="py-3">
                  <div className="x-small">
                    <FaCalendarAlt className="me-1 text-muted" />{" "}
                    {formatDateTime(log.fecha_entrada)}
                  </div>
                </td>
                <td className="py-3">
                  <div className="x-small">
                    {log.fecha_salida
                      ? formatDateTime(log.fecha_salida)
                      : "---"}
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <Badge
                    bg={log.fecha_salida ? "secondary" : "info"}
                    className="rounded-pill px-3 py-1"
                  >
                    {log.fecha_salida ? "Fuera" : "En recinto"}
                  </Badge>
                </td>
              </tr>
            ))
          ) : (
            <EmptyState
              colSpan={showCondo ? 6 : 5}
              message="No hay registros de acceso vehicular."
              icon={FaCar}
            />
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default ActivityTable;
