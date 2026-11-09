const ManoSVG = ({ posicion }) => (
    <svg 
        viewBox="0 0 100 140" 
        width="80px" 
        style={{ 
            position: 'absolute',
            top: '25px',
            [posicion]: '-52px',
            transform: posicion === 'left' ? 'none' : 'scaleX(-1)',
            zIndex: 10
        }} 
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M 10 140 L 25 80 C 40 50 40 20 65 20 C 65 20 75 40 65 70 L 55 140 Z" fill="#fa8b6f" />
        <rect x="45" y="45" width="50" height="24" rx="30" transform="rotate(15 45 25)" fill="#fa8b6f" />
    </svg>
);


const TableroCambios = ({ datosCambio }) => {
    if (!datosCambio) return null;

    const JugadorColumna = ({ accion, id, color }) => (
        <div style={{ 
            display: 'flex',
            flexDirection: 'column-reverse',
            backgroundColor: '#353434',
            borderRadius: '8px',
            fontFamily:'Arial',
            fontSize:'26px' 
        }}>
            <div style={{ color, padding: '8px' }}>{accion}</div> 
            <div style={{ color }}>{id}</div>
        </div>
    );

    return (
        <div style={{ position: 'relative', marginTop: '20px' }}>
            <div style={{ 
                position: 'relative',
                zIndex: 5,
                backgroundColor: '#1a1a1a', 
                padding: '15px 30px', 
                borderRadius: '8px', 
                border: '4px solid #030303', 
                display: 'flex', 
                gap: '20px', 
                fontSize: '20px', 
                fontWeight: 'bold',
                textAlign: 'center'
            }}>
                <JugadorColumna accion="▼ SALE" id={datosCambio.jugador_sale_id} color="#e53935" />
                <JugadorColumna accion="▲ ENTRA" id={datosCambio.jugador_entra_id} color="#43a047" />
            </div>
            <ManoSVG posicion="left" />
            <ManoSVG posicion="right" />
        </div>
    );
};

export default TableroCambios;