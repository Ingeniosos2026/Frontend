import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useNavigate, MemoryRouter } from "react-router-dom";
import PagPrincipal from "./MenuPrincipal";

const { navigateMock } = vi.hoisted(() => ({
    navigateMock: vi.fn()
}));

vi.mock("react-router-dom", async () => { 
    const actual = await vi.importActual("react-router-dom"); 
    return { ...actual, useNavigate: () => 
        navigateMock
    }; 
});

it("muestra la pagina principal inicialmente", () => {
    render (<PagPrincipal />);

    expect(
        screen.getByText("Pagina Principal")
    ).toBeTruthy();

    expect(
        screen.getByRole("button", { name: "LIGA" })
    ).toBeTruthy();

    expect(
        screen.getByRole("button", { name: "AMISTOSO" })
    ).toBeTruthy();

    expect(
        screen.getByRole("button", { name: "PLANTEL" })
    ).toBeTruthy();

    expect(
        screen.getByRole("button", { name: "COMPORTAMIENTOS" })
    ).toBeTruthy();
});

it("muestra la interfaz de liga", () => {
    render (<MemoryRouter>
        <PagPrincipal />
    </MemoryRouter>);

    fireEvent.click( screen.getByRole("button", { name: "LIGA" }) );
        expect(navigateMock).toHaveBeenCalledWith("/ligas");
});

it("muestra la interfaz de amistoso", () => {
    render (<MemoryRouter>
        <PagPrincipal />
    </MemoryRouter>);

    fireEvent.click( screen.getByRole("button", { name: "AMISTOSO" }) );
        expect(navigateMock).toHaveBeenCalledWith("/amistosos");
});

it("muestra la interfaz de plantel", () => {
    render (<MemoryRouter>
        <PagPrincipal />
    </MemoryRouter>);

    fireEvent.click( screen.getByRole("button", { name: "PLANTEL" }) );
        expect(navigateMock).toHaveBeenCalledWith("/jugadores");
});

it("muestra la interfaz de comportamientos", () => {
    render (<MemoryRouter>
        <PagPrincipal />
    </MemoryRouter>);

    fireEvent.click( screen.getByRole("button", { name: "COMPORTAMIENTOS" }) );
        expect(navigateMock).toHaveBeenCalledWith("/comportamientos");
})

