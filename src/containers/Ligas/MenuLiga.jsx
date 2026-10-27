import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import MenuLigaComp from '../../components/Ligas/MenuLigaComp';
import { createHttpService } from '../../services/HttpService';

const MenuLiga = ({ }) => {
    const navigate = useNavigate();
    const [ligasDisponibles, setLigasDisponibles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { obtenerLigas } = createHttpService();

    useEffect(() => {
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