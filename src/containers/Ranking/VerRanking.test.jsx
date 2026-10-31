import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import '@testing-library/jest-dom/vitest';
import Ranking from "./VerRanking";

const { navigateMock, obtenerRankingMock } = vi.hoisted(() => ({
    navigateMock: vi.fn(),
    obtenerRankingMock: vi.fn()
}));

vi.mock("react-router-dom", () => ({
    useNavigate: () => navigateMock
}));

vi.mock("../../services/HttpService", () => ({
    createHttpService: () => ({
        obtenerRanking: obtenerRankingMock
    })
}));

vi.mock("../../components/Ranking/VerRankingComp", () =>({
    default: ({ ranking, mensajeError, onVerPerfil, iD }) => (
        <div>
            {mensajeError && <p>{mensajeError}</p>}

            <table>
                <tbody>
                    {ranking.map((club, index) => (
                        
                        <tr key={club.usuario_id}>
                            <td>{index + 1}</td>
                            <td>{String(club.usuario_id) === String(iD) ? 'Tú' : club.nombre}</td>
                            <td>{club.puntos_ranking}</td>
                            <td>
                                <button onClick={() => onVerPerfil(club.usuario_id)}>
                                    Ver Perfil
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}));

describe ("Ver Ranking Container", () => {
    
    beforeEach(() => {
        vi.clearAllMocks();

        localStorage.clear();
        localStorage.setItem("usuario_id", "123");
    });

    it("invoca al servicio para obtener el ranking", async () => {
    obtenerRankingMock.mockResolvedValue([]);

    render(<Ranking />);

    await waitFor(() => {expect(obtenerRankingMock).toHaveBeenCalledTimes(1)});
    });

    it("muestra los clubes en la tabla", async () => {
        obtenerRankingMock.mockResolvedValue([
            { usuario_id: 1, nombre: 'Club A', puntos_ranking: 1500 },
            { usuario_id: 2, nombre: 'Club B', puntos_ranking: 1200 },
            { usuario_id: 3, nombre: 'Club C', puntos_ranking: 900 }
        ]);

        render(<Ranking />);

        expect(await screen.findByText('Club A')).toBeInTheDocument();
        expect(screen.getByText('Club B')).toBeInTheDocument();
        expect(screen.getByText('Club C')).toBeInTheDocument();
    });

    it("se resalta en la tabla el usuario que se encuentra viendo el ranking", async () => {
        obtenerRankingMock.mockResolvedValue([
            { usuario_id: 123, nombre: 'Club A', puntos_ranking: 1500 }
        ]);

        render(<Ranking />);

        expect(await screen.findByText('Tú')).toBeInTheDocument();
    });

    it("navega al perfil al seleccionar ver perfil", async () => {
        obtenerRankingMock.mockResolvedValue([
            { usuario_id: 1, nombre: 'Club A', puntos_ranking: 1500 }
        ]);
        
        render(<Ranking />);

        const buttonPerfil = await screen.findByRole("button", { name: "Ver Perfil"});

        fireEvent.click(buttonPerfil);

        expect(navigateMock).toHaveBeenCalledWith("/perfil/1");
    });
});




