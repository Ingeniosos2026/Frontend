import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Button, Stack } from "react-bootstrap";


const MenuInicio = () => {
    const navigate = useNavigate();
    
    return (
        <Container fluid className="d-flex flex-column justify-content-center align-items-center min-vh-100"
        >
            <Stack gap={3} className="mx-auto justify-content-center align-items-center" style={{ width: '100%', maxWidth: '350px' }}>
                
                <h1 className="text-white fw-bold mb-4 " 
                    style={{ fontSize: '4rem', textShadow: '2px 2px 5px rgba(0,0,0,0.7)' }}
                >
                    FutBot
                </h1>

                <Button 
                    variant="primary" 
                    size="lg"
                    className="fw-bold rounded-0 shadow"
                    onClick={() => navigate("/auth/login")}
                >
                    Iniciar Sesion
                </Button>

                <Button 
                    variant="primary" 
                    size="lg"
                    className="fw-bold rounded-0 shadow"
                    onClick={() => navigate("/auth/registro")}
                >
                    Registrarse
                </Button>
            </Stack>
        </Container>
    );
};
export default MenuInicio;