import { useState, useEffect } from "react";

const InquilinoForm = ({ onClose, inquilinoAEditar }) => {
    const [formData, setFormData] = useState({
        nombre: "",
        dni: "",
        apartamento: "",
        fechaInicio: "",
        fechaFin: ""
    });

    // Sincronizar datos si estamos editando
   useEffect(() => {
        if (inquilinoAEditar) {
            // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect
            setFormData(inquilinoAEditar);
        } else {
            // Limpiar formulario si es una creación nueva
            setFormData({ nombre: "", dni: "", apartamento: "", fechaInicio: "", fechaFin: "" });
        }
    }, [inquilinoAEditar]);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Datos guardados:", formData);
        onClose(); 
    };

    const handleApartamentoKeyDown = (e) => {
        const val = e.target.value;
        const key = e.key;

        if (['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Delete'].includes(key)) return;

        // Regla: 3 números, luego guion automático, luego 1 letra
        if (val.length < 3) {
            if (!/^[0-9]$/.test(key)) e.preventDefault();
        } else if (val.length === 3) {
            e.preventDefault();
            if (/^[A-Za-z]$/.test(key)) {
                const nuevoValor = `${val}-${key.toUpperCase()}`;
                e.target.value = nuevoValor;
                setFormData(prev => ({ ...prev, apartamento: nuevoValor }));
            }
        } else {
            e.preventDefault();
        }
    };

    return (
        <form className="row g-3" onSubmit={handleSubmit}>
            <div className="col-12">
                <label className="form-label fw-bold">Nombre Completo</label>
                <input 
                    type="text" className="form-control" maxLength="50"
                    value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value.replace(/[^A-Za-zÁáÉéÍíÓóÚúÑñ\s]/g, '')})}
                    required 
                />
            </div>

            <div className="col-md-6">
                <label className="form-label fw-bold">DNI / Documento</label>
                <input 
                    type="text" className="form-control" maxLength="8"
                    value={formData.dni}
                    onChange={(e) => setFormData({...formData, dni: e.target.value.replace(/[^0-9]/g, '')})}
                    required 
                />
            </div>

            <div className="col-md-6">
                <label className="form-label fw-bold">Apartamento</label>
                <input 
                    type="text" className="form-control" maxLength="5"
                    value={formData.apartamento}
                    onKeyDown={handleApartamentoKeyDown}
                    onChange={(e) => setFormData({...formData, apartamento: e.target.value})}
                    required 
                />
            </div>

            <div className="col-md-6">
                <label className="form-label fw-bold">Fecha de Inicio</label>
                <input 
                    type="date" className="form-control" required
                    value={formData.fechaInicio}
                    onChange={(e) => setFormData({...formData, fechaInicio: e.target.value})}
                />
            </div>
            <div className="col-md-6">
                <label className="form-label fw-bold">Fecha de Fin</label>
                <input 
                    type="date" className="form-control" required
                    value={formData.fechaFin}
                    onChange={(e) => setFormData({...formData, fechaFin: e.target.value})}
                />
            </div>

            <div className="modal-footer border-0 mt-3 d-flex justify-content-end">
                <button type="button" className="btn btn-outline-secondary me-2" onClick={onClose}>Cancelar</button>
                <button type="submit" className="btn btn-primary px-4">Guardar Inquilino</button>
            </div>
        </form>
    );
};

export default InquilinoForm;