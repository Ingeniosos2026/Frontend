import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createHttpService } from "../../services/HttpService";
import MisComportamientos from "../../components/Comportamientos/MenuComp";


const MenuComp = () => {

    const [comps, setComps] = useState([]);

    const { obtenerComportamientos } = createHttpService();

    const [cargandoComportamientos, setCargando] = useState(true);

    const usuarioId = localStorage.getItem("usuario_id");

    const navigate = useNavigate();



    useEffect(() => {

        const cargarComportamientos = async () => {

            try {

                setCargando(true);

                const data = await obtenerComportamientos(usuarioId);

                setComps(data || []);

            } catch (error) {

                console.error(error);

            } finally {

                setCargando(false);

            }

        };

        cargarComportamientos();

    }, [usuarioId]);



    const irVolver = () => {

        navigate("/main");

    };



    return (

        <MisComportamientos

            comportamientos={comps}

            cargando={cargandoComportamientos}

            volver= {irVolver}

        />

    );

};



export default MenuComp;