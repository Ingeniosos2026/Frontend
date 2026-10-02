import { useForm } from "react-hook-form";

const CrearJugadorComp = ({ mensajeError, alCrear, alVolver }) => {
    const { register, handleSubmit, formState: { errors, isSubmitting }, watch } = useForm({
        defaultValues: {
            nombre: '',
            power: 60,
            agility: 60,
            control: 60,
            speed: 60,
            strength: 60
        }
    });

    const formValues = watch();
    const totalPuntos = 
        (Number(formValues.power) || 0) + 
        (Number(formValues.agility) || 0) + 
        (Number(formValues.control) || 0) + 
        (Number(formValues.speed) || 0) + 
        (Number(formValues.strength) || 0);

    const onSubmit = (data) => {
        if (totalPuntos !== 300) {
            alert("Error: Los atributos deben sumar exactamente 300 puntos.");
            return;
        }
        alCrear(data);
    };

    const registrarAtributo = (nombre) => {
        return register(nombre, {
            required: "Este atributo es obligatorio",
            min: { value: 20, message: "El mínimo es 20" },
            max: { value: 100, message: "El máximo es 100" },
            valueAsNumber: true
        });
    };

    return (
        <div>
            <h2>Crear Nuevo Jugador</h2>
            
            <form onSubmit={handleSubmit(onSubmit)}>
                
                <div>
                    <label htmlFor="nombre">Nombre del Jugador: </label>
                    <input 
                        id="nombre" 
                        type="text" 
                        {...register('nombre', { required: "Ingrese un nombre" })} 
                    />
                    {errors.nombre && <span> {errors.nombre.message}</span>}
                </div>

                <hr />
                <p>Atributos (Total: {totalPuntos}/300)</p>

                {['power', 'agility', 'control', 'speed', 'strength'].map((attr) => (
                    <div key={attr}>
                        <label htmlFor={attr}>{attr}: </label>
                        <input 
                            id={attr} 
                            type="number" 
                            {...registrarAtributo(attr)} 
                        />
                        {errors[attr] && <span> {errors[attr].message}</span>}
                    </div>
                ))}

                {mensajeError && (
                    <div>Error: {mensajeError}</div>
                )}

                <div>
                    <button type="button" onClick={alVolver}>
                        Volver
                    </button>
                    <button 
                        type="submit" 
                        disabled={isSubmitting || totalPuntos !== 300}
                    >
                        {isSubmitting ? "Creando..." : "Crear Jugador"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CrearJugadorComp;
