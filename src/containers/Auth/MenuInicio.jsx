import { useState}  from "react";
import FormInicioSesion from "../../components/FormularioInicioSesion/InicioSesion";
import FormRegistro from "./Registro";

const MenuInicio = () => {

    const [interfaz, setInterfaz] = useState("principal");

    if (interfaz === "principal") {
        return (
            <div>
                <h1>Bienvenido</h1>

                <button onClick={() => setInterfaz("iniciar sesion")}>
                    Iniciar Sesion
                </button>

                <button onClick={() => setInterfaz("registrarse")}>
                    Registrarse
                </button>
            </div>
        );
    }

    if (interfaz === "iniciar sesion") {
        return (
            <FormInicioSesion
                volver={() => setInterfaz("principal")}
            />
        );
    }

    if (interfaz === "registrarse") {
        return (
            <FormRegistro
                volver={() => setInterfaz("principal")}
            />
        );
    }
};

export default MenuInicio;