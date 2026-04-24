const InquilinoForm = ({ onClose }) => {
    return (
        <form className="row g-3">
            <div className="col-12">
                <label className="form-label fw-bold">Nombre Completo</label>
                <input type="text" className="form-control" placeholder="Ej. Juan Pérez" required />
            </div>
            <div className="col-md-6">
                <label className="form-label fw-bold">DNI / Documento</label>
                <input type="text" className="form-control" placeholder="Ej. 12345678" required />
            </div>
            <div className="col-md-6">
                <label className="form-label fw-bold">Apartamento</label>
                <input type="text" className="form-control" placeholder="Ej. 302-B" required />
            </div>
            <div className="col-md-6">
                <label className="form-label fw-bold">Fecha de Inicio</label>
                <input type="date" className="form-control" required />
            </div>
            <div className="col-md-6">
                <label className="form-label fw-bold">Fecha de Fin</label>
                <input type="date" className="form-control" required />
            </div>
            <div className="modal-footer border-0 mt-3 d-flex justify-content-end">
                <button type="button" className="btn btn-outline-secondary me-2" onClick={onClose}>Cancelar</button>
                <button type="submit" className="btn btn-primary px-4">Guardar Inquilino</button>
            </div>
        </form>
    );
};

export default InquilinoForm;