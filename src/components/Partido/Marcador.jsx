import './Marcador.css';

const avatares = [
    { id: 1, imagen: '../src/assets/avatars/avatar_1.png' },
    { id: 2, imagen: '../src/assets/avatars/avatar_2.png' },
    { id: 3, imagen: '../src/assets/avatars/avatar_3.png' },
    { id: 4, imagen: '../src/assets/avatars/avatar_4.png' },
    { id: 5, imagen: '../src/assets/avatars/avatar_5.png' },
    { id: 6, imagen: '../src/assets/avatars/avatar_6.png' }
];

const Marcador = ({ tiempo, goles, alVolver, izquierda, derecha, espectador, avatarIzq, avatarDer }) => {
    
    const obtenerUrlAvatar = (id) => {
        const avatar = avatares.find(a => a.id === Number(id));
        return avatar ? avatar.imagen : null;
    };

    const formatearReloj = (segs) => {
        if (!segs) return "00:00";
        return `${Math.floor(segs / 60).toString().padStart(2, '0')}:${Math.floor(segs % 60).toString().padStart(2, '0')}`;
    };

    return (
        <div className="header-container">
            {espectador &&
                <button className="btn-exit" onClick={alVolver}>
                    VOLVER
                </button>     
            }

            <div className="scoreboard-base">
                
                {/* AVATAR IZQUIERDO */}
                <div className="avatar-circle avatar-left">
                    {obtenerUrlAvatar(avatarIzq) && (
                        <img 
                            src={obtenerUrlAvatar(avatarIzq)} 
                            alt="Avatar Izq" 
                            className="avatar-img"
                            onError={(e) => e.target.style.display = 'none'}                    
                        />
                    )}
                </div>

                <div className="team-name team-left">{izquierda}</div>
                
                <div className="time-container">
                    <div className="time-label">VS</div>
                    <div className="time-box">
                        {formatearReloj(tiempo)}
                        <div className="goles-text">
                            {goles.izquierdo} - {goles.derecho}
                        </div>
                    </div>
                </div>

                <div className="team-name team-right">{derecha}</div>

                {/* AVATAR DERECHO */}
                <div className="avatar-circle avatar-right">
                    {obtenerUrlAvatar(avatarDer) && (
                        <img 
                            src={obtenerUrlAvatar(avatarDer)} 
                            alt="Avatar Der" 
                            className="avatar-img"
                            onError={(e) => e.target.style.display = 'none'}
                        />
                    )}
                </div>

            </div>
        </div>
    );
};

export default Marcador;