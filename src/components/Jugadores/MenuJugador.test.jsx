import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom";
import MenuPlantelComponenente from "./MenuJugador";

describe("MenuPlantelComponenente", () => {

    it("muestra mensaje de carga", () => {
        render(
            <MenuPlantelComponenente
                jugadores={[]}
                cargando={true}
                crear={vi.fn()}
                volver={vi.fn()}
            />
        );

        expect(
            screen.getByText("Cargando jugadores...")
        ).toBeInTheDocument();
    });


    it("muestra la lista de jugadores", () => {
        const jugadores = [
            { id: 1, nombre: "Ramiro" },
            { id: 2, nombre: "Pedro" }
        ];

        render(
            <MenuPlantelComponenente
                jugadores={jugadores}
                cargando={false}
                crear={vi.fn()}
                volver={vi.fn()}
            />
        );

        expect(screen.getByText("Ramiro")).toBeInTheDocument();
        expect(screen.getByText("Pedro")).toBeInTheDocument();
    });


    it("muestra solo los botones cuando no hay jugadores", () => {
        render(
            <MenuPlantelComponenente
                jugadores={[]}
                cargando={false}
                crear={vi.fn()}
                volver={vi.fn()}
            />
        );

        expect(screen.getByText("Mis Jugadores")).toBeInTheDocument();

        expect(
            screen.getByRole("button", {
                name: "Crear Jugador"
            })
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", {
                name: "Volver"
            })
        ).toBeInTheDocument();
    });


    it("despliega las opciones de un jugador", () => {
        const jugadores = [
            { id: 1, nombre: "Ramiro" },
            { id: 2, nombre: "Pedro" }
        ];

        render(
            <MenuPlantelComponenente
                jugadores={jugadores}
                cargando={false}
                crear={vi.fn()}
                volver={vi.fn()}
            />
        );

        const botonesVer = screen.getAllByRole("button", {
            name: "Ver datos"
        });

        fireEvent.click(botonesVer[0]);

        expect(
            screen.getByRole("button", {
                name: "Eliminar jugador"
            })
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", {
                name: "Ver info de jugador"
            })
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", {
                name: "Ocultar datos"
            })
        ).toBeInTheDocument();
    });


    it("oculta las opciones al volver a hacer click", () => {
        const jugadores = [
            { id: 1, nombre: "Ramiro" }
        ];

        render(
            <MenuPlantelComponenente
                jugadores={jugadores}
                cargando={false}
                crear={vi.fn()}
                volver={vi.fn()}
            />
        );

        fireEvent.click(
            screen.getByRole("button", {
                name: "Ver datos"
            })
        );

        expect(
            screen.getByRole("button", {
                name: "Eliminar jugador"
            })
        ).toBeInTheDocument();

        fireEvent.click(
            screen.getByRole("button", {
                name: "Ocultar datos"
            })
        );

        expect(
            screen.queryByRole("button", {
                name: "Eliminar jugador"
            })
        ).not.toBeInTheDocument();

        expect(
            screen.getByRole("button", {
                name: "Ver datos"
            })
        ).toBeInTheDocument();
    });


    it("ejecuta crear al hacer click en Crear Jugador", () => {
        const crearMock = vi.fn();

        render(
            <MenuPlantelComponenente
                jugadores={[]}
                cargando={false}
                crear={crearMock}
                volver={vi.fn()}
            />
        );

        fireEvent.click(
            screen.getByRole("button", {
                name: "Crear Jugador"
            })
        );

        expect(crearMock).toHaveBeenCalled();
    });


    it("ejecuta volver al hacer click en Volver", () => {
        const volverMock = vi.fn();

        render(
            <MenuPlantelComponenente
                jugadores={[]}
                cargando={false}
                crear={vi.fn()}
                volver={volverMock}
            />
        );

        fireEvent.click(
            screen.getByRole("button", {
                name: "Volver"
            })
        );

        expect(volverMock).toHaveBeenCalled();
    });

});