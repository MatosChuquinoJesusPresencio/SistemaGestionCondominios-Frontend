const ApartamentosFiltros = ({
  itemsPerPage,
  setItemsPerPage,
  isAdmin,
  condominios,
  filtroCondominio,
  setFiltroCondominio,
  isCondominioAdmin,
  filtroEstado,
  setFiltroEstado
}) => {
  return (
    <div className="d-flex flex-wrap gap-2">
      {/* Selector de cantidad por página */}
      <div className="d-flex align-items-center bg-white p-2 rounded shadow-sm border border-light">
        <label className="me-2 fw-semibold text-muted small mb-0">Mostrar:</label>
        <select 
          className="form-select form-select-sm" 
          value={itemsPerPage}
          onChange={(e) => setItemsPerPage(Number(e.target.value))}
          style={{ minWidth: '70px' }}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>

      {/* Filtro SUPER_ADMIN */}
      {isAdmin && (
        <div className="d-flex align-items-center bg-white p-2 rounded shadow-sm border border-light">
          <label className="me-2 fw-semibold text-muted small mb-0">Condominio:</label>
          <select 
            className="form-select form-select-sm" 
            value={filtroCondominio}
            onChange={(e) => setFiltroCondominio(e.target.value)}
            style={{ minWidth: '180px' }}
          >
            <option value="">Todos</option>
            {condominios.map(c => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
        </div>
      )}

      {/* Filtro ADMIN_CONDOMINIO */}
      {isCondominioAdmin && (
        <div className="d-flex align-items-center bg-white p-2 rounded shadow-sm border border-light">
          <label className="me-2 fw-semibold text-muted small mb-0">Estado:</label>
          <select 
            className="form-select form-select-sm" 
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            style={{ minWidth: '130px' }}
          >
            <option value="TODOS">Todos</option>
            <option value="ASIGNADO">Asignados</option>
            <option value="DISPONIBLE">Disponibles</option>
          </select>
        </div>
      )}
    </div>
  );
};

export default ApartamentosFiltros;
