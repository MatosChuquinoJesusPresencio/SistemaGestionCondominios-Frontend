import { useState, useMemo } from "react";
import { Table, Button, Badge } from "react-bootstrap";
import { FaBuilding, FaEdit, FaTrash } from "react-icons/fa";
import SearchBar from "../ui/SearchBar";
import TablePagination from "../ui/TablePagination";
import EmptyState from "../ui/EmptyState";

const TowerTable = ({ data, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const filtered = useMemo(() => {
    return data.filter((t) =>
      t.nombre.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [data, searchTerm]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <>
      <div className="mb-4">
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={(val) => {
            setSearchTerm(val);
            setCurrentPage(1);
          }}
          placeholder="Buscar torre por nombre..."
        />
      </div>
      <div className="table-responsive">
        <Table hover className="align-middle mb-0 custom-table">
          <thead className="bg-light text-muted small text-uppercase">
            <tr>
              <th className="px-4 py-3 border-0">Nombre de la Torre</th>
              <th className="py-3 border-0">ID Referencia</th>
              <th className="px-4 py-3 border-0 text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length > 0 ? (
              paginated.map((tower) => (
                <tr key={tower.id} className="border-bottom border-light">
                  <td className="px-4 py-3">
                    <div className="d-flex align-items-center gap-3">
                      <div className="p-2 rounded-3 bg-primary bg-opacity-10 text-primary-theme">
                        <FaBuilding />
                      </div>
                      <div className="fw-bold text-dark">{tower.nombre}</div>
                    </div>
                  </td>
                  <td className="py-3 text-muted small">#{tower.id}</td>
                  <td className="px-4 py-3 text-end">
                    <div className="d-flex justify-content-end gap-2">
                      <Button
                        variant="light"
                        className="btn btn-primary-theme d-inline-flex align-items-center gap-2 shadow-sm px-4 py-2 rounded-3 fw-semibold transition-all"
                        onClick={() => onEdit(tower)}
                      >
                        <FaEdit /> <span>Editar</span>
                      </Button>
                      <Button
                        variant="light"
                        className="btn btn-primary-theme d-inline-flex align-items-center gap-2 shadow-sm px-4 py-2 rounded-3 fw-semibold transition-all"
                        onClick={() => onDelete(tower)}
                      >
                        <FaTrash /> <span>Eliminar</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <EmptyState
                colSpan={3}
                message="No hay torres registradas."
                icon={FaBuilding}
              />
            )}
          </tbody>
        </Table>
      </div>
      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={filtered.length}
        itemsShowing={paginated.length}
      />
    </>
  );
};

export default TowerTable;
