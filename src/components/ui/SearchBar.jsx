import React from 'react';
import { Row, Col, InputGroup, Form } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';

const SearchBar = ({ 
    searchTerm, 
    onSearchChange, 
    placeholder = "Buscar...", 
    filterValue, 
    onFilterChange, 
    filterOptions = [],
    colSize = { search: 7, filter: 5 }
}) => {
    return (
        <Row className="align-items-center g-3">
            <Col md={colSize.search}>
                <InputGroup className="input-no-shadow bg-light rounded-pill px-3 py-1 border-0">
                    <InputGroup.Text className="bg-transparent border-0 text-muted">
                        <FaSearch />
                    </InputGroup.Text>
                    <Form.Control 
                        placeholder={placeholder}
                        className="bg-transparent border-0 py-2 shadow-none"
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </InputGroup>
            </Col>
            {filterOptions.length > 0 && (
                <Col md={colSize.filter}>
                    <Form.Select 
                        className="form-control rounded-pill border-light shadow-sm py-2 px-3 small"
                        value={filterValue}
                        onChange={(e) => onFilterChange(e.target.value)}
                    >
                        {filterOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </Form.Select>
                </Col>
            )}
        </Row>
    );
};

export default SearchBar;
