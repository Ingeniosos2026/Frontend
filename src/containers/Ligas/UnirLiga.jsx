import { useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { createHttpService } from '../../services/HttpService';
import UnirseLigaComp from '../../components/Ligas/UnirLigaComp';

const UnirseLiga = () => {
    const navigate = useNavigate();
    const [mensajeError, setError] = useState(null);
    const { unirseLiga } = createHttpService();

    const usuarioId = localStorage.getItem('usuario_id');
    const {liga_id} = useParams();

    const handleUnirse = async (equipoData) => {
        try {
            setError(null);
            console.log(`Intentando unirse a la liga: ${liga_id}`);

            await unirseLiga(liga_id, usuarioId, equipoData);
            
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
        <UnirseLigaComp
            usuarioId={usuarioId}
            mensajeError={mensajeError}
            onConfirmar={handleUnirse}
            onCancelar={handleVolver}
        />
    );
};

export default UnirseLiga;