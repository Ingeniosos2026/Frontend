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
    }, []);

    const manejarCambioPateador = (index, campo, valor) => {
        const nuevosPateadores = [...pateadores];
        nuevosPateadores[index][campo] = valor;
        setPateadores(nuevosPateadores);
        setErrorMensaje('');
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

    if (enviado) {
        return (
            <div className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)', zIndex: 1050 }}>
                <div className="card bg-dark border-warning text-center p-5 shadow-lg" style={{ maxWidth: '400px', width: '90%' }}>
                    <div className="card-body">
                        <div className="spinner-border text-warning mb-4" role="status" style={{ width: '3rem', height: '3rem' }}></div>
                        <h4 className="card-title text-warning fw-bold mb-3">ESPERANDO PENALES...</h4>
                        <p className="card-text text-secondary">Aguardando que el rival configure su equipo o finalice el tiempo.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)', zIndex: 1050 }}>
            
            {/* Contenedor central simulando un Modal. Se le da un maxWidth de 650px para que no ocupe toda la pantalla */}
            <div className="card bg-dark text-light border-secondary shadow-lg" style={{ maxWidth: '650px', width: '95%' }}>
                
                <div className="card-header border-secondary text-center pt-3 pb-2">
                    <h4 className="text-warning fw-bold text-uppercase m-0">Preparación de Penales</h4>
                </div>
                
                <div className="card-body p-4">
                    {errorMensaje && (
                        <div className="alert alert-danger py-2 text-center" role="alert">
                            {errorMensaje}
                        </div>
                    )}

                    <form onSubmit={manejarEnvioPenales}>
                        
                        {/* SECCIÓN ARQUERO */}
                        <div className="mb-4">
                            <h5 className="text-success fw-bold border-bottom border-secondary pb-2 mb-3">Arquero</h5>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label text-secondary small text-uppercase fw-bold mb-1">Elegí Arquero</label>
                                    <select 
                                        className="form-select bg-dark text-light border-secondary shadow-none" 
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
                                    <label className="form-label text-secondary small text-uppercase fw-bold mb-1">Comportamiento</label>
                                    <select 
                                        className="form-select bg-dark text-light border-secondary shadow-none" 
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
                            <h5 className="text-success fw-bold border-bottom border-secondary pb-2 mb-3">Pateadores</h5>
                            {pateadores.map((pateador, index) => (
                                <div key={`pateador-${index}`} className="row g-2 align-items-center mb-3">
                                    
                                    <div className="col-12 col-md-2 text-start text-md-end">
                                        <span className="badge bg-success p-2 w-100" style={{ fontSize: '13px' }}>Pateador {index + 1}</span>
                                    </div>
                                    
                                    <div className="col-12 col-md-5">
                                        <select 
                                            className="form-select bg-dark text-light border-secondary shadow-none" 
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
                                            className="form-select bg-dark text-light border-secondary shadow-none" 
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

                        <button type="submit" className="btn btn-warning w-100 fw-bold py-3 mt-2 text-dark">
                            CONFIRMAR SELECCIÓN
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PenalesConfig;