import { useState } from 'react';
import { createHttpService } from '../../services/HttpService';
import CambiarJugadorComp from '../../components/Equipo/CambiarJugadorComp';

const CambiarJugador = ({ jugadorSaliente, jugadoresSuplentes, idPartido, idUsuario }) => {
    const [mostrarOpciones, setMostrarOpciones] = useState(false);
    const [jugadorSeleccionado, setJugadorSeleccionado] = useState(""); 
    const [mensaje, setMensaje] = useState(null); 
    const [cargando, setCargando] = useState(false);
    
    const httpService = createHttpService();

    const confirmarCambio = async () => {
        if (!jugadorSeleccionado) return;

        setCargando(true);
        const cambioData = {
            jugador_sale_id: jugadorSaliente,
            jugador_entra_id: parseInt(jugadorSeleccionado)
        };

        try {
            await httpService.realizarCambio(idPartido, idUsuario, cambioData);
            setMensaje({ tipo: 'success', mensaje: "Cambio realizado con éxito" });
            
            setMostrarOpciones(false); 
            setJugadorSeleccionado(""); 
        } catch (error) {
            console.error(error.message);
            setMensaje({ tipo: 'danger', mensaje: error.message });
        } finally {
            setCargando(false);
        }
    };

    const cancelarCambio = () => {
        setMostrarOpciones(false);
        setJugadorSeleccionado(""); 
        setMensaje(null); 
    };

    return (
        <CambiarJugadorComp
            jugadoresSuplentes={jugadoresSuplentes}
            mensaje={mensaje}
            mostrarOpciones={mostrarOpciones}
            jugadorSeleccionado={jugadorSeleccionado}
            cargando={cargando}
            setMensaje={setMensaje}
            setMostrarOpciones={setMostrarOpciones}
            setJugadorSeleccionado={setJugadorSeleccionado}
            confirmarCambio={confirmarCambio}
            cancelarCambio={cancelarCambio}
        />
    );
};

export default CambiarJugador;