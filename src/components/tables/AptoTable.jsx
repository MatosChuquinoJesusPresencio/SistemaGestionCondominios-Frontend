import React, { useState, useMemo } from "react";
import { Table, Button } from "react-bootstrap";
import { FaHome, FaEdit, FaTrash, FaUser } from "react-icons/fa";
import SearchBar from "../ui/SearchBar";
import TablePagination from "../ui/TablePagination";
import EmptyState from "../ui/EmptyState";

const AptoTable = ({ data, pisos, torres, usuarios, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [towerFilter, setTowerFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const filtered = useMemo(() => {
    return data.filter((a) => {
      const piso = pisos.find((p) => p.id === a.id_piso);
      const owner = usuarios.find((u) => u.id === a.id_usuario);
      const matchesSearch =
        a.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (owner?.nombre || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTower =
        towerFilter === "all" || piso?.id_torre.toString() === towerFilter;
      return matchesSearch && matchesTower;
    });
  }, [data, searchTerm, towerFilter, pisos, usuarios]);

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
          placeholder="Buscar por número o propietario..."
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
              <th className="px-4 py-3 border-0">Apartamento</th>
              <th className="py-3 border-0">Ubicación</th>
              <th className="py-3 border-0">Propietario</th>
              <th className="px-4 py-3 border-0 text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length > 0 ? (
              paginated.map((apto) => {
                const piso = pisos.find((p) => p.id === apto.id_piso);
                const torre = torres.find((t) => t.id === piso?.id_torre);
                const owner = usuarios.find((u) => u.id === apto.id_usuario);

                return (
                  <tr key={apto.id} className="border-bottom border-light">
                    <td className="px-4 py-3">
                      <div className="d-flex align-items-center gap-3">
                        <div className="p-2 rounded-3 bg-success bg-opacity-10 text-primary-theme">
                          <FaHome />
                        </div>
                        <div>
                          <div className="fw-bold text-dark">
                            Apto {apto.numero}
                          </div>
                          <div className="x-small text-muted">
                            {apto.metraje} m²
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="small fw-medium">
                        {torre?.nombre} • Piso {piso?.numero_piso}
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="d-flex align-items-center gap-2 small">
                        <FaUser className="text-muted x-small" />
                        <span
                          className={
                            owner
                              ? "text-dark fw-semibold"
                              : "text-danger italic"
                          }
                        >
                          {owner?.nombre || "Sin asignar"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-end">
                      <div className="d-flex justify-content-end gap-2">
                        <Button
                          variant="light"
                          className="btn btn-sm btn-primary-theme btn-action-sm"
                          onClick={() => onEdit(apto)}
                        >
                          <FaEdit /> <span>Editar</span>
                        </Button>
                        <Button
                          variant="light"
                          className="btn btn-sm btn-primary-theme btn-action-sm"
                          onClick={() => onDelete(apto)}
                        >
                          <FaTrash /> <span>Eliminar</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <EmptyState
                colSpan={4}
                message="No hay apartamentos registrados."
                icon={FaHome}
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

export default AptoTable;
