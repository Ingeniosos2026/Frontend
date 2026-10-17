import { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { createHttpService } from '../../services/HttpService';
import UnirseLigaComp from '../../components/Ligas/UnirLigaComp';

const UnirseLiga = () => {
    const navigate = useNavigate();
    const [mensajeError, setError] = useState(null);
    const { unirseLiga, obtenerLigas } = createHttpService();
    const [esPrivada, setEsPrivada] = useState(false);

    const usuarioId = localStorage.getItem('usuario_id');
    const {liga_id} = useParams();

    useEffect(() => {
        const cargarLiga = async () => {
            try {
                const ligas = await obtenerLigas();

                const liga = ligas.find(
                    (liga) => String(liga.id) === String(liga_id)
                );

                if (!liga) {
                    setError("No se encontró la liga seleccionada.");
                } else {
                    setEsPrivada(liga.privada);
                }
            } catch (error) {
                setError(error.message || "Error al cargar la liga.");
            }
        };
        cargarLiga();
    }, [liga_id, obtenerLigas]);

    const handleUnirse = async (equipoData, contraseña) => {
        try {
            setError(null);
            console.log(`Intentando unirse a la liga: ${liga_id}`);

            const datosUnirse = {
                ...equipoData,
                ...(esPrivada ? { contraseña } : {})
            };
            
            await unirseLiga(liga_id, usuarioId, datosUnirse);
            
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
            esPrivada={esPrivada}
            mensajeError={mensajeError}
            onConfirmar={handleUnirse}
            onCancelar={handleVolver}
        />
    );
};

export default UnirseLiga;