import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createHttpService } from '../../services/HttpService';
import RankingComp from '../../components/Ranking/VerRankingComp';

const Ranking = () => {
    const [ranking, setRanking] = useState([]);
    const [mensajeError, setMensajeError] = useState(null);
    const navigate = useNavigate();
    const myId = localStorage.getItem('usuario_id');

    const { obtenerRanking } = createHttpService();

    useEffect(() => {
        const cargarRanking = async () => {
            try {
                const datos = await obtenerRanking();
                setRanking(datos);
            } catch (error) {
                setMensajeError(error.message);
            }
        };

        cargarRanking();
    }, []);

    const verPerfil = (usuarioId) => {
        navigate(`/perfil/${usuarioId}`);
    };

    return (
        <RankingComp
            ranking={ranking}
            mensajeError={mensajeError}
            onVerPerfil={verPerfil}
            iD={myId}
        />
    );
};

export default Ranking;