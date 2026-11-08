import ActivarDt from "./ActivarDT";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom";
import { createHttpService } from "../../services/HttpService";

vi.mock("../../services/HttpService", () => ({
    createHttpService: vi.fn(),
}));

const mockcambiarEstadoDirectorTecnico = vi.fn();
const mockSetActivado = vi.fn();

describe("ActivarDT Container", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        createHttpService.mockReturnValue({
            cambiarEstadoDirectorTecnico: mockcambiarEstadoDirectorTecnico
        });

        mockcambiarEstadoDirectorTecnico.mockResolvedValue({});
    });

    it("invoca correctamente al endpoint y activa el DT", async () => {
        render(
            <ActivarDt
                usuarioId={1}
                partidoId={10}
                activado={false}
                setActivado={mockSetActivado}
            />
        );

        fireEvent.click(screen.getByRole("button", { name: "Activar" }));

        await waitFor(() => {
            expect(mockcambiarEstadoDirectorTecnico).toHaveBeenCalledWith(
                1,
                10
            );

            expect(mockSetActivado).toHaveBeenCalledWith(true);
        });
    });

    it("invoca correctamente al endpoint y desactiva el DT", async () => {
        render(
            <ActivarDt
                usuarioId={1}
                partidoId={10}
                activado={true}
                setActivado={mockSetActivado}
            />
        );

        fireEvent.click(screen.getByRole("button", { name: "Desactivar" }));

        await waitFor(() => {
            expect(mockcambiarEstadoDirectorTecnico).toHaveBeenCalledWith(
                1,
                10
            );

            expect(mockSetActivado).toHaveBeenCalledWith(false);
        });
    });
})