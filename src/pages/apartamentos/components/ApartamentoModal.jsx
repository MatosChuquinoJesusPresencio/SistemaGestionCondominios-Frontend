import { useState, useEffect } from 'react';
import { users as mockUsers } from '../../../data/users';

const ApartamentoModal = ({ show, onClose, mode, apartamento, onSave }) => {
  const [formData, setFormData] = useState({
    numero: '',
    metraje: '',
    derecho_estacionamiento: false,
    id_usuario: '',
    id_condominio: ''
  });

  const propietarios = mockUsers.filter(u => u.role === 'PROPIETARIO');

  useEffect(() => {
    if (show) {
      if (mode === 'create') {
        setFormData({
          numero: '',
          metraje: '',
          derecho_estacionamiento: false,
          id_usuario: '',
          id_condominio: apartamento?.id_condominio || 1
        });
      } else if (apartamento) {
        setFormData({
          numero: apartamento.numero || '',
          metraje: apartamento.metraje || '',
          derecho_estacionamiento: apartamento.derecho_estacionamiento || false,
          id_usuario: apartamento.id_usuario || '',
          id_condominio: apartamento.id_condominio || 1
        });
      }
    }
  }, [apartamento, show, mode]);

  if (!show) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(apartamento ? apartamento.id : null, formData);
  };

  const title = mode === 'edit' ? 'Editar Apartamento' : 
                mode === 'assign' ? 'Asociar Propietario' : 
                'Crear Apartamento';

  return (
    <>
      <div className="modal-backdrop fade show" style={{ zIndex: 1040 }}></div>
      <div className="modal fade show d-block" tabIndex="-1" style={{ zIndex: 1050 }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg">
            <div className="modal-header bg-light border-0">
              <h5 className="modal-title fw-bold text-primary">
                {mode === 'edit' && <i className="bi bi-pencil me-2"></i>}
                {mode === 'assign' && <i className="bi bi-person-plus me-2"></i>}
                {mode === 'create' && <i className="bi bi-plus-circle me-2"></i>}
                {title}
              </h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            
            <div className="modal-body">
              <form id="apartamentoForm" onSubmit={handleSubmit}>
                {(mode === 'edit' || mode === 'create') && (
                  <>
                    <div className="mb-3">
                      <label className="form-label text-muted fw-semibold">Número de Apartamento</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        name="numero" 
                        value={formData.numero} 
                        onChange={handleChange}
                        required 
                        placeholder="Ej. 101, A-1"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label text-muted fw-semibold">Metraje (m²)</label>
                      <input 
                        type="number" 
                        step="0.01" 
                        className="form-control" 
                        name="metraje" 
                        value={formData.metraje} 
                        onChange={handleChange}
                        required 
                        placeholder="Ej. 85.50"
                      />
                    </div>
                    <div className="mb-3 form-check form-switch">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        id="estacionamientoSwitch"
                        name="derecho_estacionamiento"
                        checked={formData.derecho_estacionamiento}
                        onChange={handleChange}
                      />
                      <label className="form-check-label text-muted fw-semibold" htmlFor="estacionamientoSwitch">
                        Derecho a Estacionamiento
                      </label>
                    </div>
                  </>
                )}

                {(mode === 'assign' || mode === 'create') && (
                  <div className="mb-3">
                    <label className="form-label text-muted fw-semibold">Propietario Asociado</label>
                    <select 
                      className="form-select" 
                      name="id_usuario" 
                      value={formData.id_usuario} 
                      onChange={handleChange}
                    >
                      <option value="">-- Sin asignar --</option>
                      {propietarios.map(prop => (
                        <option key={prop.id} value={prop.id}>
                          {prop.name} ({prop.email})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </form>
            </div>
            
            <div className="modal-footer border-0">
              <button type="button" className="btn btn-light" onClick={onClose}>Cancelar</button>
              <button type="submit" form="apartamentoForm" className="btn btn-primary px-4">
                Guardar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ApartamentoModal;
