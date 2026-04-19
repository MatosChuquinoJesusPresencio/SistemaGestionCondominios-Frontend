const ApartamentosTabla = ({ currentItems, isAdmin, openModal }) => {
  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle mb-0">
        <thead className="table-light">
          <tr>
            <th className="px-4 py-3">Número</th>
            {isAdmin && <th className="py-3">Condominio</th>}
            <th className="py-3">Propietario</th>
            <th className="py-3">Metraje</th>
            <th className="py-3 text-center">Estacionamiento</th>
            <th className="px-4 py-3 text-end">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length === 0 ? (
            <tr>
              <td colSpan={isAdmin ? 6 : 5} className="text-center py-5 text-muted">
                <div className="mb-2"><i className="bi bi-inbox fs-2"></i></div>
                No se encontraron apartamentos.
              </td>
            </tr>
          ) : (
            currentItems.map(apt => (
              <tr key={apt.id}>
                <td className="px-4 py-3 fw-medium">Apt. {apt.numero}</td>
                {isAdmin && <td className="py-3">{apt.nombreCondominio}</td>}
                <td className="py-3">
                  {apt.id_usuario ? (
                    <span className="fw-semibold text-primary">{apt.nombrePropietario}</span>
                  ) : (
                    <span className="badge bg-warning text-dark">Sin Asignar</span>
                  )}
                </td>
                <td className="py-3 text-muted">{apt.metraje} m²</td>
                <td className="py-3 text-center">
                  {apt.derecho_estacionamiento ? (
                    <i className="bi bi-check-circle-fill text-success fs-5"></i>
                  ) : (
                    <i className="bi bi-dash-circle text-muted fs-5"></i>
                  )}
                </td>
                <td className="px-4 py-3 text-end">
                  <button 
                    className="btn btn-sm btn-outline-primary me-2" 
                    title="Editar"
                    onClick={() => openModal('edit', apt)}
                  >
                    <i className="bi bi-pencil"></i> Editar
                  </button>
                  <button 
                    className={`btn btn-sm ${apt.id_usuario ? 'btn-outline-secondary' : 'btn-outline-success'}`}
                    title="Asociar Propietario"
                    onClick={() => openModal('assign', apt)}
                  >
                    <i className="bi bi-person-plus"></i> {apt.id_usuario ? 'Reasignar' : 'Asociar'}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ApartamentosTabla;
