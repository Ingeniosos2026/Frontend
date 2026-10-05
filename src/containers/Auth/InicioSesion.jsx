import { useState } from "react";
import { useForm } from "react-hook-form";
import { createHttpService } from "../../services/HttpService";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import fondoCancha from "../../assets/fondoRegistroSesion.jpg"; 

const FormInicioSesion = () => {
    const { register, formState: { errors, isSubmitting }, handleSubmit } = useForm();
    const { iniciarSesion } = createHttpService();
    const [mensaje, setMensaje] = useState("");
    const [errorLogin, setErrorLogin] = useState("");
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        setMensaje("");
        setErrorLogin("");

        try {
            const res = await iniciarSesion(data);
            console.log("Usuario logueado", res);
            localStorage.setItem("usuario_id", res.id)
            setMensaje("Login realizado con exito!");
            navigate("/main"); 
        } catch (error) {
            console.error(error);
            setErrorLogin(error.message);
        }
    };

    return (
        <Container fluid className="p-0 min-vh-100">
            <Row className="g-0 min-vh-100">

                <Col md={6} className="d-none d-md-block" style={{
                    backgroundImage: `url(${fondoCancha})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    borderRight: '1px solid #808080'
                }}>
                </Col>

                <Col xs={12} md={6} className="d-flex flex-column justify-content-center align-items-center bg-white">
                    <div style={{ width: '100%', maxWidth: '400px', padding: '20px' }}>
                        
                        <h2 className="fw-bold mb-4 text-start">Iniciar Sesión</h2>

                        <Form onSubmit={handleSubmit(onSubmit)}>
                            {/* Campo Email */}
                            <Form.Group className="mb-3" controlId="email">
                                <Form.Label className="text-muted small fw-bold">Email</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="ejemplo@gmail.com"
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

                            <Form.Group className="mb-4" controlId="contraseña">
                                <Form.Label className="text-muted small fw-bold">Contraseña</Form.Label>
                                <Form.Control 
                                    type="password"
                                    placeholder="contraseña"
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


                            {mensaje && <Alert variant="success" className="rounded-0">{mensaje}</Alert>}
                            {errorLogin && <Alert variant="danger" className="rounded-0">{errorLogin}</Alert>}


                            <Button 
                                variant="primary" 
                                type="submit" 
                                disabled={isSubmitting}
                                className="w-100 rounded-0 shadow-sm fw-bold mb-3"
                                size="lg"
                            >
                                {isSubmitting ? "Confirmando..." : "Confirmar"}
                            </Button>
                        </Form>

                        <div className="text-center">
                            <Button 
                                variant="link" 
                                className="text-muted text-decoration-none"
                                onClick={() => navigate("/auth")}
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

export default FormInicioSesion;