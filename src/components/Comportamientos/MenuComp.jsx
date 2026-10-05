import React, { useState } from 'react';
import { Container, Button, Collapse, Card, Spinner } from 'react-bootstrap';


const MisComportamientos = ({ comportamientos, cargando, volver }) => {
    const [comportamiento, setComportamiento] = useState(null);
    const mostrarOpciones = (comp) => {

        if (comportamiento?.id === comp.id) {
            setComportamiento(null);
        } else {
            setComportamiento(comp);
        }
    };

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
                style={{ maxWidth: '800px', opacity: '0.95' }}
            >
                <div className="text-center mb-5">
                    <h2 className="fw-bold mb-4" style={{ color: '#6f42c1' }}>Menú de Comportamientos</h2>
                </div>

                <h4 className="mb-4 border-bottom pb-2" style={{ color: '#6f42c1' }}>
                    Mis Comportamientos
                </h4>
                
                <div className="d-flex flex-column gap-3 mb-4">
                    {comportamientos && comportamientos.length > 0 ? (
                        comportamientos.map((comp, index) => {
                            const isExpanded = comportamiento?.id === comp.id;
                            
                            return (
                                <div key={comp.id || index}>

                                    <Button 
                                        className="w-100 text-start shadow-sm d-flex justify-content-between align-items-center"
                                        onClick={() => mostrarOpciones(comp)}
                                        aria-controls={`collapse-comp-${comp.id}`}
                                        aria-expanded={isExpanded}
                                        style={{
                                            backgroundColor: isExpanded ? '#6f42c1' : 'transparent',
                                            color: isExpanded ? 'white' : '#6f42c1',
                                            borderColor: '#6f42c1',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        <span>{comp.nombre}</span>
                                        <span>{isExpanded ? '▲' : '▼'}</span>
                                    </Button>

                                    <Collapse in={isExpanded}>
                                        <div id={`collapse-comp-${comp.id}`} className="mt-2">
                                            <Card className="shadow-sm bg-light" style={{ borderColor: '#6f42c1' }}>
                                                <Card.Body className="d-flex justify-content-between align-items-center">
                                                    <span className="text-muted fw-bold">ID: {comp.id}</span>
                                                    <span className="text-muted fw-bold">ID: {comp.codigo}</span>
                                                </Card.Body>
                                            </Card>
                                        </div>
                                    </Collapse>
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-muted text-center py-4">No tienes comportamientos creados en este momento.</p>
                    )}
                </div>

                <div className="d-flex justify-content-start border-top pt-4 mt-2">
                    <Button 
                        variant="outline-secondary" 
                        size="lg" 
                        onClick={volver} 
                        className="px-4 shadow-sm fw-bold"
                    >
                        ← Volver
                    </Button>
                </div>

            </Container>
        </div>
    );
};

export default MisComportamientos;