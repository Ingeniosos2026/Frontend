import Plantel from "../containers/InterfazPlantel/InterPlantel";
import { useNavigate } from "react-router-dom";

const PagPrincipal = () => {

    const navigate = useNavigate();

        return (
            <div>
                <h1>Pagina Principal</h1>

                <button onClick={() => navigate("/liga")}>
                    LIGA
                </button>

                <button onClick={() => navigate("/amistoso")}>
                    AMISTOSO
                </button>

                <button onClick={() => navigate("/plantel")}>
                    PLANTEL
                </button>

                <button onClick={() => navigate("/comportamientos")}>
                    COMPORTAMIENTOS
                </button>
            </div>
        );
};

export default PagPrincipal;