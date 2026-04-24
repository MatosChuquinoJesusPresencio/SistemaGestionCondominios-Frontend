const AuthButton = ({ type, text, loadingText, loading, id }) => {
    return (
        <button
            type={type}
            id={id}
            className="btn w-100 text-light py-2 rounded-3 fw-semibold shadow-sm transition btn-login"
            disabled={loading}
        >
            {loading && <span className="spinner-border spinner-border-sm me-2"></span>}
            {loading ? loadingText : text}
        </button>
    );
};

export default AuthButton;