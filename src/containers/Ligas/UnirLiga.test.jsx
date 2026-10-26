import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import UnirLiga from "./UnirLiga";

const { unirseLigaMock, obtenerLigasMock, navigateMock, useParamsMock, useLocationMock } = vi.hoisted(() => ({
    unirseLigaMock: vi.fn(),
    navigateMock: vi.fn(),
    useParamsMock: vi.fn(),
    obtenerLigasMock: vi.fn(),
    useLocationMock: vi.fn(),
}));

vi.mock("react-router-dom", () => ({
    useNavigate: () => navigateMock,
    useParams: useParamsMock,
    useLocation: useLocationMock
}));

vi.mock("../../services/HttpService", () => ({
    createHttpService: () => ({
        unirseLiga: unirseLigaMock,
        obtenerLigas: obtenerLigasMock
    })
}));

vi.mock("../../containers/Equipo/ArmarEquipo", () => ({
    default: ({ usuario_id, onConfirmar, onCancelar }) => (
        <div>
            <p>Usuario: {usuario_id}</p>

            <button
                onClick={() =>
                    onConfirmar({
                        jugadores: [[1,1], [2,3], [3,1], [4,1], [5,2], [6,3]],
                        formacion: "ofensiva"
                    })
                }
            >
                Confirmar equipo
            </button>

            <button onClick={onCancelar}>
                Cancelar
            </button>
        </div>
    )
}));

describe("UnirseLiga", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        localStorage.setItem("usuario_id", "7");
        useParamsMock.mockReturnValue({ liga_id: "12" });
        unirseLigaMock.mockResolvedValue({});
        obtenerLigasMock.mockResolvedValue([{id: 12}]);
        useLocationMock.mockReturnValue({state: { esPrivada: false, minimo: 4 }});
    });

    it("llama al servicio y navega al lobby al unirse correctamente", async () => {
        render(<UnirLiga />);

        fireEvent.click(
            screen.getByRole("button", { name: "Confirmar equipo" })
        );

        await waitFor(() => {
            expect(unirseLigaMock).toHaveBeenCalledWith("12","7",{ contraseña: "", formacion: "ofensiva", jugadores: [[1,1], [2,3], [3,1], [4,1], [5,2], [6,3]] });
        });
        expect(navigateMock).toHaveBeenCalledWith("/ligas/lobby/12", {
            state: { 
                esCreador: false, 
                minimo: 4
            }
        });
    });

    it("muestra un mensaje si falla al unirse", async () => {
        unirseLigaMock.mockRejectedValue(
            new Error("La liga está completa")
        );

        render(<UnirLiga />);

        fireEvent.click(
            screen.getByRole("button", { name: "Confirmar equipo" })
        );

        expect(
            await screen.findByRole("alert")
        ).toHaveTextContent("La liga está completa");

        expect(navigateMock).not.toHaveBeenCalled();
    });

    it("envía la contraseña al unirse a una liga privada", async () => {
        obtenerLigasMock.mockResolvedValue([{ id: 12}]);
        useLocationMock.mockReturnValue({state: { esPrivada: true }});
        
        render(<UnirLiga />);

        const campoContraseña = await screen.findByLabelText(
            "Contraseña de la liga"
        );

        fireEvent.change(campoContraseña, {
            target: { value: "clave123" }
        });

        fireEvent.click(
            screen.getByRole("button", { name: "Confirmar equipo" })
        );
        console.log(unirseLigaMock.mock.calls[0]);
        await waitFor(() => {
            expect(unirseLigaMock).toHaveBeenCalledWith(
                "12",
                "7",
                expect.objectContaining({
                    contraseña: "clave123",
                    formacion: "ofensiva",
                    jugadores: [[1,1], [2,3], [3,1], [4,1], [5,2], [6,3]]
                })
            );
        });
    });

    it("vuelve a la lista de ligas al cancelar", () => {
        render(<UnirLiga />);

        fireEvent.click(
            screen.getByRole("button", { name: "Cancelar" })
        );

        expect(navigateMock).toHaveBeenCalledWith("/ligas");
    });
});