import React, { useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { createHttpService } from '../../services/HttpService';
import UnirAmistosoComp from '../../components/Amistosos/UnirAmistosoComp';

const UnirAmistoso = () => {
    const navigate = useNavigate();
    const [mensajeError, setError] = useState(null);
    const { unirseAmistoso } = createHttpService();
    
    const usuarioId = localStorage.getItem('usuario_id');
    const {partido_id} = useParams();

    const handleUnirse = async (equipoData) => {
        try {
            setError(null);
            console.log(`Intentando unirse al amistoso: ${partido_id}`);

            await unirseAmistoso(partido_id, usuarioId, equipoData);
            
            navigate(`/amistosos/lobby/${partido_id}`);

        } catch (error) {
            console.error("Error al intentar unirse al amistoso", error);
            setError(error.message || "");
        }
    };

    const handleVolver = () => {
        navigate('/amistosos');
    };

    return (
        <UnirAmistosoComp
            usuarioId={usuarioId}
            mensajeError={mensajeError}
            onConfirmar={handleUnirse}
            onCancelar={handleVolver}
        />
    );
};

export default UnirAmistoso;