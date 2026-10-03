import { useForm } from "react-hook-form";

const CrearAmistosoComp = ({ mensajeError, alConfirmar, alVolver }) => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        defaultValues: {
            nombre: '',
            duracion_partido: 5
        }
    });

    const onSubmit = (data) => {
        alConfirmar(data);
    };

    return (
        <div>
            <h2>Detalles del Amistoso</h2>
            
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label htmlFor="nombre">Nombre del partido: </label>
                    <input 
                        id="nombre" 
                        type="text" 
                        {...register('nombre', { required: "Ingrese un nombre para el partido" })} 
                    />
                    {errors.nombre && <span> {errors.nombre.message}</span>}
                </div>

                <div>
                    <label htmlFor="duracion_partido">Duración (minutos): </label>
                    <input 
                        id="duracion_partido" 
                        type="number" 
                        {...register('duracion_partido', { 
                            required: "Ingrese la duración",
                            min: { value: 1, message: "El mínimo es 1 minuto" },
                            valueAsNumber: true 
                        })} 
                    />
                    {errors.duracion_partido && <span> {errors.duracion_partido.message}</span>}
                </div>

                {mensajeError && (
                    <div>Error: {mensajeError}</div>
                )}

                <div>
                    <button type="button" onClick={alVolver}>
                        Volver
                    </button>
                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Creando..." : "Crear Amistoso"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CrearAmistosoComp;