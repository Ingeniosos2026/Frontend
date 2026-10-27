import { Container, Card, Button, Spinner, Alert, ListGroup} from 'react-bootstrap';

const LobbyLigaComp = ({ myId, mensajeError, esCreador, competidores, iniciando, alIniciar, minimo }) => {
    return (
        <div 
            className="min-vh-100 d-flex flex-column align-items-center py-5"
            style={{
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
                backgroundRepeat: 'no-repeat',
                backgroundColor: '#0d6efd'
            }}
        >
            <Container 
                className="p-4 p-md-5 bg-white rounded shadow-lg" 
                style={{ maxWidth: '600px', opacity: '0.95' }}
            >
                <div className="text-center mb-4">
                    <h2 className="fw-bold" style={{ color: '#0d6efd' }}>Lobby de la Liga</h2>
                </div> 
                
                <div className="mb-9">
                    {!(competidores.length > 1) ? (

                        <Card className="border-0 shadow-sm text-center py-5" style={{ backgroundColor: '#f8f9fa' }}>
                            <Card.Body>
                                <Spinner animation="border" variant="primary" className="mb-3" style={{ width: '3rem', height: '3rem'}} />
                                <h5 className="text-muted fw-bold">Esperando competidores...</h5>
                            </Card.Body>
                        </Card>
                    ) : (

                        <Card className="shadow-sm" style={{ borderWidth: '1px' }}>
                            <Card.Header className="bg-primary text-white fw-bold d-flex justify-content-center align-items-center">
                                <span>Competidores</span>
                            </Card.Header>
                            <ListGroup variant="flush">
                                {competidores.map(comp => (
                                    <ListGroup.Item 
                                        key={comp.id}
                                        className={`d-flex justify-content-between align-items-center py-3 `}
                                        variant ={comp.id === myId ?"secondary":""}
                                    >
                                        <div className="justify-content-between align-items-center">
                                            <span className={`text-uppercase fw-bold fs-6 ${comp.id === myId ? 'text-secondary' : 'text-dark'}`}>
                                                {comp.id === myId ? 'Tú' : comp.nombre}
                                            </span>
                                            <div className={`text-muted small ${comp.id === myId ? 'text-secondary' : 'text-dark'}`}> CLUB: {comp.club}</div>
                                            
                                        </div>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Card>
                    )}
                </div>

                {mensajeError && (
                    <Alert variant="danger" className="shadow-sm d-flex align-items-center mb-4">
                        <span className="me-2 fs-5">⚠️</span>
                        {mensajeError}
                    </Alert>
                )}

                <div className="d-flex flex-column align-items-center pt-4">
                    {esCreador ? (
                        <>
                            <p className="text-muted text-center mb-3">
                                {competidores.length < minimo ? `Faltan ${minimo - competidores.length} competidores para poder iniciar la liga`
                                :`Eres el creador de la sala. Cuando estés listo, inicia la Liga`}
                            </p>
                            <Button 
                                variant="success" 
                                size="lg" 
                                className="px-5 shadow-sm fw-bold rounded-pill d-flex align-items-center"
                                onClick={alIniciar}
                                disabled={iniciando|| competidores.length < minimo}
                                style={{ transition: 'all 0.3s ease' }}
                            >
                                {iniciando ? (
                                    <>
                                        <Spinner as="span" animation="border" variant="danger" size="sm" role="status" aria-hidden="true" className="me-2"  />
                                        Iniciando...
                                    </>
                                ) : (
                                    "▶ Iniciar Liga"
                                )}
                            </Button>
                        </>
                    ) : (
                        <Alert variant="light" className="border shadow-sm text-center w-100 m-0">
                            <Spinner animation="grow" variant="primary" size="sm" className="me-2" />
                            <strong className="text-secondary">Esperando a que el creador inicie la Liga...</strong>
                        </Alert>
                    )}
                </div>

            </Container>
        </div>
    );
};

export default LobbyLigaComp;