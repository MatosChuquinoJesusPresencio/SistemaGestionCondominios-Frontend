import { FaInbox } from "react-icons/fa";

const EmptyState = ({
  message = "No hay registros encontrados",
  icon: Icon = FaInbox,
  colSpan = 1,
}) => {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className="text-center py-5 text-muted small italic"
      >
        <div className="d-flex flex-column align-items-center gap-2">
          <Icon size={30} className="opacity-25" />
          <span>{message}</span>
        </div>
      </td>
    </tr>
  );
};

export default EmptyState;
