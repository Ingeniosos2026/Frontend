import { useState} from 'react';

<<<<<<< Updated upstream:src/components/Ligas/MenuLiga.jsx
const MenuLiga = ({ ligasDisponibles, loading, error, CrearLiga, UnirseLiga, VerLiga, Volver }) => {
=======

const MenuLigaComp = ({ ligasDisponibles, loading, error, CrearLiga, UnirseLiga, Volver }) => {
>>>>>>> Stashed changes:src/components/Ligas/MenuLigaComp.jsx

    const [ligaDesplegadaDisp, setLigaDesplegadaDisp] = useState(null);

    const toggleDispLigas = (nombreLiga) => {
        setLigaDesplegadaDisp(ligaDesplegadaDisp === nombreLiga ? null : nombreLiga);
    };

    if (loading) {
        return <div>Cargando ligas...</div>;
    }

    return (
        <div className="contenedor-ligas">
            <button onClick={CrearLiga}>
                Crear Liga
            </button>

            <h3>Ligas Disponibles</h3>
            <ul id="Lista_ligas">
                {ligasDisponibles.map((liga, index) => (
                    <li key={`disp-${index}`}>
                        <button onClick={() => toggleDispLigas(liga.nombre)}>
                            {liga.nombre}
                        </button>
                        
                        {ligaDesplegadaDisp === liga.nombre && (
                            <div id="Detalles_colapsables">
                                <div className="participantes">
                                    Participantes: {liga.participantes}/{liga.max_jugadores}
                                </div>
                                <div className="Unirse_liga">
                                    <button onClick={() => UnirseLiga(liga.privada,liga.id,liga.min_jugadores)}>
                                        Unirse
                                    </button>
                                </div>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
            {error && <div className="mensaje-error">{error}</div>}
            
            <button onClick={Volver}>
                    Volver
            </button>

        </div>
    );
};

export default MenuLiga;