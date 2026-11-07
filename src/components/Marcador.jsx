import './Marcador.css';

const Marcador = ({ tiempo, goles, alVolver,local, visitante }) => {
    
    const formatearReloj = (segs) => {
        if (!segs) return "00:00";
        return `${Math.floor(segs / 60).toString().padStart(2, '0')}:${Math.floor(segs % 60).toString().padStart(2, '0')}`;
    };

    return (
        <div className="header-container">
            <button className="btn-exit" onClick={alVolver}>
                EXIT
            </button>

            <div className="scoreboard-base">
                <div className="team-name">{local}</div>
                
                <div className="time-container">
                    <div className="time-label">VS</div>
                    <div className="time-box">
                        {formatearReloj(tiempo)}
                        <div className="goles-text">{goles.izquierdo} - {goles.derecho}</div>
                    </div>
                </div>

                <div className="team-name">{visitante}</div>
            </div>
            
            <div className="controls-group">
                <button className="btn-control" style={{ color: '#d32f2f' }}>🔊</button>
                <button className="btn-control" style={{ color: '#1976d2' }}>⚙️</button>
            </div>
        </div>
    );
};

export default Marcador;
