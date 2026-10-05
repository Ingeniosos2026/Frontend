import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Medidas lógicas de tu backend en Python
const CANCHA_ANCHO = 100;
const CANCHA_ALTO = 60;

const CanchaVisual = ({ estadoJuego, partidoTerminado, resultadoFinal }) => {
    const canchaRef = useRef(null);
    const navigate = useNavigate();
    const [medidasFront, setMedidasFront] = useState({ ancho: 800, alto: 480 });
    
    // Obtenemos tu ID para saber de qué color pintar a tus jugadores
    const miUsuarioId = String(localStorage.getItem('usuario_id'));

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
    }, [estadoJuego]); // Re-calcula cuando carga el primer frame

    const manejarVolver = () => {
        navigate('/amistosos');
    };

    // Función matemática para mapear coordenadas
    const escalar = (coord_back, tope_back, tope_front) => {
        return (coord_back / tope_back) * tope_front;
    };

    // Formatear segundos a reloj digital (ej. 5.033 -> "00:05")
    const formatearReloj = (segundosTotales) => {
        if (!segundosTotales) return "00:00";
        const minutos = Math.floor(segundosTotales / 60);
        const segundos = Math.floor(segundosTotales % 60);
        return `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
    };

    // 1. ESTADO DE CARGA
    if (!estadoJuego && !partidoTerminado) {
        return (
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <h2>Cargando motor de físicas...</h2>
            </div>
        );
    }

    // 2. ESTADO FINALIZADO
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
                    onClick={manejarVolver}
                    style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
                >
                    Volver al Menú
                </button>
            </div>
        );
    }

    // 3. ESTADO EN CURSO (Desestructuramos el JSON)
    const { tiempo, pelota, jugadores, goles, estados_jugadores } = estadoJuego;

    // Convertimos la lista de estados_jugadores a un diccionario para búsqueda ultrarrápida
    const mapaEstados = {};
    estados_jugadores?.forEach(e => {
        mapaEstados[`${e.id_usuario}-${e.id_jugador}`] = e.estado;
    });

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            
            {/* --- SCOREBOARD --- */}
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

            {/* --- LA CANCHA --- */}
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
                {/* LÍNEA DE MITAD DE CANCHA (Decoración) */}
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
        </div>
    );
};

export default CanchaVisual;