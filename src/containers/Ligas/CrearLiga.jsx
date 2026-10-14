 import { useState } from 'react';
 import { useNavigate } from 'react-router-dom';
 import { createHttpService } from '../../services/HttpService.js';
 import CrearLigaComp from "../../components/Ligas/CrearLigaComp";
 import ArmarEquipo from "../Equipo/ArmarEquipo";

const vistas = {
    paso_1: "paso_1",
    paso_2: "paso_2",
};

const CrearLiga = () => {
    const navigate = useNavigate();
    const [httpService] = useState(() => createHttpService());
    const [mensajeError, setError] = useState(null);
    const [interfazActual, setInterfazActual] = useState(vistas.paso_1);
    const usuarioId = localStorage.getItem('usuario_id');

    const [ligaBody, setligaBody] = useState({
        nombre: '',
        min: 3,
        max: 3,
        contraseña: '',   
        duracion_partido: 0,
        jugadores: [],
        formacion: ''
    });

    const handleEquipo = async (equipoData) => {
        setligaBody(prevData => ({
            ...prevData,
            jugadores: equipoData.jugadores,
            formacion: equipoData.formacion
        }));
        setInterfazActual(vistas.paso_2);
    };


    const handleLiga = async (ligaData) => {
        try {
            setError(null);
            
            const body = {
                nombre: ligaData.nombre,
                min:ligaData.min,
                max:ligaData.max,
                contraseña:ligaData.contraseña,
                duracion: ligaData.duracion_partido,
                jugadores: ligaBody.jugadores,
                formacion: ligaBody.formacion
            };
            
            setligaBody(body);

            const respuesta = await httpService.crearLiga(usuarioId, body);
            console.log("Liga creada", respuesta);
            navigate(`/ligas/lobby/${respuesta.id_liga}`, { state: { esCreador: true } });
        } catch (error) {
            console.error(error);
            setError(error.message);
        }
    };

    const renderizarInterfaz = () => {
        switch (interfazActual) {
            case vistas.paso_1:
                return (
                    <ArmarEquipo
                        usuario_id={usuarioId}
                        onConfirmar={handleEquipo}
                        onCancelar={() => navigate('/ligas')}
                    />
                );
            case vistas.paso_2:
                return (
                    <CrearLigaComp
                        mensajeError={mensajeError}
                        alConfirmar={handleLiga}
                        alVolver={() => setInterfazActual(vistas.paso_1)}
                    />
                );
            default:
                return null;
        }
    };
    
    return (
        <div>
            {renderizarInterfaz()}
        </div>
    );
};

export default CrearLiga;