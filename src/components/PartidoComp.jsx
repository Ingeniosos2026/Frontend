import { useState, useRef, useEffect } from 'react';
import CambiarJugador from '../containers/Equipo/CambiarJugador';
import { Button, Collapse } from 'react-bootstrap'; 
import ActivarDt from '../containers/DirectorTecnico/ActivarDT';

const CanchaVisual = ({
    estadoJuego,
    partidoTerminado,
    resultadoFinal,
    alVolver,
    jugadoresEnCancha,
    jugadoresSuplentes,
    idPartido,
    idUsuario,
    canchaDim,
    directorTecnicoActivo,
    alternarDirectorTecnico

}) => {
    const canchaRef = useRef(null);
    const [medidasFront, setMedidasFront] = useState({ ancho: 800, alto: 480 });
    const [suplente, setSuplente] = useState(null);
    const mostrarOpciones = (sup) => {
        if (suplente?.id_jugador === sup.id_jugador) {
            setSuplente(null);
        } else {
            setSuplente(sup);
        }
    };
    
    const miUsuarioId = String(localStorage.getItem('usuario_id'));
    const CANCHA_ANCHO = canchaDim?.ancho || 100;
    const CANCHA_ALTO = canchaDim?.alto || 60;
    const ARCO_IZQ = {
        poste_superior: {
            x: canchaDim?.arco_izquierdo?.poste_superior?.x || 0,
            y: canchaDim?.arco_izquierdo?.poste_superior?.y || 40
        },
        poste_inferior: {
            x: canchaDim?.arco_izquierdo?.poste_inferior?.x || 0,
            y: canchaDim?.arco_izquierdo?.poste_inferior?.y || 20
        }
    }
    const ARCO_DER = {
        poste_superior: {
            x: canchaDim?.arco_derecho?.poste_superior?.x || 100,
            y: canchaDim?.arco_derecho?.poste_superior?.y || 40
        },
        poste_inferior: {
            x: canchaDim?.arco_derecho?.poste_inferior?.x || 100,
            y: canchaDim?.arco_derecho?.poste_inferior?.y || 20
        }
    }

    // Actualiza las medidas si el usuario redimensiona la ventana
    useEffect(() => {
        const actualizarMedidas = () => {
            if (canchaRef.current) {
                setMedidasFront({
                    ancho: canchaRef.current.clientWidth,
                    alto: canchaRef.current.clientHeight
                });
            }
        };
        actualizarMedidas();
        window.addEventListener('resize', actualizarMedidas);
        return () => window.removeEventListener('resize', actualizarMedidas);
    }, [estadoJuego]);


    const escalar = (coord_back, tope_back, tope_front) => {
        return (coord_back / tope_back) * tope_front;
    };


    const formatearReloj = (segundosTotales) => {
        if (!segundosTotales) return "00:00";
        const minutos = Math.floor(segundosTotales / 60);
        const segundos = Math.floor(segundosTotales % 60);
        return `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
    };


    if (!estadoJuego && !partidoTerminado) {
        return (
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <h2>El partido ya no esta disponible</h2>
            </div>
        );
    }

    if (partidoTerminado) {
        const golesIzq = resultadoFinal?.goles?.izquierdo || 0;
        const golesDer = resultadoFinal?.goles?.derecho || 0;
        return (
            <div style={{ maxWidth: '800px', margin: '50px auto', textAlign: 'center', padding: '30px', backgroundColor: '#333', color: 'white', borderRadius: '10px' }}>
                <h2>¡Final del Partido!</h2>
                <h1 style={{ fontSize: '48px', color: '#ffd700', margin: '20px 0' }}>
                    {golesIzq} - {golesDer}
                </h1>
                <p>Tiempo total: {formatearReloj(resultadoFinal?.tiempo)}</p>
                <button 
                    onClick={alVolver}
                    style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
                >
                    Volver al Menú
                </button>
            </div>
        );
    }


    const { tiempo, pelota, jugadores, goles, estados_jugadores } = estadoJuego;


    const mapaEstados = {};
    estados_jugadores?.forEach(e => {
        mapaEstados[`${e.id_usuario}-${e.id_jugador}`] = e.estado;
    });

    return (
        <div style={{ 
            display: 'flex',
            justifyContent: 'center', 
            gap: '20px',
            width: '100%',
            padding: '20px'
        }}>

            <div style={{ 
                flex: 1,
                backgroundColor: '#333', 
                padding: '20px',
                borderRadius: '10px'
            }}>
                <h3>Columna Izquierda</h3>
                <div>
                    {
                        jugadoresEnCancha.map((jugador) => {
                            const isExpanded = suplente?.id_jugador === jugador.id_jugador;
                            return (
                                <div key={jugador.id_jugador}>
                                    <Button
                                        onClick={() => mostrarOpciones(jugador)}
                                        disabled={directorTecnicoActivo}
                                    >
                                        {jugador.id_jugador} {isExpanded ? '▲' : '▼'}
                                    </Button>
                                    <Collapse in={isExpanded}>
                                        <div>
                                            <CambiarJugador
                                                jugadorSaliente={jugador.id_jugador}
                                                jugadoresSuplentes={jugadoresSuplentes}
                                                idPartido={idPartido}
                                                idUsuario={idUsuario}
                                            />
                                        </div>
                                    </Collapse>
                                </div>
                            );
                        })
                    }
                </div>
            </div>

            <div style={{
                flex: 4,
                maxWidth: '800px',
                padding: '20px'
            }}>
                
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    gap: '50px',
                    backgroundColor: '#1a1a1a', 
                    color: 'white',
                    padding: '15px 30px', 
                    borderRadius: '10px 10px 0 0',
                    borderBottom: '4px solid #333'
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '12px', color: '#aaa', textTransform: 'uppercase' }}>Local</div>
                        <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#d32f2f' }}>
                            {goles.izquierdo}
                        </div>
                    </div>

                    <div style={{ 
                        backgroundColor: '#000', padding: '8px 20px', borderRadius: '6px', 
                        fontSize: '28px', fontFamily: 'monospace', border: '1px solid #444'
                    }}>
                        {formatearReloj(tiempo)}
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '12px', color: '#aaa', textTransform: 'uppercase' }}>Visitante</div>
                        <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#1976d2' }}>
                            {goles.derecho}
                        </div>
                    </div>
                </div>

                <div 
                    ref={canchaRef}
                    style={{ 
                        position: 'relative', 
                        width: '100%', 
                        aspectRatio: `${CANCHA_ANCHO} / ${CANCHA_ALTO}`,
                        backgroundColor: '#2e7d32', 
                        border: '2px solid white',
                        borderTop: 'none',
                        overflow: 'hidden'
                    }}
                >
                    {/* LÍNEA DE MITAD DE CANCHA*/}
                    <div style={{
                        position: 'absolute',
                        left: '50%', top: 0, bottom: 0,
                        width: '2px', backgroundColor: 'rgba(255,255,255,0.5)',
                        transform: 'translateX(-50%)'
                    }}></div>

                    {/* PELOTA */}
                    <div 
                        style={{
                            position: 'absolute',
                            left: `${escalar(pelota.x, CANCHA_ANCHO, medidasFront.ancho)}px`,
                            top: `${escalar(pelota.y, CANCHA_ALTO, medidasFront.alto)}px`,
                            transform: 'translate(-50%, -50%)',
                            width: '14px', height: '14px',
                            backgroundColor: 'white',
                            borderRadius: '50%',
                            transition: 'all 0.1s linear',
                            zIndex: 20
                        }}
                    />

                    {/* JUGADORES */}
                    {jugadores.map((jugador) => {
                        const clave = `${jugador.id_usuario}-${jugador.id_jugador}`;
                        const esMio = String(jugador.id_usuario) === miUsuarioId;
                        
                        const estado = mapaEstados[clave] || '';
                        const bgColor = esMio ? '#d32f2f' : '#1976d2';

                        return (
                            <div 
                                key={clave}
                                style={{
                                    position: 'absolute',
                                    left: `${escalar(jugador.x, CANCHA_ANCHO, medidasFront.ancho)}px`,
                                    top: `${escalar(jugador.y, CANCHA_ALTO, medidasFront.alto)}px`,
                                    transform: 'translate(-50%, -50%)',
                                    transition: 'all 0.1s linear',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    zIndex: 10
                                }}
                            >
                                {/* Círculo del Jugador */}
                                <div style={{
                                    width: '24px', height: '24px',
                                    backgroundColor: bgColor,
                                    border: '2px solid white',
                                    borderRadius: '50%',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'white', fontSize: '10px', fontWeight: 'bold'
                                }}>
                                    {jugador.id_jugador}
                                </div>

                                {/* Etiqueta de Estado */}
                                {estado && (
                                    <div style={{
                                        marginTop: '2px',
                                        color: 'white',
                                        fontSize: '9px',
                                        backgroundColor: 'rgba(0,0,0,0.6)',
                                        padding: '1px 4px',
                                        borderRadius: '3px',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        {estado}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: '15px'
                }}>
                    <ActivarDt
                        usuarioId={idUsuario}
                        partidoId={idPartido}
                        activado={directorTecnicoActivo}
                        alternarDirectorTecnico={alternarDirectorTecnico}
                    />
                </div>
                
            </div>

            <div style={{ 
                    flex: 1,
                    backgroundColor: '#333',
                    padding: '20px',
                    borderRadius: '10px'
            }}>
                    <h3>Columna Derecha</h3>
            </div>

        </div>
    );
};

export default CanchaVisual;