import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { createWSService } from '../services/WSService';
import CanchaVisual from '../components/PartidoComp.jsx';

const Partido = () => {
    const { partido_id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const rutaDeRegreso = location.state?.returnTo;
    const idUsuario = Number(localStorage.getItem('usuario_id'));

    const [estadoJuego, setEstadoJuego] = useState(null);
    const [partidoTerminado, setPartidoTerminado] = useState(false);
    const [resultadoFinal, setResultadoFinal] = useState(null);
    const [misJugadoresSuplentes, setJugadoresSuplentes] = useState([]);
    const [misJugadoresEnCancha, setJugadoresEnCancha] = useState([]);
    const [canchaDim, setCanchaDim] = useState(null);
    const [datosPausa, setDatosPausa] = useState(null);
    const [datosCambio, setDatosCambio] = useState(null);

    useEffect(() => {
        const wsEndpoint = `/partido/${partido_id}/ws`;
        const wsService = createWSService(wsEndpoint);

        wsService.connect();

        const manejarEstadoPartido = (payload) => {
            setEstadoJuego(payload);
        };

        const manejarFinPartido = (payload) => {
            setPartidoTerminado(true);
            setResultadoFinal(payload);
        };

        const manejarReconexionPartido = (payload) => {
            setEstadoJuego(payload);
            setCanchaDim(payload.cancha);
            setJugadoresEnCancha(payload.jugadores.filter(jugador => jugador.id_usuario === idUsuario));   
        }

        const manejarPartidoPausado = (payload) => {
            setEstadoJuego(prevEstado => ({ ...prevEstado, tiempo: payload.tiempo }));
            setDatosPausa({
                numero_pausa: payload.numero_pausa,
                duracion_pausa: payload.duracion_pausa,
            });
        }

        const manejarPartidoReanudado = (payload) => {
            setEstadoJuego(prevEstado => ({ ...prevEstado, tiempo: payload.tiempo }));
        }

        const manejarCambioJugador = (payload) => {
            setDatosCambio(payload);
            setJugadoresEnCancha(prevJugadores => {
                const jugadoresActualizados = prevJugadores.map(jugador => {
                    if (jugador.id_jugador === payload.jugador_sale_id) {
                        return { ...jugador, id_jugador: payload.jugador_entra_id };
                    }
                    return jugador;
                });
                return jugadoresActualizados;
            });
            setJugadoresSuplentes(prevSuplentes => {
                const jugadoresActualizados = prevSuplentes.filter(jugador => jugador.id_jugador !== payload.jugador_entra_id);
                return jugadoresActualizados;
            });
                
        };

        wsService.on('estado_partido', manejarEstadoPartido);
        wsService.on('partido_terminado', manejarFinPartido);
        wsService.on('reconexion_partido', manejarReconexionPartido);
        wsService.on('partido_pausado', manejarPartidoPausado);
        wsService.on('partido_reanudado', manejarPartidoReanudado);
        wsService.on('cambio_jugador_realizado', manejarCambioJugador);

        return () => {
            wsService.off('estado_partido', manejarEstadoPartido);
            wsService.off('partido_terminado', manejarFinPartido);
            wsService.off('reconexion_partido', manejarReconexionPartido);
            wsService.off('partido_pausado', manejarPartidoPausado);
            wsService.off('partido_reanudado', manejarPartidoReanudado);
            wsService.off('cambio_jugador_realizado', manejarCambioJugador);
            wsService.disconnect();
        };
    }, [partido_id]);

    const manejarVolver = () => {
        navigate(rutaDeRegreso);
    };

    return (
        <CanchaVisual
            estadoJuego={estadoJuego}
            partidoTerminado={partidoTerminado}
            resultadoFinal={resultadoFinal}
            alVolver={manejarVolver}
            jugadoresEnCancha={misJugadoresEnCancha}
            jugadoresSuplentes={misJugadoresSuplentes}
            idPartido={partido_id}
            idUsuario={idUsuario}
            canchaDim={canchaDim}
        />
    );
};

export default Partido;