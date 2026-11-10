import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useNavigate, MemoryRouter } from "react-router-dom";
import PagPrincipal from "./MenuPrincipal";

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

vi.mock("react-slick", () => {
    return {
        default: ({ children }) => <div data-testid="mock-slider">{children}</div>
    };
});

describe("MenuPrincipal", () => {
    
    beforeEach(() => {
        navigateMock.mockClear();
    });

    it("muestra la pagina principal inicialmente con todas las opciones", () => {
        render (
            <MemoryRouter>
                <PagPrincipal />
            </MemoryRouter>
        );

        const titulosLiga = screen.getAllByText("LIGA");
        expect(titulosLiga.length).toBeGreaterThan(0);

        const titulosAmistoso = screen.getAllByText("AMISTOSO");
        expect(titulosAmistoso.length).toBeGreaterThan(0);

        const titulosPlantel = screen.getAllByText("PLANTEL");
        expect(titulosPlantel.length).toBeGreaterThan(0);

        const titulosComportamientos = screen.getAllByText("COMPORTAMIENTOS");
        expect(titulosComportamientos.length).toBeGreaterThan(0);

        const titulosRanking = screen.getAllByText("RANKING GLOBAL");
        expect(titulosRanking.length).toBeGreaterThan(0);
    });

    it("muestra la interfaz de liga al hacer clic", () => {
        render (
            <MemoryRouter>
                <PagPrincipal />
            </MemoryRouter>
        );

        fireEvent.click(screen.getAllByText("LIGA")[0]);
        expect(navigateMock).toHaveBeenCalledWith("/ligas");
    });

    it("muestra la interfaz de amistoso al hacer clic", () => {
        render (
            <MemoryRouter>
                <PagPrincipal />
            </MemoryRouter>
        );

        fireEvent.click(screen.getAllByText("AMISTOSO")[0]);
        expect(navigateMock).toHaveBeenCalledWith("/amistosos");
    });

    it("muestra la interfaz de plantel al hacer clic", () => {
        render (
            <MemoryRouter>
                <PagPrincipal />
            </MemoryRouter>
        );

        fireEvent.click(screen.getAllByText("PLANTEL")[0]);
        expect(navigateMock).toHaveBeenCalledWith("/jugadores");
    });

    it("muestra la interfaz de comportamientos al hacer clic", () => {
        render (
            <MemoryRouter>
                <PagPrincipal />
            </MemoryRouter>
        );

        fireEvent.click(screen.getAllByText("COMPORTAMIENTOS")[0]);
        expect(navigateMock).toHaveBeenCalledWith("/comportamientos");
    });

    it("muestra el ranking de clubes al hacer clic", () => {
        render (
            <MemoryRouter>
                <PagPrincipal />
            </MemoryRouter>
        );

        fireEvent.click(screen.getAllByText("RANKING GLOBAL")[0]);
        expect(navigateMock).toHaveBeenCalledWith("/ranking");
    });
});