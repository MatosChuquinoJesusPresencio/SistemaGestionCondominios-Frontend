const DashboardTable = ({ title, buttonText, onButtonClick, headers, children, colSize = "col-xl-6" }) => {
    return (
        <div className={`col-12 ${colSize}`}>
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100 bg-white">
                <div className="card-header border-0 py-4 px-4 bg-white d-flex justify-content-between align-items-center">
                    <h5 className="fw-bold mb-0" style={{ color: "var(--secondary-color)" }}>{title}</h5>
                    {buttonText && (
                        <button 
                            className="btn btn-secondary-theme btn-sm px-4 rounded-pill fw-bold shadow-sm"
                            onClick={onButtonClick}
                        >
                            {buttonText}
                        </button>
                    )}
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="bg-light">
                                <tr className="text-secondary x-small text-uppercase fw-bold">
                                    {headers.map((header, index) => (
                                        <th 
                                            key={index} 
                                            className={`${index === 0 ? 'px-4' : ''} ${index === headers.length - 1 ? 'px-4 text-end' : ''} py-3 border-0`}
                                        >
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {children}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardTable;
