import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";

import MenuComp from "./MenuComp";
import { createHttpService } from "../../services/HttpService";

const mockNavigate = vi.fn();
const mockObtenerComportamientos = vi.fn();

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");

    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

vi.mock("../../services/HttpService", () => ({
    createHttpService: () => ({
        obtenerComportamientos: mockObtenerComportamientos,
    }),
}));

vi.mock("../../components/MisComportamientos", () => ({
    default: ({ comportamientos, cargando, volver }) => (
        <div>
            {cargando && <p>Cargando comportamientos...</p>}

            {!cargando &&
                comportamientos.map((comp) => (
                    <p key={comp.id}>{comp.nombre}</p>
                ))}

            <button onClick={volver}>Volver</button>
        </div>
    ),
}));

describe("MenuComp", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        localStorage.clear();
        localStorage.setItem("usuario_id", "123");
    });

    it("muestra el estado de carga inicialmente", () => {
        mockObtenerComportamientos.mockReturnValue(
            new Promise(() => {})
        );

        render(
            <MemoryRouter>
                <MenuComp />
            </MemoryRouter>
        );

        expect(
            screen.getByText("Cargando comportamientos...")
        ).toBeInTheDocument();
    });

    it("obtiene y muestra los comportamientos", async () => {
        const comportamientos = [
            {
                id: 1,
                nombre: "Caminar",
            },
            {
                id: 2,
                nombre: "Correr",
            },
        ];

        mockObtenerComportamientos.mockResolvedValue(comportamientos);

        render(
            <MemoryRouter>
                <MenuComp />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(mockObtenerComportamientos).toHaveBeenCalledWith("123");
        });

        expect(screen.getByText("Caminar")).toBeInTheDocument();
        expect(screen.getByText("Correr")).toBeInTheDocument();
    });

    it("navega a /main al presionar Volver", async () => {
        const user = userEvent.setup();

        mockObtenerComportamientos.mockResolvedValue([]);

        render(
            <MemoryRouter>
                <MenuComp />
            </MemoryRouter>
        );

        const botonVolver = await screen.findByRole("button", {
            name: "Volver",
        });

        await user.click(botonVolver);

        expect(mockNavigate).toHaveBeenCalledWith("/main");
    });

    it("maneja un error al obtener los comportamientos", async () => {
        const consoleError = vi
            .spyOn(console, "error")
            .mockImplementation(() => {});

        const error = new Error("Error al obtener comportamientos");

        mockObtenerComportamientos.mockRejectedValue(error);

        render(
            <MemoryRouter>
                <MenuComp />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(consoleError).toHaveBeenCalledWith(error);
        });

        expect(
            screen.queryByText("Cargando comportamientos...")
        ).not.toBeInTheDocument();

        consoleError.mockRestore();
    });
});
