import { Modal } from "react-bootstrap";
import { FaBuilding, FaUsersCog, FaCog, FaPlusCircle, FaMapMarkerAlt, FaCalendarAlt, FaInfoCircle, FaExclamationTriangle } from "react-icons/fa";
import { useData } from "../../hooks/useData";

const CondoDetailModal = ({ show, onHide, condo }) => {
    const { getTable } = useData();
    
    if (!condo) return null;

    const usuarios = getTable('usuarios');
    const admin = usuarios.find(u => u.id_condominio === condo.id && u.id_rol === 2);
    
    const torres = getTable('torres').filter(t => t.id_condominio === condo.id);
    const torreIds = torres.map(t => t.id);
    
    const pisos = getTable('pisos').filter(p => torreIds.includes(p.id_torre));
    const pisoIds = pisos.map(p => p.id);
    
    const aptos = getTable('apartamentos').filter(a => pisoIds.includes(a.id_piso));
    const usersInCondo = getTable('usuarios').filter(u => u.id_condominio === condo.id);
    const carts = getTable('carritos_carga').filter(c => c.id_condominio === condo.id);
    const config = getTable('configuraciones').find(c => c.id_condominio === condo.id);

    const stats = {
        torres: torres.length,
        pisos: pisos.length,
        apartamentos: aptos.length,
        usuarios: usersInCondo.length,
        carritos: carts.length,
        config: config
    };

    return (
        <Modal show={show} onHide={onHide} centered size="lg" className="border-0 shadow-lg">
            <Modal.Header closeButton className="border-0 pb-0 bg-white">
                <Modal.Title className="fw-bold text-primary-theme d-flex align-items-center gap-2">
                    <div className="p-2 rounded-3 bg-primary-theme bg-opacity-10 text-primary-theme">
                        <FaInfoCircle />
                    </div>
                    Detalles del Condominio
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-3 bg-white">
                <div className="row g-4">
                    <div className="col-12 col-md-6">
                        <div className="card border-0 bg-light rounded-4 p-4 h-100">
                            <h6 className="text-muted small text-uppercase fw-bold mb-3">Información General</h6>
                            <h3 className="fw-bold text-dark mb-1">{condo.nombre}</h3>
                            <p className="text-secondary mb-3">{condo.direccion}, {condo.ciudad}</p>
                            <div className="d-flex align-items-center gap-2 text-muted small">
                                <FaCalendarAlt /> Registrado el {new Date(condo.fecha_creacion).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}
                            </div>
                            
                            <div className="mt-4 pt-3 border-top border-secondary border-opacity-10">
                                <h6 className="text-muted small text-uppercase fw-bold mb-2 text-secondary">Administrador Asignado</h6>
                                {admin ? (
                                    <div className="d-flex align-items-center gap-3 bg-white p-3 rounded-3 border">
                                        <div className="p-2 rounded-circle bg-primary-theme bg-opacity-10 text-primary-theme">
                                            <FaUsersCog size={20} />
                                        </div>
                                        <div className="overflow-hidden">
                                            <div className="fw-bold text-dark text-truncate">{admin.nombre}</div>
                                            <div className="small text-muted text-truncate">{admin.email}</div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="alert alert-light border small text-muted py-2">No hay un administrador asignado actualmente.</div>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    <div className="col-12 col-md-6">
                        <div className="row g-3">
                            <div className="col-6">
                                <div className="bg-white border rounded-4 p-3 text-center shadow-sm h-100 transition-all hover-up">
                                    <div className="text-primary-theme fs-4 mb-1"><FaBuilding /></div>
                                    <div className="fw-bold fs-5">{stats.torres}</div>
                                    <div className="x-small text-muted text-uppercase fw-bold">Torres</div>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="bg-white border rounded-4 p-3 text-center shadow-sm h-100 transition-all hover-up">
                                    <div className="text-secondary-theme fs-4 mb-1"><FaMapMarkerAlt /></div>
                                    <div className="fw-bold fs-5">{stats.apartamentos}</div>
                                    <div className="x-small text-muted text-uppercase fw-bold">Aptos.</div>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="bg-white border rounded-4 p-3 text-center shadow-sm h-100 transition-all hover-up">
                                    <div className="text-primary-theme fs-4 mb-1"><FaUsersCog size={24} /></div>
                                    <div className="fw-bold fs-5">{stats.usuarios}</div>
                                    <div className="x-small text-muted text-uppercase fw-bold">Usuarios</div>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="bg-white border rounded-4 p-3 text-center shadow-sm h-100 transition-all hover-up">
                                    <div className="text-secondary-theme fs-4 mb-1"><FaPlusCircle /></div>
                                    <div className="fw-bold fs-5">{stats.carritos}</div>
                                    <div className="x-small text-muted text-uppercase fw-bold">Carritos</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {stats.config ? (
                        <div className="col-12">
                            <div className="card border-0 bg-primary-theme bg-opacity-10 rounded-4 p-4 shadow-sm">
                                <h6 className="text-primary-theme small text-uppercase fw-bold mb-3 d-flex align-items-center gap-2">
                                    <FaCog /> Configuración del Sistema
                                </h6>
                                <div className="row g-3">
                                    <div className="col-6 col-md-3">
                                        <div className="x-small text-muted text-uppercase fw-bold mb-1">Máx. Autos</div>
                                        <div className="fw-bold text-dark fs-5">{stats.config.max_autos}</div>
                                    </div>
                                    <div className="col-6 col-md-3">
                                        <div className="x-small text-muted text-uppercase fw-bold mb-1">Máx. Motos</div>
                                        <div className="fw-bold text-dark fs-5">{stats.config.max_motos}</div>
                                    </div>
                                    <div className="col-6 col-md-3">
                                        <div className="x-small text-muted text-uppercase fw-bold mb-1">Préstamo</div>
                                        <div className="fw-bold text-dark fs-5">{stats.config.tiempo_max_prestamo_min} min.</div>
                                    </div>
                                    <div className="col-6 col-md-3">
                                        <div className="x-small text-muted text-uppercase fw-bold mb-1">Penalización</div>
                                        <div className="fw-bold text-dark fs-5">S/ {stats.config.penalizacion_por_minuto.toFixed(2)}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="col-12">
                            <div className="alert alert-warning bg-warning bg-opacity-10 border-warning border-opacity-25 rounded-4 p-4 d-flex align-items-center gap-3">
                                <FaExclamationTriangle className="text-warning fs-4" />
                                <div>
                                    <h6 className="fw-bold text-dark mb-1">Aún no está configurada</h6>
                                    <p className="small text-secondary mb-0">Este condominio no tiene una configuración del sistema activa. Algunas funcionalidades podrían no estar disponibles.</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default CondoDetailModal;
