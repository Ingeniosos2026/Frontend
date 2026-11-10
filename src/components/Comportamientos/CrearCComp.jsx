import { useForm, Controller } from "react-hook-form";
import { Container, Form, Button, Alert, Spinner } from "react-bootstrap";
import EditorTexto from '../../containers/Comportamientos/EditorTexto';
import ApiModal from './ApiModal';

const CrearCComp = ({ mensajeError, alConfirmar, alVolver }) => {
    const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm({
        defaultValues: {
            nombre: "",
            codigo:"# Escribe tu comportamiento en código Python aquí\n"
        }
    });

    const sugerencias = [
                    {
        label: "correr",
        insertText: "correr(${1:destino})",
        insertTextRules: 4,
        detail: "correr(destino: Coordenada)",
        documentation: "Mueve el jugador al destino indicado."
    },
    {
        label: "patear",
        insertText: "patear(${1:direccion})",
        insertTextRules: 4,
        detail: "patear(direccion: Coordenada) -> bool",
        documentation: "Patea la pelota hacia la dirección indicada."
    },
    {
        label: "direccionPelota",
        insertText: "direccionPelota()",
        detail: "direccionPelota() -> Coordenada",
        documentation: "Devuelve la posición actual de la pelota."
    },
    {
        label: "direccionCompañeros",
        insertText: "direccionCompañeros()",
        detail: "direccionCompañeros() -> list[Coordenada]",
        documentation: "Devuelve las posiciones de los compañeros."
    },
    {
        label: "direccionRivales",
        insertText: "direccionRivales()",
        detail: "direccionRivales() -> list[Coordenada]",
        documentation: "Devuelve las posiciones de los rivales."
    },
    {
        label: "pelotaCerca",
        insertText: "pelotaCerca()",
        detail: "pelotaCerca() -> bool",
        documentation: "True si la pelota está al alcance."
    },
    {
        label: "direccionArcoRival",
        insertText: "direccionArcoRival()",
        detail: "direccionArcoRival() -> Coordenada",
        documentation: "Devuelve la posición del arco rival."
    },
    {
        label: "direccionArcoPropio",
        insertText: "direccionArcoPropio()",
        detail: "direccionArcoPropio() -> Coordenada",
        documentation: "Devuelve la posición de tu arco."
    }
                ];

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
                <div className="text-center mb-5" style={{ marginBottom: '0px' }}>
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
                            className="form-control-lg shadow-sm "
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

                        <ApiModal/>

                        <Controller
                            name="codigo"
                            control={control}
                            rules={{ required: "Ingrese un codigo de comportamiento" }}
                            render={({ field }) => (
                                <div className={errors.codigo ? "border border-danger rounded" : ""}>
                                    <EditorTexto {...field}
                                        sugerencias={sugerencias}
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