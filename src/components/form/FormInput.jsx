import { Form } from 'react-bootstrap';

const FormInput = ({ label, type, placeholder, register, name, validation, error, ...rest }) => {
    return (
        <Form.Group className="mb-4">
            {label && (
                <Form.Label className="text-secondary fw-semibold small mb-1">
                    {label}
                </Form.Label>
            )}

            <Form.Control
                type={type}
                placeholder={placeholder}
                isInvalid={!!error}
                className="input-no-shadow"
                {...register(name, validation)}
                {...rest}
            />

            {error && (
                <Form.Control.Feedback type="invalid" className="d-block mt-1">
                    {error.message}
                </Form.Control.Feedback>
            )}
        </Form.Group>
    );
};

export default FormInput;
