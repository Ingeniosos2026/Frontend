import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import ReactSlick from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./MenuPrincipal.css";
import Liga from "../assets/Liga.png";
import Amistoso from "../assets/Amistoso.png";
import Plantel from "../assets/Plantel.jpg";
import Comps from "../assets/Comps.png";
import Ranking from "../assets/ranking.png";

const Slider = ReactSlick.default || ReactSlick;

const FlechaAnterior = ({ onClick }) => {
    return (
        <button onClick={onClick} className="btn-carrusel btn-prev">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
        </button>
    );
};

const FlechaSiguiente = ({ onClick }) => {
    return (
        <button onClick={onClick} className="btn-carrusel btn-next">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
        </button>
    );
};

const PagPrincipal = () => {
    const navigate = useNavigate();

    const settings = {
        className: "center",
        centerMode: true,
        infinite: true,
        centerPadding: "0px",
        slidesToShow: 3,
        speed: 500,
        focusOnSelect: true,
        prevArrow: <FlechaAnterior />,
        nextArrow: <FlechaSiguiente />, 
        responsive: [
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 1,
                    centerPadding: "150px" 
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    centerPadding: "60px"
                }
            }
        ]
    };

    const opciones = [
        { id: 1, ruta: "/amistosos", color: "#198754", img: Amistoso, titulo: "AMISTOSO", desc: "Crea o unete a un Amistoso" },
        { id: 2, ruta: "/jugadores", color: "#fd7e14", img: Plantel, titulo: "PLANTEL", desc: "Gestiona tus Jugadores" },
        { id: 3, ruta: "/comportamientos", color: "#6f42c1", img: Comps, titulo: "COMPORTAMIENTOS", desc: "Gestiona tus Comportamientos" },
        { id: 4, ruta: "/ligas", color: "#0d6efd", img: Liga, titulo: "LIGA", desc: "Crea o unete a una Liga" },
        { id: 5, ruta: "/ranking", color: "#fd0d0d", img: Ranking, titulo: "RANKING GLOBAL", desc: "Clasificación mundial" }
    ];

    return (
        <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center overflow-hidden">
            <Container style={{ maxWidth: '1200px', width: '100%', position: 'relative' }}>
                
                <Slider {...settings}>
                    {opciones.map((opcion) => (
                        <div key={opcion.id}>
                            <div 
                                onClick={() => navigate(opcion.ruta)} 
                                className="position-relative shadow-lg overflow-hidden tarjeta-carrusel"
                                style={{ 
                                    cursor: "pointer", 
                                    height: '300px', 
                                    backgroundColor: opcion.color,
                                    backgroundImage: `url(${opcion.img})`,
                                    backgroundSize: '40%',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat'
                                }} 
                            >
                                <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50"></div>
                                
                                <div className="position-absolute bottom-0 m-0 pb-4 pt-3 w-100 start-0 px-4" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)' }}>
                                    <h4 className="fw-bold text-white mb-1" style={{ letterSpacing: '1px' }}>
                                        {opcion.titulo}
                                    </h4>
                                    <p className="mb-0 text-white-50">{opcion.desc}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </Slider>

            </Container>
        </div>
    );
};

export default PagPrincipal;