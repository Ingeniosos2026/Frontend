import React from 'react';
import { useForm } from "react-hook-form";
import { Container, Form, Button, Card, Alert, Spinner, Row, Col } from 'react-bootstrap';


const CrearJugadorComp = ({ mensajeError, alCrear, alVolver }) => {
    const { register, handleSubmit, formState: { errors, isSubmitting }, watch } = useForm({
        defaultValues: {
            nombre: '',
            power: 60,
            agility: 60,
            control: 60,
            speed: 60,
            strength: 60
        }
    });

    const formValues = watch();
    
    // Cálculo dinámico del total de puntos
    const totalPuntos = 
        (Number(formValues.power) || 0) + 
        (Number(formValues.agility) || 0) + 
        (Number(formValues.control) || 0) + 
        (Number(formValues.speed) || 0) + 
        (Number(formValues.strength) || 0);

    const onSubmit = (data) => {
        if (totalPuntos !== 300) {
            alert("Error: Los atributos deben sumar exactamente 300 puntos.");
            return;
        }
        alCrear(data);
    };

    const registrarAtributo = (nombre) => {
        return register(nombre, {
            required: "Obligatorio",
            min: { value: 20, message: "Mínimo 20" },
            max: { value: 100, message: "Máximo 100" },
            valueAsNumber: true
        });
    };

    return (

        <div 
            className="min-vh-100 d-flex flex-column align-items-center py-5"
            style={{
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
                backgroundRepeat: 'no-repeat',
                backgroundColor: '#fd7e14'
            }}
        >
            <Container 
                className="p-4 p-md-5 bg-white rounded shadow-lg" 
                style={{ maxWidth: '700px', opacity: '0.95' }}
            >
                <div className="text-center mb-4">
                    <h2 className="fw-bold" style={{ color: '#fd7e14' }}>Crear Nuevo Jugador</h2>
                </div>


                {mensajeError && (
                    <Alert variant="danger" className="shadow-sm d-flex align-items-center">
                        <span className="me-2 fs-5">⚠️️</span>
                        {mensajeError}
                    </Alert>
                )}

                <Form onSubmit={handleSubmit(onSubmit)}>
                    
                    {/* Sección: Nombre del Jugador */}
                    <Card className="border-0 shadow-sm mb-4" style={{ backgroundColor: '#f8f9fa' }}>
                        <Card.Body className="p-4">
                            <Form.Group controlId="nombre">
                                <Form.Label className="fw-bold text-secondary">Nombre del Jugador</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Ej: Lionel Messi"
                                    size="lg"
                                    className="shadow-sm border-secondary"
                                    isInvalid={!!errors.nombre}
                                    {...register('nombre', { required: "Ingrese un nombre para el jugador" })} 
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.nombre?.message}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Card.Body>
                    </Card>

                    <h4 className="mb-3 border-bottom pb-2" style={{ color: '#fd7e14' }}>
                        Atributos (PACSS)
                    </h4>
                    <p className="text-muted">Distribuye 300 puntos entre las habilidades estrategicamente:</p>

                    <Card className="border-0 shadow-sm mb-4" style={{ backgroundColor: '#f8f9fa' }}>
                        <Card.Body className="p-4">
                            <Row className="g-4">
                                {['power', 'agility', 'control', 'speed', 'strength'].map((attr) => (
                                    <Col xs={6} md={4} key={attr}>
                                        <Form.Group controlId={attr}>
                                            <Form.Label className="text-capitalize fw-bold text-secondary">
                                                {/* Iconos decorativos según el atributo */}
                                                {attr === 'power' && '💥 '}
                                                {attr === 'agility' && '🤸 '}
                                                {attr === 'control' && '🎯 '}
                                                {attr === 'speed' && '⚡ '}
                                                {attr === 'strength' && '🏋️ '}
                                                {attr}
                                            </Form.Label>
                                            <Form.Control 
                                                type="number" 
                                                className="shadow-sm border-secondary text-center"
                                                isInvalid={!!errors[attr]}
                                                {...registrarAtributo(attr)} 
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors[attr]?.message}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                ))}
                            </Row>
                        </Card.Body>
                    </Card>

                    <Alert 
                        variant={totalPuntos === 300 ? 'success' : 'warning'} 
                        className="text-center fw-bold shadow-sm"
                    >
                        Total Asignado: {totalPuntos} / 300 Puntos
                        {totalPuntos !== 300 && <span className="d-block small text-muted mt-1">Los atributos deben sumar 300 puntos en total</span>}
                    </Alert>

                    <div className="d-flex justify-content-between border-top pt-4 mt-2">
                        <Button 
                            variant="outline-secondary" 
                            size="lg" 
                            onClick={alVolver} 
                            disabled={isSubmitting}
                            className="px-4 shadow-sm fw-bold"
                        >
                            ← Cancelar
                        </Button>

                        <Button 
                            type="submit" 
                            size="lg" 
                            className="px-5 shadow-sm fw-bold rounded-pill border-0 d-flex align-items-center"
                            style={{ 
                                backgroundColor: (isSubmitting || totalPuntos !== 300) ? '#e9ecef' : '#fd7e14',
                                color: (isSubmitting || totalPuntos !== 300) ? '#6c757d' : 'white',
                                transition: 'all 0.3s ease' 
                            }}
                            disabled={isSubmitting || totalPuntos !== 300}
                        >
                            {isSubmitting ? (
                                <>
                                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                                    Creando...
                                </>
                            ) : (
                                "Crear Jugador"
                            )}
                        </Button>
                    </div>

                </Form>
            </Container>
        </div>
    );
};

export default CrearJugadorComp;