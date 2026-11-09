import './Pantallas.css';

const avatares = [
    { id: 1, imagen: '../src/assets/avatars/avatar_1.png' },
    { id: 2, imagen: '../src/assets/avatars/avatar_2.png' },
    { id: 3, imagen: '../src/assets/avatars/avatar_3.png' },
    { id: 4, imagen: '../src/assets/avatars/avatar_4.png' },
    { id: 5, imagen: '../src/assets/avatars/avatar_5.png' },
    { id: 6, imagen: '../src/assets/avatars/avatar_6.png' }
];

const PantallaFinal = ({ visual, resultadoFinal, alVolver }) => {
    
    const obtenerUrlAvatar = (id) => {
        const avatar = avatares.find(a => a.id === Number(id));
        return avatar ? avatar.imagen : null;
    };

    const formatearReloj = (segs) => {
        if (!segs) return "00:00";
        return `${Math.floor(segs / 60).toString().padStart(2, '0')}:${Math.floor(segs % 60).toString().padStart(2, '0')}`;
    };

    const urlAvatarIzq = obtenerUrlAvatar(visual?.avatar_usuario_izq);
    const urlAvatarDer = obtenerUrlAvatar(visual?.avatar_usuario_der);

    return (
        <div className="pantalla-dividida-container">
            <div className="pantalla-dividida-content">
                
                <div className="pantalla-mitad">
                    <div className="avatar-gigante-wrapper">
                        {urlAvatarIzq && (
                            <img src={urlAvatarIzq} alt="Avatar Izquierda" className="avatar-gigante-img" />
                        )}
                    </div>
                    <h2 className="club-name-gigante">{visual?.club_usuario_izq}</h2>
                </div>

                <div className="centro-final-wrapper">
                    <div className="etiqueta-finalizado">FINALIZADO</div>
                    
                    <div className="resultado-3d">
                        {resultadoFinal?.goles?.izquierdo ?? 0} - {resultadoFinal?.goles?.derecho ?? 0}
                    </div>
                    
                    <div className="tiempo-total">
                        TIEMPO: {formatearReloj(resultadoFinal?.tiempo)}
                    </div>

                    <button className="btn-volver-final" onClick={alVolver}>
                        Volver al Menú
                    </button>
                </div>

                <div className="pantalla-mitad">
                    <div className="avatar-gigante-wrapper">
                        {urlAvatarDer && (
                            <img src={urlAvatarDer} alt="Avatar Derecha" className="avatar-gigante-img" />
                        )}
                    </div>
                    <h2 className="club-name-gigante">{visual?.club_usuario_der}</h2>
                </div>

            </div>
        </div>
    );
};

export default PantallaFinal;