import { Accordion } from 'react-bootstrap';
import CambiarJugador from '../../containers/Equipo/CambiarJugador';
import CambiarComportamiento from '../../containers/Equipo/CambiarComportamiento';

const JugadoresTabla= ({ players, esMio, jugadoresSuplentes, idPartido, idUsuario, activadoDt }) => {
    return (
        <div className="player-list-container" style={{display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
            <div style={{textAlign: 'center', fontWeight: 'bold', marginBottom: '10px', color: '#44443c'}}>
                <p style={{ margin: 0 }}>{esMio ? "MIS JUGADORES" : "JUGADORES DEL RIVAL"}</p>
            </div>
            
            {esMio ? (
                <>
                <Accordion flush>
                    {players.map((jugador) => (
                        <Accordion.Item eventKey={String(jugador.id_jugador)} key={jugador.id_jugador}>
                            <Accordion.Header className="custom-accordion-header">
                                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'center'}}>
                                    <span style={{ fontWeight: '600', color: '#2c3e50', fontSize: '14px' }}>{jugador.nombre}</span>
                                </div>
                            </Accordion.Header>
                            <Accordion.Body style=
                            {{ 
                                backgroundColor: '#f8f9fa',
                                padding: '10px',
                                borderBottom: '1px solid #dee2e6',
                                display:'flex',flexDirection:'column',
                                justifyContent:'end'
                            }}>
                                <CambiarJugador
                                    jugadorSaliente={jugador.id_jugador}
                                    jugadoresSuplentes={jugadoresSuplentes}
                                    idPartido={idPartido}
                                    idUsuario={idUsuario}
                                    disabled = {activadoDt}
                                />
                                <CambiarComportamiento
                                    idJugadorSeleccionado={jugador.id_jugador}
                                    idPartido={idPartido}
                                    idUsuario={idUsuario}
                                    disabled={activadoDt}
                                />
                            </Accordion.Body>
                        </Accordion.Item>
                    ))}
                    
                </Accordion>
                </>
            ) : (
                <div style={{ width: '100%' ,display:'flex', flexDirection:'column', alignItems:'center'}}>
                    {players.map((jugador) => (
                        <div key={jugador.id_jugador} style=
                        {{
                            padding: '12px 15px',
                            borderBottom: '1px solid #dee2e6',
                            color: '#2c3e50',
                            fontSize: '14px',
                            fontWeight: '600' 
                        }}>
                            {jugador.nombre}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default JugadoresTabla;