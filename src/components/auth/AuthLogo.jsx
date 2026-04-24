import logoSinFondo from "../../assets/logo-sin-fondo.svg";

const AuthLogo = ({ title, subtitle }) => {
    return (
        <div className="text-center mb-4">
            <img
                src={logoSinFondo}
                alt="Logo Condominio"
                className="mb-3 rounded-circle shadow-sm login-logo"
            />
            <h3 className="fw-bold text-dark mb-0 login-title">{title}</h3>
            {subtitle && <p className="text-muted small">{subtitle}</p>}
        </div>
    );
};

export default AuthLogo;