import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import CrearAmistoso from './CrearAmistoso';
import { createHttpService } from '../../services/HttpService.js';
import { MemoryRouter } from 'react-router-dom';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

vi.mock('../../services/HttpService.js', () => ({
    createHttpService: vi.fn(),
}));

vi.mock('../Equipo/ArmarEquipo', () => ({
    __esModule: true,
    default: ({ onConfirmar, onCancelar }) => (
        <div data-testid="mock-armar-equipo">
            <button 
                data-testid="btn-confirmar-equipo"
                onClick={() => onConfirmar({ 
                    jugadores: [
                        { id_jugador: 1, id_comportamiento: 101 },
                        { id_jugador: 2, id_comportamiento: 102 },
                        { id_jugador: 3, id_comportamiento: 103 },
                        { id_jugador: 4, id_comportamiento: 104 },
                        { id_jugador: 5, id_comportamiento: 105 },
                        { id_jugador: 6, id_comportamiento: 106 }
                    ],
                    formacion: "c" 
                })}
            >
                Confirmar Equipo
            </button>
            <button data-testid="btn-cancelar-equipo" onClick={onCancelar}>
                Cancelar Equipo
            </button>
        </div>
    )
}));

describe('CrearAmistoso Logic Container', () => {
    const mockCrearAmistoso = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        createHttpService.mockReturnValue({
            crearAmistoso: mockCrearAmistoso,
        });

        vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('1');
    });

    const avanzarAPaso2 = () => {
        const botonConfirmarEquipo = screen.getByTestId('btn-confirmar-equipo');
        fireEvent.click(botonConfirmarEquipo);
    };

    it('renderiza el Paso 1 (ArmarEquipo) inicialmente', () => {
        render(<MemoryRouter><CrearAmistoso /></MemoryRouter>);
        expect(screen.getByTestId('mock-armar-equipo')).toBeInTheDocument();
    });

    it('avanza al Paso 2 (CrearAmistosoComp) tras confirmar el equipo', async () => {
        render(<MemoryRouter><CrearAmistoso /></MemoryRouter>);
        avanzarAPaso2();

        expect(await screen.findByRole('heading', { name: /Crear Amistoso/i })).toBeInTheDocument();
        
        expect(screen.getByLabelText(/Duración del partido/i)).toBeInTheDocument();
    });

    it('muestra error de validación si la duración es menor a 1', async () => {
        render(<MemoryRouter><CrearAmistoso /></MemoryRouter>);
        avanzarAPaso2();

        const inputDuracion = await screen.findByLabelText(/Duración del partido/i);
        const botonCrear = screen.getByRole('button', { name: /Crear Amistoso/i });

        fireEvent.change(inputDuracion, { target: { value: '0' } });
        fireEvent.click(botonCrear);

        await waitFor(() => {
            expect(screen.getByText(/El mínimo es de 1 minuto/i)).toBeInTheDocument();
        });
    });

    it('envía datos combinados al backend y navega al lobby si todo es válido', async () => {
        mockCrearAmistoso.mockResolvedValue({ id_partido: 99 });

        render(<MemoryRouter><CrearAmistoso /></MemoryRouter>);
        avanzarAPaso2();

        const inputDuracion = await screen.findByLabelText(/Duración del partido/i);
        const botonCrear = screen.getByRole('button', { name: /Crear Amistoso/i });

        fireEvent.change(inputDuracion, { target: { value: '15' } });
        fireEvent.click(botonCrear);

        await waitFor(() => {
            expect(mockCrearAmistoso).toHaveBeenCalledWith('1', {
                duracion: 15,
                jugadores: [
                    { id_jugador: 1, id_comportamiento: 101 },
                    { id_jugador: 2, id_comportamiento: 102 },
                    { id_jugador: 3, id_comportamiento: 103 },
                    { id_jugador: 4, id_comportamiento: 104 },
                    { id_jugador: 5, id_comportamiento: 105 },
                    { id_jugador: 6, id_comportamiento: 106 }
                ],
                formacion: "c"
            });
            expect(mockNavigate).toHaveBeenCalledWith(
                '/amistosos/lobby/99',
                { state: { esCreador: true } }
            );
        });
    });

    it('muestra un mensaje de error si el servidor falla', async () => {
        mockCrearAmistoso.mockRejectedValue(new Error('Error interno del servidor'));

        render(<MemoryRouter><CrearAmistoso /></MemoryRouter>);
        avanzarAPaso2();

        const inputDuracion = await screen.findByLabelText(/Duración del partido/i);
        const botonCrear = screen.getByRole('button', { name: /Crear Amistoso/i });

        fireEvent.change(inputDuracion, { target: { value: '15' } });
        fireEvent.click(botonCrear);

        await waitFor(() => {
            expect(screen.getByText(/Error interno del servidor/i)).toBeInTheDocument();
            expect(mockNavigate).not.toHaveBeenCalled();
        });
    });

    it('vuelve al Paso 1 al presionar el botón "Volver"', async () => {
        render(<MemoryRouter><CrearAmistoso /></MemoryRouter>);
        avanzarAPaso2();

        expect(await screen.findByRole('heading', { name: /Crear Amistoso/i })).toBeInTheDocument();

        const botonVolver = screen.getByRole('button', { name: /Volver/i });
        fireEvent.click(botonVolver);

        expect(await screen.findByTestId('mock-armar-equipo')).toBeInTheDocument();
    });

    it('vuelve al menú de amistosos al cancelar en ArmarEquipo', () => {
        render(<MemoryRouter><CrearAmistoso /></MemoryRouter>);
        
        const botonCancelarEquipo = screen.getByTestId('btn-cancelar-equipo');
        fireEvent.click(botonCancelarEquipo);
        
        expect(mockNavigate).toHaveBeenCalledWith('/amistosos');
    });
});