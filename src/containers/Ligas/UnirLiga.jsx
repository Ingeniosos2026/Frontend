import { useState } from 'react';
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { createHttpService } from '../../services/HttpService';
import UnirLigaComp from '../../components/Ligas/UnirLigaComp';

const UnirLiga = () => {
    const navigate = useNavigate();
    const [mensajeError, setError] = useState(null);
    const { unirseLiga } = createHttpService();
    const location = useLocation();
    const esPrivada = location.state?.esPrivada;
    const usuarioId = localStorage.getItem('usuario_id');
    const {liga_id} = useParams();

    const [unirBody, setUnirBody] = useState({  
        jugadores: [],
        formacion: '',
        contraseña: '' 
    });

    const handleUnirse = async (equipoData, contraseña) => {
        try {
            setError(null);

            const unirBody = {
                jugadores: equipoData.jugadores,
                formacion: equipoData.formacion,
                contraseña: contraseña
            };

            await unirseLiga(liga_id, usuarioId, unirBody);
            
            navigate(`/ligas/lobby/${liga_id}`);

        } catch (error) {
            console.error("Error al intentar unirse a la liga", error);
            setError(error.message || "");
        }
    };

    const handleVolver = () => {
        navigate('/ligas');
    };

    return (
        <UnirLigaComp
            usuarioId={usuarioId}
            esPrivada={esPrivada}
            mensajeError={mensajeError}
            onConfirmar={handleUnirse}
            onCancelar={handleVolver}
        />
    );
};

export default UnirLiga;