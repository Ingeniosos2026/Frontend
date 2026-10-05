const LobbyAmistosoComp = ({ mensajeError, esCreador, versus, iniciando, alIniciar }) => {
    return (
        <div>
            <h2>Lobby del Partido </h2>
            <hr />
            
            <div>
                <h3>Estado del encuentro</h3>
                
                {!versus ? (
                    <div>
                        <p>Esperando a que un rival se una a la sala...</p>
                    </div>
                ) : (
                    <div>
                        <h4>¡Rival listo!</h4>
                        <ul>
                            <li><strong>Nombre:</strong> {versus.nombre_owner}</li>
                            <li><strong>Club:</strong> {versus.club_owner}</li>
                        </ul>
                        <ul>
                            <li><strong>Nombre:</strong> {versus.nombre}</li>
                            <li><strong>Club:</strong> {versus.club}</li>
                        </ul>
                    </div>
                )}
            </div>

            <div>
                
                {esCreador ? (
                    <div>
                        <p>Eres el creador de la sala.</p>
                        <button 
                            type="button" 
                            onClick={alIniciar}
                            disabled={!versus || iniciando}
                        >
                            {iniciando ? "Iniciando..." : "Iniciar Amistoso"}
                        </button>
                        {mensajeError && (
                            <div>Error: {mensajeError}</div>
                        )}
                    </div>

                ) : (
                    <div>
                        <p>
                            <strong>Esperando a que el creador inicie el partido...</strong>
                        </p>
                    </div>
                )}

            </div>
        </div>
    );
};

export default LobbyAmistosoComp;