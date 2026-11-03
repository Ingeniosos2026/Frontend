const LigaFinalizadaComp = ({ alVolver, tablaLiga }) => {
    return (
        <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center bg-light">
                <div className="text-center p-5 bg-white shadow rounded">
                    <h2 className="text-success mb-4">🏆 ¡La liga ha finalizado! 🏆</h2>
                    <p className="text-muted mb-4">Todos los partidos han sido jugados y los resultados son definitivos.</p>
                    <button className="btn btn-primary btn-lg px-5" onClick={alVolver}>
                        Volver al menú principal
                    </button>
                </div>
            </div>
    );
};

export default LigaFinalizadaComp;