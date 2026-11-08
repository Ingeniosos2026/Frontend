import ActivarDt from "./ActivarDT";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom";
import { createHttpService } from "../../services/HttpService";

vi.mock("../../services/HttpService", () => ({
    createHttpService: vi.fn(),
}));

const mockActivarDirectorTecnico = vi.fn();
const mockAlternarDirectorTecnico = vi.fn();

describe("ActivarDT Container", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        createHttpService.mockReturnValue({
            activarDirectorTecnico: mockActivarDirectorTecnico
        });

        mockActivarDirectorTecnico.mockResolvedValue({});
    });

    it("invoca correctamente al endpoint y activa el DT", async () => {
        render(
            <ActivarDt
                usuarioId={1}
                partidoId={10}
                activado={false}
                alternarDirectorTecnico={mockAlternarDirectorTecnico}
            />
        );

        fireEvent.click(screen.getByRole("button", { name: "Activar" }));

        await waitFor(() => {
            expect(mockActivarDirectorTecnico).toHaveBeenCalledWith(
                1,
                10,
                true
            );

            expect(mockAlternarDirectorTecnico).toHaveBeenCalledWith(true);
        });
    });

    it("invoca correctamente al endpoint y desactiva el DT", async () => {
        render(
            <ActivarDt
                usuarioId={1}
                partidoId={10}
                activado={true}
                alternarDirectorTecnico={mockAlternarDirectorTecnico}
            />
        );

        fireEvent.click(screen.getByRole("button", { name: "Desactivar" }));

        await waitFor(() => {
            expect(mockActivarDirectorTecnico).toHaveBeenCalledWith(
                1,
                10,
                false
            );

            expect(mockAlternarDirectorTecnico).toHaveBeenCalledWith(false);
        });
    });
})