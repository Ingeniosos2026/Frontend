import { Accordion } from 'react-bootstrap';
import CambiarJugador from '../containers/Equipo/CambiarJugador';

const JugadoresTabla= ({ players, esMio, jugadoresSuplentes, idPartido, idUsuario }) => {
    return (
        <div className="player-list-container" style={{display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
            <div style={{textAlign: 'center', fontWeight: 'bold', marginBottom: '10px', color: '#44443c'}}>
                <p style={{ margin: 0 }}>{esMio ? "MIS JUGADORES" : "JUGADORES DEL RIVAL"}</p>
            </div>
            
            {esMio ? (
                <Accordion flush>
                    {players.map((jugador) => (
                        <Accordion.Item eventKey={String(jugador.id_jugador)} key={jugador.id_jugador}>
                            <Accordion.Header className="custom-accordion-header">
                                <span style={{ fontWeight: '600', color: '#2c3e50', fontSize: '14px' }}>JUGADOR {jugador.id_jugador}</span>
                            </Accordion.Header>
                            <Accordion.Body style={{ backgroundColor: '#f8f9fa', padding: '10px', borderBottom: '1px solid #dee2e6',display:'flex',flexDirection:'column',justifyContent:'end'}}>
                                <CambiarJugador
                                    jugadorSaliente={jugador.id_jugador}
                                    jugadoresSuplentes={jugadoresSuplentes}
                                    idPartido={idPartido}
                                    idUsuario={idUsuario}
                                />
                                <button style={{ width: '100%', marginTop: '8px', padding: '6px', backgroundColor: '#e9ecef', border: '1px solid #ced4da', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', color: '#495057' }}>
                                    Comportamiento
                                </button>
                            </Accordion.Body>
                        </Accordion.Item>
                    ))}
                </Accordion>
            ) : (
                <div style={{ width: '100%' ,display:'flex', flexDirection:'column', alignItems:'center'}}>
                    {players.map((jugador) => (
                        <div key={jugador.id_jugador} style={{ padding: '12px 15px', borderBottom: '1px solid #dee2e6', color: '#2c3e50', fontSize: '14px', fontWeight: '600' }}>
                            JUGADOR {jugador.id_jugador}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default JugadoresTabla;