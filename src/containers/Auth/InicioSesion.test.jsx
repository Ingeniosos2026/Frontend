import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import FormInicioSesion from "./InicioSesion";
import { MemoryRouter } from "react-router-dom"; 
import { createHttpService } from "../../services/HttpService";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => { 
    const actual = await vi.importActual("react-router-dom"); 
    return { 
        ...actual, 
        useNavigate: () => mockNavigate
    }; 
});

vi.mock("../../services/HttpService", () => ({
    createHttpService: vi.fn()
}));

const datosUsuario = {
    email: "joel@gmail.com",
    contraseña: "123456",
};

const labels = {
    email: /Email/i,
    contraseña: /Contraseña/i
};

const completarFormulario = () => {
    Object.entries(datosUsuario).forEach(([campo, valor]) => {
        const input = screen.getByLabelText(labels[campo]);
        fireEvent.change(input, {
            target: { value: valor }
        });
    });
};

describe("FormInicioSesion", () => {
    const mockIniciarSesion = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        createHttpService.mockReturnValue({
            iniciarSesion: mockIniciarSesion
        });
    });

    it("muestra todos los campos del formulario", () => {
        render(<MemoryRouter><FormInicioSesion /></MemoryRouter>);

        expect(screen.getByRole("heading", { name: /Iniciar Sesión/i })).toBeTruthy();
        expect(screen.getByLabelText(/Email/i)).toBeTruthy();
        expect(screen.getByLabelText(/Contraseña/i)).toBeTruthy();

        // Utilizamos Regex para atrapar la flecha "← Volver"
        expect(screen.getByRole("button", { name: /Volver/i })).toBeTruthy();
        expect(screen.getByRole("button", { name: /Confirmar/i })).toBeTruthy();
    });

    it("permite ingresar datos en los campos", () => {
        render(<MemoryRouter><FormInicioSesion /></MemoryRouter>);

        completarFormulario();
        Object.entries(datosUsuario).forEach(([campo, valor]) => {
            const input = screen.getByLabelText(labels[campo]);
            expect(input.value).toBe(valor);
        });
    });

    it("muestra errores cuando los campos obligatorios están vacíos", async () => {
        render(<MemoryRouter><FormInicioSesion /></MemoryRouter>);

        fireEvent.click(screen.getByRole("button", { name: /Confirmar/i }));

        expect(await screen.findByText(/Ingrese un mail/i)).toBeTruthy();
        expect(await screen.findByText(/Ingrese una contraseña/i)).toBeTruthy();
    });

    it("muestra un error cuando el email tiene un formato inválido", async () => {
        render(<MemoryRouter><FormInicioSesion /></MemoryRouter>);

        const email = screen.getByLabelText(/Email/i);
        fireEvent.change(email, { target: { value: "correo-invalido" } });

        fireEvent.click(screen.getByRole("button", { name: /Confirmar/i }));

        expect(await screen.findByText(/El formato de mail no es valido/i)).toBeTruthy();
    });

    it("muestra un mensaje cuando falla el login", async () => {
        mockIniciarSesion.mockRejectedValue(new Error("El email o contraseña son incorrectos"));

        render(<MemoryRouter><FormInicioSesion /></MemoryRouter>);

        completarFormulario();
        fireEvent.click(screen.getByRole("button", { name: /Confirmar/i }));

        expect(await screen.findByText(/El email o contraseña son incorrectos/i)).toBeTruthy();
    });

    it("muestra un mensaje cuando el login es exitoso", async () => {
        mockIniciarSesion.mockResolvedValue({ id: 1 });

        render(<MemoryRouter><FormInicioSesion /></MemoryRouter>);

        completarFormulario();
        fireEvent.click(screen.getByRole("button", { name: /Confirmar/i }));

        await waitFor(() => {
            expect(mockIniciarSesion).toHaveBeenCalledWith(datosUsuario);
        });

        expect(await screen.findByText(/Login realizado con exito!/i)).toBeTruthy();
    });

    it("vuelve a la página anterior al presionar Volver", () => { 
        render(<MemoryRouter><FormInicioSesion /></MemoryRouter>);

        fireEvent.click(screen.getByRole("button", { name: /Volver/i }));
        expect(mockNavigate).toHaveBeenCalledWith("/auth");
    });
});