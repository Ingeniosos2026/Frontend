import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { createWSService } from '../../services/WSService';
import { createHttpService } from '../../services/HttpService';
import LobbyLigaComp from '../../components/Ligas/LobbyLigaComp';

const LobbyLiga = () => {
    const {liga_id} = useParams();
    const usuarioId = localStorage.getItem('usuario_id');

    const navigate = useNavigate();
    const location = useLocation();

    const esCreador = location.state?.esCreador;
    const minimo = location.state?.minimo;
    const [httpService] = useState(() => createHttpService());
    const [competidores, setCompetidores] = useState([]);
    const [mensajeError, setError] = useState(null);

    const [iniciando, setIniciando] = useState(false);
    const [abandonando, setAbandonando] = useState(false);

    useEffect(() => {
        const wsService = createWSService(`/ws/liga/${liga_id}`);
        wsService.connect();

        const manejarUnirse = (payload) => {
            const nuevoCompetidor = {
                id: payload.usuario_unido.id,
                nombre: payload.usuario_unido.nombre,
                club: payload.usuario_unido.club
            };

            setCompetidores((prev) => {
                const yaExiste = prev.some(
                    (c) => c.nombre === nuevoCompetidor.nombre && c.club === nuevoCompetidor.club
                );
                if (yaExiste) return prev;
                return [...prev, nuevoCompetidor];
            });
        };

        const manejarIniciar = (payload) => {
            console.log("El creador inició la liga. Armando fixture...");
            navigate(`/ligas/en_curso/${liga_id}`, { state: { esCreador: esCreador, fixture: payload.fixture, tabla: payload.tabla, id_partido_actual: payload.id_partido_actual } });
        };

        const manejarAbandonar = (payload) => {
            const usuarioAbandono = payload.usuario_abandono.id;

            setCompetidores((prev) =>
                prev.filter((c) => c.id !== usuarioAbandono)
            );
        }

        wsService.on('usuario_unido_liga', manejarUnirse);
        wsService.on('usuario_abandono_liga', manejarAbandonar);
        wsService.on('liga_iniciada', manejarIniciar);

        return () => {
            wsService.off('usuario_unido_liga', manejarUnirse);
            wsService.off('usuario_abandono_liga', manejarAbandonar);
            wsService.off('iniciar_partido', manejarIniciar);
            wsService.disconnect();
        };
    }, [liga_id, navigate]);

    const manejarIniciarLiga = async () => {
        try {
            setIniciando(true);
            await httpService.iniciarLiga(liga_id, usuarioId);
            console.log("Liga iniciada")
        } catch (error) {
            console.error("Error al iniciar la Liga:", error);
            setIniciando(false);
            setError(error.message);
        }
    };

    const manejarAbandonarLiga = async () => {
        try {
            setAbandonando(true);
            await httpService.abandonarLiga(liga_id, usuarioId);
            navigate("/main");
        } catch (error) {
            console.error("Error al abandonar liga:", error);
            setAbandonando(false);
            setError(error.message);
        }
    };

    return (
        <LobbyLigaComp
            myId={Number(usuarioId)}
            mensajeError={mensajeError}
            esCreador={esCreador}
            competidores={competidores}
            iniciando={iniciando}
            abandonar={abandonando}
            alAbandonar={manejarAbandonarLiga}
            alIniciar={manejarIniciarLiga}
            minimo={minimo}
        />
    );
};

export default LobbyLiga;