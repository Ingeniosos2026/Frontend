import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import FormRegistro from "./Registro";
import { useNavigate, MemoryRouter } from "react-router-dom";


const { crearUsuarioMock, navigateMock } = vi.hoisted(() => ({
    crearUsuarioMock: vi.fn(),
    navigateMock: vi.fn()
}));

vi.mock("../../services/HttpService", () => ({
    createHttpService: () => ({
        crearUsuario: crearUsuarioMock
    })
}));

vi.mock("react-router-dom", async () => { 
    const actual = await vi.importActual("react-router-dom"); 
    return { ...actual, useNavigate: () => 
        navigateMock 
    }; 
});

const datosUsuario = {
    nombre: "Joel",
    email: "joel@gmail.com",
    contraseña: "123456",
    club: "Barcelona",
    avatar: "avatar.png"
};

const labels = {
    nombre: "Nombre",
    email: "Email",
    contraseña: "Contraseña",
    club: "Club",
    avatar: "Avatar"
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

describe("FormRegistro", () => {
    beforeEach(() => {
        crearUsuarioMock.mockReset();
    });

    it("muestra todos los campos del formulario", () => {
        render(<MemoryRouter>
            <FormRegistro />
        </MemoryRouter>);

        expect(
            screen.getByRole("heading", {
                name: "Registrarse"
            })
        ).toBeTruthy();

        expect(
            screen.getByLabelText("Nombre")
        ).toBeTruthy();

        expect(
            screen.getByLabelText("Email")
        ).toBeTruthy();

        expect(
            screen.getByLabelText("Contraseña")
        ).toBeTruthy();

        expect(
            screen.getByLabelText("Club")
        ).toBeTruthy();

        expect(
            screen.getByLabelText("Avatar")
        ).toBeTruthy();

        expect(
            screen.getByRole("button", {
                name: "Volver"
            })
        ).toBeTruthy();

        expect(
            screen.getByRole("button", {
                name: "Registrar"
            })
        ).toBeTruthy();
    });


    it("permite ingresar datos en los campos", () => {
        render(<MemoryRouter>
            <FormRegistro />
        </MemoryRouter>);

        completarFormulario();
        Object.entries(datosUsuario).forEach(([campo, valor]) => {

            const input = screen.getByLabelText(labels[campo]);
            expect(input.value).toBe(valor);
        });
    });


    it("muestra errores cuando los campos obligatorios están vacíos", async () => {
        render(<MemoryRouter>
            <FormRegistro />
        </MemoryRouter>);

        fireEvent.click(
            screen.getByRole("button", {
                name: "Registrar"
            })
        );

        expect(
            await screen.findByText("Ingrese un nombre")
        ).toBeTruthy();

        expect(
            await screen.findByText("Ingrese un mail")
        ).toBeTruthy();

        expect(
            await screen.findByText("Ingrese una contraseña")
        ).toBeTruthy();

        expect(
            await screen.findByText("Ingrese un club")
        ).toBeTruthy();
    });


    it("muestra un error cuando el email tiene un formato inválido", async () => {
        render(<MemoryRouter>
            <FormRegistro />
        </MemoryRouter>);

        const email = screen.getByLabelText("Email");
        fireEvent.change(email, {
            target: {
                value: "correo-invalido"
            }
        });

        fireEvent.click(
            screen.getByRole("button", {
                name: "Registrar"
            })
        );

        expect(
            await screen.findByText(
                "El formato de mail no es valido"
            )
        ).toBeTruthy();
    });


    it("registra correctamente un usuario", async () => {
        crearUsuarioMock.mockResolvedValue({
            id: 1
        });

        render(<MemoryRouter>
            <FormRegistro />
        </MemoryRouter>);

        completarFormulario();
        fireEvent.click(
            screen.getByRole("button", {
                name: "Registrar"
            })
        );

        await waitFor(() => {
            expect(crearUsuarioMock).toHaveBeenCalledWith(
                datosUsuario
            );
        });

        expect(
            await screen.findByText(
                "Registro realizado correctamente!"
            )
        ).toBeTruthy();
    });

    it("muestra un mensaje cuando falla el registro", async () => {
        crearUsuarioMock.mockRejectedValue(
            new Error("El email ya está registrado")
        );

        render(<MemoryRouter>
            <FormRegistro />
        </MemoryRouter>);

        completarFormulario();
        fireEvent.click(
            screen.getByRole("button", {
                name: "Registrar"
            })
        );

        expect(
            await screen.findByText(
                "El email ya está registrado"
            )
        ).toBeTruthy();
    });


    it("vuelve a la página anterior al presionar Volver", () => { 
        render( <MemoryRouter> 
            <FormRegistro /> 
        </MemoryRouter>
        );

        fireEvent.click( screen.getByRole("button", { name: "Volver" }) );
        expect(navigateMock).toHaveBeenCalledWith(-1);
    });
});