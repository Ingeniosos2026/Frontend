import { Form} from 'react-bootstrap';

const CambiarJugadorComp = ({
    jugadoresSuplentes,
    jugadorSeleccionado,
    cargando,
    confirmarCambio,
}) => {
return (
    <div style={{
        flexDirection:'column',
        display:'flex',
        alignContent:'end'
    }}>
        <Form.Select 
            value={jugadorSeleccionado}
            onChange={(e) => confirmarCambio(e.target.value)}
            disabled={cargando}
        >
            <option value="" style={{color:'#a8a8a8'}}>Seleccionar Jugador....</option>
            {jugadoresSuplentes.map((jugador) => (
                <option key={jugador.id_jugador} value={jugador.id_jugador}>
                    {jugador.nombre}
                </option>
            ))}
        </Form.Select>
    </div>
    );
};

export default CambiarJugadorComp;