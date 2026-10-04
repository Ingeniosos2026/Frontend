import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createHttpService } from '../../services/HttpService.js';
import CrearJugadorComp from "../../components/Jugadores/CrearJugadorComp";

const CrearJugador = () => {
    const navigate = useNavigate();
    const [httpService] = useState(() => createHttpService());
    const [mensajeError, setError] = useState(null);

    const usuarioId = localStorage.getItem('usuario_id');

    const manejarCrearJugador = async (jugadorData) => {
        try {
            setError(null);
            const respuesta = await httpService.crearJugador(usuarioId, jugadorData);
            console.log("Jugador creado", respuesta);
            navigate('/jugadores');
        } catch (error) {
            console.error(error);
            setError(error.message);
        }
    };

    const manejarVolver = () => {
        navigate('/jugadores');
    };

    return (
        <CrearJugadorComp
            mensajeError={mensajeError}
            alCrear={manejarCrearJugador}
            alVolver={manejarVolver}
        />
    );
};
export default CrearJugador;
