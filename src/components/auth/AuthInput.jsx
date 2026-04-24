const AuthInput = ({ label, icon, type, placeholder, register, name, validation, error }) => {
    const iconClass = icon === "envelope" ? "bi bi-envelope" : icon === "lock" ? "bi bi-lock" : "bi bi-lock-fill";

    return (
        <div className="mb-4">
            <label className="form-label text-secondary fw-semibold small mb-1">{label}</label>
            <div className="input-group">
                <span className={`input-group-text bg-white border-end-0 ${error ? "border-danger text-danger" : "text-muted"}`}>
                    <i className={iconClass}></i>
                </span>
                <input
                    type={type}
                    placeholder={placeholder}
                    className={`form-control border-start-0 ps-0 input-no-shadow ${error ? "is-invalid" : ""}`}
                    {...register(name, validation)}
                />
                {error && (
                    <div className="invalid-feedback d-block mt-1">{error.message}</div>
                )}
            </div>
        </div>
    );
};

export default AuthInput;