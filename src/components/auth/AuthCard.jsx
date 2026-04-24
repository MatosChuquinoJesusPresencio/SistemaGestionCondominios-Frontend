const AuthCard = ({ children }) => {
    return (
        <div className="card border-0 shadow-lg position-relative p-4 rounded-4 login-glass-card login-card-container">
            {children}
        </div>
    );
};

export default AuthCard;