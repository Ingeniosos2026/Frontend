const ArmarEquipoComp = ({ 
    listaJugadores, 
    listaComportamientos, 
    equipo, 
    formacion, 
    loading, 
    error, 
    onSeleccion, 
    onFormacionChange, 
    ConfirmarEquipo, 
    Cancelar 
}) => {
    
    if (loading) {
        return <div>Cargando jugadores y comportamientos...</div>;
    }

    return (
        <div>
            <h2>Armar Equipo</h2>
    
            {error && <div>{error}</div>}
            <div>
                {equipo.map((slot, index) => (
                    <div key={`slot-${index}`}>
                        
                        <select 
                            value={slot.id_jugador} 
                            onChange={(e) => onSeleccion(index, 'id_jugador', e.target.value)}
                        >
                            <option value="">Seleccionar Jugador...</option>
                            {listaJugadores.map(jugador => (
                                <option key={jugador.id} value={jugador.id}>
                                    {jugador.nombre}
                                </option>
                            ))}
                        </select>

                        <select 
                            value={slot.id_comportamiento} 
                            onChange={(e) => onSeleccion(index, 'id_comportamiento', e.target.value)}
                        >
                            <option value="">Asignar Comportamiento...</option>
                            {listaComportamientos.map(comp => (
                                <option key={comp.id} value={comp.id}>
                                    {comp.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                ))}
            </div>

            <div>
                <h3>Formación Inicial</h3>
                <select value={formacion} onChange={onFormacionChange}>
                    <option value="ofensiva">Ofensivo</option>
                    <option value="defensiva">Defensivo</option>
                    <option value="c">C-formación</option>
                    <option value="d">D-formación</option>
                </select>
            </div>

            <div>
                <button onClick={Cancelar}>
                    Cancelar
                </button>
                <button onClick={ConfirmarEquipo}>
                    Confirmar Equipo
                </button>
            </div>
        </div>
    );
};





export default ArmarEquipoComp;