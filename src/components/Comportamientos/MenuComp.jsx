import { useState } from "react";

const MisComportamientos = ({ comportamientos, cargando, volver }) => {
    const [comportamiento, setComportamiento] = useState(null);
    const mostrarOpciones = (comp) => {

        if (comportamiento?.id === comp.id) {
            setComportamiento(null);
        } else {
            setComportamiento(comp);
        }
    };

    if (cargando) {
        return <div>Cargando comportamientos...</div>;
    }

    return (
        <div className="Comportamientos">

            <h3>Mis Comportamientos</h3>

            <ul id="Lista_comportamientos">
                {comportamientos.map((comp) => (
                    <li key={comp.id}>
                        <p>{comp.nombre}</p>

                        <button onClick={() => mostrarOpciones(comp)}>
                            {comportamiento?.id === comp.id
                        ? "Ocultar datos" : "Ver datos"}
                        </button>
                        {comportamiento?.id === comp.id && (
                        <div>
                            
                        </div>
                        )}
                    </li>
                ))}
            </ul>

            <button onClick={volver}>
                    Volver
            </button>

        </div>
)}

export default MisComportamientos;