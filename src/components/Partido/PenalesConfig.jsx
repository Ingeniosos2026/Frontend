import { useState, useEffect } from 'react';
import { createHttpService } from '../../services/HttpService';

const PenalesConfig = ({ 
    titulares,
    idUsuario,
    idPartido,
}) => {
    const [comportamientos, setComportamientos] = useState([]);
    const [idArquero, setIdArquero] = useState('');
    const [idComportamientoArquero, setIdComportamientoArquero] = useState('');
    const [pateadores, setPateadores] = useState([
        { id_jugador: '', id_comportamiento: '' },
        { id_jugador: '', id_comportamiento: '' },
        { id_jugador: '', id_comportamiento: '' }
    ]);
    const [enviado, setEnviado] = useState(false);
    const [errorMensaje, setErrorMensaje] = useState('');

    const httpService = createHttpService();

    useEffect(() => {
        const init = async () => {
            try {
                const dataComportamientos = await httpService.obtenerComportamientos(idUsuario);
                setComportamientos(dataComportamientos);

                if (dataComportamientos.length > 0 && titulares.length >= 3) {
                    const defaultComp = dataComportamientos[0].id;
                    
                    setIdArquero(titulares[0].id_jugador);
                    setIdComportamientoArquero(defaultComp);
                    
                    setPateadores([
                        { id_jugador: titulares[0].id_jugador, id_comportamiento: defaultComp },
                        { id_jugador: titulares[1].id_jugador, id_comportamiento: defaultComp },
                        { id_jugador: titulares[2].id_jugador, id_comportamiento: defaultComp }
                    ]);
                }
            } catch (error) {
                console.error(error.message);
            }
        }
        init();
    }, [idUsuario, titulares]);

    const manejarCambioPateador = (index, campo, valor) => {
        const nuevosPateadores = [...pateadores];
        nuevosPateadores[index][campo] = valor;
        setPateadores(nuevosPateadores);
        setErrorMensaje(''); // Limpiamos errores si el usuario cambia algo
    };

    const manejarEnvioPenales = async (e) => {
        e.preventDefault();

        const idsPateadores = pateadores.map(p => Number(p.id_jugador));
        const setIds = new Set(idsPateadores);
        if (setIds.size !== 3) {
            setErrorMensaje("No podés repetir jugadores en la tanda. Elegí 3 distintos.");
            return;
        }

        try {
            const bodyData = {
                id_usuario: Number(idUsuario),
                id_arquero: Number(idArquero),
                id_comportamiento_arquero: Number(idComportamientoArquero),
                pateadores: pateadores.map(p => ({
                    id_jugador: Number(p.id_jugador),
                    id_comportamiento: Number(p.id_comportamiento)
                }))
            };
            
            await httpService.configurarPenales(idPartido, bodyData);
            setEnviado(true);

        } catch (error) {
            console.error("Error al configurar penales:", error);
            setErrorMensaje("Hubo un error al guardar la configuración con el servidor.");
        }
    };

    // Pantalla de espera usando un Card de Bootstrap centrado
    if (enviado) {
        return (
            <div className="d-flex justify-content-center align-items-center position-absolute top-0 start-0 w-100 h-100" style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)', zIndex: 1050 }}>
                <div className="card bg-dark border-warning text-center p-4 shadow-lg">
                    <div className="card-body">
                        <div className="spinner-border text-warning mb-3" role="status"></div>
                        <h4 className="card-title text-warning fw-bold">ESPERANDO PENALES...</h4>
                        <p className="card-text text-light">Aguardando que el rival configure su equipo o finalice el tiempo.</p>
                    </div>
                </div>
            </div>
        );
    }

    // Modal forzado usando clases de Bootstrap (sin necesidad de JS de Bootstrap)
    return (
        <div className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)', zIndex: 1050 }}>
            <div className="modal-dialog modal-dialog-centered modal-lg w-100 shadow-lg">
                <div className="modal-content bg-dark text-light border-secondary">
                    
                    <div className="modal-header border-secondary">
                        <h4 className="modal-title text-warning fw-bold">Preparación de Penales</h4>
                    </div>
                    
                    <div className="modal-body">
                        {errorMensaje && (
                            <div className="alert alert-danger py-2" role="alert">
                                {errorMensaje}
                            </div>
                        )}

                        <form onSubmit={manejarEnvioPenales}>
                            
                            {/* SECCIÓN ARQUERO */}
                            <div className="mb-4">
                                <h5 className="text-success border-bottom border-secondary pb-2">Arquero</h5>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label text-secondary small mb-1">Elegí Arquero</label>
                                        <select 
                                            className="form-select bg-secondary text-light border-0" 
                                            value={idArquero} 
                                            onChange={(e) => setIdArquero(e.target.value)}
                                            required
                                        >
                                            <option value="" disabled>Seleccionar...</option>
                                            {titulares.map(j => (
                                                <option key={j.id_jugador} value={j.id_jugador}>{j.nombre}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label text-secondary small mb-1">Comportamiento</label>
                                        <select 
                                            className="form-select bg-secondary text-light border-0" 
                                            value={idComportamientoArquero} 
                                            onChange={(e) => setIdComportamientoArquero(e.target.value)}
                                            required
                                        >
                                            <option value="" disabled>Seleccionar...</option>
                                            {comportamientos.map(c => (
                                                <option key={c.id} value={c.id}>{c.nombre}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* SECCIÓN PATEADORES */}
                            <div className="mb-4">
                                <h5 className="text-success border-bottom border-secondary pb-2">Pateadores</h5>
                                {pateadores.map((pateador, index) => (
                                    <div key={`pateador-${index}`} className="row g-2 align-items-center mb-3">
                                        
                                        <div className="col-12 col-md-2 text-md-end">
                                            <span className="badge bg-success p-2">Pateador {index + 1}</span>
                                        </div>
                                        
                                        <div className="col-12 col-md-5">
                                            <select 
                                                className="form-select bg-secondary text-light border-0" 
                                                value={pateador.id_jugador} 
                                                onChange={(e) => manejarCambioPateador(index, 'id_jugador', e.target.value)}
                                                required
                                            >
                                                <option value="" disabled>Elegí Pateador...</option>
                                                {titulares.map(j => (
                                                    <option key={j.id_jugador} value={j.id_jugador}>{j.nombre}</option>
                                                ))}
                                            </select>
                                        </div>
                                        
                                        <div className="col-12 col-md-5">
                                            <select 
                                                className="form-select bg-secondary text-light border-0" 
                                                value={pateador.id_comportamiento} 
                                                onChange={(e) => manejarCambioPateador(index, 'id_comportamiento', e.target.value)}
                                                required
                                            >
                                                <option value="" disabled>Comportamiento...</option>
                                                {comportamientos.map(c => (
                                                    <option key={c.id} value={c.id}>{c.nombre}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button type="submit" className="btn btn-warning w-100 fw-bold py-2 mt-2">
                                CONFIRMAR SELECCIÓN
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PenalesConfig;