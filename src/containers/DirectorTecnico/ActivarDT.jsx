import { Button } from "react-bootstrap";
import { createHttpService } from '../../services/HttpService.js';

const ActivarDt = ({ usuarioId, partidoId, activado, setActivado}) => {
    const { cambiarEstadoDirectorTecnico } = createHttpService();

    const cambiarEstadoDt = async () => {
        try {
            await cambiarEstadoDirectorTecnico(usuarioId, partidoId);

            setActivado(!activado);

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