
import ArmarEquipo from '../../containers/Equipo/ArmarEquipo';

const UnirAmistosoComp = ({ 
    usuarioId, 
    mensajeError, 
    onConfirmar, 
    onCancelar 
}) => {
    return (
        <div>
            <h2>Unirse al Partido Amistoso</h2>
            
            {mensajeError && (
                <div>
                    <strong>Error: </strong> {mensajeError}
                </div>
            )}
            
            <ArmarEquipo
                usuario_id={usuarioId}
                onConfirmar={onConfirmar} 
                onCancelar={onCancelar}
            />
        </div>
    );
};

export default UnirAmistosoComp;