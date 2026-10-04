import { useState, useEffect } from 'react';
import ArmarEquipoComp from '../../components/Equipo/ArmarEquipoComp';
import { createHttpService } from '../../services/HttpService';

const ArmarEquipo = ({ usuario_id, onConfirmar, onCancelar }) => {
    const [listaJugadores, setListaJugadores] = useState([]);
    const [listaComportamientos, setListaComportamientos] = useState([]);
    const [loading, setLoading] = useState(true);
    //Error de seleccion/asignacion
    const [error, setError] = useState(null);
    //Error en cantidad de jugadores y/o listas
    const [bloqueoCritico, setBloqueoCritico] = useState(false); 
    const [equipo, setEquipo] = useState(Array(6).fill({ jugador_id: '', comp_id: ''}));
    const [formacion, setFormacion] = useState('Ofensivo');
    const { obtenerJugadores, obtenerComportamientos } = createHttpService();


    useEffect(() => {
        const fetchDatos = async () => {
            setLoading(true);
            setError(null);
            setBloqueoCritico(false);
            
            try {
                const [resJugadores, resComportamientos] = await Promise.all([
                    obtenerJugadores(usuario_id),
                    obtenerComportamientos(usuario_id)
                ]);
                
                const jugadores = resJugadores.disponibles || resJugadores || [];
                const comps = resComportamientos.disponibles || resComportamientos || [];

                //Control de errores criticos
                if (jugadores.length < 6) {
                    setError(`Jugadores insuficientes, se requiere como minimo 6 pero existen ${jugadores.length}`);
                    setBloqueoCritico(true);
                }
                if (comps.length === 0) {
                    setError("Sin comportamientos para asignar");
                    setBloqueoCritico(true);
                }

                setListaJugadores(jugadores);
                setListaComportamientos(comps);
                
            } catch (err) {
                setError(err.message || "Error al cargar jugadores y/o comportamientos");
                setBloqueoCritico(true);
            } finally {
                setLoading(false);
            }
        };
        fetchDatos();
    }, [usuario_id]);

    const handleSeleccion = (index, campo, valor) => {
        if (error && !bloqueoCritico) {
            setError(null);
        }
        const nuevoEquipo = [...equipo];
        nuevoEquipo[index] = { ...nuevoEquipo[index], [campo]: valor };
        setEquipo(nuevoEquipo);
    };

    const handleConfirmar = () => {
        if (bloqueoCritico) return;

        //Verificacion de asignacion completa
        if (equipo.some(slot => !slot.jugador_id || !slot.comp_id)) {
            setError("Equipo con menos de 6 jugadores con comportamiento asignado");
            return;
        }

        //Verificacion de jugador_id no repetido
        const idsSeleccionados = equipo.map(slot => slot.jugador_id);
        const idsUnicos = new Set(idsSeleccionados);
        if (idsUnicos.size !== 6) {
            setError("Jugadores repetidos");
            return;
        }

        //Formato para API
        const tuplasString = equipo.map(slot => `(${slot.jugador_id},${slot.comp_id})`).join(',');
        const jugadoresFormateados = `[${tuplasString}]`;

        onConfirmar({
            jugadores: jugadoresFormateados,
            formacion: formacion
        });
    };

    return (
        <ArmarEquipoComp 
            listaJugadores={listaJugadores}
            listaComportamientos={listaComportamientos}
            equipo={equipo}
            formacion={formacion}
            loading={loading}
            error={error}
            onSeleccion={handleSeleccion}
            onFormacionChange={(e) => setFormacion(e.target.value)}
            ConfirmarEquipo={handleConfirmar}
            Cancelar={onCancelar}
            bloqueoCritico={bloqueoCritico} 
        />
    );
};

export default ArmarEquipo;