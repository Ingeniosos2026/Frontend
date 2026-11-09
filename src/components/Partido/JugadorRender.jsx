import { memo } from 'react';

const JugadorRender = memo(({ jugador }) => (
    <div 
        className="entidad-juego jugador-wrapper"
        style={{ 
            left: `${jugador.left}px`, 
            top: `${jugador.top}px`, 
        }}
    >
        <svg viewBox="0 0 100 100" width="130%" height="130%" xmlns="http://www.w3.org/2000/svg" style={{ 
            transform: `translate(-50%, -50%) rotate(${jugador.angulo}deg)`, 
            transition: 'left 0.1s linear, top 0.1s linear, transform 0.5s ease-out' 
        }}>
            <rect x="35" y="25" width="9" height="19" rx="4.5" fill="#1F1C27" transform="rotate(-15 39.5 34.5)" />    
            <rect x="56" y="25" width="9" height="19" rx="4.5" fill="#1F1C27" transform="rotate(15 60.5 34.5)" />
            <rect x="18" y="32" width="9" height="22" rx="4" fill="#F29C7C" transform="rotate(-15 22.5 43)" />
            <rect x="73" y="32" width="9" height="22" rx="4" fill="#F29C7C" transform="rotate(15 77.5 43)" />
            <ellipse cx="26" cy="50" rx="11" ry="9" fill={jugador.colorCamiseta} transform="rotate(-20 26 50)" />
            <ellipse cx="26" cy="48" rx="10" ry="8" fill={jugador.colorCamiseta} transform="rotate(-20 26 48)" />
            <ellipse cx="74" cy="50" rx="11" ry="9" fill={jugador.colorCamiseta} transform="rotate(20 74 50)" />
            <ellipse cx="74" cy="48" rx="10" ry="8" fill={jugador.colorCamiseta} transform="rotate(20 74 48)" />
            <ellipse cx="50" cy="55" rx="29" ry="24" fill={jugador.colorCamiseta} />
            <ellipse cx="50" cy="52" rx="28" ry="23" fill={jugador.colorCamiseta} />
            <path d="M 47 31 C 47 27.5, 53 27.5, 53 31 Z" fill="#E08565" />
            <circle cx="50" cy="47" r="15" fill="#F29C7C" />
            <path d="M 35 47 A 15 15 0 0 0 65 47 A 15 15 0 0 0 56.1 33.3 L 52.2 36.4 L 46.9 32 L 43.8 37.3 L 39.4 33.8 L 38.5 40 A 15 15 0 0 0 35 47 Z" fill="#1F1C27" />
        </svg>
        <div className="jugador-info">
            {jugador.idStr && <div className="jugador-id">{jugador.nombre}</div>}
        </div>
    </div>
));

export default JugadorRender;