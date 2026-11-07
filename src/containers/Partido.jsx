import { useEffect, useState, useRef, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { createWSService } from '../services/WSService';
import PartidoComp from './PartidoComp'; 

const CANCHA_ANCHO = 100;
const CANCHA_ALTO = 60;

const Partido = () => {

    const { partido_id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const rutaDeRegreso = location.state?.returnTo;
    const idUsuario = Number(localStorage.getItem('usuario_id'));

    const [estadoJuego, setEstadoJuego] = useState(null);
    const [EnPausa, setPartidoPausado] = useState(false);
    const [datosPausa, setDatosPausa] = useState(null);
    const [partidoTerminado, setPartidoTerminado] = useState(false);
    const [resultadoFinal, setResultadoFinal] = useState(null);
    const [datosCambio, setDatosCambio] = useState(null);
    const [jugadoresSuplentes, setJugadoresSuplentes] = useState([]); 

    const canchaRef = useRef(null);
    const posicionesPrevias = useRef({});
    const [medidasFront, setMedidasFront] = useState({ ancho: 800, alto: 480 });

    useEffect(() => {
        const wsEndpoint = `/partido/${partido_id}/ws`;
        const wsService = createWSService(wsEndpoint);

        wsService.connect();

        const manejarEstadoPartido = (payload) => setEstadoJuego(payload);
        const manejarFinPartido = (payload) => { setPartidoTerminado(true); setResultadoFinal(payload); };
        const manejarReconexionPartido = (payload) => setEstadoJuego(payload);
        const manejarCambioJugador = (payload) => setDatosCambio(payload);
        
        const manejarPartidoPausado = (payload) => {
            setPartidoPausado(true);
            setEstadoJuego(prev => ({ ...prev, tiempo: payload.tiempo }));
            setDatosPausa({ numero_pausa: payload.numero_pausa, duracion_pausa: payload.duracion_pausa });
        };

        const manejarPartidoReanudado = () => {
            setPartidoPausado(false);
            setDatosPausa(null);
            setDatosCambio(null);
        };

        wsService.on('estado_partido', manejarEstadoPartido);
        wsService.on('partido_terminado', manejarFinPartido);
        wsService.on('reconexion_partido', manejarReconexionPartido);
        wsService.on('partido_pausado', manejarPartidoPausado);
        wsService.on('partido_reanudado', manejarPartidoReanudado);
        wsService.on('cambio_jugador_realizado', manejarCambioJugador);

        return () => {
            wsService.off('estado_partido', manejarEstadoPartido);
            wsService.off('reconexion_partido', manejarReconexionPartido);
            wsService.off('partido_pausado', manejarPartidoPausado);
            wsService.off('partido_reanudado', manejarPartidoReanudado);
            wsService.off('cambio_jugador_realizado', manejarCambioJugador);
            wsService.off('partido_terminado', manejarFinPartido);
            wsService.disconnect();
        };
    }, [partido_id]);

    useEffect(() => {
        if (!canchaRef.current) return;
        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                setMedidasFront({ ancho: entry.contentRect.width, alto: entry.contentRect.height });
            }
        });
        resizeObserver.observe(canchaRef.current);
        return () => resizeObserver.disconnect();
    }, [estadoJuego]);

    const { misJugadores, rivales, jugadoresRender, pelotaRender } = useMemo(() => {
        if (!estadoJuego) return { misJugadores: [], rivales: [], jugadoresRender: [], pelotaRender: null };

        const m = [];
        const r = [];
        const jRender = [];

        estadoJuego.jugadores?.forEach(jugador => {
            const esMio = String(jugador.id_usuario) === String(idUsuario);
            if (esMio) m.push(jugador);
            else r.push(jugador);

            const clave = `${jugador.id_usuario}-${jugador.id_jugador}`;
            let angulo = 0;
            const prev = posicionesPrevias.current[clave];
            
            if (prev) {
                const dx = jugador.x - prev.x;
                const dy = jugador.y - prev.y;
                if (Math.abs(dx) > 0.05 || Math.abs(dy) > 0.05) {
                    angulo = (Math.atan2(dy, dx) * (180 / Math.PI)) + 90;
                } else {
                    angulo = prev.angulo; 
                }
            }
            posicionesPrevias.current[clave] = { x: jugador.x, y: jugador.y, angulo };

            jRender.push({
                ...jugador,
                clave,
                idStr: String(jugador.id_usuario),
                colorCamiseta: esMio ? '#1976d2' : '#941a1a',
                left: (jugador.x / CANCHA_ANCHO) * medidasFront.ancho,
                top: (jugador.y / CANCHA_ALTO) * medidasFront.alto,
                angulo
            });
        });

        const pRender = estadoJuego.pelota ? {
            left: (estadoJuego.pelota.x / CANCHA_ANCHO) * medidasFront.ancho,
            top: (estadoJuego.pelota.y / CANCHA_ALTO) * medidasFront.alto,
        } : null;

        return { misJugadores: m, rivales: r, jugadoresRender: jRender, pelotaRender: pRender };
    }, [estadoJuego, medidasFront, idUsuario]);
    
    const manejarVolver = () => {
        navigate(rutaDeRegreso);
    };

    return (
        <PartidoComp
            canchaRef={canchaRef}
            estadoJuego={estadoJuego}
            EnPausa={EnPausa}
            datosPausa={datosPausa}
            datosCambio={datosCambio}
            partidoTerminado={partidoTerminado}
            resultadoFinal={resultadoFinal}
            alVolver={manejarVolver}
            jugadoresSuplentes={jugadoresSuplentes}
            idPartido={partido_id}
            idUsuario={idUsuario}
            misJugadores={misJugadores}
            rivales={rivales}
            jugadoresRender={jugadoresRender}
            pelotaRender={pelotaRender}
        />
    );
};

export default Partido;