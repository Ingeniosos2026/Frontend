import { useState, useEffect } from "react";
import { createHttpService } from '../../services/HttpService';
import CambiarComportamientoComp from '../../components/Equipo/CambiarComportamientoComp.jsx';

const CambiarComportamiento = ({
    idJugadorSeleccionado,
    idPartido,
    idUsuario,
    disabled
}) => {
    
    const httpService = createHttpService();
    const [comportamientos, setComportamientos] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const init = async () => {
            try {
                setCargando(true);
                const comportamientos = await httpService.obtenerComportamientos(idUsuario);
                setComportamientos(comportamientos);
            } catch (error) {
                console.error(error.message);
            } finally {
                setCargando(false);
            }
        }
        init();
    }, []);

    const manejarConfirmar = async (idComportamiento) => {
        if (!idComportamiento) return;

        try {
            setCargando(true);
            const cambioData = {
                usuario_id: idUsuario,
                jugador_id: idJugadorSeleccionado,
                comp_id: Number(idComportamiento)
            };
            await httpService.cambiarComportamiento(idPartido, cambioData);
        } catch (error) {
            console.error(error.message);
        } finally {
            setCargando(false);
        }
    };

    return (
        <CambiarComportamientoComp
            comportamientos={comportamientos}
            cargando={cargando}
            alConfirmar={manejarConfirmar}
            disabled={disabled}
        />
    );
};

export default CambiarComportamiento;