const AuthInput = ({ label, type, placeholder, register, name, validation, error }) => {
    return (
        <div className="mb-4">
            <label className="form-label text-secondary fw-semibold small mb-1">
                {label}
            </label>

            <input
                type={type}
                placeholder={placeholder}
                className={`form-control input-no-shadow ${error ? "is-invalid" : ""}`}
                {...register(name, validation)}
            />

            {error && (
                <div className="invalid-feedback d-block mt-1">
                    {error.message}
                </div>
            )}
        </div>
    );
};

export default AuthInput;