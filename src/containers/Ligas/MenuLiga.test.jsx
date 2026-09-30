import { it, expect, vi, describe, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import MenuLigaLogic from "./MenuLiga";
import { createHttpService } from "../../services/HttpService";

// Mocks
const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
    useNavigate: () => mockNavigate,
}));

vi.mock("../../services/HttpService", () => ({
    createHttpService: vi.fn(),
}));

//Escenarios de prueba: 
// (Inyectar Lista de Ligas, errores HTTP, navegacion correcta a CrearLiga y volver)
describe("MenuLigaLogic", () => {
    const mockObtenerLigas = vi.fn();

    //Limpieza antes de cada prueba
    beforeEach(() => {
        vi.clearAllMocks();
        createHttpService.mockReturnValue({
            obtenerLigas: mockObtenerLigas
        });
    });

    it("muestra estado de carga e inyecta solo ligas disponibles al resolver la API", async () => {
        mockObtenerLigas.mockResolvedValue({
            disponibles: [{ nombre: "Liga_Profesional", max_jugadores: 30, participantes: 30 }]
        });

        render(<MenuLigaLogic usuario_id={1} />);

        
        expect(screen.getByText("Cargando ligas...")).toBeTruthy();

        
        const liga = await screen.findByText("Liga_Profesional");
        expect(liga).toBeTruthy();
        
        
        expect(screen.queryByText("Cargando ligas...")).toBeNull();
    });

    it("maneja correctamente el error si la llamada HTTP falla", async () => {
        mockObtenerLigas.mockRejectedValue(new Error("Error interno del servidor"));

        render(<MenuLigaLogic usuario_id={1} />);

        
        const errorMsg = await screen.findByText("Error interno del servidor");
        expect(errorMsg).toBeTruthy();
    });

    it("navega a /ligas/crear al ejecutar la acción CrearLiga", async () => {
        mockObtenerLigas.mockResolvedValue({ disponibles: [], misLigas: [] });
        render(<MenuLigaLogic usuario_id={1} />);

        
        await waitFor(() => {
            expect(screen.queryByText("Cargando ligas...")).toBeNull();
        });

        // Una vez que el componente está listo, buscamos el botón y hacemos clic
        fireEvent.click(screen.getByRole("button", { name: "Crear Liga" }));

        expect(mockNavigate).toHaveBeenCalledWith("/ligas/crear");
    });

    it("navega a /main al ejecutar la acción Volver", async () => {
        mockObtenerLigas.mockResolvedValue({ disponibles: [], misLigas: [] });
        render(<MenuLigaLogic usuario_id={1} />);

        
        await waitFor(() => {
            expect(screen.queryByText("Cargando ligas...")).toBeNull();
        });

        fireEvent.click(screen.getByRole("button", { name: "Volver" }));

        expect(mockNavigate).toHaveBeenCalledWith("/main");
    });
});