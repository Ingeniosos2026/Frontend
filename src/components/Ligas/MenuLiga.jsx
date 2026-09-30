import { useState} from 'react';

const MenuLiga = ({ ligasDisponibles, misLigas, loading, error, CrearLiga, UnirseLiga, VerLiga, Volver }) => {
    // Estados locales visuales para rastrear qué liga está desplegada (colapsable)
    const [ligaDesplegadaMis, setLigaDesplegadaMis] = useState(null);
    const [ligaDesplegadaDisp, setLigaDesplegadaDisp] = useState(null);

    const toggleMisLigas = (nombreLiga) => {
        setLigaDesplegadaMis(ligaDesplegadaMis === nombreLiga ? null : nombreLiga);
    };
    const toggleDispLigas = (nombreLiga) => {
        setLigaDesplegadaDisp(ligaDesplegadaDisp === nombreLiga ? null : nombreLiga);
    };

    if (loading) {
        return <div>Cargando ligas...</div>;
    }

    return (
        <div className="contenedor-ligas">
            {/* Manejo de errores visuales (Ej: 404 No hay ligas disponibles) */}
            {error && <div className="mensaje-error" style={{ color: 'red' }}>{error}</div>}
            
            {/* Botón principal */}
            <button onClick={CrearLiga}>
                Crear Liga
            </button>

            {/* Lista de mis ligas */}
            <h3>Mis Ligas</h3>
            <ul id="Lista_mis_ligas">
                {misLigas.map((liga, index) => (
                    <li key={`mis-${index}`}>
                        <button onClick={() => toggleMisLigas(liga.nombre)}>
                            {liga.nombre}
                        </button>
                        
                        {/* Condicional para inyectar el cuerpo desplegable si fue clickeado */}
                        {ligaDesplegadaMis === liga.nombre && (
                            <div id="Detalles_colapsables">
                                <div className="max_jugadores">
                                    Máx Jugadores: {liga.max_jugadores}
                                </div>
                                <div className="participantes">
                                    Participantes: {liga.participantes}/{liga.max_jugadores}
                                </div>
                                <div className="Ver liga">
                                    <button onClick={() => VerLiga(liga.nombre)}>
                                        Ver Liga
                                    </button>
                                </div>
                            </div>
                        )}
                    </li>
                ))}
            </ul>

            {/* Lista de ligas disponibles */}
            <h3>Ligas Disponibles</h3>
            <ul id="Lista_ligas">
                {ligasDisponibles.map((liga, index) => (
                    <li key={`disp-${index}`}>
                        <button onClick={() => toggleDispLigas(liga.nombre)}>
                            {liga.nombre}
                        </button>
                        
                        {/* Condicional para inyectar el cuerpo desplegable si fue clickeado */}
                        {ligaDesplegadaDisp === liga.nombre && (
                            <div id="Detalles_colapsables">
                                <div className="max_jugadores">
                                    Máx Jugadores: {liga.max_jugadores}
                                </div>
                                <div className="participantes">
                                    Participantes: {liga.participantes}/{liga.max_jugadores}
                                </div>
                                <div className="Unirse_liga">
                                    <button onClick={() => UnirseLiga(liga.nombre)}>
                                        Unirse
                                    </button>
                                </div>
                            </div>
                        )}
                    </li>
                ))}
            </ul>

            <button onClick={Volver}>
                    Volver
            </button>

        </div>
    );
};

export default MenuLiga;