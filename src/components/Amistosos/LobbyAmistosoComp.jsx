import { Container, Card, Button, Spinner, Alert, Row, Col } from 'react-bootstrap';

const LobbyAmistosoComp = ({ mensajeError, esCreador, versus, sePuedeIniciar, iniciando, alIniciar, visual }) => {

    return (

        <div 
            className="min-vh-100 d-flex flex-column align-items-center py-5"
            style={{
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
                backgroundRepeat: 'no-repeat',
                backgroundColor: '#21503a'
            }}
        >
            <Container 
                className="p-4 p-md-5 bg-white rounded shadow-lg" 
                style={{ maxWidth: '800px', opacity: '0.95' }}
            >
                <div className="text-center mb-4">
                    <h2 className="fw-bold" style={{ color: '#198754' }}>Lobby del Partido</h2>
                </div>
                
                {mensajeError && (
                    <Alert variant="danger" className="shadow-sm d-flex align-items-center mb-4">
                        <span className="me-2 fs-5">⚠️</span>
                        {mensajeError}
                    </Alert>
                )}

                <h4 className="mb-4 border-bottom pb-2" style={{ color: '#198754' }}>
                    Estado del encuentro
                </h4>

                <div className="mb-5">
                    {!versus ? (

                        <Card className="border-0 shadow-sm text-center py-5" style={{ backgroundColor: '#f8f9fa' }}>
                            <Card.Body>
                                <Spinner animation="border" variant="success" className="mb-3" style={{ width: '3rem', height: '3rem' }} />
                                <h5 className="text-muted fw-bold">Esperando rival...</h5>
                            </Card.Body>
                        </Card>
                    ) : (

                        <Card className="border-success shadow-sm" style={{ borderWidth: '2px' }}>
                            <Card.Header className="bg-success text-white text-center py-3">
                                <h4 className="mb-0 fw-bold">¡Rival listo!</h4>
                            </Card.Header>
                            <Card.Body className="p-4">
                                <Row className="g-4 text-center align-items-center">
                                    <Col xs={12} md={5}>
                                        <div className="d-flex justify-content-center mb-3">
                                            {visual?.avatar_usuario_izq && (
                                                <img 
                                                    src={new URL(`../../assets/avatars/avatar_${visual.avatar_usuario_izq}.png`, import.meta.url).href} 
                                                    alt="Avatar Izquierda" 
                                                    style={{width: '150px',height: '150px',objectFit: 'contain'}}
                                                />
                                            )}
                                        </div>
                                        <h3 className="fw-bold text-dark">{versus.nombre_owner}</h3>
                                        <p className="text-secondary mb-0">{versus.club_owner}</p>
                                    </Col>
                                    
                                    <Col xs={12} md={2} className="d-flex justify-content-center my-3 my-md-0">
                                        <div className="bg-light rounded-circle border border-success d-flex align-items-center justify-content-center shadow-sm" style={{ width: '60px', height: '60px' }}>
                                            <span className="fs-5 fw-bold text-success">VS</span>
                                        </div>
                                    </Col>
                                    
                                    {/* EQUIPO DERECHO (RIVAL) */}
                                    <Col xs={12} md={5}>
                                        <div className="d-flex justify-content-center mb-3">
                                            {visual?.avatar_usuario_der && (
                                                <img 
                                                    src={new URL(`../../assets/avatars/avatar_${visual.avatar_usuario_der}.png`, import.meta.url).href} 
                                                    alt="Avatar Derecha" 
                                                    style={{width: '150px',height: '150px',objectFit: 'contain'}}
                                                />
                                            )}
                                        </div>
                                        <h3 className="fw-bold text-dark">{versus.nombre}</h3>
                                        <p className="text-secondary mb-0">{versus.club}</p>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    )}
                </div>

                <div className="d-flex flex-column align-items-center ">
                    {esCreador ? (
                        <>
                            <p className="text-muted text-center mb-3">
                                Eres el creador de la sala. Cuando estés listo, inicia el partido.
                            </p>
                            <Button 
                                variant="success" 
                                size="lg" 
                                className="px-5 shadow-sm fw-bold rounded-pill d-flex align-items-center"
                                onClick={alIniciar}
                                disabled={!versus || iniciando || !sePuedeIniciar}
                                style={{ transition: 'all 0.3s ease' }}
                            >
                                {iniciando ? (
                                    <>
                                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                                        Iniciando...
                                    </>
                                ) : (
                                    "Iniciar Amistoso"
                                )}
                            </Button>
                        </>
                    ) : (
                        <Alert variant="light" className="border shadow-sm text-center w-100 m-0">
                            <Spinner animation="grow" variant="success" size="sm" className="me-2" />
                            <strong className="text-secondary">Esperando a que el creador inicie el partido...</strong>
                        </Alert>
                    )}
                </div>

            </Container>
        </div>
    );
};

export default LobbyAmistosoComp;