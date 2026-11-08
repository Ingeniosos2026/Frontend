import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createHttpService } from "../../services/HttpService";
import MenuCComp from "../../components/Comportamientos/MenuCComp";

const MenuComp = () => {
    const [comps, setComps] = useState([]);
    const [compsDt, setCompsDt] = useState([]);
    const { obtenerComportamientos, obtenerComportamientosDt, asignarComportamientoDt } = createHttpService();
    const usuarioId = localStorage.getItem("usuario_id");
    const navigate = useNavigate();
    const [comportamientoDtAsignado, setComportamientoDtAsignado] = useState(null);

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

    useEffect(() => {
        const cargarComportamientosDt = async () => {
            try {
                const data = await obtenerComportamientosDt(usuarioId);
                setCompsDt(data);
            } catch (error) {
                console.error(error);
            }
        };
        cargarComportamientosDt();
    }, [usuarioId]);

    const cargarComportamientoDt = async (compId) => {
        try {
            await asignarComportamientoDt(usuarioId, compId);

            setComportamientoDtAsignado(compId);

        } catch (error) {
            console.error("Error al asignar comportamiento DT:", error);
        }
    };

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
            comportamientosDt={compsDt}
            crear = {crearComp}
            crearDt={crearCompDt}
            editar = {editarComp}
            volver= {irVolver}
            asignarComportamientoDt={cargarComportamientoDt}
            comportamientoDtAsignado={comportamientoDtAsignado}
        />
    );
};

export default MenuComp;