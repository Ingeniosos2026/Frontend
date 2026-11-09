import { useForm, Controller } from "react-hook-form";
import { Container, Form, Button, Alert, Spinner } from "react-bootstrap";
import EditorTexto from '../../containers/Comportamientos/EditorTexto';
import ApiModal from './ApiModal';

const CrearCCompDt = ({ mensajeError, alConfirmar, alVolver }) => {
    const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm({
        defaultValues: {
            nombre: "",
            codigo:"# Escribe tu comportamiento en código Python aquí\n"
        }
    });

    const sugerenciasDt = [
                    {
                        label: "cambiar_comportamiento_ataque",
                        insertText: "cambiar_comportamiento_ataque()",
                        detail: "cambiar_comportamiento_ataque()",
                        documentation: "Selecciona a todos los jugadores propios y les asigna el comportamiento 'Atacar'."
                    },
                    {
                        label: "cambiar_comportamiento_defensa",
                        insertText: "cambiar_comportamiento_defensa()",
                        detail: "cambiar_comportamiento_defensa()",
                        documentation: "Selecciona a todos los jugadores propios y les asigna el comportamiento 'Defender'."
                    },
                    {
                        label: "cambiar_jugador",
                        insertText: "cambiar_jugador()",
                        detail: "cambiar_jugador()",
                        documentation: "Realiza un cambio aleatorio entre un titular y un suplente. Solo puede ejecutarse durante una pausa."
                    },
                    {
                        label: "voy_perdiendo",
                        insertText: "voy_perdiendo()",
                        detail: "voy_perdiendo() -> bool",
                        documentation: "Devuelve verdadero si el equipo propio está perdiendo."
                    },
                    {
                        label: "voy_ganando",
                        insertText: "voy_ganando()",
                        detail: "voy_ganando() -> bool",
                        documentation: "Devuelve verdadero si el equipo propio está ganando."
                    },
                    {
                        label: "esta_empatado",
                        insertText: "esta_empatado()",
                        detail: "esta_empatado() -> bool",
                        documentation: "Devuelve verdadero si ambos equipos tienen la misma cantidad de goles."
                    },
                    {
                        label: "es_pausa",
                        insertText: "es_pausa()",
                        detail: "es_pausa() -> bool",
                        documentation: "Devuelve verdadero si el partido se encuentra en pausa."
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
                    <h2 className="fw-bold mb-3" style={{ color: '#8b59e7' }}>Crear Comportamiento DT</h2>
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

                        <ApiModal tipo="dt"/>

                        <Controller
                            name="codigo"
                            control={control}
                            rules={{ required: "Ingrese un codigo de comportamiento" }}
                            render={({ field }) => (
                                <div className={errors.codigo ? "border border-danger rounded" : ""}>
                                    <EditorTexto {...field}
                                        sugerencias={sugerenciasDt}
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

export default CrearCCompDt;