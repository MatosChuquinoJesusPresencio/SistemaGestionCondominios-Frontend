const InquilinoForm = ({ onClose }) => {

    // Control estricto para el formato: 3 números + guion + 1 letra mayúscula
    const handleApartamentoKeyDown = (e) => {
        const val = e.target.value;
        const key = e.key;

        // Permitir teclas de control para navegación y borrado
        if (['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Delete'].includes(key)) return;

        // POSICIONES 0, 1, 2: Solo permitir números
        if (val.length < 3) {
            if (!/^[0-9]$/.test(key)) e.preventDefault();
        }
        
        // POSICIÓN 3: Insertar guion automáticamente y forzar mayúscula
        else if (val.length === 3) {
            e.preventDefault();
            if (/^[A-Za-z]$/.test(key)) {
                e.target.value = `${val}-${key.toUpperCase()}`;
            }
        }
        
        // POSICIÓN 4 en adelante: Bloquear cualquier escritura adicional
        else {
            e.preventDefault();
        }
    };

    return (
        <form className="row g-3">
            {/* Nombre Completo: Solo letras */}
            <div className="col-12">
                <label className="form-label fw-bold">Nombre Completo</label>
                <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Ej. Juan Pérez" 
                    maxLength="50"
                    onInput={(e) => e.target.value = e.target.value.replace(/[^A-Za-zÁáÉéÍíÓóÚúÑñ\s]/g, '')}
                    required 
                />
            </div>

            {/* DNI / Documento: Solo números */}
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

            {/* Apartamento: Formato estricto 555-J */}
            <div className="col-md-6">
                <label className="form-label fw-bold">Apartamento</label>
                <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Ej. 123-J" 
                    maxLength="5"
                    onKeyDown={handleApartamentoKeyDown}
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

            {/* Botones */}
            <div className="modal-footer border-0 mt-3 d-flex justify-content-end">
                <button 
                    type="button" 
                    className="btn btn-outline-secondary me-2" 
                    onClick={onClose}
                >
                    Cancelar
                </button>
                <button type="submit" className="btn btn-primary px-4">
                    Guardar Inquilino
                </button>
            </div>
        </form>
    );
};

export default InquilinoForm;