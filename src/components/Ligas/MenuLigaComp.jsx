import { useState } from 'react';
import { Container, Button, Collapse, Card, Alert } from 'react-bootstrap';


const MenuLigaComp = ({ ligasDisponibles, error, CrearLiga, UnirseLiga, Volver }) => {

    const [ligaDesplegadaDisp, setLigaDesplegadaDisp] = useState(null);

    const toggleDispLigas = (idLiga) => {
        setLigaDesplegadaDisp(ligaDesplegadaDisp === idLiga ? null : idLiga);
    };

    return (
        <div className="min-vh-100 d-flex flex-column align-items-center py-5">

            <Container 
                className="p-4 p-md-5 bg-white rounded shadow-lg" 
                style={{ maxWidth: '800px', opacity: '0.95' }}
            >

                {error && <Alert variant="danger" className="shadow-sm">{error}</Alert>}
                
                <div className="text-center mb-5">
                    <h2 className="fw-bold mb-4" style={{ color: '#0d6efd' }}>Menú de Ligas</h2>
                    
                    <Button 
                        variant="primary" 
                        size="lg" 
                        className="px-5 shadow-sm fw-bold rounded-pill"
                        onClick={CrearLiga}
                        style={{ transition: 'all 0.3s ease' }}
                    >
                        + Crear Liga
                    </Button>
                </div>

                <h4 className="mb-4 border-bottom pb-2" style={{ color: '#0d6efd' }}>
                    Ligas Disponibles
                </h4>
                
                <div className="d-flex flex-column gap-3 mb-4">
                    {ligasDisponibles && ligasDisponibles.length > 0 ? (
                        ligasDisponibles.map((liga, index) => (
                            <div key={`disp-${index}`}>
                                <Button 
                                    variant={ligaDesplegadaDisp === liga.id_liga ? "primary" : "outline-primary"}
                                    className="w-100 text-start shadow-sm d-flex justify-content-between align-items-center"
                                    onClick={() => toggleDispLigas(liga.id_liga)}
                                    aria-controls={`collapse-liga-${index}`}
                                    aria-expanded={ligaDesplegadaDisp === liga.id_liga}
                                >
                                    <span className="fw-bold">{liga.nombre}</span>
                                    <span>{ligaDesplegadaDisp === liga.id_liga ? '▲' : '▼'}</span>
                                </Button>
                                
                                <Collapse in={ligaDesplegadaDisp === liga.id_liga}>
                                    <div id={`collapse-liga-${index}`} className="mt-2">
                                        <Card className="border-primary shadow-sm bg-light">
                                            <Card.Body className="d-flex justify-content-between align-items-center">
                                                <Button 
                                                    variant="primary" 
                                                    className="px-4 fw-bold shadow-sm"
                                                    onClick={() => UnirseLiga(liga.es_privada, liga.id_liga, liga.min_jugadores)}
                                                >
                                                    Unirse a la Liga
                                                </Button>
                                            </Card.Body>
                                        </Card>
                                    </div>
                                </Collapse>
                            </div>
                        ))
                    ) : (
                        <p className="text-muted text-center py-4">No hay ligas disponibles en este momento.</p>
                    )}
                </div>

                <div className="d-flex justify-content-start border-top pt-4 mt-2">
                    <Button 
                        variant="outline-secondary" 
                        size="lg" 
                        onClick={Volver} 
                        className="px-4 shadow-sm fw-bold"
                    >
                        ← Volver
                    </Button>
                </div>
            </Container>
        </div>
    );
};

export default MenuLigaComp;