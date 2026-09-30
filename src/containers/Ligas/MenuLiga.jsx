import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import MenuLiga from '../../components/ligas/MenuLiga';
import { createHttpService } from '../../services/HttpService';

const MenuLigaLogic = ({ usuario_id }) => {
    const navigate = useNavigate();
    const [interfaz, setInterfaz] = useState("ModuloConstruccion");
    const [misLigas, setMisLigas] = useState([]);
    const [ligasDisponibles, setLigasDisponibles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { obtenerListaLigas } = createHttpService();

    useEffect(() => {
        const fetchLigas = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await obtenerListaLigas();
                if (response.status === 200) {
                    setLigasDisponibles(response.data.disponibles || []);
                    setMisLigas(response.data.misLigas || []);
                } else if (response.status === 404) {
                    setError("404: No hay ligas disponibles.");
                } else {
                    setError("Ocurrió un error al intentar obtener las ligas.");
                }
            } catch (err) {
                setError("Error de conexión con el servidor.");
            } finally {
                setLoading(false);
            }
        };
        fetchLigas();
    }, []);

    const handleCrearLiga = () => {
        console.log("Desplegando componente Crear Liga...");
        navigate("/ligas/crear");
    };

    const handleUnirseLiga = (liga_id) => {
        console.log(`Iniciando flujo para unirse a la liga: ${liga_id}`);
        setInterfaz("/ModuloConstruccion");
    };

    const handleVolver = () => {
        navigate("/main");
    };

    return (
        <MenuLiga 
            ligasDisponibles={ligasDisponibles}
            misLigas={misLigas}
            loading={loading}
            error={error}
            CrearLiga={handleCrearLiga}
            UnirseLiga={handleUnirseLiga}
            Volver={handleVolver}
        />
    );
};

export default MenuLigaLogic;