import { useForm } from "react-hook-form";
import { Container, Form, Button, Alert, Spinner } from "react-bootstrap";

const CrearLigaComp = ({ mensajeError, alConfirmar, alVolver }) => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        defaultValues: {
            nombre: "",
            min_jugadores: 3,
            max_jugadores: 6,
            duracion_partido: 5,
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
          
                    <Form.Group className="mb-5" controlId="nombre">

                        <Form.Label className="fw-bold text-secondary" style={{ marginTop: '.3rem', marginBottom: '.2rem',size: '1rem' }}>
                            Nombre de la Liga
                        </Form.Label> 
                        <Form.Control 
                            type="text" 
                            placeholder="Nombre de la Liga..."
                            className="form-control-lg shadow-sm border-success"
                            isInvalid={!!errors.nombre}
                            {...register('nombre', {
                                required: "Ingrese un nombre"
                            })}
                        />
                        <Form.Control.Feedback type="invalid" className="fw-bold">
                            {errors.nombre?.message}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-5" controlId="min_jugadores">
                        <Form.Label className="fw-bold text-secondary"style={{ marginTop: '.3rem', marginBottom: '.2rem' }}>
                            Minima cantidad de clubs
                        </Form.Label>
                        <Form.Control 
                            type="number" 
                            size="lg"
                            className="shadow-sm border-success"
                            isInvalid={!!errors.min_jugadores}
                            {...register('min_jugadores', { 
                                required: "Ingrese un minimo de clubs",
                                min: { value: 3, message: "El mínimo es de 3 clubs" },
                                valueAsNumber: true 
                            })} 
                        />
                        <Form.Control.Feedback type="invalid" className="fw-bold">
                            {errors.min_jugadores?.message}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-5" controlId="max_jugadores">
                        <Form.Label className="fw-bold text-secondary" style={{ marginTop: '.3rem', marginBottom: '.2rem' }}>
                            Maxima cantidad de clubs
                        </Form.Label>
                        <Form.Control 
                            type="number" 
                            size="lg"
                            className="shadow-sm border-success"
                            isInvalid={!!errors.max_jugadores}
                            {...register('max_jugadores', { 
                                required: "Ingrese un maximo de clubs",
                                validate: (value, formValues) => {
                                    if (value < formValues.min_jugadores) {
                                        return "El valor máximo debe ser mayor que el mínimo";
                                    }
                                },
                                valueAsNumber: true 
                            })} 
                        />
                        <Form.Control.Feedback type="invalid" className="fw-bold">
                            {errors.max_jugadores?.message}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-5" controlId="duracion_partido">
                        <Form.Label className="fw-bold text-secondary" style={{ marginTop: '.3rem', marginBottom: '.2rem' }}>
                            Duración de cada partido (minutos)
                        </Form.Label>
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

                    <Form.Group className="mb-5" controlId="contraseña">
                        <Form.Label className="fw-bold text-secondary" style={{ marginTop: '.3rem', marginBottom: '.2rem' }}>
                            Contraseña para la Liga (Opcional)
                        </Form.Label> 
                        <Form.Control 
                            type="password"  
                            placeholder="Contraseña para la Liga..."
                            className="form-control-lg shadow-sm border-success"
                            {...register('contraseña')} 
                        />
                    </Form.Group>

                    <div className="d-flex justify-content-between border-top pt-4 mt-2">
                        <Button 
                            variant="outline-secondary" 
                            onClick={alVolver} 
                            className="px-5 shadow-sm fw-bold rounded-pill"
                        >
                            ← Volver
                        </Button>
                        <Button 
                            variant="success" 
                            type="submit" 
                            disabled={isSubmitting}
                            className="px-5 shadow-sm fw-bold rounded-pill"
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
            </Container>
        </div>
    );
};

export default CrearLigaComp;