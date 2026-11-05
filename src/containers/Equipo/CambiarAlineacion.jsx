import { useState, useEffect } from 'react';
import { createHttpService } from '../../services/HttpService';
import CambiarAlineacionComp from '../../components/Equipo/CambiarAlineacionComp';

const CambiarAlineacion = ({usuario_id, liga_id, onConfirmar}) => {
    const [cargando, setCargando] = useState(true);
    const [mensajeError, setMensajeError] = useState('');

    const [titulares, setTitulares] = useState([]);
    const [suplentes, setSuplentes] = useState([]);
    const [formacion, setFormacion] = useState('');
    const [comportamientos, setComportamientos] = useState([]);
    const obtenerEquipoLiga = createHttpService();

    useEffect(() => {
        const cargarEquipo = async () => {
            try {
                setCargando(true);
                setMensajeError('');

                const datosEquipo = await obtenerEquipoLiga(liga_id, usuario_id);
                setEquipo(datosEquipo);
                setTitulares(datosEquipo.titulares);
                setSuplentes(datosEquipo.suplentes);
                setFormacion(datosEquipo.formacion);
                setComportamientos(datosEquipo.comportamientos);
            } catch (error) {
                setMensajeError(error.message);
            } finally {
                setCargando(false);
            }
        };
        cargarEquipo();
    }, [usuario_id, liga_id]);

    const confirmar = () => {
        onConfirmar({
            titulares,
            suplentes,
            formacion,
            comportamientos
        });
    };

    if(cargando) {
        return <p>Cargando equipo...</p>;
    }

    if (mensajeError) {
        return <p>{mensajeError}</p>;
    }

    const volver = () => {
        navigate(`/ligas/lobby/${liga_id}`);
    };

    return (
        <CambiarAlineacionComp
            titulares={titulares}
            suplentes={suplentes}
            formacion={formacion}
            comportamientos={comportamientos}
            onCambiarTitular={(nuevosTitulares, nuevosSuplentes) => { 
                setTitulares(nuevosTitulares);
                setSuplentes(nuevosSuplentes);
            }}
            onCambiarFormacion={setFormacion}
            onCambiarComportamiento={setComportamientos}
            onGuardar={confirmar}
            volver={volver}
        />
    );
};

export default CambiarAlineacion;
