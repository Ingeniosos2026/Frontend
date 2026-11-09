import { useState } from 'react';
import { createHttpService } from '../../services/HttpService';
import CambiarJugadorComp from '../../components/Equipo/CambiarJugadorComp';

const CambiarJugador = ({ jugadorSaliente, jugadoresSuplentes, idPartido, idUsuario, disabled }) => {
    const [mostrarOpciones, setMostrarOpciones] = useState(false);
    const [mensaje, setMensaje] = useState(null); 
    const [cargando, setCargando] = useState(false);
    
    const httpService = createHttpService();

    const confirmarCambio = async (jugadorEntranteId) => {
        if (!jugadorEntranteId) return;

        setCargando(true);
        const cambioData = {
            jugador_sale_id: jugadorSaliente,
            jugador_entra_id: parseInt(jugadorEntranteId)
        };

        try {
            await httpService.realizarCambio(idPartido, idUsuario, cambioData);
            setMensaje({ tipo: 'success', mensaje: "Cambio realizado con éxito" });
            
            setMostrarOpciones(false); 
        } catch (error) {
            console.error(error.message);
            setMensaje({ tipo: 'danger', mensaje: error.message });
        } finally {
            setCargando(false);
        }
    };

    const cancelarCambio = () => {
        setMostrarOpciones(false);
        setMensaje(null); 
    };

    return (
        <CambiarJugadorComp
            jugadoresSuplentes={jugadoresSuplentes}
            mensaje={mensaje}
            mostrarOpciones={mostrarOpciones}
            cargando={cargando}
            setMensaje={setMensaje}
            setMostrarOpciones={setMostrarOpciones}
            confirmarCambio={confirmarCambio}
            cancelarCambio={cancelarCambio}
            disabled={disabled}
        />
    );
};

export default CambiarJugador;