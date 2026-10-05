import React from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, Spinner, Badge } from 'react-bootstrap';

const ArmarEquipoComp = ({ 
    listaJugadores, 
    listaComportamientos, 
    equipo, 
    formacion, 
    loading, 
    error, 
    onSeleccion, 
    onFormacionChange, 
    ConfirmarEquipo, 
    Cancelar 
}) => {
    
    if (loading) {
        return (
            <div 
                className="min-vh-100 d-flex justify-content-center align-items-center"
            >
                <Spinner animation="border" variant="light" />
                <span className="ms-3 text-white fw-bold fs-5">Cargando jugadores y comportamientos...</span>
            </div>
        );
    }

    return (
        <div 
            className="min-vh-100 d-flex flex-column align-items-center py-5"
            style={{
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
                backgroundRepeat: 'no-repeat',
                backgroundColor: '#495057'
            }}
        >
            <Container 
                className="p-4 p-md-5 bg-white rounded shadow-lg" 
                style={{ maxWidth: '900px', opacity: '0.95' }}
            >
                <div className="text-center mb-4">
                    <h2 className="fw-bold" style={{ color: '#323335' }}>Armar Equipo</h2>
                    <p className="text-muted">Selecciona 6 jugadores y define sus tácticas:</p>
                </div>
                
                
                <div className="d-flex flex-column gap-3 mb-4">

                    {equipo.map((slot, index) => (
                        <Card key={`slot-${index}`} className="border-0 shadow-sm" style={{ backgroundColor: '#f8f9fa' }}>
                            <Card.Body className="p-3">
                                <Row className="align-items-center g-3">
                                    
                                    <Col xs={12} md={2} className="text-center text-md-start">
                                        <Badge 
                                            bg={index < 3 ? 'secondary' : 'light'} 
                                            text={index < 3 ? 'light' : 'dark'}
                                            className={`p-2 fs-6 w-100 ${index >= 3 ? 'border text-muted' : ''}`}
                                        >
                                            {index < 3 ? `Titular ${index + 1}` : `Suplente ${index - 2}`}
                                        </Badge>
                                    </Col>

                                    <Col xs={12} md={5}>
                                        <Form.Select 
                                            value={slot.id_jugador} 
                                            onChange={(e) => onSeleccion(index, 'id_jugador', e.target.value)}
                                            className="shadow-sm border-secondary"
                                        >
                                            <option value="">👤 Seleccionar Jugador...</option>
                                            {listaJugadores.map(jugador => (
                                                <option key={jugador.id} value={jugador.id}>
                                                    {jugador.nombre}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Col>

                                    <Col xs={12} md={5}>
                                        <Form.Select 
                                            value={slot.id_comportamiento} 
                                            onChange={(e) => onSeleccion(index, 'id_comportamiento', e.target.value)}
                                            className="shadow-sm border-secondary"
                                        >
                                            <option value="">🧠 Asignar Comportamiento...</option>
                                            {listaComportamientos.map(comp => (
                                                <option key={comp.id} value={comp.id}>
                                                    {comp.nombre}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    ))}
                </div>

                <h4 className="mb-4 border-bottom pb-2" style={{ color: '#495057' }}>
                    Táctica
                </h4>
                
                <Card className="border-0 shadow-sm mb-5" style={{ backgroundColor: '#f8f9fa' }}>
                    <Card.Body className="p-3">
                        <Form.Group>
                            <Form.Label className="fw-bold text-secondary">Formación Inicial</Form.Label>
                            <Form.Select 
                                value={formacion} 
                                onChange={onFormacionChange}
                                size="lg"
                                className="shadow-sm border-secondary"
                            >
                                <option value="ofensiva">⚔️ Ofensivo</option>
                                <option value="defensiva">🛡️ Defensivo</option>
                                <option value="c">🔄 C-formación</option>
                                <option value="d">🧱 D-formación</option>
                            </Form.Select>
                        </Form.Group>
                    </Card.Body>
                </Card>

                {error && (
                    <Alert variant="danger" className="shadow-sm d-flex align-items-center">
                        <span className="me-2 fs-5">⚠️</span>
                        {error}
                    </Alert>
                )}

                <div className="d-flex justify-content-between border-top pt-4 mt-2">
                    <Button 
                        variant="outline-secondary" 
                        size="lg" 
                        onClick={Cancelar} 
                        className="px-4 shadow-sm fw-bold"
                    >
                        ← Cancelar
                    </Button>

                    <Button 
                        size="lg" 
                        className="px-5 shadow-sm fw-bold rounded-pill border-0"
                        style={{ backgroundColor: '#495057', transition: 'all 0.3s ease' }}
                        onClick={ConfirmarEquipo}
                    >
                        Confirmar Equipo
                    </Button>
                </div>

            </Container>
        </div>
    );
};

export default ArmarEquipoComp;