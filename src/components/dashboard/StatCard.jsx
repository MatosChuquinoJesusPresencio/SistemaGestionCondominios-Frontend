const StatCard = ({ icon: Icon, label, value, colorClass = "primary", colSize, useFullHeight = true }) => {
    return (
        <div className={colSize || "col-12 col-sm-6 col-xl-3"}>
            <div className={`card card-custom p-3 ${useFullHeight ? 'h-100' : ''} border-start border-${colorClass} border-5`}>
                <div className="d-flex align-items-center">
                    <div className={`bg-${colorClass} bg-opacity-10 p-3 rounded-circle me-3 flex-shrink-0`}>
                        <Icon className={`text-${colorClass} fs-4`} />
                    </div>
                    <div className="min-w-0 flex-grow-1">
                        <h6 className="text-muted fw-semibold mb-1 small text-uppercase" style={{ wordBreak: 'break-word', lineHeight: '1.2' }}>{label}</h6>
                        <h4 className="fw-bold mb-0">{value}</h4>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatCard;
