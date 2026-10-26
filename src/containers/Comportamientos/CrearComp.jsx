import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createHttpService } from '../../services/HttpService.js';
import CrearCComp from "../../components/Comportamientos/CrearCComp";

const CrearComp = () => {
    const navigate = useNavigate();
    const [httpService] = useState(() => createHttpService());
    const [mensajeError, setError] = useState(null);

    const usuarioId = localStorage.getItem('usuario_id');

    const manejarCrearComp = async (comportamientoData) => {
        try {
            setError(null);
            const respuesta = await httpService.crearComportamiento(usuarioId, comportamientoData);
            console.log("Comportamiento creado", respuesta);
            navigate('/comportamientos');
        } catch (error) {
            console.error(error);
            setError(error.message);
        }
    };

    const manejarVolver = () => {
        navigate('/comportamientos');
    };

    return (
        <CrearCComp
            mensajeError={mensajeError}
            alCrear={manejarCrearComp}
            alVolver={manejarVolver}
        />
    );
};
export default CrearComp;
