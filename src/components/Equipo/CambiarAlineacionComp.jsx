import { Container, Row, Col, Form, Button, Card, Alert,  Badge } from 'react-bootstrap';

const CambiarAlineacionComp = ({
    titulares,
    suplentes,
    formacion,
    comportamientos,
    error,
    onCambiarTitular,
    onCambiarFormacion,
    onCambiarComportamiento,
    onGuardar,
    volver}) => {
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
                                <h2 className="fw-bold" style={{ color: '#323335' }}>Cambio de Alineacion</h2>
                                <p className="text-muted">Seleccione sus nuevos titulares y modifique sus tacticas</p>
                            </div>
                            
                            
                            <div className="d-flex flex-column gap-3 mb-4">
            
                                {titulares.map((titular, index) => (
                                    <Card key={titular.id} className="border-0 shadow-sm">
                                        <Card.Body className="p-3">
                                            <Row className="align-items-center g-3">

                                                <Col xs={12} md={2}>
                                                    <Badge bg="secondary" className="p-2 fs-6 w-100">
                                                        Titular {index + 1}
                                                    </Badge>
                                                </Col>
            
                                                <Col xs={12} md={5}>
                                                    <p className="mb-0 fw-bold" data-testid="nombre-titular">
                                                        {titular.nombre}
                                                    </p>

                                                    <Form.Select
                                                        aria-label={`Reemplazar a ${titular.nombre}`}
                                                        defaultValue=""
                                                        onChange={(e) => 
                                                            onCambiarTitular(index, e.target.value)
                                                        }
                                                        className="shadow-sm border-secondary"
                                                    >
                                                        <option value="">👤 Seleccionar Jugador...</option>
                                                        {suplentes.map(jugador => (
                                                            <option key={jugador.id} value={jugador.id}>
                                                                {jugador.nombre}
                                                            </option>
                                                        ))}
                                                    </Form.Select>
                                                </Col>
            
                                                <Col xs={12} md={5}>
                                                    <Form.Select 
                                                        value={titular.comportamiento?.id ?? ''} 
                                                        onChange={(e) => onCambiarComportamiento(titular.id, e.target.value)}
                                                        className="shadow-sm border-secondary"
                                                    >
                                                        <option value="">🧠 Asignar Comportamiento...</option>
                                                        {comportamientos.map(comp => (
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
                                            onChange={(e) => onCambiarFormacion(e.target.value)}
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
                                    onClick={volver} 
                                    className="px-4 shadow-sm fw-bold"
                                >
                                    Volver
                                </Button>
            
                                <Button 
                                    size="lg" 
                                    className="px-5 shadow-sm fw-bold rounded-pill border-0"
                                    style={{ backgroundColor: '#495057', transition: 'all 0.3s ease' }}
                                    onClick={onGuardar}
                                >
                                    Confirmar Alineacion
                                </Button>
                            </div>
            
                        </Container>
                    </div>
        );
    }

export default CambiarAlineacionComp;