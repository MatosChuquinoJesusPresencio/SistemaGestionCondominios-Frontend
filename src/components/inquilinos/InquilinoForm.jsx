const InquilinoForm = ({ onClose }) => {
    
    // Función para validar apartamento: 3 números + guion + 1 letra mayúscula
    const handleApartamentoChange = (e) => {
        let val = e.target.value.toUpperCase();
        // Expresión regular: ^\d{0,3}(-?[A-Z]{0,1})?$
        // Permite escribir progresivamente: 123 -> 123- -> 123-A
        const regex = /^(\d{0,3})(-?[A-Z]?)?$/;
        if (regex.test(val)) {
            e.target.value = val;
        } else {
            e.target.value = e.target.value.slice(0, -1);
        }
    };

    return (
        <form className="row g-3">
            {/* Nombre: Solo letras y espacios, máx 50 caracteres */}
            <div className="col-12">
                <label className="form-label fw-bold">Nombre Completo</label>
                <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Ej. Juan Pérez" 
                    pattern="[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+" 
                    maxLength="50"
                    onInput={(e) => e.target.value = e.target.value.replace(/[^A-Za-zÁáÉéÍíÓóÚúÑñ\s]/g, '')}
                    required 
                />
            </div>

            {/* DNI: Solo números, exactamente 8 dígitos (típico de DNI) */}
            <div className="col-md-6">
                <label className="form-label fw-bold">DNI / Documento</label>
                <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Ej. 12345678" 
                    maxLength="8"
                    onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')}
                    required 
                />
            </div>

            {/* Apartamento: 123-A */}
            <div className="col-md-6">
                <label className="form-label fw-bold">Apartamento</label>
                <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Ej. 123-A" 
                    maxLength="5"
                    onChange={handleApartamentoChange}
                    required 
                />
            </div>

            {/* Fechas */}
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