import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { createWSService } from '../../services/WSService';
import { createHttpService } from '../../services/HttpService';
import LigaEnCursoComp from '../../components/Ligas/LigaEnCursoComp';
import LigaFinalizadaComp from '../../components/Ligas/LigaFinalizadaComp';

const estados = { 
    EN_CURSO: 'en_curso',
    FINALIZADA: 'finalizada'
};

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
    const [estadoLiga, setEstadoLiga] = useState(estados.EN_CURSO);
    
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
        const manejarProximoPartido = (payload) => {
            const partido_id = payload.id_proximo_partido;
            const proximo_turno = payload.turno;
            
            setIdPartidoActual(partido_id);
            setPartidosEnCurso(prev => {
                const nuevo = new Set(prev);
                nuevo.add(partido_id);
                return nuevo;
            });

            const miPartido = fixtureRef.current.find(
                p => p.turno === proximo_turno && 
                (p.equipo_izq.id_equipo === usuarioId || p.equipo_der.id_equipo === usuarioId)
            );
            
            if (miPartido) {
                const ultimoJugado = sessionStorage.getItem(`ultimo_jugado_${liga_id}`);
                if (String(partido_id) !== ultimoJugado) {
                    sessionStorage.setItem(`ultimo_jugado_${liga_id}`, partido_id);
                    navigate(`/partido/${partido_id}`, { 
                        state: { returnTo: `/ligas/en_curso/${liga_id}` }
                    });
                }
            }
        };

        const manejarPartidoFinalizado = (payload) => {
            const fila_fixture = payload.fixture;
            const fila_tabla_eq_iza = payload.tabla_actualizada[0];
            const fila_tabla_eq_der = payload.tabla_actualizada[1];
            
            setPartidosEnCurso(prev => {
                const nuevo = new Set(prev);
                nuevo.delete(fila_fixture.id_partido);
                return nuevo;
            });
            setPartidosFinalizados(prev => {
                const nuevo = new Set(prev);
                nuevo.add(fila_fixture.id_partido)
                return nuevo;
            });

            setFixtureLiga(prevFixture => prevFixture.map(fila => 
                fila.id_partido === fila_fixture.id_partido ? fila_fixture : fila
            ));

            setTablaLiga(prevTabla => {
                const actualizado = prevTabla.map(fila => {
                    if (fila.id_equipo === fila_tabla_eq_iza.id_equipo) return fila_tabla_eq_iza;
                    if (fila.id_equipo === fila_tabla_eq_der.id_equipo) return fila_tabla_eq_der;
                    return fila;
                });
                return ordenarTabla(actualizado);
            });
        };

        const manejarLigaTerminada = (payload) => {
            console.log("La liga finalizó. ID:", payload.liga_id);
            setEstadoLiga(estados.FINALIZADA);
        };

        if (!wsService.isConnected) {
            wsService.connect();
            wsService.on('proximo_partido', manejarProximoPartido);
            wsService.on('resultado_partido', manejarPartidoFinalizado);
            wsService.on('liga_terminada', manejarLigaTerminada);
        }

        return () => {
            wsService.off('proximo_partido', manejarProximoPartido);
            wsService.off('resultado_partido', manejarPartidoFinalizado);
            wsService.off('liga_terminada', manejarLigaTerminada);
            wsService.disconnect();
        };
    }, [liga_id, usuarioId, navigate]);
    
    const manejarVolver = () => {
        sessionStorage.removeItem(`ultimo_jugado_${liga_id}`);
        navigate('/ligas');
    };

    if (estadoLiga === estados.FINALIZADA) {
        return (
            <LigaFinalizadaComp 
                alVolver={manejarVolver}
                tablaLiga={tablaLiga}    
            />
        );
    }

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
            partidoActualId={idPartidoActual}
        />  
    );
};

export default LigaEnCurso;