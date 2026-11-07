import { useState, useEffect } from 'react';
import { createHttpService } from '../../services/HttpService';
import { useParams } from 'react-router-dom';
import CambiarAlineacionComp from '../../components/Equipo/CambiarAlineacionComp';

const CambiarAlineacion = ({volver}) => {
    const [cargando, setCargando] = useState(true);
    const [mensajeError, setMensajeError] = useState('');
    const { liga_id } = useParams();
    const usuarioId = localStorage.getItem('usuario_id');
    const equipoId = localStorage.getItem(`equipo_id`);

    const [titulares, setTitulares] = useState([]);
    const [suplentes, setSuplentes] = useState([]);
    const [formacion, setFormacion] = useState('');
    const [comportamientos, setComportamientos] = useState([]);
    const {obtenerEquipoLiga, obtenerComportamientos, actualizarEquipoLiga} = createHttpService();

    useEffect(() => {
        const cargarEquipo = async () => {
            try {
                setCargando(true);
                setMensajeError('');

                const [datosEquipo, datosComp] = await Promise.all([
                    obtenerEquipoLiga(liga_id, equipoId),
                    obtenerComportamientos(usuarioId)
                ]);
                setTitulares(datosEquipo.jugadores.filter(jugador => jugador.estado === 'titular'));
                setSuplentes(datosEquipo.jugadores.filter(jugador => jugador.estado === 'suplente'));
                setFormacion(datosEquipo.formacion);
                setComportamientos(datosComp);
            } catch (error) {
                setMensajeError(error.message);
            } finally {
                setCargando(false);
            }
        };
        cargarEquipo();
    }, [usuarioId, equipoId, liga_id]);

    const confirmar = async () => {
        try {
            setCargando(true);
            setMensajeError('');

            const jugadoresActualizados = [
                ...titulares.map(jugador => ({
                    id: jugador.id,
                    estado: 'titular',
                    comportamiento_id: jugador.comportamiento.id
                })),
                    ...suplentes.map(jugador => ({
                    id: jugador.id,
                    estado: 'suplente',
                    comportamiento_id: jugador.comportamiento.id
                }))
            ];

            await actualizarEquipoLiga(liga_id, equipoId, {
                jugadores: jugadoresActualizados,
                formacion: formacion
            });

            volver();

        } catch (error) {
            setMensajeError(error.message);
        } finally {
            setCargando(false);
        }
    };

    if(cargando) {
        return <p>Cargando equipo...</p>;
    }

    if (mensajeError) {
        return <p>{mensajeError}</p>;
    }

    const cambiarTitular = (titularIndex, suplenteId) => {
        const suplenteSelec = suplentes.find(
            jugador => jugador.id === Number(suplenteId)
        );

        if (suplenteSelec) {
            const titularReemplazado = titulares[titularIndex];
            const nuevosTitulares = [...titulares];
            const nuevosSuplentes = [...suplentes];

            nuevosTitulares[titularIndex] = suplenteSelec;

            const indiceSuplente = nuevosSuplentes.findIndex(
            jugador => jugador.id === suplenteSelec.id
            );

            nuevosSuplentes[indiceSuplente] = titularReemplazado;

            setTitulares(nuevosTitulares);
            setSuplentes(nuevosSuplentes);
        }
    };

    const cambiarComportamiento = (jugadorId, comportamientoId) => {
        const comportamientoSeleccionado = comportamientos.find(
            comp => comp.id === Number(comportamientoId)
        );

        if (!comportamientoSeleccionado) return;

        setTitulares(prev =>
            prev.map(jugador =>
                jugador.id === jugadorId ? { ...jugador, comportamiento: comportamientoSeleccionado } : jugador
            )
        );
    };

    return (
        <CambiarAlineacionComp
            titulares={titulares}
            suplentes={suplentes}
            formacion={formacion}
            comportamientos={comportamientos}
            error={mensajeError}
            onCambiarTitular={cambiarTitular}
            onCambiarFormacion={setFormacion}
            onCambiarComportamiento={cambiarComportamiento}
            onGuardar={confirmar}
            volver={volver}
        />
    );
};

export default CambiarAlineacion;
