import { useState } from "react";
// import CrearJugador from "../../containers/Jugadores/CrearJugador";
// import DetalleJugador from "../../containers/Jugadores/DetalleJugador";

    const MenuPlantelComponenente = ({jugadores, cargando, crear, volver}) => {
    const [jugadorDespliegue, setJugadorDespliegue] = useState(null);
    const mostrarOpciones = (jugador) => {
        if (jugadorDespliegue?.id === jugador.id) {
            setJugadorDespliegue(null);
        } else {
            setJugadorDespliegue(jugador);
        }
    };

    if (cargando) {
        return <div>Cargando jugadores...</div>;
    }
    
    return (
        <div className="Jugadores">
            
            <button onClick={crear}>
                Crear Jugador
            </button>

            <h3>Mis Jugadores</h3>
            <ul id="Lista_jugadores">
                {jugadores.map((jugador) => (
                    <li key={jugador.id}>
                        <p>{jugador.nombre}</p>

                        <button onClick={() => mostrarOpciones(jugador)}>
                            {jugadorDespliegue?.id === jugador.id
                        ? "Ocultar datos" : "Ver datos"}
                        </button>
                        
                        {jugadorDespliegue?.id === jugador.id && (
                        <div>
                            <button>Eliminar jugador</button>
                            <button>Ver info de jugador</button>
                        </div>
                        )}
                    </li>
                ))}
            </ul>
            <button onClick={volver}>
                    Volver
            </button>
        </div>
    );
};

export default MenuPlantelComponenente;