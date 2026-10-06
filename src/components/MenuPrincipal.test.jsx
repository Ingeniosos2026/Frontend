import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useNavigate, MemoryRouter } from "react-router-dom";
import PagPrincipal from "./MenuPrincipal";

// 1. Mock de react-router-dom
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

        // Verificamos los títulos principales que se ven dentro de las secciones del carrusel[cite: 12]
        // Se utiliza getAllByText ya que el texto aparece dos veces en cada Carousel.Item (en h5 y en la etiqueta superior si estuviera visible)
        const titulosLiga = screen.getAllByText("LIGA");
        expect(titulosLiga.length).toBeGreaterThan(0);

        const titulosAmistoso = screen.getAllByText("AMISTOSO");
        expect(titulosAmistoso.length).toBeGreaterThan(0);

        const titulosPlantel = screen.getAllByText("PLANTEL");
        expect(titulosPlantel.length).toBeGreaterThan(0);

        const titulosComportamientos = screen.getAllByText("COMPORTAMIENTOS");
        expect(titulosComportamientos.length).toBeGreaterThan(0);
    });

    it("muestra la interfaz de liga al hacer clic", () => {
        render (
            <MemoryRouter>
                <PagPrincipal />
            </MemoryRouter>
        );

        // Como el onClick está en un div que contiene el texto, hacemos clic en el primer elemento de texto encontrado[cite: 12]
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
});