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
    const usuarioId = Number(localStorage.getItem('usuario_id'));

    const httpServiceRef = useRef(null);
    if (!httpServiceRef.current) {
        httpServiceRef.current = createHttpService();
    }
    const httpService = httpServiceRef.current;
    
    const [mensajeError, setError] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [estadoLiga, setEstadoLiga] = useState(estados.EN_CURSO);
    
    const [tablaLiga, setTablaLiga] = useState([]);
    const [fixtureLiga, setFixtureLiga] = useState([]);
    const [idPartidoActual, setIdPartidoActual] = useState(null);

    const fixtureRef = useRef([]);

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

                    const miPartido = fixture_ordenado.find(
                        p => p.id_partido === partido_actual_id && 
                        (Number(p.equipo_izq.id_usuario) === usuarioId || Number(p.equipo_der.id_usuario) === usuarioId)
                    );

                    if (miPartido) {
                        navigate(`/partido/${partido_actual_id}`, { 
                            state: { returnTo: `/ligas/en_curso/${liga_id}` }
                        });
                    }
                }

            } catch (error) {
                console.error(error.message);
                setError(error.message);
                if (error.tipo === "LIGA_NO_DISPONIBLE") {
                    setEstadoLiga(estados.FINALIZADA);
                }
            } finally {
                setCargando(false);
            }
        };

        init();

    }, [httpService, usuarioId, liga_id, navigate]);

    useEffect(() => {
        const wsService = createWSService(`/ws/liga/${liga_id}`);
        wsService.connect();

        const manejarProximoPartido = (payload) => {
            const partido_id = payload.id_proximo_partido;
            const proximo_turno = payload.turno;
            
            setIdPartidoActual(partido_id);

            setFixtureLiga(prevFixture => 
                prevFixture.map(fila => 
                    fila.turno === proximo_turno 
                        ? { ...fila, id_partido: partido_id }
                        : fila
                )
            );

            const miPartido = fixtureRef.current.find(
                p => p.turno === proximo_turno && 
                (Number(p.equipo_izq.id_usuario) === usuarioId || Number(p.equipo_der.id_usuario) === usuarioId)
            );
            
            if (miPartido) {
                navigate(`/partido/${partido_id}`, { 
                    state: { returnTo: `/ligas/en_curso/${liga_id}` }
                });
            }
        };

        const manejarPartidoFinalizado = (payload) => {
            const fila_fixture = payload.fixture;
            const fila_tabla_eq_izq = payload.tabla_actualizada[0];
            const fila_tabla_eq_der = payload.tabla_actualizada[1];
            
            setIdPartidoActual(null);

            setFixtureLiga(prevFixture => {
                const existe = prevFixture.some(fila => fila.turno === fila_fixture.turno);
                
                const actualizado = existe
                    ? prevFixture.map(fila => fila.turno === fila_fixture.turno ? fila_fixture : fila)
                    : [...prevFixture, fila_fixture];

                return ordenarFixture(actualizado);
            });

            setTablaLiga(prevTabla => {
                let actualizado = [...prevTabla];

                [fila_tabla_eq_izq, fila_tabla_eq_der].forEach(nuevo_fila => {
                    const existe = actualizado.some(fila => fila.id_equipo === nuevo_fila.id_equipo);
                    
                    if (existe) {
                        actualizado = actualizado.map(fila => 
                            fila.id_equipo === nuevo_fila.id_equipo ? nuevo_fila : fila
                        );
                    } else {
                        actualizado.push(nuevo_fila);
                    }
                });

                return ordenarTabla(actualizado);
            });
        };

        const manejarLigaTerminada = (payload) => {
            console.log("La liga finalizó. ID:", payload.id_liga);
            setEstadoLiga(estados.FINALIZADA);
        };

        wsService.on('proximo_partido', manejarProximoPartido);
        wsService.on('resultado_partido', manejarPartidoFinalizado);
        wsService.on('liga_terminada', manejarLigaTerminada);

        return () => {
            wsService.off('proximo_partido', manejarProximoPartido);
            wsService.off('resultado_partido', manejarPartidoFinalizado);
            wsService.off('liga_terminada', manejarLigaTerminada);
            wsService.disconnect();
        };
    }, [liga_id, usuarioId]);
    
    const manejarVolver = () => {
        sessionStorage.removeItem(`ultimo_jugado_${liga_id}`);
        navigate('/ligas');
    };

    const manejarVerPartido = (partidoId) => {
        if (partidoId) {
            navigate(`/partido/${partidoId}`, { 
                state: { returnTo: `/ligas/en_curso/${liga_id}` }
            });
        }
    }

    if (estadoLiga === estados.FINALIZADA) {
        return (
            <LigaFinalizadaComp 
                alVolver={manejarVolver}
                tablaLiga={tablaLiga}
                mensajeError={mensajeError}    
            />
        );
    }

    return (
        <LigaEnCursoComp
            cargando={cargando}
            tablaLiga={tablaLiga}
            fixtureLiga={fixtureLiga}
            mensajeError={mensajeError}
            miUsuarioId={usuarioId}
            partidoActualId={idPartidoActual}
            verPartido={manejarVerPartido}
        />  
    );
};

export default LigaEnCurso;