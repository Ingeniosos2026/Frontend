import { useNavigate } from "react-router-dom";

const MenuInicio = () => {
    const navigate = useNavigate();
    
    return (
        <div>
            <h1>Bienvenido</h1>

            <button onClick={() => navigate("/auth/registro")}>
                Registrarse
            </button>

            <button onClick={() => navigate("/auth/login")}>
                Iniciar Sesion
            </button>
        </div>
    );
};

export default MenuInicio;