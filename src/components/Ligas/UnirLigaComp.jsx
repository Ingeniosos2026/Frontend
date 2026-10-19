import { Container, Alert, Form } from "react-bootstrap";
import ArmarEquipo from '../../containers/Equipo/ArmarEquipo';
import { useState } from "react";

const UnirLigaComp = ({ 
    usuarioId,
    esPrivada, 
    mensajeError, 
    onConfirmar, 
    onCancelar 
}) => {
    const [contraseña, setContraseña] = useState("");

    const handleConfirmar = (equipoData) => {
        onConfirmar(equipoData, contraseña);
    };

    return (

        <div 
            className="min-vh-100 d-flex flex-column align-items-center py-5"
            style={{
                backgroundColor: '#21503a',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
                backgroundRepeat: 'no-repeat'
            }}
        >
            <Container 
                className="p-4 p-md-5 bg-white rounded shadow-lg" 
                style={{ maxWidth: '900px', opacity: '0.95' }}
            >
                <div className="text-center mb-4">
                    <h2 className="fw-bold mb-3" style={{ color: '#198754' }}>Unirse a Liga</h2>
                    <p className="text-muted">Arma tu Equipo antes de ingresar al lobby de la liga</p>
                </div>
                
                {mensajeError && (
                    <Alert variant="danger" className="shadow-sm mb-4">
                        <strong>Error:</strong> {mensajeError}
                    </Alert>
                )}

                {esPrivada && (
                    <Form.Group className="mb-4">
                    <Form.Label htmlFor="contraseña">Contraseña de la liga</Form.Label>
                    <Form.Control
                        id="contraseña"
                        type="password"
                        value={contraseña}
                        onChange={(e) => setContraseña(e.target.value)}
                        placeholder="Ingresá la contraseña"
                        required
                    />
                    </Form.Group>
                )}
                
                <ArmarEquipo
                    usuario_id={usuarioId}
                    onConfirmar={handleConfirmar} 
                    onCancelar={onCancelar}
                />
            </Container>
        </div>
    );
};

export default UnirLigaComp;