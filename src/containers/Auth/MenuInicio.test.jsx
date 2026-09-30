import { it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import MenuInicio from "./MenuInicio";

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
    render(<MenuInicio />);

    fireEvent.click(
        screen.getByRole("button", { name: "Registrarse" })
    );

    expect(
        screen.queryByText("Bienvenido")
    ).toBeNull();
});

it("abre el formulario de login", () => {
    render(<MenuInicio />);

    fireEvent.click(
        screen.getByRole("button", { name: "Iniciar Sesion" })
    );

    expect(
        screen.queryByText("Bienvenido")
    ).toBeNull();
});