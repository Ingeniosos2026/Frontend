import { it, expect, vi, describe, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import ArmarEquipo from "./ArmarEquipo"; 
import { createHttpService } from "../../services/HttpService";


vi.mock("../../services/HttpService", () => ({
    createHttpService: vi.fn(),
}));

describe("ArmarEquipo Logic Container", () => {
    const mockObtenerJugadores = vi.fn();
    const mockObtenerComportamientos = vi.fn();
    const mockOnConfirmar = vi.fn();
    const mockOnCancelar = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        createHttpService.mockReturnValue({
            obtenerJugadores: mockObtenerJugadores,
            obtenerComportamientos: mockObtenerComportamientos
        });
    });

    it("muestra estado de carga inicial y oculta el mensaje al resolver las APIs", async () => {
        const jugadoresValidos = Array.from({ length: 6 }, (_, i) => ({ 
            id: (i + 1).toString(), 
            nombre: `Jugador ${i + 1}` 
        }));
        mockObtenerJugadores.mockResolvedValue({ disponibles: jugadoresValidos });
        mockObtenerComportamientos.mockResolvedValue({ disponibles: [{ id: '101', nombre: 'Comp' }] });

        render(<ArmarEquipo usuario_id={1} onConfirmar={mockOnConfirmar} onCancelar={mockOnCancelar} />);
        expect(screen.getByText("Cargando jugadores y comportamientos...")).toBeTruthy();

        await waitFor(() => {
            expect(screen.queryByText("Cargando jugadores y comportamientos...")).toBeNull();
        });
    });

    it("activa bloqueo crítico mostrando error si la API devuelve menos de 6 jugadores", async () => {
        const jugadoresInsuficientes = Array.from({ length: 5 }, (_, i) => ({ 
            id: (i + 1).toString(), 
            nombre: `Jugador ${i + 1}` 
        }));
        mockObtenerJugadores.mockResolvedValue({ disponibles: jugadoresInsuficientes });
        mockObtenerComportamientos.mockResolvedValue({ disponibles: [{ id: '101', nombre: 'Comp' }] });

        render(<ArmarEquipo usuario_id={1} onConfirmar={mockOnConfirmar} onCancelar={mockOnCancelar} />);
        const errorMsg = await screen.findByText("Jugadores insuficientes, se requiere como minimo 6 pero existen 5");
        expect(errorMsg).toBeTruthy();

        fireEvent.click(screen.getByRole("button", { name: "Confirmar Equipo" }));
        expect(mockOnConfirmar).not.toHaveBeenCalled();
    });

    it("activa bloqueo crítico mostrando error si no existen comportamientos", async () => {
        const jugadoresValidos = Array.from({ length: 6 }, (_, i) => ({ 
            id: (i + 1).toString(), 
            nombre: `Jugador ${i + 1}` 
        }));
        mockObtenerJugadores.mockResolvedValue({ disponibles: jugadoresValidos});
        mockObtenerComportamientos.mockResolvedValue({ disponibles: [] });

        render(<ArmarEquipo usuario_id={1} onConfirmar={mockOnConfirmar} onCancelar={mockOnCancelar} />);

        const errorMsg = await screen.findByText("Sin comportamientos para asignar");
        expect(errorMsg).toBeTruthy();
    });

    it("maneja correctamente excepciones asíncronas si las llamadas HTTP fallan", async () => {
        mockObtenerJugadores.mockRejectedValue(new Error("Error 500: Server Down"));
        mockObtenerComportamientos.mockResolvedValue({ disponibles: [] });

        render(<ArmarEquipo usuario_id={1} onConfirmar={mockOnConfirmar} onCancelar={mockOnCancelar} />);

        const errorMsg = await screen.findByText("Error 500: Server Down");
        expect(errorMsg).toBeTruthy();
    });
    
    it("muestra error de validación interactiva si se intenta confirmar sin asignar a todos", async () => {
        const jugadoresValidos = Array.from({ length: 6 }, (_, i) => ({ 
            id: (i + 1).toString(), 
            nombre: `Jugador ${i + 1}` 
        }));
        mockObtenerJugadores.mockResolvedValue({ disponibles: jugadoresValidos });
        mockObtenerComportamientos.mockResolvedValue({ disponibles: [{ id: '101', nombre: 'Comp' }] });

        render(<ArmarEquipo usuario_id={1} onConfirmar={mockOnConfirmar} onCancelar={mockOnCancelar} />);

        await waitFor(() => {
            expect(screen.queryByText("Cargando jugadores y comportamientos...")).toBeNull();
        });

        fireEvent.click(screen.getByRole("button", { name: "Confirmar Equipo" }));

        expect(screen.getByText("Equipo con menos de 6 jugadores con comportamiento asignado")).toBeTruthy();
        expect(mockOnConfirmar).not.toHaveBeenCalled();
    });

    it("muestra error de validación si el usuario selecciona jugadores repetidos", async () => {
        const jugadoresUnicos = Array.from({ length: 6 }, (_, i) => ({ 
            id: (i + 1).toString(), 
            nombre: `Jugador ${i + 1}` 
        }));
        
        mockObtenerJugadores.mockResolvedValue({ disponibles: jugadoresUnicos });
        mockObtenerComportamientos.mockResolvedValue({ disponibles: [{ id: '101', nombre: 'Comp' }] });

        render(<ArmarEquipo usuario_id={1} onConfirmar={mockOnConfirmar} onCancelar={mockOnCancelar} />);

        await waitFor(() => {
            expect(screen.queryByText("Cargando jugadores y comportamientos...")).toBeNull();
        });

        const selects = screen.getAllByRole("combobox");

        for (let i = 0; i < 6; i++) {
             fireEvent.change(selects[i * 2], { target: { value: '1' } });
            fireEvent.change(selects[i * 2 + 1], { target: { value: '101' } }); 
        }

        fireEvent.click(screen.getByRole("button", { name: "Confirmar Equipo" }));

        expect(screen.getByText("Jugadores repetidos")).toBeTruthy();
        expect(mockOnConfirmar).not.toHaveBeenCalled();
    });

    it("formatea los datos como array de objetos y envia al confirmar un equipo válido", async () => {
        mockObtenerJugadores.mockResolvedValue({
            disponibles: [
                { id: '1', nombre: 'J1' }, { id: '2', nombre: 'J2' }, { id: '3', nombre: 'J3' },
                { id: '4', nombre: 'J4' }, { id: '5', nombre: 'J5' }, { id: '6', nombre: 'J6' }
            ]
        });
        mockObtenerComportamientos.mockResolvedValue({ disponibles: [{ id: '101', nombre: 'C1' }] });

        render(<ArmarEquipo usuario_id={1} onConfirmar={mockOnConfirmar} onCancelar={mockOnCancelar} />);

        await waitFor(() => {
            expect(screen.queryByText("Cargando jugadores y comportamientos...")).toBeNull();
        });

        const selects = screen.getAllByRole("combobox");

        for (let i = 0; i < 6; i++) {
            fireEvent.change(selects[i * 2], { target: { value: (i + 1).toString() } });
            fireEvent.change(selects[i * 2 + 1], { target: { value: '101' } });
        }

        fireEvent.click(screen.getByRole("button", { name: "Confirmar Equipo" }));

        expect(mockOnConfirmar).toHaveBeenCalledWith({
            jugadores: [
                { id_jugador: 1, id_comportamiento: 101 },
                { id_jugador: 2, id_comportamiento: 101 },
                { id_jugador: 3, id_comportamiento: 101 },
                { id_jugador: 4, id_comportamiento: 101 },
                { id_jugador: 5, id_comportamiento: 101 },
                { id_jugador: 6, id_comportamiento: 101 }
            ],
            formacion: "ofensiva"
        });
    });

    it("ejecuta onCancelar correctamente al presionar el botón", async () => {
        mockObtenerJugadores.mockResolvedValue({ disponibles: [] });
        mockObtenerComportamientos.mockResolvedValue({ disponibles: [] });

        render(<ArmarEquipo usuario_id={1} onConfirmar={mockOnConfirmar} onCancelar={mockOnCancelar} />);

        await waitFor(() => {
            expect(screen.queryByText("Cargando jugadores y comportamientos...")).toBeNull();
        });

        fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));

        expect(mockOnCancelar).toHaveBeenCalledTimes(1);
    });
});