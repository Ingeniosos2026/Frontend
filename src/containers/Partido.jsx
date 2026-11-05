import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { createWSService } from '../services/WSService';
import CanchaVisual from '../components/PartidoComp.jsx';

const Partido = () => {
    const { partido_id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const rutaDeRegreso = location.state?.returnTo;

    const [estadoJuego, setEstadoJuego] = useState(null);
    const [partidoTerminado, setPartidoTerminado] = useState(false);
    const [resultadoFinal, setResultadoFinal] = useState(null);

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
            wsService.disconnect();
        };

        wsService.on('estado_partido', manejarEstadoPartido);
        wsService.on('partido_terminado', manejarFinPartido);

        return () => {
            wsService.off('estado_partido', manejarEstadoPartido);
            wsService.off('partido_terminado', manejarFinPartido);
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
        />
    );
};

export default Partido;