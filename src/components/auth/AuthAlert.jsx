const AuthAlert = ({ type, message, onClose }) => {
    const alertClass = type === "danger" ? "alert-danger" : "alert-success";
    const iconClass = type === "danger" ? "bi bi-exclamation-triangle-fill" : "bi bi-check-circle-fill";

    return (
        <div className={`alert ${alertClass} d-flex align-items-center justify-content-center position-relative py-2 border-0 rounded-3 shadow-sm text-center`}>
            <span className="small"><i className={`${iconClass} me-2`}></i>{message}</span>
            {onClose && (
                <button
                    type="button"
                    className="btn-close alert-close-small position-absolute end-0 me-3"
                    onClick={onClose}
                />
            )}
        </div>
    );
};

export default AuthAlert;