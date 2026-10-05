import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Carousel } from "react-bootstrap";

import Liga from "../assets/Liga.png";
import Amistoso from "../assets/Amistoso.png";
import Plantel from "../assets/Plantel.jpg";
import Comps from "../assets/Comps.png";

const PagPrincipal = () => {
    const navigate = useNavigate();

    return (
        <div 
            className="min-vh-100 d-flex flex-column justify-content-center align-items-center"
        >
            <Container style={{ maxWidth: '800px', width: '100%' }}>
                
                <Carousel data-bs-theme="light" className="shadow-lg rounded overflow-hidden">
                    
                    <Carousel.Item>
                        <div 
                            onClick={() => navigate("/amistosos")} 
                            className="position-relative w-100"
                            style={{ 
                                cursor: "pointer", 
                                height: '400px',
                                backgroundColor: '#198754',
                                backgroundImage: `url(${Amistoso})`,
                                backgroundSize: 'contain',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat'
                            }} 
                        >
                            <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-25"></div>
                            
                            <div className="position-relative d-flex h-100 justify-content-center align-items-center pb-5">
                                <h1 className="display-2 fw-bold text-white tracking-wide"></h1>
                            </div>
                            
                            <Carousel.Caption className="bg-dark bg-opacity-50 m-0 pb-3 pt-2 w-100 start-0 px-3">
                                <h5 className="fw-bold tracking-wide text-white mb-0">AMISTOSO</h5>
                                <p className="mb-0 text-white-50">Crea o unete a un Amistoso</p>
                            </Carousel.Caption>
                        </div>
                    </Carousel.Item>
                    
                    <Carousel.Item>
                        <div 
                            onClick={() => navigate("/jugadores")} 
                            className="position-relative w-100"
                            style={{ 
                                cursor: "pointer", 
                                height: '400px',
                                backgroundColor: '#fd7e14',
                                backgroundImage: `url(${Plantel})`,
                                backgroundSize: 'contain',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat'
                            }} 
                        >
                            <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-25"></div>
                            
                            <div className="position-relative d-flex h-100 justify-content-center align-items-center pb-5">
                                <h1 className="display-2 fw-bold text-white tracking-wide"></h1>
                            </div>
                            
                            <Carousel.Caption className="bg-dark bg-opacity-50 m-0 pb-3 pt-2 w-100 start-0 px-3">
                                <h5 className="fw-bold tracking-wide text-white mb-0">PLANTEL</h5>
                                <p className="mb-0 text-white-50">Gestiona tus Jugadores</p>
                            </Carousel.Caption>
                        </div>
                    </Carousel.Item>
                    
                    <Carousel.Item>
                        <div 
                            onClick={() => navigate("/comportamientos")} 
                            className="position-relative w-100"
                            style={{ 
                                cursor: "pointer", 
                                height: '400px',
                                backgroundColor: '#6f42c1',
                                backgroundImage: `url(${Comps})`,
                                backgroundSize: 'contain',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat'
                            }} 
                        >
                            <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-25"></div>
                            
                            <div className="position-relative d-flex h-100 justify-content-center align-items-center pb-5">
                                <h1 className="display-2 fw-bold text-white tracking-wide"></h1>
                            </div>
                            
                            <Carousel.Caption className="bg-dark bg-opacity-50 m-0 pb-3 pt-2 w-100 start-0 px-3">
                                <h5 className="fw-bold tracking-wide text-white mb-0">COMPORTAMIENTOS</h5>
                                <p className="mb-0 text-white-50">Gestiona tus Comportamientos</p>
                            </Carousel.Caption>
                        </div>
                    </Carousel.Item>
                    
                    <Carousel.Item>
                        <div 
                            onClick={() => navigate("/ligas")} 
                            className="position-relative w-100"
                            style={{ 
                                cursor: "pointer", 
                                height: '400px',
                                backgroundColor: '#0d6efd',
                                backgroundImage: `url(${Liga})`,
                                backgroundSize: 'contain',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat'
                            }} 
                        >
                            
                            <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-25"></div>

                            <div className="position-relative d-flex h-100 justify-content-center align-items-center pb-5">
                                <h1 className="display-2 fw-bold text-white tracking-wide"></h1>
                            </div>
                            
                            
                            <Carousel.Caption className="bg-dark bg-opacity-50 m-0 pb-3 pt-2 w-100 start-0 px-3">
                                <h5 className="fw-bold tracking-wide text-white mb-0">LIGA</h5>
                                <p className="mb-0 text-white-50">Crea o unete a una Liga</p>
                            </Carousel.Caption>
                        </div>
                    </Carousel.Item>

                </Carousel>
            </Container>
        </div>
    );
};

export default PagPrincipal;