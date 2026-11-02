import { useState } from 'react';
import { useNavigate,useParams } from 'react-router-dom';
import { createHttpService } from '../../services/HttpService.js';
import EditarCComp from "../../components/Comportamientos/EditarCComp";

const EditarComp = () => {
    const navigate = useNavigate();
    const [httpService] = useState(() => createHttpService());
    const [mensajeError, setError] = useState(null);
    const usuarioId = localStorage.getItem('usuario_id');
    const {comp_id} = useParams();

    const manejarCrearComp = async (comportamientoData) => {
        try {
            setError(null);
            const respuesta = await httpService.editarComportamiento(usuarioId,comp_id,comportamientoData);
            console.log("Comportamiento editado", respuesta);
            navigate('/comportamientos');
        } catch (error) {
            console.error(error);
            setError(error.message);
        }
    };

    const manejarVolver = () => {
        navigate('/comportamientos');
    };

    return (
        <EditarCComp
            mensajeError={mensajeError}
            alConfirmar={manejarCrearComp}
            alVolver={manejarVolver}
        />
    );
};
export default EditarComp;
