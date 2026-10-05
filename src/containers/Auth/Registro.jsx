import { useState } from "react";
import { useForm } from "react-hook-form";
import { createHttpService } from "../../services/HttpService";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";

// Importa la misma imagen de fondo
import fondoCancha from "../../assets/fondoRegistroSesion.jpg"; 

const FormRegistro = () => {
    const { register, formState: { errors, isSubmitting }, handleSubmit } = useForm();
    const { crearUsuario } = createHttpService();
    const [mensaje, setMensaje] = useState("");
    const [errorRegistro, setErrorRegistro] = useState("");
    const navigate = useNavigate();
    
    const onSubmit = async (data) => {
        setMensaje("");
        setErrorRegistro("");
        try {
            const res = await crearUsuario(data);
            console.log("Usuario creado", res);
            setMensaje("Registro realizado correctamente!");
        } catch(error) {
            console.error(error);
            setErrorRegistro(error.message);
        }
    };

    return (
        <Container fluid className="p-0 min-vh-100">
            <Row className="g-0 min-vh-100">
                
                {/* MITAD IZQUIERDA: Imagen de la cancha */}
                <Col md={6} className="d-none d-md-block" style={{
                    backgroundImage: `url(${fondoCancha})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    borderRight: 'px solid #007bff'
                }}>
                </Col>

                {/* MITAD DERECHA: Formulario de Registro */}
                <Col xs={12} md={6} className="d-flex flex-column justify-content-center align-items-center bg-white">
                    <div style={{ width: '100%', maxWidth: '400px', padding: '20px' }}>
                        
                        <h2 className="fw-bold mb-4 text-start">Registrarse</h2>

                        <Form onSubmit={handleSubmit(onSubmit)}>
                            {/* Campo Nombre */}
                            <Form.Group className="mb-3" controlId="nombre">
                                <Form.Label className="text-muted small fw-bold">Nombre</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Tu nombre..."
                                    className="bg-light border-0 shadow-sm rounded-0"
                                    isInvalid={!!errors.nombre}
                                    {...register('nombre', {
                                        required: "Ingrese un nombre"
                                    })}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.nombre?.message}
                                </Form.Control.Feedback>
                            </Form.Group>

                            {/* Campo Email */}
                            <Form.Group className="mb-3" controlId="email">
                                <Form.Label className="text-muted small fw-bold">Email</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Tu mail..."
                                    className="bg-light border-0 shadow-sm rounded-0"
                                    isInvalid={!!errors.email}
                                    {...register('email', {
                                        required: "Ingrese un mail",
                                        pattern: { 
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                            message: "El formato de mail no es valido"
                                        }
                                    })}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.email?.message}
                                </Form.Control.Feedback>
                            </Form.Group>

                            {/* Campo Contraseña */}
                            <Form.Group className="mb-3" controlId="contraseña">
                                <Form.Label className="text-muted small fw-bold">Contraseña</Form.Label>
                                <Form.Control 
                                    type="password" 
                                    placeholder="Elige una contraseña segura..."
                                    className="bg-light border-0 shadow-sm rounded-0"
                                    isInvalid={!!errors.contraseña}
                                    {...register('contraseña', {
                                        required: "Ingrese una contraseña"
                                    })}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.contraseña?.message}
                                </Form.Control.Feedback>
                            </Form.Group>

                            {/* Campo Club */}
                            <Form.Group className="mb-3" controlId="club">
                                <Form.Label className="text-muted small fw-bold">Club</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Nombre para tu club..."
                                    className="bg-light border-0 shadow-sm rounded-0"
                                    isInvalid={!!errors.club}
                                    {...register('club', {
                                        required: "Ingrese un club"
                                    })}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.club?.message}
                                </Form.Control.Feedback>
                            </Form.Group>

                            {/* Campo Avatar (Opcional) */}
                            <Form.Group className="mb-4" controlId="avatar">
                                <Form.Label className="text-muted small fw-bold">Avatar</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Elige un avatar..."
                                    className="bg-light border-0 shadow-sm rounded-0"
                                    {...register("avatar")}
                                />
                            </Form.Group>

                            {/* Mensajes de feedback de la API */}
                            {mensaje && <Alert variant="success" className="rounded-0">{mensaje}</Alert>}
                            {errorRegistro && <Alert variant="danger" className="rounded-0">{errorRegistro}</Alert>}

                            {/* Botón de Submit */}
                            <Button 
                                variant="primary" 
                                type="submit" 
                                disabled={isSubmitting}
                                className="w-100 rounded-0 shadow-sm fw-bold mb-3"
                                size="lg"
                            >
                                {isSubmitting ? "Registrando..." : "Registrar"}
                            </Button>
                        </Form>

                        {/* Botón Volver secundario */}
                        <div className="text-center">
                            <Button 
                                variant="link" 
                                className="text-muted text-decoration-none"
                                onClick={() => navigate(-1)}
                            >
                                ← Volver
                            </Button>
                        </div>

                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default FormRegistro;