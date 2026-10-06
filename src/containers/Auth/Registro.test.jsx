import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import FormRegistro from "./Registro";
import { MemoryRouter } from "react-router-dom";
import { createHttpService } from "../../services/HttpService";

// 1. Mock seguro de react-router-dom sin usar vi.hoisted
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => { 
    const actual = await vi.importActual("react-router-dom"); 
    return { 
        ...actual, 
        useNavigate: () => mockNavigate 
    }; 
});

// 2. Mock del servicio HTTP
vi.mock("../../services/HttpService", () => ({
    createHttpService: vi.fn()
}));

const datosUsuario = {
    nombre: "Joel",
    email: "joel@gmail.com",
    contraseña: "123456",
    club: "Barcelona",
    avatar: "avatar.png"
};

// Utilizamos RegEx para que soporte variaciones e íconos en el DOM
const labels = {
    nombre: /Nombre/i,
    email: /Email/i,
    contraseña: /Contraseña/i,
    club: /Club/i,
    avatar: /Avatar/i
};

const completarFormulario = () => {
    Object.entries(datosUsuario).forEach(([campo, valor]) => {
        const input = screen.getByLabelText(labels[campo]);
        fireEvent.change(input, {
            target: { value: valor }
        });
    });
};

describe("FormRegistro", () => {
    const mockCrearUsuario = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        
        // Inyectamos el mock al servicio HTTP
        createHttpService.mockReturnValue({
            crearUsuario: mockCrearUsuario
        });
    });

    it("muestra todos los campos del formulario", () => {
        render(<MemoryRouter><FormRegistro /></MemoryRouter>);

        expect(screen.getByRole("heading", { name: /Registrarse/i })).toBeTruthy();
        expect(screen.getByLabelText(/Nombre/i)).toBeTruthy();
        expect(screen.getByLabelText(/Email/i)).toBeTruthy();
        expect(screen.getByLabelText(/Contraseña/i)).toBeTruthy();
        expect(screen.getByLabelText(/Club/i)).toBeTruthy();
        expect(screen.getByLabelText(/Avatar/i)).toBeTruthy();
        
        expect(screen.getByRole("button", { name: /Volver/i })).toBeTruthy();
        expect(screen.getByRole("button", { name: /Registrar/i })).toBeTruthy();
    });

    it("permite ingresar datos en los campos", () => {
        render(<MemoryRouter><FormRegistro /></MemoryRouter>);

        completarFormulario();
        
        Object.entries(datosUsuario).forEach(([campo, valor]) => {
            const input = screen.getByLabelText(labels[campo]);
            expect(input.value).toBe(valor);
        });
    });

    it("muestra errores cuando los campos obligatorios están vacíos", async () => {
        render(<MemoryRouter><FormRegistro /></MemoryRouter>);

        fireEvent.click(screen.getByRole("button", { name: /Registrar/i }));

        expect(await screen.findByText(/Ingrese un nombre/i)).toBeTruthy();
        expect(await screen.findByText(/Ingrese un mail/i)).toBeTruthy();
        expect(await screen.findByText(/Ingrese una contraseña/i)).toBeTruthy();
        expect(await screen.findByText(/Ingrese un club/i)).toBeTruthy();
    });

    it("muestra un error cuando el email tiene un formato inválido", async () => {
        render(<MemoryRouter><FormRegistro /></MemoryRouter>);

        const email = screen.getByLabelText(/Email/i);
        fireEvent.change(email, { target: { value: "correo-invalido" } });

        fireEvent.click(screen.getByRole("button", { name: /Registrar/i }));

        expect(await screen.findByText(/El formato de mail no es valido/i)).toBeTruthy();
    });

    it("registra correctamente un usuario", async () => {
        mockCrearUsuario.mockResolvedValue({ id: 1 });

        render(<MemoryRouter><FormRegistro /></MemoryRouter>);

        completarFormulario();
        fireEvent.click(screen.getByRole("button", { name: /Registrar/i }));

        await waitFor(() => {
            expect(mockCrearUsuario).toHaveBeenCalledWith(datosUsuario);
        });

        expect(await screen.findByText(/Registro realizado correctamente!/i)).toBeTruthy();
    });

    it("muestra un mensaje cuando falla el registro", async () => {
        mockCrearUsuario.mockRejectedValue(new Error("El email ya está registrado"));

        render(<MemoryRouter><FormRegistro /></MemoryRouter>);

        completarFormulario();
        fireEvent.click(screen.getByRole("button", { name: /Registrar/i }));

        expect(await screen.findByText(/El email ya está registrado/i)).toBeTruthy();
    });

    it("vuelve a la página anterior al presionar Volver", () => { 
        render(<MemoryRouter><FormRegistro /></MemoryRouter>);

        fireEvent.click(screen.getByRole("button", { name: /Volver/i }));
        expect(mockNavigate).toHaveBeenCalledWith(-1);
    });
});