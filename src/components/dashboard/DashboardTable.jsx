import { Form, InputGroup, Pagination } from "react-bootstrap";
import { FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const DashboardTable = ({ 
    title, 
    buttonText, 
    onButtonClick, 
    headers, 
    children, 
    colSize = "col-xl-6",
    searchPlaceholder = "Buscar...",
    searchValue = "",
    onSearchChange = null,
    currentPage = 1,
    totalPages = 1,
    onPageChange = null
}) => {
    return (
        <div className={`col-12 ${colSize}`}>
            <div className="card card-custom overflow-hidden h-100">
                <div className="card-header border-0 py-4 px-4 bg-white d-flex flex-wrap justify-content-between align-items-center gap-3">
                    <div className="d-flex align-items-center gap-3 flex-grow-1">
                        <h5 className="fw-bold mb-0 text-secondary-theme">{title}</h5>
                        
                        {onSearchChange && (
                            <InputGroup className="search-group-table rounded-pill border overflow-hidden ms-2" style={{ maxWidth: '280px' }}>
                                <InputGroup.Text className="bg-transparent border-0 text-muted ps-3 py-1">
                                    <FaSearch size={14} />
                                </InputGroup.Text>
                                <Form.Control 
                                    placeholder={searchPlaceholder}
                                    className="border-0 shadow-none py-1 small"
                                    value={searchValue}
                                    onChange={onSearchChange}
                                    style={{ fontSize: '0.85rem' }}
                                />
                            </InputGroup>
                        )}
                    </div>

                    {buttonText && (
                        <button 
                            className="btn btn-sm btn-primary-theme btn-action-sm"
                            onClick={onButtonClick}
                        >
                            {buttonText}
                        </button>
                    )}
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0 table-custom-bordered">
                            <thead className="bg-light">
                                <tr className="text-secondary x-small text-uppercase fw-bold">
                                    {headers.map((header, index) => (
                                        <th 
                                            key={index} 
                                            className={`${index === 0 ? 'px-4' : ''} ${index === headers.length - 1 ? 'px-4 text-end' : ''} py-3`}
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

                {onPageChange && totalPages > 1 && (
                    <div className="card-footer border-0 bg-white py-3 px-4 d-flex justify-content-between align-items-center border-top">
                        <div className="small text-muted fw-medium">
                            Página <span className="text-dark fw-bold">{currentPage}</span> de <span className="text-dark fw-bold">{totalPages}</span>
                        </div>
                        <div className="d-flex gap-2">
                            <button 
                                className="btn btn-light btn-sm rounded-circle p-2 d-flex align-items-center justify-content-center transition-all border shadow-sm"
                                disabled={currentPage === 1}
                                onClick={() => onPageChange(currentPage - 1)}
                                style={{ width: '32px', height: '32px' }}
                            >
                                <FaChevronLeft size={12} />
                            </button>
                            
                            {[...Array(totalPages)].map((_, i) => {
                                const page = i + 1;
                                if (totalPages > 8 && Math.abs(page - currentPage) > 2 && page !== 1 && page !== totalPages) {
                                    if (page === 2 || page === totalPages - 1) return <span key={page} className="text-muted px-1 align-self-end">...</span>;
                                    return null;
                                }
                                return (
                                    <button
                                        key={page}
                                        className={`btn btn-sm rounded-circle fw-bold transition-all ${currentPage === page ? 'btn-primary-theme shadow-sm' : 'btn-light border'}`}
                                        onClick={() => onPageChange(page)}
                                        style={{ width: '32px', height: '32px', fontSize: '0.75rem' }}
                                    >
                                        {page}
                                    </button>
                                );
                            })}

                            <button 
                                className="btn btn-light btn-sm rounded-circle p-2 d-flex align-items-center justify-content-center transition-all border shadow-sm"
                                disabled={currentPage === totalPages}
                                onClick={() => onPageChange(currentPage + 1)}
                                style={{ width: '32px', height: '32px' }}
                            >
                                <FaChevronRight size={12} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardTable;
