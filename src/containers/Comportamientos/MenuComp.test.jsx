import { render, screen, waitFor, fireEvent } from "@testing-library/react";
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

vi.mock("../../components/Comportamientos/MenuComp", () => ({
    default: (props) => (
        <div data-testid="mock-mis-comportamientos">
            <span data-testid="cargando">{props.cargando.toString()}</span>
            <span data-testid="comportamientos-count">{props.comportamientos?.length || 0}</span>
            <button data-testid="btn-volver" onClick={props.volver}>Volver</button>
        </div>
    ),
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

    it("muestra el estado de carga y luego inyecta los comportamientos obtenidos", async () => {
        const comportamientos = [
            { id: 1, nombre: "Caminar" },
            { id: 2, nombre: "Correr" },
        ];
        mockObtenerComportamientos.mockResolvedValue(comportamientos);

        render(<MemoryRouter><MenuComp /></MemoryRouter>);
        expect(screen.getByTestId("cargando").textContent).toBe("true");

        await waitFor(() => {
            expect(screen.getByTestId("cargando").textContent).toBe("false");
        });

        expect(screen.getByTestId("comportamientos-count").textContent).toBe("2");
        expect(mockObtenerComportamientos).toHaveBeenCalledWith("123");
    });

    it("maneja un error al obtener los comportamientos", async () => {
        const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
        
        mockObtenerComportamientos.mockRejectedValue(new Error("Error al obtener comportamientos"));

        render(<MemoryRouter><MenuComp /></MemoryRouter>);

        await waitFor(() => {
            expect(screen.getByTestId("cargando").textContent).toBe("false");
        });

        expect(consoleError).toHaveBeenCalled();
        expect(screen.getByTestId("comportamientos-count").textContent).toBe("0");

        consoleError.mockRestore();
    });

    it("navega a /main al presionar Volver", async () => {
        mockObtenerComportamientos.mockResolvedValue([]);
        
        render(<MemoryRouter><MenuComp /></MemoryRouter>);

        await waitFor(() => {
            expect(screen.getByTestId("cargando").textContent).toBe("false");
        });

        fireEvent.click(screen.getByTestId("btn-volver"));
        
        expect(mockNavigate).toHaveBeenCalledWith("/main");
    });
});