import React from 'react';
import { Container, Alert } from "react-bootstrap";
import ArmarEquipo from '../../containers/Equipo/ArmarEquipo';

const UnirAmistosoComp = ({ 
    usuarioId, 
    mensajeError, 
    onConfirmar, 
    onCancelar 
}) => {
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
                    <h2 className="fw-bold mb-3" style={{ color: '#198754' }}>Unirse al Partido Amistoso</h2>
                    <p className="text-muted">Arma tu Equipo antes de ingresar a la sala</p>
                </div>
                
                {mensajeError && (
                    <Alert variant="danger" className="shadow-sm mb-4">
                        <strong>Error:</strong> {mensajeError}
                    </Alert>
                )}
                
                <ArmarEquipo
                    usuario_id={usuarioId}
                    onConfirmar={onConfirmar} 
                    onCancelar={onCancelar}
                />
            </Container>
        </div>
    );
};

export default UnirAmistosoComp;