import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Alert, Button } from 'react-bootstrap';

const ModuloConstruccion = () =>  {
    const navigate = useNavigate();

    return (
        <Container className="d-flex flex-column justify-content-center align-items-center mt-5 text-center">
            <Alert variant="warning" className="shadow-sm w-100 p-5" style={{ maxWidth: '600px' }}>
                <Alert.Heading className="fw-bold mb-4">
                    🚧 Módulo en Desarrollo
                </Alert.Heading>
                <p className="mb-4 text-muted">
                    Este modulo se encuentra actualmente en proceso de construcción. 
                    Estamos trabajando para habilitar estas funciones pronto.
                </p>
                <hr />
                <div className="d-flex justify-content-center mt-4">
                    <Button 
                        variant="secondary" 
                        onClick={() => navigate('/main')}
                        className="px-4 shadow-sm"
                        style={{ transition: 'all 0.3s ease' }}
                    >
                        ← Volver al Menú Principal
                    </Button>
                </div>
            </Alert>
        </Container>
    );
}

export default ModuloConstruccion;