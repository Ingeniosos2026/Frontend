import { it, expect, vi, describe, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom/vitest';
import { MemoryRouter, Routes, Route } from "react-router-dom";
import CambiarAlineacion from "./CambiarAlineacion";
import { createHttpService } from "../../services/HttpService";

vi.mock("../../services/HttpService", () => ({
    createHttpService: vi.fn(),
}));

const { navigateMock } = vi.hoisted(() => ({
    navigateMock: vi.fn()
}));

vi.mock("react-router-dom", async () => { 
    const actual = await vi.importActual("react-router-dom"); 
    return { 
        ...actual, 
        useNavigate: () => navigateMock
    }; 
});

describe("CambiarAlineacion Container", () => {
    const mockobtenerEquipoLiga = vi.fn();
    const mockobtenerComportamientos = vi.fn();
    const mockactualizarEquipoLiga = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        createHttpService.mockReturnValue({
            obtenerEquipoLiga: mockobtenerEquipoLiga,
            obtenerComportamientos: mockobtenerComportamientos,
            actualizarEquipoLiga: mockactualizarEquipoLiga
        });
        localStorage.setItem("usuario_id", "2");
        localStorage.setItem("equipo_id", "10");
    });

    it("muestra los titulares, comportamientos, formaciones y permite desplegar la lista de suplentes", async () => {
        mockobtenerEquipoLiga.mockResolvedValue({
            id_equipo: 8,
            formacion: 'ofensiva',
            jugadores: [
                {
                    id: 1,
                    nombre: 'Messi',
                    estado: 'titular',
                    comportamiento: {
                        id: 2,
                        nombre: 'Atacar'
                    }
                },
                {
                    id: 2,
                    nombre: 'Di María',
                    estado: 'titular',
                    comportamiento: {
                        id: 1,
                        nombre: 'Defender'
                    }
                },
                {
                    id: 3,
                    nombre: 'Lautaro',
                    estado: 'suplente',
                    comportamiento: {
                        id: 2,
                        nombre: 'Atacar'
                    }
                }
            ]
        });
        mockobtenerComportamientos.mockResolvedValue([
            { id: 1, nombre: 'Atacar' },
            { id: 2, nombre: 'Defender' }
        ]);

        render(<MemoryRouter><CambiarAlineacion /></MemoryRouter>);

        expect(await screen.findByText('Messi')).toBeInTheDocument();
        expect(screen.getByText('Di María')).toBeInTheDocument();
        expect(screen.getAllByText('Atacar')).toHaveLength(2);
        expect(screen.getAllByText('Defender')).toHaveLength(2);
        expect(screen.getByText('⚔️ Ofensivo')).toBeInTheDocument();
        expect(screen.getByText('🛡️ Defensivo')).toBeInTheDocument();
        expect(screen.getByText('🔄 C-formación')).toBeInTheDocument();
        expect(screen.getByText('🧱 D-formación')).toBeInTheDocument();

        expect(screen.getAllByText('Lautaro')).toHaveLength(2);
    });

    it("navega al lobby de la liga si los cambios se aplican con exito", async () => {
        render(
            <MemoryRouter initialEntries={["/alineacion/7"]}>
                <Routes>
                    <Route
                        path="/alineacion/:liga_id"
                        element={<CambiarAlineacion />}
                    />
                </Routes>
            </MemoryRouter>
        );
        
        await waitFor(() => {
            expect(mockobtenerEquipoLiga).toHaveBeenCalledWith("7","10");
        });

        fireEvent.click(
            screen.getByRole("button", { name: "Confirmar Alineacion" })
        )

        await waitFor(() => {
            expect(mockactualizarEquipoLiga).toHaveBeenCalled();
            expect(navigateMock).toHaveBeenCalledWith("/ligas/en_curso/7");
        });
    });

    it("cambia al titular por el suplente seleccionado", async () => {
        mockobtenerEquipoLiga.mockResolvedValue({
            id_equipo: 10,
            formacion: "ofensiva",
            jugadores: [
                {
                    id: 1,
                    nombre: "Messi",
                    estado: "titular",
                    comportamiento: { id: 2, nombre: "Atacar" }
                },
                {
                    id: 2,
                    nombre: "Di María",
                    estado: "titular",
                    comportamiento: { id: 1, nombre: "Defender" }
                },
                {
                    id: 3,
                    nombre: "Lautaro",
                    estado: "suplente",
                    comportamiento: { id: 2, nombre: "Atacar" }
                }
            ]
        });

        render(
            <MemoryRouter initialEntries={["/alineacion/7"]}>
                <Routes>
                    <Route
                        path="/alineacion/:liga_id"
                        element={<CambiarAlineacion />}
                    />
                </Routes>
            </MemoryRouter>
        );

        await screen.findByText("Messi");

        fireEvent.change(
            screen.getByRole("combobox", { name: /reemplazar a messi/i }),
            { target: { value: "3" } }
        );

        await waitFor(() => {
            const nombresTitulares = screen.getAllByTestId("nombre-titular");
            expect(nombresTitulares[0]).toHaveTextContent("Lautaro");
            expect(nombresTitulares[1]).toHaveTextContent("Di María");
        });
    });

    it("muestra un mensaje de error si falla al guardar la alineacion", async () => {
        mockobtenerEquipoLiga.mockResolvedValue({
            id_equipo: 10,
            formacion: "ofensiva",
            jugadores: [
                {
                    id: 1,
                    nombre: "Messi",
                    estado: "titular",
                    comportamiento: { id: 2, nombre: "Atacar" }
                },
                {
                    id: 2,
                    nombre: "Di María",
                    estado: "titular",
                    comportamiento: { id: 1, nombre: "Defender" }
                },
                {
                    id: 3,
                    nombre: "Lautaro",
                    estado: "suplente",
                    comportamiento: { id: 2, nombre: "Atacar" }
                }
            ]
        });

        mockactualizarEquipoLiga.mockRejectedValue(
            new Error("No se pudo actualizar la alineación")
        );

        render(
            <MemoryRouter initialEntries={["/alineacion/7"]}>
                <Routes>
                    <Route
                        path="/alineacion/:liga_id"
                        element={<CambiarAlineacion />}
                    />
                </Routes>
            </MemoryRouter>
        );

        await screen.findByText("Messi");

        fireEvent.click(
            screen.getByRole("button", { name: /confirmar alineacion/i })
        );

        expect(
            await screen.findByText("No se pudo actualizar la alineación")
        ).toBeInTheDocument();

        expect(navigateMock).not.toHaveBeenCalled();
    });
});
