import { Form, Button, Alert } from 'react-bootstrap';

const CambiarJugadorComp = ({
    jugadoresSuplentes,
    mensaje,
    mostrarOpciones,
    jugadorSeleccionado,
    cargando,
    setMensaje,
    setMostrarOpciones,
    setJugadorSeleccionado,
    confirmarCambio,
    cancelarCambio
}) => {
return (
        <div>
            
            {mensaje && (
                <Alert 
                    variant={mensaje.tipo} 
                    onClose={() => setMensaje(null)} 
                    dismissible
                >
                    {mensaje.mensaje}
                </Alert>
            )}

            {!mostrarOpciones ? (
                <Button onClick={() => setMostrarOpciones(true)}>
                    Cambiar Jugador
                </Button>
            ) : (
                <div>
                    
                    <Form.Select 
                        value={jugadorSeleccionado}
                        onChange={(e) => setJugadorSeleccionado(e.target.value)}
                        disabled={cargando}
                    >
                        <option value="">Selecciona un suplente...</option>
                        {jugadoresSuplentes.map((jugador) => (
                            <option key={jugador.id_jugador} value={jugador.id_jugador}>
                                {jugador.nombre}
                            </option>
                        ))}
                    </Form.Select>

                    <Button 
                        onClick={confirmarCambio}
                        disabled={cargando || !jugadorSeleccionado}
                    >
                        Confirmar
                    </Button>

                    <Button 
                        onClick={cancelarCambio}
                        disabled={cargando}
                    >
                        Cancelar
                    </Button>
                    
                </div>
            )}
        </div>
    );
};

export default CambiarJugadorComp;