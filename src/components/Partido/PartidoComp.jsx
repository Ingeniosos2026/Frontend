import './PartidoComp.css';
import fondoGlobal from '../../assets/kempes.jpeg';
import JugadoresTabla from './JugadoresTabla';
import Marcador from './Marcador';
import TableroCambios from './TableroCambios';
import Confetti from 'react-confetti';
import FondoCancha from './FondoCancha';
import JugadorRender from './JugadorRender';
import ActivarDt from './ActivarDt';
import PantallaInicial from './PantallaInicial';
import PantallaFinal from './PantallaFinal';

const PartidoComp = ({
    visual, hayGol, suplentes, canchaRef, estadoJuego, datosPausa, datosCambio,
    partidoIniciado,partidoTerminado, resultadoFinal,alVolver,activado, setActivado,
    idPartido, idUsuario, misJugadores, rivales, jugadoresRender, pelotaRender
}) => {
    const { tiempo, goles } = estadoJuego || {};
    const soyIzquierda = String(visual?.id_usuario_izq) === String(idUsuario);
    const soyDerecha = String(visual?.id_usuario_der) === String(idUsuario);
    const soyEspectador = !(soyDerecha || soyIzquierda);

    // PANTALLA INICIO DE PARTIDO
    if (!partidoIniciado) {
        return (
            <PantallaInicial visual={visual} />
        );
    }

    // PANTALLA DE FIN DE PARTIDO
    if (partidoTerminado) {
        return (
            <PantallaFinal 
                visual={visual} 
                resultadoFinal={resultadoFinal} 
                alVolver={alVolver} 
            />
        );
    }

    // CAMPO DE JUEGO
    return (
        <div className="layout-wrapper" style=
        {{ 
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1), rgba(252, 252, 252, 0.1)), url(${fondoGlobal})`
        }}>

            {/* MARCADOR */}
            <Marcador 
               tiempo={tiempo} 
                goles={goles} 
                alVolver={alVolver} 
                izquierda={visual.club_usuario_izq} 
                derecha={visual.club_usuario_der} 
                espectador={soyEspectador}
                avatarIzq={visual.avatar_usuario_izq}
                avatarDer={visual.avatar_usuario_der}
            />

            {/* EVENTO GOL */}
            {hayGol&& !datosPausa &&
                <div className="overlay-evento-gol">
                    <Confetti 
                        width={window.innerWidth} 
                        height={window.innerHeight} 
                        recycle={false}
                        numberOfPieces={500}
                    />
                    <h1 className="animacion-gol-texto">¡GOL!</h1>
                </div>
            }

            <div className="main-grid">

                {/* PANEL IZQUIERDO */}
                <div className="panel-left">
                    {soyIzquierda && (
                        <>
                        <ActivarDt usuarioId={idUsuario} partidoId={idPartido} activado={activado} setActivado={setActivado}/>
                        <JugadoresTabla players={misJugadores} esMio={true} jugadoresSuplentes={suplentes} idPartido={idPartido} idUsuario={idUsuario} activadoDt={activado}/>
                        
                        </>
                    )}
                    {soyDerecha && (
                        <JugadoresTabla players={rivales} esMio={false} />
                    )}
                </div>
            
                {/* CAMPO DE JUEGO */}
                <div className="pitch-container" ref={canchaRef}>

                    {/* PAUSAS */}
                    {datosPausa && (
                        <div className="overlay-pausas-cancha">
                            <h2 className="pausa-titulo-cancha">
                                {datosPausa?.numero_pausa === 2 ? "MEDIO-TIEMPO" : "COOLING BREAK"}
                            </h2>

                            {datosPausa && !datosCambio && (
                                <div className="pausa-info-cancha">
                                    <p className="pausa-info-texto-cancha">
                                        Vuelves en {datosPausa.duracion_pausa} segundos...
                                    </p>
                                </div>
                            )}

                            {/* TABLERO CAMBIOS */}
                            <TableroCambios datosCambio={datosCambio} />
                        </div>
                    )}

                    {/* CANCHA */}
                    <FondoCancha/> 

                    {/* PELOTA */}
                    {pelotaRender && (
                        <div className="entidad-juego pelota" style={{ left: `${pelotaRender.left}px`, top: `${pelotaRender.top}px` }} />
                    )}

                    {/* JUGADORES */}
                    {jugadoresRender.map((jugador) => (
                        <JugadorRender key={jugador.clave} jugador={jugador} />
                    ))}
                </div>
                
                {/* PANEL DERECHO */}
                <div className="panel-right">
                    {soyDerecha && (
                        <>
                            <ActivarDt  usuarioId={idUsuario} partidoId={idPartido} activado={activado} setActivado={setActivado}/>
                            <JugadoresTabla players={misJugadores} esMio={true} jugadoresSuplentes={suplentes} idPartido={idPartido} idUsuario={idUsuario} activadoDt={activado} />
                            
                        </>
                    )}
                    {soyIzquierda && (
                        <JugadoresTabla players={rivales} esMio={false}/>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PartidoComp;