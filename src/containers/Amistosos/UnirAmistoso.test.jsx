import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import UnirAmistoso from "./UnirAmistoso";
import { createHttpService } from "../../services/HttpService";
import { useNavigate } from "react-router-dom";

//MOCKS
vi.mock("react-router-dom", () => ({
    useNavigate: vi.fn(),
}));
vi.mock("../../services/HttpService", () => ({
    createHttpService: vi.fn(),
}));
vi.mock("../../components/Amistosos/UnirAmistosoComp", () => ({
    default: (props) => (
        <div data-testid="unir-amistoso-mock">
            <span data-testid="usuario-id">{props.usuarioId}</span>
            {props.mensajeError && <span data-testid="error-msg">{props.mensajeError}</span>}
            
            <button 
                data-testid="btn-confirmar" 
                onClick={() => props.onConfirmar({ jugadores: "[(1,101)]", formacion: "Ofensivo" })}
            >
                Confirmar
            </button>
            <button data-testid="btn-cancelar" onClick={props.onCancelar}>
                Cancelar
            </button>
        </div>
    )
}));


describe("Unitests sobre container: UnirAmistoso ", () => {
    const mockUnirseAmistoso = vi.fn();
    const mockNavigate = vi.fn();
    
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.setItem("usuario_id", "42");
        createHttpService.mockReturnValue({
            unirseAmistoso: mockUnirseAmistoso
        });
        useNavigate.mockReturnValue(mockNavigate);
    });

    it("redireccion a lobby en caso de exito al unirse a Amistoso", async () => {

        mockUnirseAmistoso.mockResolvedValue({ id: 99, status: "ok" });
        render(<UnirAmistoso partido_id={99} />);
        fireEvent.click(screen.getByTestId("btn-confirmar"));

        expect(mockUnirseAmistoso).toHaveBeenCalledWith(
            99, 
            "42", 
            { jugadores: "[(1,101)]", formacion: "Ofensivo" }
        );

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/amistosos/lobby/99");
        });
        
        expect(screen.queryByTestId("error-msg")).toBeNull();
    });

    it("redireccion a Menu Amistoso en caso de cancelar", () => {
        render(<UnirAmistoso partido_id={99} />);
        fireEvent.click(screen.getByTestId("btn-cancelar"));

        expect(mockNavigate).toHaveBeenCalledWith("/amistosos");
        expect(mockUnirseAmistoso).not.toHaveBeenCalled();
    });

    it("captura de errores en caso de error al unirse a Amistoso", async () => {
        mockUnirseAmistoso.mockRejectedValue(new Error("El partido ya se encuentra lleno."));
        render(<UnirAmistoso partido_id={99} />);

        fireEvent.click(screen.getByTestId("btn-confirmar"));

        await waitFor(() => {
            expect(screen.getByTestId("error-msg").textContent).toBe("El partido ya se encuentra lleno.");
        });
        expect(mockNavigate).not.toHaveBeenCalled();
    });
});