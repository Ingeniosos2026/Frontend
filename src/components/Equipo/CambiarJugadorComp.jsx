import { Form} from 'react-bootstrap';

const CambiarJugadorComp = ({
    jugadoresSuplentes,
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
            defaultValue=""
            onChange={(e) => confirmarCambio(e.target.value)}
            disabled={cargando}
            style={{color:'#818181'}}
        >
            <option value="" style={{color:'#a8a8a8', textAlign: 'center'}}>Cambiar Jugador</option>
            {jugadoresSuplentes.map((jugador) => (
                <option key={jugador.id_jugador} value={jugador.id_jugador} style={{textAlign: 'center'}}>
                    {jugador.nombre}
                </option>
            ))}
        </Form.Select>
    </div>
    );
};

export default CambiarJugadorComp;