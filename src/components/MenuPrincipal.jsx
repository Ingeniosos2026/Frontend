import { useNavigate } from "react-router-dom";

const PagPrincipal = () => {

    const navigate = useNavigate();

        return (
            <div>
                <h1>Pagina Principal</h1>

                <button onClick={() => navigate("/ligas")}>
                    LIGA
                </button>

                <button onClick={() => navigate("/amistosos")}>
                    AMISTOSO
                </button>

                <button onClick={() => navigate("/jugadores")}>
                    PLANTEL
                </button>

                <button onClick={() => navigate("/comportamientos")}>
                    COMPORTAMIENTOS
                </button>
            </div>
        );
};

export default PagPrincipal;