import React, { useState } from "react";
import { Container, Button, Collapse, Card, Spinner } from 'react-bootstrap';

const MenuPlantelComponente = ({ jugadores, cargando, crear, volver }) => {
    const [jugadorDespliegue, setJugadorDespliegue] = useState(null);

    const mostrarOpciones = (jugador) => {
        if (jugadorDespliegue?.id === jugador.id) {
            setJugadorDespliegue(null);
        } else {
            setJugadorDespliegue(jugador);
        }
    };

    
    return (
        <div 
            className="min-vh-100 d-flex flex-column align-items-center py-5"
        >

            <Container 
                className="p-4 p-md-5 bg-white rounded shadow-lg" 
                style={{ maxWidth: '800px', opacity: '0.95' }}
            >
                <div className="text-center mb-5">
                    <h2 className="fw-bold mb-4" style={{ color: '#fd7e14' }}>Menú de Jugadores</h2>
                    

                    <Button 
                        size="lg" 
                        className="px-5 shadow-sm fw-bold rounded-pill border-0"
                        style={{ backgroundColor: '#fd7e14', transition: 'all 0.3s ease' }}
                        onClick={crear}
                    >
                        + Crear Jugador
                    </Button>
                </div>

                <h4 className="mb-4 border-bottom pb-2" style={{ color: '#fd7e14' }}>
                    Mis Jugadores
                </h4>
                
                <div className="d-flex flex-column gap-3 mb-4">
                    {jugadores && jugadores.length > 0 ? (
                        jugadores.map((jugador) => {
                            const isExpanded = jugadorDespliegue?.id === jugador.id;
                            
                            return (
                                <div key={jugador.id}>
                            
                                    <Button 
                                        className="w-100 text-start shadow-sm d-flex justify-content-between align-items-center"
                                        onClick={() => mostrarOpciones(jugador)}
                                        aria-controls={`collapse-jugador-${jugador.id}`}
                                        aria-expanded={isExpanded}
                                        style={{
                                            backgroundColor: isExpanded ? '#fd7e14' : 'transparent',
                                            color: isExpanded ? 'white' : '#fd7e14',
                                            borderColor: '#fd7e14',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        <span>{jugador.nombre}</span>
                                        <span>{isExpanded ? '▲' : '▼'}</span>
                                    </Button>
                                    
                                    <Collapse in={isExpanded}>
                                        <div id={`collapse-jugador-${jugador.id}`} className="mt-2">
                                            <Card className="shadow-sm bg-light" style={{ borderColor: '#fd7e14' }}>
                                                <Card.Body className="d-flex justify-content-between align-items-center">
                                                    <span className="text-muted fw-bold">PODER: {jugador.strength}</span>
                                                    <span className="text-muted fw-bold">AGILIDAD: {jugador.strength}</span>
                                                    <span className="text-muted fw-bold">CONTROL: {jugador.strength}</span>
                                                    <span className="text-muted fw-bold">VELOCIDAD: {jugador.strength}</span>
                                                    <span className="text-muted fw-bold">FUERZA: {jugador.strength}</span>
                                                </Card.Body>
                                            </Card>
                                        </div>
                                    </Collapse>
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-muted text-center py-4">No tienes jugadores creados en este momento.</p>
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

export default MenuPlantelComponente;