import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import MenuComp from "./MenuComp";
import { createHttpService } from "../../services/HttpService";
import "@testing-library/jest-dom";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

vi.mock("../../services/HttpService", () => ({
    createHttpService: vi.fn(),
}));

const mockObtenerComportamientos = vi.fn();
const mockObtenerComportamientosDt = vi.fn();
const mockAsignarComportamientoDt = vi.fn();

describe("MenuComp Logic Container", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        localStorage.setItem("usuario_id", "123");
        createHttpService.mockReturnValue({
            obtenerComportamientos: mockObtenerComportamientos,
            obtenerComportamientosDt: mockObtenerComportamientosDt,
            asignarComportamientoDt: mockAsignarComportamientoDt
        });
    });

    it("obtiene y muestra los comportamientos en la lista", async () => {
        const comportamientos = [
            { id: 4, nombre: "Caminar", codigo: "def caminar():\n primitivas.correr(arco_propio)\n" },
            { id: 5, nombre: "traicionar", codigo: "def traicionar():\nprimitivas.patear(primitivas.direccionArcoPropio())" },
        ];
        mockObtenerComportamientos.mockResolvedValue(comportamientos);

        render(<MemoryRouter><MenuComp /></MemoryRouter>);

        expect(await screen.findByText("Caminar")).toBeInTheDocument();
        expect(screen.getByText("traicionar")).toBeInTheDocument();
        expect(mockObtenerComportamientos).toHaveBeenCalledWith("123");
    });

    it("maneja error al obtener comportamientos y muestra mensaje de lista vacía", async () => {
        const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
        mockObtenerComportamientos.mockRejectedValue(new Error("Error al obtener comportamientos"));

        render(<MemoryRouter><MenuComp /></MemoryRouter>);

        const mensajes = await screen.findAllByText(/No tienes comportamientos creados en este momento./i);

        expect(mensajes).toHaveLength(2);
        expect(consoleError).toHaveBeenCalledTimes(1);

        consoleError.mockRestore();
    });

    it("navega a /comportamientos/crear al ejecutar la acción Crear Comportamiento", async () => {
        mockObtenerComportamientos.mockResolvedValue([]);
        render(<MemoryRouter><MenuComp /></MemoryRouter>);

        const botonesCrear = await screen.findAllByRole("button", {
            name: /\+ Crear Comportamiento/i
        });

        const btnCrear = botonesCrear[0];
        fireEvent.click(btnCrear);
        expect(mockNavigate).toHaveBeenCalledWith("/comportamientos/crear");
    });

    it("despliega detalle y navega a /comportamientos/editar/:id al ejecutar la acción Editar", async () => {
        const comportamientos = [
            { id: 67, nombre: "Pasar al Rival", codigo: "def Pasar_Rival():\n  primitivas.patear(direccionRival)\n" },
        ];
        mockObtenerComportamientos.mockResolvedValue(comportamientos);
        render(<MemoryRouter><MenuComp /></MemoryRouter>);

        const btnAcordeon = await screen.findByRole("button", { name: /Pasar al Rival/i });
        fireEvent.click(btnAcordeon);
        
        expect(await screen.findByText(/def Pasar_Rival\(\):/i)).toBeInTheDocument();
        expect(await screen.findByText(/primitivas\.patear\(direccionRival\)/i)).toBeInTheDocument();

        const btnEditar = await screen.findByRole("button", { name: /Editar/i });
        fireEvent.click(btnEditar);

        expect(mockNavigate).toHaveBeenCalledWith("/comportamientos/editar/67");
    });

    it("despliega detalle y no permite editar comportamiento default", async () => {
        const comportamientos = [
            { id: 1, nombre: "Defender", codigo:"def comportamiento_defender(primitivas):\n    primitivas.patear(direccionRival)\n" },
        ];
        mockObtenerComportamientos.mockResolvedValue(comportamientos);
        render(<MemoryRouter><MenuComp /></MemoryRouter>);

        const btnAcordeon = await screen.findByRole("button", { name: /Defender/i });
        fireEvent.click(btnAcordeon);

        const btnEditar = screen.queryByRole("button", { name: /Editar/i });
        expect(btnEditar).not.toBeInTheDocument();
    });

    it("navega a /comportamientos/crearDt al ejecutar la acción Crear Comportamiento DT", async () => {
        mockObtenerComportamientos.mockResolvedValue([]);
        render(<MemoryRouter><MenuComp /></MemoryRouter>);

        const btnCrear = await screen.findByRole("button", { name: /\+ Crear Comportamiento DT/i });
        fireEvent.click(btnCrear);

        expect(mockNavigate).toHaveBeenCalledWith("/comportamientos/crearDt");
    });

    it('asigna el comportamiento al director tecnico al seleccionar la opcion "Asignar al DT"', async () => {
        const comportamientos = [
            {
                id: 8,
                nombre: "Cambiar jugador",
                codigo: "def cambiar_jugador():"
            }
        ];
        
        mockObtenerComportamientos.mockResolvedValue([]);
        mockObtenerComportamientosDt.mockResolvedValue(comportamientos);
        mockAsignarComportamientoDt.mockResolvedValue({});

        render(<MemoryRouter><MenuComp /></MemoryRouter>);

        const botonAsignar = await screen.findByRole("button", {
            name: /Asignar al DT/i
        });

        fireEvent.click(botonAsignar);

        expect(mockAsignarComportamientoDt).toHaveBeenCalledWith("123", 8);



    });

    it("navega a /main al presionar Volver", async () => {
        mockObtenerComportamientos.mockResolvedValue([]);
        render(<MemoryRouter><MenuComp /></MemoryRouter>);

        const btnVolver = await screen.findByRole("button", { name: /Volver/i });
        fireEvent.click(btnVolver);
        
        expect(mockNavigate).toHaveBeenCalledWith("/main");
    });
});