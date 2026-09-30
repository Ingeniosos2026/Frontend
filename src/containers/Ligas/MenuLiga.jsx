import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import MenuLiga from '../../components/Ligas/MenuLiga';
import { createHttpService } from '../../services/HttpService';

const MenuLigaLogic = ({ usuario_id }) => {
    const navigate = useNavigate();
    const [interfaz, setInterfaz] = useState("ModuloConstruccion");
    //const [misLigas, setMisLigas] = useState([]);
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
                setLigasDisponibles(res.disponibles || res || []);
                //setMisLigas(res.misLigas || []);
            
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
            //misLigas={misLigas}
            loading={loading}
            error={error}
            CrearLiga={handleCrearLiga}
            UnirseLiga={handleUnirseLiga}
            Volver={handleVolver}
        />
    );
};

export default MenuLigaLogic;