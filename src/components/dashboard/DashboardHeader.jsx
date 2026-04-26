const DashboardHeader = ({
  icon: Icon,
  title,
  badgeText,
  welcomeText,
  children,
}) => {
  return (
    <div className="row mb-5 align-items-center">
      <div className="col-12 col-md-8">
        <div className="d-flex align-items-center gap-3 mb-2">
          <div className="p-2 rounded-3 bg-white shadow-sm border border-primary border-opacity-10">
            <Icon className="fs-4" style={{ color: "var(--primary-color)" }} />
          </div>
          <h2
            className="fw-bold mb-0 tracking-tight"
            style={{ color: "var(--primary-color)", fontSize: "1.75rem" }}
          >
            {title}
          </h2>
        </div>
        <p className="text-muted mb-0 ms-1 d-flex align-items-center gap-2">
          <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-10 px-2 py-1 rounded-1 small">
            {badgeText}
          </span>
          <span className="text-secondary opacity-75">{welcomeText}</span>
        </p>
      </div>
      {children && (
        <div className="col-12 col-md-4 text-md-end mt-3 mt-md-0">
          {children}
        </div>
      )}
    </div>
  );
};

export default DashboardHeader;
