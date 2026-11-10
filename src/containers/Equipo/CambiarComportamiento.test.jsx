import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import CambiarComportamiento from './CambiarComportamiento';
import { createHttpService } from '../../services/HttpService';

// Mock del servicio HTTP
vi.mock('../../services/HttpService', () => ({
    createHttpService: vi.fn()
}));

// Mock del componente visual (CambiarComportamientoComp)
vi.mock('../../components/Equipo/CambiarComportamientoComp.jsx', () => ({
    default: (props) => (
        <div data-testid="mock-visual">
            <div data-testid="estado-cargando">{props.cargando.toString()}</div>
            <div data-testid="estado-comportamientos">{props.comportamientos?.length || 0}</div>
            
            <button 
                data-testid="btn-confirmar" 
                onClick={() => props.alConfirmar("1")}
            >
                Confirmar
            </button>
            <button 
                data-testid="btn-confirmar-vacio" 
                onClick={() => props.alConfirmar(null)}
            >
                Confirmar Vacío
            </button>
        </div>
    )
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

    it('renderiza el estado de carga y luego pasa los comportamientos obtenidos al presentador', async () => {
        mockObtenerComportamientos.mockResolvedValueOnce([
            { id: 1, nombre: 'Ofensivo' },
            { id: 2, nombre: 'Defensivo' }
        ]);

        render(<CambiarComportamiento {...propsBase} />);

        expect(screen.getByTestId('estado-cargando')).toHaveTextContent('true');

        await waitFor(() => {
            expect(screen.getByTestId('estado-cargando')).toHaveTextContent('false');
        });

        expect(screen.getByTestId('estado-comportamientos')).toHaveTextContent('2');
        expect(mockObtenerComportamientos).toHaveBeenCalledWith(propsBase.idUsuario);
    });

    it('llama a cambiarComportamiento con los datos formateados al confirmar', async () => {
        mockObtenerComportamientos.mockResolvedValueOnce([
            { id: 1, nombre: 'Ofensivo' }
        ]);
        mockCambiarComportamiento.mockResolvedValueOnce({ success: true });

        render(<CambiarComportamiento {...propsBase} />);

        await waitFor(() => expect(screen.getByTestId('estado-cargando')).toHaveTextContent('false'));

        fireEvent.click(screen.getByTestId('btn-confirmar'));

        expect(screen.getByTestId('estado-cargando')).toHaveTextContent('true');

        await waitFor(() => {
            expect(mockCambiarComportamiento).toHaveBeenCalledWith(propsBase.idPartido, {
                usuario_id: propsBase.idUsuario,
                jugador_id: propsBase.idJugadorSeleccionado,
                comp_id: 1
            });
        });
        expect(screen.getByTestId('estado-cargando')).toHaveTextContent('false');
    });

    it('no dispara la petición si se fuerza la confirmación vacía o sin ID', async () => {
        mockObtenerComportamientos.mockResolvedValueOnce([]);

        render(<CambiarComportamiento {...propsBase} />);

        await waitFor(() => expect(screen.getByTestId('estado-cargando')).toHaveTextContent('false'));

        fireEvent.click(screen.getByTestId('btn-confirmar-vacio'));

        expect(mockCambiarComportamiento).not.toHaveBeenCalled();
    });
});