import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createHttpService } from '../../services/HttpService.js';
import CrearAmistosoComp from "../../components/Amistosos/CrearAmistosoComp";
import ArmarEquipo from "../Equipo/ArmarEquipo";

const vistas = {
    paso_1: "paso_1",
    paso_2: "paso_2",
};

const CrearAmistoso = () => {
    const navigate = useNavigate();
    const [httpService] = useState(() => createHttpService());
    const [mensajeError, setError] = useState(null);
    const [interfazActual, setInterfazActual] = useState(vistas.paso_1);
    const [amistosoBody, setAmistosoBody] = useState({
        duracion_partido: 0,
        jugadores: [],
        formacion: ''
    });

    const usuarioId = localStorage.getItem('usuario_id');

    const manejarConfirmacionEquipo = async (equipoData) => {
        setAmistosoBody(prevData => ({
            ...prevData,
            jugadores: equipoData.jugadores,
            formacion: equipoData.formacion
        }));
        setInterfazActual(vistas.paso_2);
    };

    // puede variar segun como pase los datos ArmarEquipo
    const manejarConfirmacionAmistoso = async (amistosoData) => {
        try {
            setError(null);
            
            const partidoData = {
                duracion: amistosoData.duracion_partido,
                jugadores: amistosoBody.jugadores,
                formacion: amistosoBody.formacion
            };
            
            setAmistosoBody(partidoData);

            const respuesta = await httpService.crearAmistoso(usuarioId, partidoData);
            console.log("Amistoso creado", respuesta);
            navigate(`/amistosos/lobby/${respuesta.id}`);
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
                        onConfirmar={manejarConfirmacionEquipo}
                        onCancelar={() => navigate('/amistosos')}
                    />
                );
            case vistas.paso_2:
                return (
                    <CrearAmistosoComp
                        mensajeError={mensajeError}
                        alConfirmar={manejarConfirmacionAmistoso}
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
export default CrearAmistoso;