import { useState } from "react";
import { useForm } from "react-hook-form";
import { createHttpService } from "../../services/HttpService";
import { useNavigate } from "react-router-dom";

const FormInicioSesion = () => {
    const { register, formState: {errors, isSubmitting} , handleSubmit } = useForm();
    const {iniciarSesion} = createHttpService();
    const [mensaje, setMensaje] = useState("");
    const [errorLogin, setErrorLogin] = useState("");
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        setMensaje("");
        setErrorLogin("");

        try {
            const res = await iniciarSesion(data);
            console.log("Usuario logueado", res);
            localStorage.setItem("usuario_id", res.usuario_id)
            setMensaje("Login realizado con exito!");
            navigate("/main"); 
        } catch (error) {
            console.error(error);
            setErrorLogin(error.message);
        }
    };

    return <div>
        <h2>Inicio de Sesion</h2>
        <form onSubmit = {handleSubmit(onSubmit)}>
            <div>
                <label htmlFor="email">Email</label>
                <input id="email" type="text" {...register('email', {
                    required: true,
                    pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "El formato de mail no es valido"
                    }
                })}
                />
                {errors.email?.type === "required" && <span>Ingrese un mail</span>}
                {errors.email?.type === "pattern" && <p>{errors.email.message}</p>}
            </div>
            <div>
                <label htmlFor="contraseña">Contraseña</label>
                <input id="contraseña" type="password" {...register('contraseña', {
                    required: true
                })} />
                {errors.contraseña?.type === "required" && <span>Ingrese una contraseña</span>}
            </div>
            <input type="submit" 
                value={isSubmitting ? "Confirmando" : "Confirmar"} 
                disabled= {isSubmitting}
            />
            {mensaje && <p>{mensaje}</p>}
            {errorLogin && (<p>{errorLogin}</p>)}
        </form>
        <button onClick={() => navigate("/auth")}>
            Volver
        </button>
    </div>
};

export default FormInicioSesion;