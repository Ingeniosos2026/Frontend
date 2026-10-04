import MenuPlantelComponente from "../../components/Jugadores/MenuJugador";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createHttpService } from "../../services/HttpService";

const MenuJugador = () => {
    const [jugadores1, setJugadores1] = useState([]);
    const { obtenerJugadores } = createHttpService();
    const [cargandoJugadores, setCargando] = useState(true);
    const usuarioId = localStorage.getItem("usuario_id");
    const navigate = useNavigate();

    useEffect(() => {
        const cargarJugadores = async () => {
            try {
                setCargando(true);
                const data = await obtenerJugadores(usuarioId);
                setJugadores1(data || []);
            } catch (error) {
                console.error(error);
            } finally {
                setCargando(false);
            }
        };
        cargarJugadores();
    }, [usuarioId]);

    const crearJugador = () => {
        navigate("/jugadores/crear");
    };

    const irVolver = () => {
        navigate("/main");
    };

    return (
        <MenuPlantelComponente
            jugadores={jugadores1}
            cargando={cargandoJugadores}
            crear={crearJugador}
            volver={irVolver}
        />
    );
};

export default MenuJugador;
