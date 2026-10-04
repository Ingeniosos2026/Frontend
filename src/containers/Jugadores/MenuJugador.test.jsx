import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom";
import MenuJugador from "./MenuJugador";

const mockNavigate = vi.fn();
const mockObtenerJugadores = vi.fn();

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");

    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

vi.mock("../../services/HttpService", () => ({
    createHttpService: () => ({
        obtenerJugadores: mockObtenerJugadores,
    }),
}));

vi.mock("../../components/Jugadores/MenuJugador", () => ({
    default: ({ jugadores, cargando, crear, volver }) => (
        <div>
            {cargando && (
                <p>Cargando jugadores...</p>
            )}

            {!cargando &&
                jugadores.map((jugador) => (
                    <p key={jugador.id}>
                        {jugador.nombre}
                    </p>
                ))}

            <button onClick={crear}>
                Crear Jugador
            </button>

            <button onClick={volver}>
                Volver
            </button>
        </div>
    ),
}));

describe("MenuJugador container", () => {

    beforeEach(() => {
        vi.clearAllMocks();

        localStorage.clear();
        localStorage.setItem("usuario_id", "123");
    });


    it("muestra el estado de carga", () => {
        mockObtenerJugadores.mockReturnValue(
            new Promise(() => {})
        );

        render(<MenuJugador />);

        expect(
            screen.getByText("Cargando jugadores...")
        ).toBeInTheDocument();
    });


    it("obtiene los jugadores del usuario", async () => {
        const jugadores = [
            { id: 1, nombre: "Ramiro" },
            { id: 2, nombre: "Pedro" }
        ];

        mockObtenerJugadores.mockResolvedValue(jugadores);

        render(<MenuJugador />);

        await waitFor(() => {
            expect(mockObtenerJugadores)
                .toHaveBeenCalledWith("123");
        });
    });


    it("pasa los jugadores obtenidos al componente", async () => {
        const jugadores = [
            { id: 1, nombre: "Ramiro" },
            { id: 2, nombre: "Pedro" }
        ];

        mockObtenerJugadores.mockResolvedValue(jugadores);

        render(<MenuJugador />);

        expect(
            await screen.findByText("Ramiro")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Pedro")
        ).toBeInTheDocument();
    });


    it("usa un array vacío si el servicio devuelve null", async () => {
        mockObtenerJugadores.mockResolvedValue(null);

        render(<MenuJugador />);

        await waitFor(() => {
            expect(mockObtenerJugadores)
                .toHaveBeenCalledWith("123");
        });

        expect(
            screen.queryByText("Ramiro")
        ).not.toBeInTheDocument();
    });


    it("navega a crear jugador", async () => {
        mockObtenerJugadores.mockResolvedValue([]);

        render(<MenuJugador />);

        const botonCrear = await screen.findByRole("button", {
            name: "Crear Jugador"
        });

        fireEvent.click(botonCrear);

        expect(mockNavigate)
            .toHaveBeenCalledWith("/jugadores/crear");
    });


    it("navega a main al volver", async () => {
        mockObtenerJugadores.mockResolvedValue([]);

        render(<MenuJugador />);

        const botonVolver = await screen.findByRole("button", {
            name: "Volver"
        });

        fireEvent.click(botonVolver);

        expect(mockNavigate)
            .toHaveBeenCalledWith("/main");
    });


    it("maneja un error al obtener los jugadores", async () => {
        const error = new Error("Error al obtener jugadores");

        const consoleError = vi
            .spyOn(console, "error")
            .mockImplementation(() => {});

        mockObtenerJugadores.mockRejectedValue(error);

        render(<MenuJugador />);

        await waitFor(() => {
            expect(consoleError)
                .toHaveBeenCalledWith(error);
        });

        consoleError.mockRestore();
    });

});