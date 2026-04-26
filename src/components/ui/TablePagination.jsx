import { Card, Pagination } from "react-bootstrap";

const TablePagination = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsShowing,
}) => {
  if (totalPages <= 1 && totalItems === itemsShowing) return null;

  return (
    <Card.Footer className="bg-white border-0 py-3 px-4 d-flex flex-column flex-md-row justify-content-between align-items-center border-top gap-3">
      <div className="small text-muted fw-medium">
        Mostrando <span className="text-dark fw-bold">{itemsShowing}</span> de{" "}
        <span className="text-dark fw-bold">{totalItems}</span> registros
      </div>
      {totalPages > 1 && (
        <Pagination className="mb-0 pagination-sm custom-pagination">
          <Pagination.Prev
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          />
          {[...Array(totalPages)].map((_, i) => (
            <Pagination.Item
              key={i + 1}
              active={i + 1 === currentPage}
              onClick={() => onPageChange(i + 1)}
            >
              {i + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          />
        </Pagination>
      )}
      <style>
        {`
                .custom-pagination .page-link {
                    border: none;
                    color: #495057;
                    margin: 0 2px;
                    border-radius: 8px !important;
                    font-weight: 600;
                    padding: 0.5rem 0.8rem;
                }
                .custom-pagination .page-item.active .page-link {
                    background-color: #112d4d !important;
                    color: white !important;
                    box-shadow: 0 4px 10px rgba(17, 45, 77, 0.2);
                }
                .custom-pagination .page-item.disabled .page-link {
                    background-color: transparent;
                    opacity: 0.5;
                }
                `}
      </style>
    </Card.Footer>
  );
};

export default TablePagination;
