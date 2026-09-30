import { useState } from "react";
import { useForm } from "react-hook-form";
import { createHttpService } from "../../services/HttpService"; 

const FormRegistro = ({ volver }) => {
    const { register, formState: {errors, isSubmitting}, handleSubmit } = useForm();
    const {crearUsuario} = createHttpService();
    const [mensaje, setMensaje] = useState("");
    const [errorRegistro, setErrorRegistro] = useState("");

    const onSubmit = async (data) => {
        setMensaje("");
        setErrorRegistro("");
        try {
            const res = await crearUsuario(data);
            console.log("Usuario creado", res);
            setMensaje("Registro realizado correctamente!");
        } catch(error) {
            console.error(error);
            setErrorRegistro(error.message);
        }
    };

    return <div>
        <h2>Registrarse</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label htmlFor="nombre">Nombre</label>
                <input id="nombre" type="text" {...register('nombre', {
                    required: true
                })} />
                {errors.nombre && (<span>Ingrese un nombre</span>)}
            </div>
            <div>
                <label htmlFor="email">Email</label>
                <input id="email" type="text" {...register('email', {
                    required: true,
                    pattern: { 
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "El formato de mail no es valido"
                    }
                })} />
                {errors.email?.type === "pattern" && <p>{errors.email.message}</p>}
                {errors.email?.type === "required" && <span>Ingrese un mail</span>}
            </div>
            <div>
                <label htmlFor="contraseña">Contraseña</label>
                <input id="contraseña" type="password" {...register('contraseña', {
                    required: true
                })} />
                {errors.contraseña && <span>Ingrese una contraseña</span>}
            </div>
            <div>
                <label htmlFor="club">Club</label>
                <input id="club" type="text" {...register('club', {
                    required: true
                })} />
                {errors.club && <span>Ingrese un club</span>}
            </div>
            <div>
                <label htmlFor="avatar">Avatar</label>
                <input id="avatar" type="text" {...register("avatar")} 
                />
            </div>
            <input type="submit" 
                value={isSubmitting ? "Registrando" : "Registrar"}
                disabled= {isSubmitting}
            />
            {mensaje && <p>{mensaje}</p>}
            {errorRegistro && (<p>{errorRegistro}</p>)}
        </form>
        <button onClick={volver}>
            Volver
        </button>
    </div>
};

export default FormRegistro;