import { useForm } from "react-hook-form";
import { Container, Form, Button, Alert, Spinner } from "react-bootstrap";

const CrearLigaComp = ({ mensajeError, alConfirmar, alVolver }) => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        defaultValues: {
            duracion_partido: 5,
            min: 3,
            max: 6,
            contraseña: ""
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
                    <h2 className="fw-bold mb-3" style={{ color: '#198754' }}>Crear Liga</h2>
                    <p className="text-muted">Configura los detalles de tu Liga</p>
                </div>

                {mensajeError && (
                    <Alert variant="danger" className="shadow-sm mb-4">
                        <strong>Error:</strong> {mensajeError}
                    </Alert>
                )}

                <Form onSubmit={handleSubmit(onSubmit)}>
          
                    <Form.Group className="mb-5" controlId="duracion_partido">

                        <Form.Label className="fw-bold text-secondary">Nombre de la Liga</Form.Label> 
                        <Form.Control 
                            type="text" 
                            placeholder="Nombre de la Liga..."
                            className="bg-light border-0 shadow-sm rounded-0"
                            isInvalid={!!errors.nombre}
                            {...register('nombre', {
                                required: "Ingrese un nombre"
                            })}
                        />
                        
                        <Form.Label className="fw-bold text-secondary">Minima cantidad de clubs</Form.Label>
                        <Form.Control 
                            type="number" 
                            size="lg"
                            className="shadow-sm border-success"
                            isInvalid={!!errors.min}
                            {...register('min', { 
                                required: "Ingrese un minimo de clubs",
                                min: { value: 3, message: "El mínimo es de 3 clubs" },
                                valueAsNumber: true 
                            })} 
                        />

                        <Form.Label className="fw-bold text-secondary">Maxima cantidad de clubs</Form.Label>
                        <Form.Control 
                            type="number" 
                            size="lg"
                            className="shadow-sm border-success"
                            isInvalid={!!errors.max}
                            {...register('max', { 
                                required: "Ingrese un maximo de clubs",
                                validate: (value, formValues) => {
                                    if (value < formValues.min) {
                                        return "El valor máximo debe ser mayor que el mínimo";
                                    }
                                },
                                valueAsNumber: true 
                            })} 
                        />
                        <Form.Label className="fw-bold text-secondary">Duración de cada partido (minutos)</Form.Label>
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

                        <Form.Label className="fw-bold text-secondary">Contraseña para la Liga (Opcional)</Form.Label> 
                        <Form.Control 
                            type="password"  
                            placeholder="Contraseña para la Liga..."
                            className="bg-light border-0 shadow-sm rounded-0"
                        />
                        
                        <Form.Control.Feedback type="invalid" className="fw-bold">
                            {errors.duracion_partido?.message}
                            {errors.min?.message}
                            {errors.max?.message}
                            {errors.max?.nombre}
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
                                "Crear Liga"
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

export default CrearLigaComp;