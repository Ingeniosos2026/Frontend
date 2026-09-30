import { useForm } from "react-hook-form";

const CrearLiga = ({ volver,FormularioEquipo }) => {
    const { register, formState: {errors} , handleSubmit } = useForm();
    const onSubmit = (data) => {
        console.log(data);
    }
    return <div>
        <h2>Crear Liga</h2>
        <form onSubmit = {handleSubmit(onSubmit)}>
            <button onClick={FormularioEquipo}>
                Crear Equipo
            </button> 
            <div>
                <label>Nombre de Liga</label>
                <input type="text"{...register('LigaNombre', {
                    required: true
                })} />
            </div>
            <div>
                <label>Minimo de Participantes</label>
                <input type="number" {...register('MinJugadores', {
                    required: true
                })} />
            </div>
            <div>
                <label>Maximo de Participantes</label>
                <input type="number" {...register('MaxJugadores', {
                    required: true
                })} />
            </div>
            <div>
                <label>Contraseña</label>
                <input type="password" {...register('contrasena', {
                    required: false
                })} />
            </div>
            <div>
                <label>Duracion de partidos</label>
                <input type="number" {...register('duracion', {
                    required: true
                })} />
            </div>
            <input type="submit" value="Crear Liga" />
        </form>
        <button onClick={volver}>
            Volver
        </button>
    </div>
};
export default CrearLiga;