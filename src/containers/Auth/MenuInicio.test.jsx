import { it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import MenuInicio from "./MenuInicio";
import { MemoryRouter } from "react-router-dom";

const { navigateMock } = vi.hoisted(() => ({
    navigateMock: vi.fn()
}));

vi.mock("react-router-dom", async () => { 
    const actual = await vi.importActual("react-router-dom"); 
    return { ...actual, useNavigate: () => 
        navigateMock
    }; 
});

it("muestra el menú inicialmente", () => {
    render(<MenuInicio />);

    expect(
        screen.getByText("Bienvenido")
    ).toBeTruthy();

    expect(
        screen.getByRole("button", { name: "Registrarse" })
    ).toBeTruthy();

    expect(
        screen.getByRole("button", { name: "Iniciar Sesion" })
    ).toBeTruthy()
});

it("abre el formulario de registro", () => {
    render(<MemoryRouter>
        <MenuInicio />
    </MemoryRouter>);

    fireEvent.click(
        screen.getByRole("button", { name: "Registrarse" })
    );

    fireEvent.click( screen.getByRole("button", { name: "Registrarse" }) );
    expect(navigateMock).toHaveBeenCalledWith("/auth/registro");
});

it("abre el formulario de login", () => {
    render(<MemoryRouter>
        <MenuInicio />
    </MemoryRouter>);

    fireEvent.click(
        screen.getByRole("button", { name: "Iniciar Sesion" })
    );

    fireEvent.click( screen.getByRole("button", { name: "Iniciar Sesion" }) );
    expect(navigateMock).toHaveBeenCalledWith("/auth/login");
});