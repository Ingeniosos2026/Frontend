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

describe("MenuComp Logic Container", () => {
    const mockObtenerComportamientos = vi.fn();
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        localStorage.setItem("usuario_id", "123");
        createHttpService.mockReturnValue({
            obtenerComportamientos: mockObtenerComportamientos,
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

            expect(await screen.findByText(/No tienes comportamientos creados en este momento./i)).toBeInTheDocument();
            expect(consoleError).toHaveBeenCalled();

            consoleError.mockRestore();
        });

    it("navega a /comportamientos/crear al ejecutar la acción Crear Comportamiento", async () => {
        mockObtenerComportamientos.mockResolvedValue([]);
        render(<MemoryRouter><MenuComp /></MemoryRouter>);

        const btnCrear = await screen.findByRole("button", { name: /\+ Crear Comportamiento/i });
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

        const btnEditar = await screen.findByRole("button", { name: /Editar/i });
        fireEvent.click(btnEditar);

        expect(mockNavigate).toHaveBeenCalledWith("/comportamientos/editar/67");
    });

    it("navega a /main al presionar Volver", async () => {
        mockObtenerComportamientos.mockResolvedValue([]);
        render(<MemoryRouter><MenuComp /></MemoryRouter>);

        const btnVolver = await screen.findByRole("button", { name: /Volver/i });
        fireEvent.click(btnVolver);
        
        expect(mockNavigate).toHaveBeenCalledWith("/main");
    });
});