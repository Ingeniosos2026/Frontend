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

    it("vuelve a la pagina principal al seleccionar volver", async () => {
        render(<Ranking />);

        const buttonVolver = await screen.findByRole("button", { name: "Volver"});

        fireEvent.click(buttonVolver);

        expect(navigateMock).toHaveBeenCalledWith("/main");
    })
});




