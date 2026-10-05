import React from 'react';
import { useForm } from "react-hook-form";
import { Container, Form, Button, Alert, Spinner } from "react-bootstrap";


const CrearAmistosoComp = ({ mensajeError, alConfirmar, alVolver }) => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        defaultValues: {
            duracion_partido: 5
        }
    });

    const onSubmit = (data) => {
        alConfirmar(data);
    };

    return (

        <div 
            className="min-vh-100 d-flex flex-column align-items-center py-5"
            style={{
                backgroundColor: '#21503a',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
                backgroundRepeat: 'no-repeat'
            }}
        >
            <Container 
                className="p-4 p-md-5 bg-white rounded shadow-lg" 
                style={{ maxWidth: '600px', opacity: '0.95' }}
            >
                <div className="text-center mb-5">
                    <h2 className="fw-bold mb-3" style={{ color: '#198754' }}>Crear Amistoso</h2>
                    <p className="text-muted">Configura los detalles de tu próximo partido</p>
                </div>

                {mensajeError && (
                    <Alert variant="danger" className="shadow-sm mb-4">
                        <strong>Error:</strong> {mensajeError}
                    </Alert>
                )}

                <Form onSubmit={handleSubmit(onSubmit)}>
                    
                    <Form.Group className="mb-5" controlId="duracion_partido">
                        <Form.Label className="fw-bold text-secondary">Duración del partido (minutos)</Form.Label>
                        <Form.Control 
                            type="number" 
                            size="lg"
                            className="shadow-sm border-success"
                            isInvalid={!!errors.duracion_partido}
                            {...register('duracion_partido', { 
                                required: "Ingrese la duración",
                                min: { value: 1, message: "El mínimo es de 1 minuto" },
                                valueAsNumber: true 
                            })} 
                        />
                        <Form.Control.Feedback type="invalid" className="fw-bold">
                            {errors.duracion_partido?.message}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <div className="text-center mb-4">
                        <Button 
                            variant="success" 
                            type="submit" 
                            size="lg" 
                            disabled={isSubmitting}
                            className="px-5 shadow-sm fw-bold rounded-pill w-100"
                            style={{ transition: 'all 0.3s ease' }}
                        >
                            {isSubmitting ? (
                                <>
                                    <Spinner 
                                        as="span" 
                                        animation="border" 
                                        size="sm" 
                                        role="status" 
                                        aria-hidden="true" 
                                        className="me-2" 
                                    />
                                    Creando...
                                </>
                            ) : (
                                "Crear Amistoso"
                            )}
                        </Button>
                    </div>
                </Form>

                <div className="d-flex justify-content-start border-top pt-4 mt-2">
                    <Button 
                        variant="outline-secondary" 
                        size="lg" 
                        onClick={alVolver} 
                        className="px-4 shadow-sm fw-bold"
                    >
                        ← Volver
                    </Button>
                </div>
            </Container>
        </div>
    );
};

export default CrearAmistosoComp;