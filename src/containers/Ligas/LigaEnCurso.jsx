import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { createWSService } from '../../services/WSService';
import { createHttpService } from '../../services/HttpService';
import LigaEnCursoComp from '../../components/Ligas/LigaEnCursoComp';

const ordenarTabla = (tabla) => {
    return [...tabla].sort((a, b) => {
        const diferenciaPuntos = b.puntos - a.puntos;
        if (diferenciaPuntos !== 0) return diferenciaPuntos; 
        
        const difGolesA = a.goles_a_favor - a.goles_en_contra;
        const difGolesB = b.goles_a_favor - b.goles_en_contra;
        return difGolesB - difGolesA;
    });
};
const ordenarFixture = (fixture) => {
    return [...fixture].sort((a, b) => {
        return a.turno - b.turno;
    });
};

const LigaEnCurso = () => {
    const { liga_id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const usuarioId = Number(localStorage.getItem('usuario_id'));
    const esCreador = location.state?.esCreador || false;

    const [httpService] = useState(() => createHttpService());
    const [wsService] = useState(() => createWSService(`/ws/liga/${liga_id}`));
    
    const [mensajeError, setError] = useState(null);
    const [cargando, setCargando] = useState(true);
    
    const [tablaLiga, setTablaLiga] = useState([]);
    const [fixtureLiga, setFixtureLiga] = useState([]);
    const [idPartidoActual, setIdPartidoActual] = useState(null);
    const [partidosEnCurso, setPartidosEnCurso] = useState(new Set());
    const [partidosFinalizados, setPartidosFinalizados] = useState(new Set());

    const fixtureRef = useRef([]);
    const usuarioIdRef = useRef(usuarioId);

    useEffect(() => {
        fixtureRef.current = fixtureLiga;
    }, [fixtureLiga]);

    useEffect(() => {
        const init = async () => {
            try {
                setCargando(true);
                const tabla = await httpService.obtenerTablaLiga(liga_id);
                const fixture = await httpService.obtenerFixtureLiga(liga_id);
                
                const tabla_ordenada = ordenarTabla(tabla);
                const fixture_ordenado = ordenarFixture(fixture);
                
                const partido_actual_obj = fixture_ordenado.toReversed().find(f => f.id_partido !== null);
                const partido_actual_id = partido_actual_obj ? partido_actual_obj.id_partido : null;
                
                setTablaLiga(tabla_ordenada);
                setFixtureLiga(fixture_ordenado);
                setIdPartidoActual(partido_actual_id);

                if (partido_actual_id) {
                    setPartidosEnCurso(new Set([partido_actual_id]));

                    const miPartido = fixture_ordenado.find(
                        p => p.id_partido === partido_actual_id && 
                        (p.equipo_izq.id_equipo === usuarioId || p.equipo_der.id_equipo === usuarioId)
                    );

                    if (miPartido) {
                        const ultimoJugado = sessionStorage.getItem(`ultimo_jugado_${liga_id}`);
                        if (String(partido_actual_id) !== ultimoJugado) {
                            sessionStorage.setItem(`ultimo_jugado_${liga_id}`, partido_actual_id);
                            navigate(`/partido/${partido_actual_id}`, { 
                                state: { returnTo: `/ligas/en_curso/${liga_id}` }
                            });
                        }
                    }
                }

            } catch (error) {
                console.error(error.message);
                setError(error.message);
            } finally {
                setCargando(false);
            }
        };

        init();

    }, [httpService, usuarioId, liga_id, navigate]);

    useEffect(() => {
        const manejarPartidoIniciado = (payload) => {
            const partidoId = payload.partido_id;
            
            setPartidosEnCurso(prev => {
                const nuevo = new Set(prev);
                nuevo.add(partidoId);
                return nuevo;
            });

            const miPartido = fixtureRef.current.find(
                p => p.partido_id === partidoId && 
                (p.usuario_id_izq === usuarioIdRef.current || p.usuario_id_der === usuarioIdRef.current)
            );
            
            if (miPartido) {
                navigate(`/partido/${partidoId}`, { 
                    state: { returnTo: `/ligas/lobby/${liga_id}` }
                });
            }
        };

        const manejarPartidoFinalizado = async (payload) => {
            const partidoId = payload.partido_id;
            const goles_izq = payload.goles_izq;
            const goles_der = payload.goles_der;
            
            setPartidosEnCurso(prev => {
                const nuevo = new Set(prev);
                nuevo.delete(partidoId);
                return nuevo;
            });
            setPartidosFinalizados(prev => {
                const nuevo = new Set(prev);
                nuevo.add(partidoId);
                return nuevo;
            });

            setFixtureLiga(prevFixture => 
                prevFixture.map(partido => 
                    partido.partido_id === partidoId 
                        ? { ...partido, goles_izq, goles_der } 
                        : partido
                )
            );

            try {
                const tablaActualizada = await httpService.obtenerTablaLiga(liga_id);
                setTablaLiga(tablaActualizada);
            } catch (error) {
                console.error("Error al refrescar la tabla:", error);
            }
        };

        const manejarLigaFinalizada = (payload) => {
            console.log("La liga finalizó. ID:", payload.liga_id);
        };

        if (!wsService.isConnected) {
            wsService.connect();
            wsService.on('partido_iniciado', manejarPartidoIniciado);
            wsService.on('partido_finalizado', manejarPartidoFinalizado);
            wsService.on('liga_finalizada', manejarLigaFinalizada);
        }

        return () => {
            wsService.off('partido_iniciado', manejarPartidoIniciado);
            wsService.off('partido_finalizado', manejarPartidoFinalizado);
            wsService.off('liga_finalizada', manejarLigaFinalizada);
            wsService.disconnect();
        };
    }, [liga_id, usuarioId, navigate]);
    
    return (
        <LigaEnCursoComp
            cargando={cargando}
            tablaLiga={tablaLiga}
            fixtureLiga={fixtureLiga}
            mensajeError={mensajeError}
            partidosEnCurso={partidosEnCurso}
            partidosFinalizados={partidosFinalizados}
            miUsuarioId={usuarioId}
            esCreador={esCreador}
        />  
    );
};

export default LigaEnCurso;