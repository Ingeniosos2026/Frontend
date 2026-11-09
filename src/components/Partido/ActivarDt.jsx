import { createHttpService } from '../../services/HttpService.js';
import './ActivarDt.css';  
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
    <div className="dt-container">
        <div className="dt-label-box">
            <span className="dt-title">DIRECTOR TECNICO</span>
            <button className="dt-toggle-btn" onClick={cambiarEstadoDt}>
                {activado ? "Desactivar" : "Activar"}
            </button>
        </div>
    </div>
    );
};

export default ActivarDt;
