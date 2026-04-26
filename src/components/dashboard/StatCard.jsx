const StatCard = ({ icon: Icon, label, value, colorClass = "primary" }) => {
    return (
        <div className="col-12 col-sm-6 col-xl-3">
            <div className={`card card-custom p-3 h-100 border-start border-${colorClass} border-5`}>
                <div className="d-flex align-items-center">
                    <div className={`bg-${colorClass} bg-opacity-10 p-3 rounded-circle me-3`}>
                        <Icon className={`text-${colorClass} fs-4`} />
                    </div>
                    <div>
                        <h6 className="text-muted fw-semibold mb-1 small text-uppercase">{label}</h6>
                        <h4 className="fw-bold mb-0">{value}</h4>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatCard;
