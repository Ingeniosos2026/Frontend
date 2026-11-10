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
            { id: 1, club: 'Club A', puntos: 1500 },
            { id: 2, club: 'Club B', puntos: 1200 },
            { id: 3, club: 'Club C', puntos: 900 }
        ]);

        render(<Ranking />);

        expect(await screen.findByText('Club A')).toBeInTheDocument();
        expect(screen.getByText('Club B')).toBeInTheDocument();
        expect(screen.getByText('Club C')).toBeInTheDocument();
    });

    it("se resalta en la tabla el usuario que se encuentra viendo el ranking", async () => {
        obtenerRankingMock.mockResolvedValue([
            { id: 123, club: 'Club A', puntos: 1500 }
        ]);

        render(<Ranking />);

        expect(await screen.findByText('Tú')).toBeInTheDocument();
    });
});




