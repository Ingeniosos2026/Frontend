import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createHttpService } from '../../services/HttpService.js';
import { createWSService } from '../../services/WSService';
import MenuAmistosoComp from '../../components/Amistosos/MenuAmistosoComp.jsx';

const MenuAmistoso = () => {
    const [amistososDisponibles, setAmistosos] = useState([]);
    const [cargandoAmistosos, setCargando] = useState(true);
    const navigate = useNavigate();
    const [httpService] = useState(() => createHttpService());
    const [mensajeError, setError] = useState(null);
    const usuario_id = Number(localStorage.getItem('usuario_id'));
    
    useEffect(() => {
        const wsService = createWSService(`/ws/notificaciones/${usuario_id}`);
        wsService.connect();
        const init = async () => {
            try {
                setCargando(true);

                const amistosos = await httpService.obtenerAmistosos();

                setAmistosos(amistosos);

            } catch (error) {
                console.error(error.message)
                setError(error.message);
            } finally {
                setCargando(false);
            }
        };

        init();

        const introducirAmistoso = (payload) => {
            setAmistosos((prevAmistosos) => [...prevAmistosos, {
                id: payload.id_partido,
                nombre: payload.nombre,
            }]);
        };

        wsService.on('amistoso_creado', introducirAmistoso);

        return () => {
            wsService.off('amistoso_creado', introducirAmistoso);
            wsService.disconnect();
        };

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
