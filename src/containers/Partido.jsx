import { useEffect, useState, useRef, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { createWSService } from '../services/WSService';
import { createHttpService } from '../services/HttpService.js';
import PartidoComp from '../components/PartidoComp';

const CANCHA_ANCHO = 100;
const CANCHA_ALTO = 60;

const Partido = () => {

    const { partido_id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const rutaDeRegreso = location.state?.returnTo;
    const idUsuario = Number(localStorage.getItem('usuario_id'));
    const [httpService] = useState(() => createHttpService());

    const [datosSuplente, setDatosSuplente] = useState([]);
    const [equipo, setEquipo] = useState({});
    const [estadoJuego, setEstadoJuego] = useState(null);
    const [datosPausa, setDatosPausa] = useState(null);
    const [partidoTerminado, setPartidoTerminado] = useState(false);
    const [resultadoFinal, setResultadoFinal] = useState(null);
    const [datosCambio, setDatosCambio] = useState(null);

    const canchaRef = useRef(null);
    const posicionesPrevias = useRef({});
    const [medidasFront, setMedidasFront] = useState({ ancho: 800, alto: 480 });
    const debeActualizarSuplentes = useRef(true);
    const [hayGol,setHayGol] = useState(false);
    const totalGolesPrevios = useRef(0);

    useEffect(() => {
        const wsEndpoint = `/partido/${partido_id}/ws`;
        const wsService = createWSService(wsEndpoint);

        wsService.connect();

        const cargarDatosEquipo = async () => {
            try {
                const respuesta = await httpService.obtenerEquipo(partido_id, idUsuario);
                setEquipo(respuesta.usuario);
                console.log(equipo);
            } catch (error) {
                console.error("Error al obtener equipo:", error);
            }
        };

        const manejarEstadoPartido = (payload) => {
            setEstadoJuego(payload);

            if (payload.goles) {
                // 1. Aseguramos que sean números matemáticos
                const golesIzq = Number(payload.goles.derecho);
                const golesDer = Number(payload.goles.izquierdo);
                const totalGolesActual = golesIzq + golesDer;
                
                // 2. Log de diagnóstico: Solo imprime si nota una diferencia con el tick anterior
                if (totalGolesActual !== totalGolesPrevios.current && totalGolesPrevios.current !== -1) {
                    console.log(`[DEBUG] Marcador cambió: antes ${totalGolesPrevios.current}, ahora ${totalGolesActual}`);
                }
                
                // 3. Condición de Gol
                if (totalGolesActual > totalGolesPrevios.current) {
                    
                    // Si NO es la primera vez que lee el estado (evita falso gol al reconectar)
                    if (totalGolesPrevios.current !== -1) {
                        setHayGol(true);
                        console.log("¡GOL ANIMACIÓN ACTIVADA!");
                        setTimeout(() => setHayGol(false), 3500);
                    }
                }

                // 4. Actualizamos siempre la referencia para el próximo tick
                totalGolesPrevios.current = totalGolesActual;
            }

        

            if (debeActualizarSuplentes.current && payload.suplentes) {
                const suplentesFormateados = payload.suplentes
                    .filter((jugador) => String(jugador.id_usuario) === String(idUsuario))
                    .map((jugador) => ({
                        id_jugador: jugador.id_jugador,
                        nombre: jugador.nombre
                    }));
                setDatosSuplente(suplentesFormateados);
                debeActualizarSuplentes.current = false;
            }
        };

        const manejarPartidoIniciado = () => {
            //setar pantalla de inicio..
            cargarDatosEquipo(); 
        };

        const manejarFinPartido = (payload) => { 
            setPartidoTerminado(true); 
            setResultadoFinal(payload); 
        };

        const manejarReconexionPartido = (payload) =>{
            setEstadoJuego(payload);
            cargarDatosEquipo();
        } 
        
        const manejarCambioJugador = (payload) => {
            setDatosCambio(payload);
            debeActualizarSuplentes.current = true;
        };
        
        const manejarPartidoPausado = (payload) => {
            setEstadoJuego(prev => ({ ...prev, tiempo: payload.tiempo }));
            setDatosPausa({ numero_pausa: payload.numero_pausa, duracion_pausa: payload.duracion_pausa });
        };

        const manejarPartidoReanudado = () => {
            setDatosPausa(null);
            setDatosCambio(null);
        };
        
        wsService.on('partido_iniciado', manejarPartidoIniciado);
        wsService.on('estado_partido', manejarEstadoPartido);
        wsService.on('partido_terminado', manejarFinPartido);
        wsService.on('reconexion_partido', manejarReconexionPartido);
        wsService.on('partido_pausado', manejarPartidoPausado);
        wsService.on('partido_reanudado', manejarPartidoReanudado);
        wsService.on('cambio_jugador_realizado', manejarCambioJugador);

        return () => {
            wsService.off('partido_iniciado', manejarPartidoIniciado);
            wsService.off('estado_partido', manejarEstadoPartido);
            wsService.off('reconexion_partido', manejarReconexionPartido);
            wsService.off('partido_pausado', manejarPartidoPausado);
            wsService.off('partido_reanudado', manejarPartidoReanudado);
            wsService.off('cambio_jugador_realizado', manejarCambioJugador);
            wsService.off('partido_terminado', manejarFinPartido);
            wsService.disconnect();
        };
    }, [partido_id, idUsuario]);

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
            hayGol={hayGol}
            suplentes={datosSuplente}
            equipo={equipo}
            canchaRef={canchaRef}
            estadoJuego={estadoJuego}
            datosPausa={datosPausa}
            datosCambio={datosCambio}
            partidoTerminado={partidoTerminado}
            resultadoFinal={resultadoFinal}
            alVolver={manejarVolver}
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