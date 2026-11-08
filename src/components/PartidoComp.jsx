import fondoGlobal from '../assets/kempes.jpeg';
import JugadoresTabla from './JugadoresTabla';
import Marcador from '../components/Marcador';
import './PartidoComp.css';
import TableroCambios from './TableroCambios';
import Confetti from 'react-confetti';

const formatearReloj = (segs) => {
    if (!segs) return "00:00";
    return `${Math.floor(segs / 60).toString().padStart(2, '0')}:${Math.floor(segs % 60).toString().padStart(2, '0')}`;
};

const THEME = {
    colors: { pitchGreen: '#4a9029' }
};

const PartidoComp = ({
    hayGol,suplentes,equipo,canchaRef, estadoJuego, datosPausa, datosCambio,
    partidoTerminado, resultadoFinal, alVolver,
    idPartido, idUsuario, misJugadores, rivales, jugadoresRender, pelotaRender
}) => {
    // PANTALLA DE CARGA
    if (!estadoJuego && !partidoTerminado) {
        return (
            <div className="overlay-cargando">
                <h2>CARGANDO MOTOR...</h2>
            </div>
        );
    }
    
    // PANTALLA DE FIN DE PARTIDO
    if (partidoTerminado) {
        return (
            <div className="overlay-pantalla-completa">
                <h2>¡Final del Partido!</h2>
                <h1 className="texto-resultado">
                    {resultadoFinal?.goles?.izquierdo} - {resultadoFinal?.goles?.derecho}
                </h1>
                <p className="texto-secundario">Tiempo total: {formatearReloj(resultadoFinal?.tiempo)}</p>
                <button className="btn-volver" onClick={alVolver}>Volver al Menú</button>
            </div>
        );
    }

    const { tiempo, goles } = estadoJuego;
    const nombreMio = equipo.club;
    // CAMPO DE JUEGO
    return (
        <div 
            className="layout-wrapper" 
            style={{ 
                backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1), rgba(252, 252, 252, 0.1)), url(${fondoGlobal})`,
                backgroundSize: '189%', backgroundPosition: "center center", backgroundRepeat: "no-repeat",
                display: "flex", flexDirection: "column", position: "relative",
            }}
        >
            {/* MARCADOR */}
            <Marcador 
                tiempo={tiempo} goles={goles} alVolver={alVolver} local={nombreMio} visitante={"usuario 2"}
            />
            {hayGol &&
                <div style={{
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    width: '100%', 
                    height: '100%', 
                    zIndex: 9999,
                    pointerEvents: 'none',
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center'
                }}>
                <Confetti 
                    width={window.innerWidth} 
                    height={window.innerHeight} 
                    recycle={false}
                    numberOfPieces={500}
                />
                <h1 className="animacion-gol-texto" style={{ fontSize: '100px', color: 'gold', fontWeight: 'bold' }}>¡GOL!</h1>
                </div>
            }
            <div className="main-grid">

                {/* TABLA JUGADORES PROPIA */}
                <div className="panel-left">
                    <JugadoresTabla players={misJugadores} esMio={true} jugadoresSuplentes={suplentes} idPartido={idPartido} idUsuario={idUsuario} />
                </div>
            
                <div className="pitch-container" ref={canchaRef}>

                    {/* PAUSAS */}
                    {datosPausa && (
                        <div style={{
                            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                            backgroundColor: '#337e47', zIndex: 100, display: 'flex', flexDirection: 'column', 
                            justifyContent: 'center', alignItems: 'center', borderRadius: 'inherit'
                        }}>
                            <h2 style={{ fontFamily:'Arial',fontSize: '60px', color: '#f0f0f0', fontWeight: 'bold', margin: 0 }}>
                                {datosPausa?.numero_pausa === 2 ? "MEDIO-TIEMPO" : "COOLING BREAK"}
                            </h2>

                            {datosPausa && !datosCambio && (
                                <div style={{ fontSize: '20px', marginTop: '20px', color: '#555', textAlign: 'center' }}>
                                    <p style={{ margin: '5px 0', color: '#dfdfdf', fontWeight: 'bold' }}>Vuelves en {datosPausa.duracion_pausa} segundos...</p>
                                </div>
                            )}

                            {/* TABLERO CAMBIOS */}
                            <TableroCambios datosCambio={datosCambio} />
                        </div>
                    )}
                    {/* CANCHA */}
                    <div className="arco arco-izquierdo"></div>
                    <div className="arco arco-derecho"></div>
                    
                    <div className="cancha-lineas">
                        <div className="cancha-linea" style={{ left: '50%', top: 0, bottom: 0, width: '2px', transform: 'translateX(-50%)' }}></div>
                        <div className="cancha-arco-circulo" style={{ left: '50%', top: '50%', width: '20%', aspectRatio: '1', transform: 'translate(-50%, -50%)' }}></div>
                        <div className="cancha-arco-circulo" style={{ left: '50%', top: '50%', width: '6px', height: '6px', backgroundColor: 'white', transform: 'translate(-50%, -50%)' }}></div>
                        <div className="cancha-arco-circulo" style={{ left: '11%', top: '50%', transform: 'translate(-40%, -40%)', width: '12%', aspectRatio: '1', zIndex: 1 }}></div>
                        <div className="cancha-arco-circulo" style={{ right: '11%', top: '50%', transform: 'translate(40%, -40%)', width: '12%', aspectRatio: '1', zIndex: 1 }}></div>
                        <div className="cancha-area-rect" style={{ left: 0, top: '22%', width: '16%', height: '56%', borderLeft: 'none', backgroundColor: THEME.colors.pitchGreen, zIndex: 2 }}></div>
                        <div className="cancha-area-rect" style={{ right: 0, top: '22%', width: '16%', height: '56%', borderRight: 'none', backgroundColor: THEME.colors.pitchGreen, zIndex: 2 }}></div>
                        <div className="cancha-area-rect" style={{ left: 0, top: '36%', width: '6%', height: '28%', borderLeft: 'none', zIndex: 3 }}></div>
                        <div className="cancha-area-rect" style={{ right: 0, top: '36%', width: '6%', height: '28%', borderRight: 'none', zIndex: 3 }}></div>
                        <div className="cancha-arco-circulo" style={{ left: 0, top: 0, width: '6%', aspectRatio: '1', transform: 'translate(-50%, -50%)' }}></div>
                        <div className="cancha-arco-circulo" style={{ left: 0, bottom: 0, width: '6%', aspectRatio: '1', transform: 'translate(-50%, 50%)' }}></div>
                        <div className="cancha-arco-circulo" style={{ right: 0, top: 0, width: '6%', aspectRatio: '1', transform: 'translate(50%, -50%)' }}></div>
                        <div className="cancha-arco-circulo" style={{ right: 0, bottom: 0, width: '6%', aspectRatio: '1', transform: 'translate(50%, 50%)' }}></div>
                    </div>

                    {/* PELOTA */}
                    {pelotaRender && (
                        <div className="entidad-juego pelota" style={{ left: `${pelotaRender.left}px`, top: `${pelotaRender.top}px` }} />
                    )}

                    {/* JUGADORES */}
                    {jugadoresRender.map((jugador) => (
                        <div key={jugador.clave} className="entidad-juego jugador-wrapper"
                             style={{ left: `${jugador.left}px`, top: `${jugador.top}px`, transform: `translate(-50%, -50%) rotate(${jugador.angulo}deg)`, transition: 'left 0.1s linear, top 0.1s linear, transform 0.1s ease-out' }}>
                            
                            {/* DISEÑO DEL JUGADOR */}
                            <svg viewBox="0 0 100 100" width="130%" height="130%" xmlns="http://www.w3.org/2000/svg">
                                <rect x="35" y="25" width="9" height="19" rx="4.5" fill="#1F1C27" transform="rotate(-15 39.5 34.5)" />    
                                <rect x="56" y="25" width="9" height="19" rx="4.5" fill="#1F1C27" transform="rotate(15 60.5 34.5)" />
                                <rect x="18" y="32" width="9" height="22" rx="4" fill="#F29C7C" transform="rotate(-15 22.5 43)" />
                                <rect x="73" y="32" width="9" height="22" rx="4" fill="#F29C7C" transform="rotate(15 77.5 43)" />
                                <ellipse cx="26" cy="50" rx="11" ry="9" fill={jugador.colorCamiseta} transform="rotate(-20 26 50)" />
                                <ellipse cx="26" cy="48" rx="10" ry="8" fill={jugador.colorCamiseta} transform="rotate(-20 26 48)" />
                                <ellipse cx="74" cy="50" rx="11" ry="9" fill={jugador.colorCamiseta} transform="rotate(20 74 50)" />
                                <ellipse cx="74" cy="48" rx="10" ry="8" fill={jugador.colorCamiseta} transform="rotate(20 74 48)" />
                                <ellipse cx="50" cy="55" rx="29" ry="24" fill={jugador.colorCamiseta} />
                                <ellipse cx="50" cy="52" rx="28" ry="23" fill={jugador.colorCamiseta} />
                                <path d="M 47 31 C 47 27.5, 53 27.5, 53 31 Z" fill="#E08565" />
                                <circle cx="50" cy="47" r="15" fill="#F29C7C" />
                                <path d="M 35 47 A 15 15 0 0 0 65 47 A 15 15 0 0 0 56.1 33.3 L 52.2 36.4 L 46.9 32 L 43.8 37.3 L 39.4 33.8 L 38.5 40 A 15 15 0 0 0 35 47 Z" fill="#1F1C27" />
                            </svg>
                            <div className="jugador-info" style={{ transform: `rotate(-${jugador.angulo}deg)` }}>
                                {jugador.idStr && <div className="jugador-id">{jugador.idStr}</div>}
                            </div>
                        </div>
                    ))}
                </div>
                
                {/* TABLA JUGADORES RIVAL */}
                <div className="panel-right">
                    <JugadoresTabla players={rivales} esMio={false} />
                </div>
            </div>
        </div>
    );
};

export default PartidoComp;