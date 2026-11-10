import { it, expect, vi, describe, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom';
import MenuLiga from "./MenuLiga";
import { createHttpService } from "../../services/HttpService";
import { useNavigate } from 'react-router-dom';

// Mocks
const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
    useNavigate: vi.fn(), 
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
        useNavigate.mockReturnValue(mockNavigate);
    });

    it("muestra estado de carga e inyecta solo ligas disponibles al resolver la API", async () => {
        mockObtenerLigas.mockResolvedValue([{
                        id: 1, 
            nombre: 'Liga Profesional', 
            max_jugadores: 30, 
            participantes: 30,
            privada: false,
            min_jugadores: 4
        }]);

        render(<MenuLiga />);
        
        expect(await screen.findByText('Liga Profesional')).toBeInTheDocument();
        
        
        expect(screen.queryByText("Cargando ligas...")).toBeNull();
    });

    it("maneja correctamente el error si la llamada HTTP falla", async () => {
        mockObtenerLigas.mockRejectedValue(new Error("Error interno del servidor"));

        render(<MenuLiga />);

        
        const errorMsg = await screen.findByText("Error interno del servidor");
        expect(errorMsg).toBeInTheDocument();
    });

    it("navega a /ligas/crear al ejecutar la acción CrearLiga", async () => {
        mockObtenerLigas.mockResolvedValue([]);
        render(<MenuLiga />);

        
        const btnCrear = await screen.findByRole('button', { name: /\+ Crear Liga/i });

        fireEvent.click(btnCrear);

        expect(mockNavigate).toHaveBeenCalledWith("/ligas/crear");
    });

    it("navega a /main al ejecutar la acción Volver", async () => {
        mockObtenerLigas.mockResolvedValue([]);
        render(<MenuLiga />);

        const btnVolver = await screen.findByRole('button', { name: /Volver/i });
        fireEvent.click(btnVolver);

        expect(mockNavigate).toHaveBeenCalledWith("/main");
    });
});