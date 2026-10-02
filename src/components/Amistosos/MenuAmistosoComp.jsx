import { useState } from 'react';

const MenuAmistosoComp = ({ amistosos, cargando, mensajeError, alCrear, alUnirse, alVolver }) => {
    const [amistosoDesplegadaDisp, setAmistosoDesplegadaDisp] = useState(null);

    const toggleDispAmistosos = (nombreAmistoso) => {
        setAmistosoDesplegadaDisp(amistosoDesplegadaDisp === nombreAmistoso ? null : nombreAmistoso);
    };

    if (cargando) {
        return <div>Cargando amistosos...</div>;
    }

    return (
        <div className="contenedor-amistosos">
            {/* Manejo de errores visuales */}
            {mensajeError && <div className="mensaje-error" style={{ color: 'red' }}>{mensajeError}</div>}
            
            {/* Botón principal */}
            <button onClick={alCrear}>
                Crear Amistoso
            </button>

            {/* Lista de amistosos disponibles */}
            <h3>Amistosos Disponibles</h3>
            <ul id="Lista_amistosos">
                {amistosos.map((amistoso, index) => (
                    <li key={`disp-${index}`}>
                        <button onClick={() => toggleDispAmistosos(amistoso.nombre)}>
                            {amistoso.nombre}
                        </button>
                        
                        {/* Condicional para inyectar el cuerpo desplegable si fue clickeado */}
                        {amistosoDesplegadaDisp === amistoso.nombre && (
                            <div id="Detalles_colapsables">
                                <div className="Unirse_amistoso">
                                    <button onClick={() => alUnirse(amistoso.id)}>
                                        Unirse
                                    </button>
                                </div>
                            </div>
                        )}
                    </li>
                ))}
            </ul>

            <button onClick={alVolver}>
                    Volver
            </button>

        </div>
    );
};

export default MenuAmistosoComp;