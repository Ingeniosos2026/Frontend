import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import CambiarComportamiento from './CambiarComportamiento';
import { createHttpService } from '../../services/HttpService';

vi.mock('../../services/HttpService', () => ({
    createHttpService: vi.fn()
}));

describe('Contenedor CambiarComportamiento', () => {
    const mockObtenerComportamientos = vi.fn();
    const mockCambiarComportamiento = vi.fn();

    const propsBase = {
        idJugadorSeleccionado: 7,
        idPartido: 100,
        idUsuario: 10
    };

    beforeEach(() => {
        vi.clearAllMocks();
        createHttpService.mockReturnValue({
            obtenerComportamientos: mockObtenerComportamientos,
            cambiarComportamiento: mockCambiarComportamiento
        });
    });

    it('renderiza el estado de carga y luego muestra los comportamientos obtenidos', async () => {
        mockObtenerComportamientos.mockResolvedValueOnce([
            { id: 1, nombre: 'Ofensivo' },
            { id: 2, nombre: 'Defensivo' }
        ]);

        render(<CambiarComportamiento {...propsBase} />);

        const select = screen.getByRole('combobox');
        
        expect(select).toBeDisabled();

        await waitFor(() => {
            expect(screen.getByText('Ofensivo')).toBeInTheDocument();
            expect(screen.getByText('Defensivo')).toBeInTheDocument();
        });

        expect(select).not.toBeDisabled();
        
        expect(mockObtenerComportamientos).toHaveBeenCalledWith(propsBase.idUsuario);
    });

    it('llama a cambiarComportamiento con los datos formateados al seleccionar una opción', async () => {
        mockObtenerComportamientos.mockResolvedValueOnce([
            { id: 1, nombre: 'Ofensivo' }
        ]);
        mockCambiarComportamiento.mockResolvedValueOnce({ success: true });

        render(<CambiarComportamiento {...propsBase} />);

        const select = screen.getByRole('combobox');
        
        await waitFor(() => expect(select).not.toBeDisabled());

        fireEvent.change(select, { target: { value: '1' } });

        expect(select).toBeDisabled();

        await waitFor(() => {
            expect(mockCambiarComportamiento).toHaveBeenCalledWith(propsBase.idPartido, {
                usuario_id: propsBase.idUsuario,
                jugador_id: propsBase.idJugadorSeleccionado,
                comp_id: 1
            });
        });
    });

    it('no dispara la petición si se fuerza la selección de la opción vacía', async () => {
        mockObtenerComportamientos.mockResolvedValueOnce([]);

        render(<CambiarComportamiento {...propsBase} />);

        const select = screen.getByRole('combobox');
        await waitFor(() => expect(select).not.toBeDisabled());

        fireEvent.change(select, { target: { value: '' } });

        expect(mockCambiarComportamiento).not.toHaveBeenCalled();
    });
});