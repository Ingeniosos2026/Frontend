import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import FormInicioSesion from "./InicioSesion";
import { useNavigate, MemoryRouter } from "react-router-dom"; 

const { iniciarSesionMock, navigateMock } = vi.hoisted(() => ({
    iniciarSesionMock: vi.fn(),
    navigateMock: vi.fn()
}));

vi.mock("../../services/HttpService", () => ({
    createHttpService: () => ({
        iniciarSesion: iniciarSesionMock
    })
}));

vi.mock("react-router-dom", async () => { 
    const actual = await vi.importActual("react-router-dom"); 
    return { ...actual, useNavigate: () => 
        navigateMock
    }; 
});

const datosUsuario = {
    email: "joel@gmail.com",
    contraseña: "123456",
};

const labels = {
    email: "Email",
    contraseña: "Contraseña"
};

const completarFormulario = () => {
    Object.entries(datosUsuario).forEach(([campo, valor]) => {
        const input = screen.getByLabelText(labels[campo]);
        fireEvent.change(input, {
            target: {
                value: valor
            }
        });
    });
};

describe("FormInicioSesion", () => {
    beforeEach(() => {
        iniciarSesionMock.mockReset();
    });

    it("muestra todos los campos del formulario", () => {
        render(<MemoryRouter>
            <FormInicioSesion />
        </MemoryRouter>);

        expect(
            screen.getByRole("heading", {
                name: "Inicio de Sesion"
            })
        ).toBeTruthy();

        expect(
            screen.getByLabelText("Email")
        ).toBeTruthy();

        expect(
            screen.getByLabelText("Contraseña")
        ).toBeTruthy();

        expect(
            screen.getByRole("button", {
                name: "Volver"
            })
        ).toBeTruthy();

        expect(
            screen.getByRole("button", {
                name: "Confirmar"
            })
        ).toBeTruthy();
    });

    it("permite ingresar datos en los campos", () => {
        render(<MemoryRouter>
            <FormInicioSesion />
        </MemoryRouter>);

        completarFormulario();
        Object.entries(datosUsuario).forEach(([campo, valor]) => {

            const input = screen.getByLabelText(labels[campo]);
            expect(input.value).toBe(valor);
        });
    });

    it("muestra errores cuando los campos obligatorios están vacíos", async () => {
        render(<MemoryRouter>
            <FormInicioSesion />
        </MemoryRouter>);

        fireEvent.click(
            screen.getByRole("button", {
                name: "Confirmar"
            })
        );

        expect(
            await screen.findByText("Ingrese un mail")
        ).toBeTruthy();

        expect(
            await screen.findByText("Ingrese una contraseña")
        ).toBeTruthy();
    });

    it("muestra un error cuando el email tiene un formato inválido", async () => {
        render(<MemoryRouter>
            <FormInicioSesion />
        </MemoryRouter>);

        const email = screen.getByLabelText("Email");
        fireEvent.change(email, {
            target: {
                value: "correo-invalido"
            }
        });

        fireEvent.click(
            screen.getByRole("button", {
                name: "Confirmar"
            })
        );

        expect(
            await screen.findByText(
                "El formato de mail no es valido"
            )
        ).toBeTruthy();
    });

    it("muestra un mensaje cuando falla el login", async () => {
        iniciarSesionMock.mockRejectedValue(
            new Error("El email ya está registrado")
        );

        render(<MemoryRouter>
            <FormInicioSesion />
        </MemoryRouter>);

        completarFormulario();
        fireEvent.click(
            screen.getByRole("button", {
                name: "Confirmar"
            })
        );

        expect(
            await screen.findByText(
                "El email ya está registrado"
            )
        ).toBeTruthy();
    });

    it("muestra un mensaje cuando el login es exitoso", async () => {
        iniciarSesionMock.mockResolvedValue({
            id: 1
        });

        render(<MemoryRouter>
            <FormInicioSesion />
        </MemoryRouter>);

        completarFormulario();
        fireEvent.click(
            screen.getByRole("button", {
                name: "Confirmar"
            })
        );

        await waitFor(() => {
            expect(iniciarSesionMock).toHaveBeenCalledWith(
                datosUsuario
            );
        });

        expect(
            await screen.findAllByText("Login realizado con exito!")
        ).toBeTruthy();
    });

    it("vuelve a la página anterior al presionar Volver", () => { 
        render( <MemoryRouter> 
            <FormInicioSesion /> 
        </MemoryRouter>
        );

        fireEvent.click( screen.getByRole("button", { name: "Volver" }) );
        expect(navigateMock).toHaveBeenCalledWith("/auth");
    });
});