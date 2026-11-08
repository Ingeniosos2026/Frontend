import { Button } from "react-bootstrap";
import { createHttpService } from '../../services/HttpService.js';

const ActivarDt = ({ usuarioId, partidoId, activado, alternarDirectorTecnico}) => {
    const { activarDirectorTecnico } = createHttpService();

    const cambiarEstadoDt = async () => {
        try {
            const nuevoEstado = !activado;

            await activarDirectorTecnico(usuarioId, partidoId, nuevoEstado);

            alternarDirectorTecnico(nuevoEstado);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <p>Director Tecnico</p>
            <Button onClick={cambiarEstadoDt}>
                {activado ? "Desactivar" : "Activar"}
            </Button>
        </div>
    );
};

export default ActivarDt;