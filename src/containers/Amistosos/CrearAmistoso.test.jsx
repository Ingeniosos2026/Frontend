import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import CrearAmistoso from './CrearAmistoso';
import { createHttpService } from '../../services/HttpService.js';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));

vi.mock('../../services/HttpService.js', () => ({
    createHttpService: vi.fn(),
}));

vi.mock('../Equipo/ArmarEquipo', () => ({
    __esModule: true,
    default: ({ onConfirmar }) => (
        <div data-testid="mock-armar-equipo">
            <button 
                onClick={() => onConfirmar({ 
                    jugadores: [[1, 101], [2, 102], [3, 103], [4, 104], [5, 105], [6, 106]],
                    formacion: "C-FORMACION" 
                })}
            >
                Confirmar Equipo
            </button>
        </div>
    )
}));

describe('CrearAmistoso', () => {
    let mockCrearAmistoso;

    beforeEach(() => {
        vi.clearAllMocks();
        
        mockCrearAmistoso = vi.fn();
        createHttpService.mockReturnValue({
            crearAmistoso: mockCrearAmistoso,
        });

        vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('1');
    });

    const avanzarAPaso2 = () => {
        const botonConfirmarEquipo = screen.getByText('Confirmar Equipo');
        fireEvent.click(botonConfirmarEquipo);
    };

    it('renderiza el Paso 1 (ArmarEquipo) inicialmente', () => {
        render(<CrearAmistoso />);
        expect(screen.getByTestId('mock-armar-equipo')).toBeInTheDocument();
    });

    it('avanza al Paso 2 (CrearAmistosoComp) tras confirmar el equipo', () => {
        render(<CrearAmistoso />);
        avanzarAPaso2();

        expect(screen.getByText('Detalles del Amistoso')).toBeInTheDocument();
        expect(screen.getByLabelText(/Duración/i)).toBeInTheDocument();
    });

    it('muestra error de validación si la duración es menor a 1', async () => {
        render(<CrearAmistoso />);
        avanzarAPaso2();

        const inputDuracion = screen.getByLabelText(/Duración/i);
        const botonCrear = screen.getByRole('button', { name: /Crear Amistoso/i });

        fireEvent.change(inputDuracion, { target: { value: '0' } });
        fireEvent.click(botonCrear);

        await waitFor(() => {
            expect(screen.getByText('El mínimo es 1 minuto')).toBeInTheDocument();
        });
    });

    it('envía datos combinados al backend y navega al lobby si todo es válido', async () => {
        mockCrearAmistoso.mockResolvedValue({ id: 99 });

        render(<CrearAmistoso />);
        avanzarAPaso2();

        const inputDuracion = screen.getByLabelText(/Duración/i);
        const botonCrear = screen.getByRole('button', { name: /Crear Amistoso/i });

        fireEvent.change(inputDuracion, { target: { value: '15' } });
        fireEvent.click(botonCrear);

        await waitFor(() => {
            expect(mockCrearAmistoso).toHaveBeenCalledWith('1', {
                duracion: 15,
                jugadores: [[1, 101], [2, 102], [3, 103], [4, 104], [5, 105], [6, 106]],
                formacion: "C-FORMACION"
            });
            expect(mockNavigate).toHaveBeenCalledWith('/amistosos/lobby/99');
        });
    });

    it('muestra un mensaje de error si el servidor falla', async () => {
        mockCrearAmistoso.mockRejectedValue(new Error('Error interno del servidor'));

        render(<CrearAmistoso />);
        avanzarAPaso2();

        const inputDuracion = screen.getByLabelText(/Duración/i);
        const botonCrear = screen.getByRole('button', { name: /Crear Amistoso/i });

        fireEvent.change(inputDuracion, { target: { value: '15' } });
        fireEvent.click(botonCrear);

        await waitFor(() => {
            expect(screen.getByText(/Error: Error interno del servidor/i)).toBeInTheDocument();
            expect(mockNavigate).not.toHaveBeenCalled();
        });
    });

    it('vuelve al Paso 1 al presionar el botón "Volver"', () => {
        render(<CrearAmistoso />);
        avanzarAPaso2();

        expect(screen.getByText('Detalles del Amistoso')).toBeInTheDocument();

        const botonVolver = screen.getByRole('button', { name: /Volver/i });
        fireEvent.click(botonVolver);

        expect(screen.getByTestId('mock-armar-equipo')).toBeInTheDocument();
    });
});