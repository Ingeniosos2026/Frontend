import { useForm, Controller } from "react-hook-form";
import { Container, Form, Button, Alert, Spinner } from "react-bootstrap";
import EditorTexto from '../../containers/Comportamientos/EditorTexto';

const CrearCComp = ({ mensajeError, alConfirmar, alVolver }) => {
    const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm({
        defaultValues: {
            nombre: "",
            codigo: ""
        }
    });

    return (
        <div 
            className="min-vh-100 d-flex flex-column align-items-center py-5"
            style={{
                backgroundColor: '#6f42c1',
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
                    <h2 className="fw-bold mb-3" style={{ color: '#8b59e7' }}>Crear Comportamiento</h2>
                </div>

                {mensajeError && (
                    <Alert variant="danger" className="shadow-sm mb-4">
                        <strong>Error:</strong> {mensajeError}
                    </Alert>
                )}

                <Form onSubmit={handleSubmit(alConfirmar)}>
          
                    <Form.Group className="mb-5" controlId="nombre">
                        <Form.Label className="fw-bold text-secondary" style={{ marginTop: '.3rem', marginBottom: '.2rem' }}>
                            Nombre del comportamiento
                        </Form.Label> 
                        <Form.Control 
                            type="text" 
                            placeholder="Defender"
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

                    <Form.Group className="mb-5" controlId="codigo">
                        <Form.Label className="fw-bold text-secondary" style={{ marginTop: '.3rem', marginBottom: '.2rem' }}>
                            Código del comportamiento
                        </Form.Label> 
                        
                        <Controller
                            name="codigo"
                            control={control}
                            rules={{ required: "Ingrese un codigo de comportamiento" }}
                            render={({ field }) => (
                                <div className={errors.codigo ? "border border-danger rounded" : ""}>
                                    <EditorTexto 
                                        {...field}
                                    />
                                </div>
                            )}
                        />
                        {errors.codigo && (
                            <div className="text-danger fw-bold mt-1" style={{ fontSize: '0.875em' }}>
                                {errors.codigo.message}
                            </div>
                        )}
                    </Form.Group>

                    <div className="d-flex justify-content-between border-top pt-4 mt-2">
                        <Button 
                            variant="outline-secondary" 
                            onClick={alVolver} 
                            className="px-4 shadow-sm fw-bold rounded-pill"
                        >
                            ← Cancelar
                        </Button>
                        <Button 
                            variant="success" 
                            type="submit" 
                            disabled={isSubmitting}
                            className="px-5 shadow-sm fw-bold rounded-pill"
                            style={{ backgroundColor:'#8b59e7' ,borderColor: '#8b59e7',transition: 'all 0.3s ease' }}
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
                                "Crear"
                            )}
                        </Button>
                    </div>
                </Form>
            </Container>
        </div>
    );
};

export default CrearCComp;