import { useState, useMemo } from "react";
import { Table, Button, Badge } from "react-bootstrap";
import { FaLayerGroup, FaEdit, FaTrash } from "react-icons/fa";
import SearchBar from "../ui/SearchBar";
import TablePagination from "../ui/TablePagination";
import EmptyState from "../ui/EmptyState";

const FloorTable = ({ data, torres, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [towerFilter, setTowerFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const filtered = useMemo(() => {
    return data.filter((f) => {
      const matchesSearch = f.numero_piso.toString().includes(searchTerm);
      const matchesTower =
        towerFilter === "all" || f.id_torre.toString() === towerFilter;
      return matchesSearch && matchesTower;
    });
  }, [data, searchTerm, towerFilter]);

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
          placeholder="Buscar por número de piso..."
          filterValue={towerFilter}
          onFilterChange={(val) => {
            setTowerFilter(val);
            setCurrentPage(1);
          }}
          filterOptions={[
            { value: "all", label: "Todas las Torres" },
            ...torres.map((t) => ({ value: t.id.toString(), label: t.nombre })),
          ]}
          colSize={{ search: 6, filter: 6 }}
        />
      </div>
      <div className="table-responsive">
        <Table hover className="align-middle mb-0 custom-table">
          <thead className="bg-light text-muted small text-uppercase">
            <tr>
              <th className="px-4 py-3 border-0">Número de Piso</th>
              <th className="py-3 border-0">Torre Perteneciente</th>
              <th className="px-4 py-3 border-0 text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length > 0 ? (
              paginated.map((floor) => (
                <tr key={floor.id} className="border-bottom border-light">
                  <td className="px-4 py-3">
                    <div className="d-flex align-items-center gap-3">
                      <div className="p-2 rounded-3 bg-info bg-opacity-10 text-primary-theme">
                        <FaLayerGroup />
                      </div>
                      <div className="fw-bold text-dark">
                        Piso {floor.numero_piso}
                      </div>
                    </div>
                  </td>
                  <td className="py-3">
                    <Badge bg="light" className="text-dark border fw-normal">
                      {torres.find((t) => t.id === floor.id_torre)?.nombre ||
                        "N/A"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-end">
                    <div className="d-flex justify-content-end gap-2">
                      <Button
                        variant="light"
                        className="btn-primary-theme btn-action"
                        onClick={() => onEdit(floor)}
                      >
                        <FaEdit /> <span>Editar</span>
                      </Button>
                      <Button
                        variant="light"
                        className="btn-primary-theme btn-action"
                        onClick={() => onDelete(floor)}
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
                message="No hay pisos registrados."
                icon={FaLayerGroup}
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

export default FloorTable;
