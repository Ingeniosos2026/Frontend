import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import UnirseLiga from "./UnirLiga";

const { unirseLigaMock, obtenerLigasMock, navigateMock, useParamsMock } = vi.hoisted(() => ({
    unirseLigaMock: vi.fn(),
    navigateMock: vi.fn(),
    useParamsMock: vi.fn(),
    obtenerLigasMock: vi.fn()
}));

vi.mock("react-router-dom", () => ({
    useNavigate: () => navigateMock,
    useParams: useParamsMock
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
                        jugadores: [1, 2, 3, 4, 5, 6]
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
        obtenerLigasMock.mockResolvedValue([{id: 12, privada: false}
]);
    });

    it("llama al servicio y navega al lobby al unirse correctamente", async () => {
        render(<UnirseLiga />);

        fireEvent.click(
            screen.getByRole("button", { name: "Confirmar equipo" })
        );

        await waitFor(() => {
            expect(unirseLigaMock).toHaveBeenCalledWith(
                "12",
                "7",
                { jugadores: [1, 2, 3, 4, 5, 6] }
            );

            expect(navigateMock).toHaveBeenCalledWith("/ligas/lobby/12");
        });
    });

    it("muestra un mensaje si falla al unirse", async () => {
        unirseLigaMock.mockRejectedValue(
            new Error("La liga está completa")
        );

        render(<UnirseLiga />);

        fireEvent.click(
            screen.getByRole("button", { name: "Confirmar equipo" })
        );

        expect(
            await screen.findByRole("alert")
        ).toHaveTextContent("La liga está completa");

        expect(navigateMock).not.toHaveBeenCalled();
    });

    it("envía la contraseña al unirse a una liga privada", async () => {
        obtenerLigasMock.mockResolvedValue([{ id: 12, privada: true }]);
        
        render(<UnirseLiga />);

        const campoContraseña = await screen.findByLabelText(
            "Contraseña de la liga"
        );

        fireEvent.change(campoContraseña, {
            target: { value: "clave123" }
        });

        fireEvent.click(
            screen.getByRole("button", { name: "Confirmar equipo" })
        );

        await waitFor(() => {
            expect(unirseLigaMock).toHaveBeenCalledWith(
                "12",
                "7",
                expect.objectContaining({
                    contraseña: "clave123"
                })
            );
        });
    });

    it("vuelve a la lista de ligas al cancelar", () => {
        render(<UnirseLiga />);

        fireEvent.click(
            screen.getByRole("button", { name: "Cancelar" })
        );

        expect(navigateMock).toHaveBeenCalledWith("/ligas");
    });
});