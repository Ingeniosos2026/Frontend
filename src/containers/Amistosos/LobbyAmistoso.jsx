import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { createWSService } from '../../services/WSService';
import { createHttpService } from '../../services/HttpService';
import LobbyAmistosoComp from '../../components/Amistosos/LobbyAmistosoComp';

const LobbyAmistoso = () => {
    const { partido_id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    
    const esCreador = location.state?.esCreador || false;

    const [httpService] = useState(() => createHttpService());
    const [versus, setVersus] = useState(null);
    const [mensajeError, setError] = useState(null);

    const [iniciando, setIniciando] = useState(false);

    useEffect(() => {
        const wsEndpoint = `/ws/partido/${partido_id}`;
        const wsService = createWSService(wsEndpoint);

        wsService.connect();

        const manejarUnirse = (payload) => {
            console.log("Se unió alguien a la sala:", payload);
            setVersus({
                nombre_owner: payload.owner.nombre,
                club_owner: payload.owner.club,
                nombre: payload.usuario_unido.nombre,
                club: payload.usuario_unido.club
            });
        };

        const manejarIniciar = () => {
            console.log("El creador inició el partido. Navegando al juego...");
            navigate(`/partido/${partido_id}`);
        };

        wsService.on('usuario_unido', manejarUnirse);
        wsService.on('iniciar_partido', manejarIniciar);

        return () => {
            wsService.off('usuario_unido', manejarUnirse);
            wsService.off('iniciar_partido', manejarIniciar);
            wsService.disconnect();
        };
    }, [partido_id, navigate]);

    const manejarIniciarPartido = async () => {
        try {
            setIniciando(true);
            await httpService.iniciarAmistoso(partido_id);
        } catch (error) {
            console.error("Error al iniciar el partido:", error);
            setIniciando(false);
            setError(error.message);
        }
    };

    return (
        <LobbyAmistosoComp 
            mensajeError={mensajeError}
            esCreador={esCreador}
            versus={versus}
            iniciando={iniciando}
            alIniciar={manejarIniciarPartido}
        />
    );
};

export default LobbyAmistoso;