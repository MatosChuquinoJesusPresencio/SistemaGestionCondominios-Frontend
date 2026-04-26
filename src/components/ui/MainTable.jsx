import { Card, Table } from "react-bootstrap";
import TablePagination from "./TablePagination";
import EmptyState from "./EmptyState";

const MainTable = ({ 
    headers, 
    children, 
    searchBar, 
    paginationProps, 
    isEmpty, 
    emptyMessage, 
    emptyIcon,
    cardClass = "mb-4"
}) => {
    return (
        <Card className={`card-custom overflow-hidden ${cardClass}`}>
            {searchBar && (
                <Card.Header className="bg-white border-0 py-4 px-4">
                    {searchBar}
                </Card.Header>
            )}
            <Card.Body className="p-0">
                <div className="table-responsive">
                    <Table hover className="align-middle mb-0 custom-table">
                        <thead className="bg-light text-muted small text-uppercase">
                            <tr>
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
                            {isEmpty ? (
                                <EmptyState 
                                    colSpan={headers.length} 
                                    message={emptyMessage} 
                                    icon={emptyIcon} 
                                />
                            ) : children}
                        </tbody>
                    </Table>
                </div>
            </Card.Body>
            {paginationProps && (
                <TablePagination {...paginationProps} />
            )}
        </Card>
    );
};

export default MainTable;
