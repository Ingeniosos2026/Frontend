import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import MenuLigaComp from '../../components/Ligas/MenuLigaComp';
import { createHttpService } from '../../services/HttpService';
import { createWSService } from '../../services/WSService';

const MenuLiga = ({ }) => {
    const navigate = useNavigate();
    const [ligasDisponibles, setLigasDisponibles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const usuario_id = Number(localStorage.getItem('usuario_id'));

    const { obtenerLigas } = createHttpService();

    useEffect(() => {
        const wsService = createWSService(`/ws/notificaciones/${usuario_id}`);
        wsService.connect();
        const fetchLigas = async () => {
            setLoading(true);
            setError(null);
            
            try {
                const res = await obtenerLigas();
                setLigasDisponibles(res);
            
            } catch (error) {
                console.error("Error al intentar obtener las ligas:", error);
                setError(error.message);

            } finally {
                setLoading(false);
            }
        };

        fetchLigas();

        const introducirLiga = (payload) => {
            setLigasDisponibles((prevLigas) => [...prevLigas, {
                id_liga: payload.id_liga,
                id_usuario: payload.id_usuario || null,
                nombre: payload.nombre,
                estado: payload.estado || null,
                min_jugadores: payload.min_jugadores,
                max_jugadores: payload.max_jugadores,
                duracion_partido: payload.duracion,
                es_privada: payload.es_privada || false,
            }]);
        }

        wsService.on('liga creada', introducirLiga);

        return () => {
            wsService.off('liga creada', introducirLiga);
            wsService.disconnect();
        };

    }, []);

    const handleCrearLiga = () => {
        navigate("/ligas/crear");
    };

    const handleUnirseLiga = (privada,liga_id,min_jugadores) => {
        navigate(`/ligas/unir/${liga_id}`,{ state: { esPrivada: privada , minimo : min_jugadores } });
    };

    const handleVolver = () => {
        navigate("/main");
    };

    return (
        <MenuLigaComp 
            ligasDisponibles={ligasDisponibles}
            loading={loading}
            error={error}
            CrearLiga={handleCrearLiga}
            UnirseLiga={handleUnirseLiga}
            Volver={handleVolver}
        />
    );
};

export default MenuLiga;