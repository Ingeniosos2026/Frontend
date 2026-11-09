import { memo } from 'react';

const FondoCancha = memo(() => (
    <>
                    <div className="arco arco-izquierdo"></div>
                    <div className="arco arco-derecho"></div>
                    
                    <div className="cancha-lineas">
                        <div className="cancha-linea" style={{ left: '50%', top: 0, bottom: 0, width: '2px', transform: 'translateX(-50%)' }}></div>
                        <div className="cancha-arco-circulo" style={{ left: '50%', top: '50%', width: '20%', aspectRatio: '1', transform: 'translate(-50%, -50%)' }}></div>
                        <div className="cancha-arco-circulo" style={{ left: '50%', top: '50%', width: '6px', height: '6px', backgroundColor: 'white', transform: 'translate(-50%, -50%)' }}></div>
                        <div className="cancha-arco-circulo" style={{ left: '11%', top: '50%', transform: 'translate(-40%, -40%)', width: '12%', aspectRatio: '1', zIndex: 1 }}></div>
                        <div className="cancha-arco-circulo" style={{ right: '11%', top: '50%', transform: 'translate(40%, -40%)', width: '12%', aspectRatio: '1', zIndex: 1 }}></div>
                        <div className="cancha-area-rect" style={{ left: 0, top: '22%', width: '16%', height: '56%', borderLeft: 'none', backgroundColor:'#4a9029', zIndex: 2 }}></div>
                        <div className="cancha-area-rect" style={{ right: 0, top: '22%', width: '16%', height: '56%', borderRight: 'none', backgroundColor:'#4a9029', zIndex: 2 }}></div>
                        <div className="cancha-area-rect" style={{ left: 0, top: '36%', width: '6%', height: '28%', borderLeft: 'none', zIndex: 3 }}></div>
                        <div className="cancha-area-rect" style={{ right: 0, top: '36%', width: '6%', height: '28%', borderRight: 'none', zIndex: 3 }}></div>
                        <div className="cancha-arco-circulo" style={{ left: 0, top: 0, width: '6%', aspectRatio: '1', transform: 'translate(-50%, -50%)' }}></div>
                        <div className="cancha-arco-circulo" style={{ left: 0, bottom: 0, width: '6%', aspectRatio: '1', transform: 'translate(-50%, 50%)' }}></div>
                        <div className="cancha-arco-circulo" style={{ right: 0, top: 0, width: '6%', aspectRatio: '1', transform: 'translate(50%, -50%)' }}></div>
                        <div className="cancha-arco-circulo" style={{ right: 0, bottom: 0, width: '6%', aspectRatio: '1', transform: 'translate(50%, 50%)' }}></div>
                    </div>
    </>
));

export default FondoCancha;