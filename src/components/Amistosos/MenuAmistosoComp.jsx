import React, { useState } from 'react';
import { Container, Button, Collapse, Card, Spinner, Alert } from 'react-bootstrap';

const MenuAmistosoComp = ({ amistosos, cargando, mensajeError, alCrear, alUnirse, alVolver }) => {
    const [amistosoDesplegadaDisp, setAmistosoDesplegadaDisp] = useState(null);

    const toggleDispAmistosos = (nombreAmistoso) => {
        setAmistosoDesplegadaDisp(amistosoDesplegadaDisp === nombreAmistoso ? null : nombreAmistoso);
    };

    return (

        <div 
            className="min-vh-100 d-flex flex-column align-items-center py-5"
        >

            <Container 
                className="p-4 p-md-5 bg-white rounded shadow-lg" 
                style={{ maxWidth: '800px', opacity: '0.95' }}
            >

                {mensajeError && <Alert variant="danger" className="shadow-sm">{mensajeError}</Alert>}
                
                <div className="text-center mb-5">
                    <h2 className="fw-bold mb-4" style={{ color: '#198754' }}>Menú de Amistosos</h2>
                    
                    <Button 
                        variant="success" 
                        size="lg" 
                        className="px-5 shadow-sm fw-bold rounded-pill"
                        onClick={alCrear}
                    >
                        + Crear Amistoso
                    </Button>
                </div>

                <h4 className="mb-4 border-bottom pb-2" style={{ color: '#198754' }}>
                    Amistosos Disponibles
                </h4>
                
                <div className="d-flex flex-column gap-3 mb-4">
                    {amistosos && amistosos.length > 0 ? (
                        amistosos.map((amistoso, index) => (
                            <div key={`disp-${index}`}>
                                <Button 
                                    variant={amistosoDesplegadaDisp === amistoso.nombre ? "success" : "outline-success"}
                                    className="w-100 text-start shadow-sm d-flex justify-content-between align-items-center"
                                    onClick={() => toggleDispAmistosos(amistoso.nombre)}
                                    aria-controls={`collapse-amistoso-${index}`}
                                    aria-expanded={amistosoDesplegadaDisp === amistoso.nombre}
                                >
                                    <span className="fw-bold">{amistoso.nombre}</span>
                                    <span>{amistosoDesplegadaDisp === amistoso.nombre ? '▲' : '▼'}</span>
                                </Button>
                                
                                <Collapse in={amistosoDesplegadaDisp === amistoso.nombre}>
                                    <div id={`collapse-amistoso-${index}`} className="mt-2">
                                        <Card className="border-success shadow-sm bg-light">
                                            <Card.Body className="d-flex justify-content-between align-items-center">
                                                <span className="text-muted fw-bold">ID: {amistoso.id}</span>
                                                <Button 
                                                    variant="success" 
                                                    className="px-4 fw-bold shadow-sm"
                                                    onClick={() => alUnirse(amistoso.id)}
                                                >
                                                    Unirse al Partido
                                                </Button>
                                            </Card.Body>
                                        </Card>
                                    </div>
                                </Collapse>
                            </div>
                        ))
                    ) : (
                        <p className="text-muted text-center py-4">No hay amistosos disponibles en este momento.</p>
                    )}
                </div>

                <div className="d-flex justify-content-start border-top pt-4 mt-2">
                    <Button 
                        variant="outline-secondary" 
                        size="lg" 
                        onClick={alVolver} 
                        className="px-4 shadow-sm fw-bold"
                    >
                        ← Volver
                    </Button>
                </div>
            </Container>
        </div>
    );
};

export default MenuAmistosoComp;