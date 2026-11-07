import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createHttpService } from "../../services/HttpService";
import MenuCComp from "../../components/Comportamientos/MenuCComp";

const MenuComp = () => {
    const [comps, setComps] = useState([]);
    const { obtenerComportamientos } = createHttpService();
    const usuarioId = localStorage.getItem("usuario_id");
    const navigate = useNavigate();

    useEffect(() => {
        const cargarComportamientos = async () => {
            try {
                const data = await obtenerComportamientos(usuarioId);
                setComps(data);
            } catch (error) {
                console.error(error);
            }
        };
        cargarComportamientos();
    }, [usuarioId]);

    const crearComp = () => {
        navigate("/comportamientos/crear");
    };

    const crearCompDt = () => {
        navigate("/comportamientos/crearDt");
    }

    const editarComp = (comp_id) => {
        navigate(`/comportamientos/editar/${comp_id}`);
    };

    const irVolver = () => {
        navigate("/main");
    };

    return (
        <MenuCComp
            comportamientos={comps}
            crear = {crearComp}
            crearDt={crearCompDt}
            editar = {editarComp}
            volver= {irVolver}
        />
    );
};

export default MenuComp;