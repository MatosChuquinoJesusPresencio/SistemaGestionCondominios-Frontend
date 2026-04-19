import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { condominios as mockCondominios } from '../../data/condominios';
import { apartamentos as mockApartamentos } from '../../data/apartamentos';
import { users as mockUsers } from '../../data/users';

import ApartamentoModal from './components/ApartamentoModal';
import ApartamentosFiltros from './components/ApartamentosFiltros';
import ApartamentosTabla from './components/ApartamentosTabla';
import ApartamentosPaginacion from './components/ApartamentosPaginacion';

const ApartamentosPage = () => {
  const { authUser } = useAuth();
  const [apartamentos, setApartamentos] = useState([]);
  const [condominios, setCondominios] = useState([]);
  
  // Filtros
  const [filtroCondominio, setFiltroCondominio] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('TODOS'); 

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modal
  const [modalState, setModalState] = useState({
    show: false,
    mode: null, 
    apartamento: null
  });

  // Inicializar datos con LocalStorage
  useEffect(() => {
    setCondominios(mockCondominios);
    
    const storedApts = localStorage.getItem('apartamentosMock');
    if (storedApts) {
      setApartamentos(JSON.parse(storedApts));
    } else {
      setApartamentos(mockApartamentos);
      localStorage.setItem('apartamentosMock', JSON.stringify(mockApartamentos));
    }
  }, []);

  const isAdmin = authUser?.role === 'SUPER_ADMIN';
  const isCondominioAdmin = authUser?.role === 'ADMIN_CONDOMINIO';
  const isPropietario = authUser?.role === 'PROPIETARIO';

  const userCondominioId = authUser?.id_condominio || 1; 

  const apartamentosFiltrados = useMemo(() => {
    let filtrados = apartamentos;

    if (isAdmin && filtroCondominio) {
      filtrados = filtrados.filter(a => a.id_condominio === parseInt(filtroCondominio));
    } else if (isCondominioAdmin) {
      filtrados = filtrados.filter(a => a.id_condominio === userCondominioId);
      
      if (filtroEstado === 'ASIGNADO') {
        filtrados = filtrados.filter(a => a.id_usuario !== null && a.id_usuario !== '');
      } else if (filtroEstado === 'DISPONIBLE') {
        filtrados = filtrados.filter(a => a.id_usuario === null || a.id_usuario === '');
      }
    } else if (isPropietario) {
      filtrados = filtrados.filter(a => a.id_usuario === authUser.id);
    }

    return filtrados.map(a => {
      const cond = condominios.find(c => c.id === a.id_condominio);
      const prop = mockUsers.find(u => u.id === parseInt(a.id_usuario));
      return {
        ...a,
        nombreCondominio: cond ? cond.nombre : 'Desconocido',
        nombrePropietario: prop ? prop.name : 'Sin Asignar'
      };
    });
  }, [apartamentos, condominios, filtroCondominio, filtroEstado, isAdmin, isCondominioAdmin, isPropietario, authUser, userCondominioId]);

  // Lógica de Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = apartamentosFiltrados.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(apartamentosFiltrados.length / itemsPerPage);

  // Resetear página si cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [filtroCondominio, filtroEstado, itemsPerPage]);

  const openModal = (mode, apt) => {
    setModalState({ show: true, mode, apartamento: apt });
  };

  const closeModal = () => {
    setModalState({ show: false, mode: null, apartamento: null });
  };

  const handleSave = (id, formData) => {
    setApartamentos(prev => {
      const newApartamentos = prev.map(apt => {
        if (apt.id === id) {
          if (modalState.mode === 'edit') {
            return {
              ...apt,
              numero: formData.numero,
              metraje: parseFloat(formData.metraje),
              derecho_estacionamiento: formData.derecho_estacionamiento
            };
          } else if (modalState.mode === 'assign') {
            return {
              ...apt,
              id_usuario: formData.id_usuario ? parseInt(formData.id_usuario) : null
            };
          }
        }
        return apt;
      });
      localStorage.setItem('apartamentosMock', JSON.stringify(newApartamentos));
      return newApartamentos;
    });
    closeModal();
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <h2 className="text-primary fw-bold mb-0">
          <i className="bi bi-building me-2"></i>
          Gestión de Apartamentos
        </h2>
        
        <ApartamentosFiltros 
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          isAdmin={isAdmin}
          condominios={condominios}
          filtroCondominio={filtroCondominio}
          setFiltroCondominio={setFiltroCondominio}
          isCondominioAdmin={isCondominioAdmin}
          filtroEstado={filtroEstado}
          setFiltroEstado={setFiltroEstado}
        />
      </div>

      {isPropietario ? (
        <div className="row g-4">
          {currentItems.length === 0 ? (
            <div className="col-12">
              <div className="alert alert-info border-0 shadow-sm">No tienes apartamentos asignados.</div>
            </div>
          ) : (
            currentItems.map(apt => (
              <div className="col-md-6 col-lg-4" key={apt.id}>
                <div className="card shadow-sm h-100 border-top border-4 border-info">
                  <div className="card-header bg-white border-0 pt-4 pb-0">
                    <h5 className="card-title text-dark fw-bold mb-0">Apartamento {apt.numero}</h5>
                    <p className="text-muted small mb-0">{apt.nombreCondominio}</p>
                  </div>
                  <div className="card-body">
                    <ul className="list-group list-group-flush mb-3">
                      <li className="list-group-item px-0 d-flex justify-content-between align-items-center">
                        <span className="text-muted">Propietario</span>
                        <span className="fw-medium text-dark">{apt.nombrePropietario}</span>
                      </li>
                      <li className="list-group-item px-0 d-flex justify-content-between align-items-center">
                        <span className="text-muted">Metraje</span>
                        <span className="fw-medium">{apt.metraje} m²</span>
                      </li>
                      <li className="list-group-item px-0 d-flex justify-content-between align-items-center">
                        <span className="text-muted">Estacionamiento</span>
                        {apt.derecho_estacionamiento ? (
                          <span className="badge bg-success rounded-pill px-3">Sí</span>
                        ) : (
                          <span className="badge bg-secondary rounded-pill px-3">No</span>
                        )}
                      </li>
                    </ul>
                  </div>
                  <div className="card-footer bg-light border-0 pb-3 text-center rounded-bottom">
                    <span className="text-muted small"><i className="bi bi-info-circle me-1"></i> Vista de solo lectura</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body p-0">
            <ApartamentosTabla 
              currentItems={currentItems}
              isAdmin={isAdmin}
              openModal={openModal}
            />
            
            <ApartamentosPaginacion 
              totalPages={totalPages}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              indexOfFirstItem={indexOfFirstItem}
              indexOfLastItem={indexOfLastItem}
              totalItems={apartamentosFiltrados.length}
            />
          </div>
        </div>
      )}

      <ApartamentoModal 
        show={modalState.show}
        mode={modalState.mode}
        apartamento={modalState.apartamento}
        onClose={closeModal}
        onSave={handleSave}
      />
    </div>
  );
};

export default ApartamentosPage;
