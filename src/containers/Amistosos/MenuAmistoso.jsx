import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createHttpService } from '../../services/HttpService.js';
// import { createWSService } from 'src/services/WSService';
import MenuAmistosoComp from '../../components/Amistosos/MenuAmistosoComp.jsx';

const MenuAmistoso = () => {
    const [amistososDisponibles, setAmistosos] = useState([]);
    const [cargandoAmistosos, setCargando] = useState(true);
    const navigate = useNavigate();
    const [httpService] = useState(() => createHttpService());
    // const [wsService] = useState(() => createWSService('/amistosos/ws'));
    const [mensajeError, setError] = useState(null);
    
    useEffect(() => {
        const init = async () => {
            try {
                setCargando(true);

                const amistosos = await httpService.obtenerAmistosos();

                setAmistosos(amistosos);

                // if (wsService.isConnected) {
                //     console.warn('WebSocket ya está conectado. Reutilizando conexion existente.');
                // } else {
                //     wsService.connect();
                //     completar...
                // }

            } catch (error) {
                console.error(error.message)
                setError(error.message);
            } finally {
                setCargando(false);
            }
        };

        init();

    }, []);
    
    const manejarCrearAmistoso = () => {
        navigate("/amistosos/crear");
    };

    const manejarUnirseAmistoso = async (partidoId) => {
        navigate(`/amistosos/unir/${partidoId}`);
    };

    const manejarVolver = () => {
        navigate("/main");
    };

    return (
        <MenuAmistosoComp
            amistosos={amistososDisponibles}
            cargando={cargandoAmistosos} 
            mensajeError={mensajeError}
            alCrear={manejarCrearAmistoso}
            alUnirse={manejarUnirseAmistoso}
            alVolver={manejarVolver}
        />
    );
};

export default MenuAmistoso;
