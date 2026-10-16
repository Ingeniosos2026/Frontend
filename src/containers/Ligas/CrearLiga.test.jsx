import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import CrearLiga from './CrearLiga';
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

describe('CrearLiga Logic Container', () => {
    const mockCrearLiga = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        createHttpService.mockReturnValue({
            crearLiga: mockCrearLiga
        });

        vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('1');
    });

    const avanzarAPaso2 = () => {
        const botonConfirmarEquipo = screen.getByTestId('btn-confirmar-equipo');
        fireEvent.click(botonConfirmarEquipo);
    };

    it('renderiza el Paso 1 (ArmarEquipo) inicialmente', () => {
        render(<MemoryRouter><CrearLiga /></MemoryRouter>);
        expect(screen.getByTestId('mock-armar-equipo')).toBeInTheDocument();
    });

    it('avanza al Paso 2 (CrearLigaComp) tras confirmar el equipo', async () => {
        render(<MemoryRouter><CrearLiga /></MemoryRouter>);
        avanzarAPaso2();

        expect(await screen.findByRole('heading', { name: /Crear Liga/ })).toBeInTheDocument();
        
        expect(screen.getByLabelText(/Nombre de la Liga/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Minima cantidad de clubs/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Maxima cantidad de clubs/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Duración de cada partido \(minutos\)/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Contraseña para la Liga \(Opcional\)/i)).toBeInTheDocument();
    });

    it('muestra error por omision de nombre', async () => {
        render(<MemoryRouter><CrearLiga /></MemoryRouter>);
        avanzarAPaso2();
 
        const botonCrear = screen.getByRole('button', { name: /Crear Liga/i });
        fireEvent.click(botonCrear);
        expect(await screen.findByText(/Ingrese un nombre/i)).toBeInTheDocument();
    });

    it('muestra error por input de minimo invalido', async () => {
        render(<MemoryRouter><CrearLiga /></MemoryRouter>);
        avanzarAPaso2();

        const inputMinimo = await screen.findByLabelText(/Minima cantidad de clubs/i);        
        const botonCrear = screen.getByRole('button', { name: /Crear Liga/i });
        
        fireEvent.change(inputMinimo, { target: { value: '2' } });
        fireEvent.click(botonCrear);
        expect(await screen.findByText(/El mínimo es de 3 clubs/i)).toBeInTheDocument();
    });

    it('muestra error por input maximo invalido', async () => {
        render(<MemoryRouter><CrearLiga /></MemoryRouter>);
        avanzarAPaso2();

        const inputMaximo = await screen.findByLabelText(/Maxima cantidad de clubs/i);    
        const botonCrear = screen.getByRole('button', { name: /Crear Liga/i });

        fireEvent.change(inputMaximo, { target: { value: '1' } });
        fireEvent.click(botonCrear);
        expect(await screen.findByText(/El valor máximo debe ser mayor que el mínimo/i)).toBeInTheDocument();
    });

    it('muestra error por input de duracion invalida', async () => {
        render(<MemoryRouter><CrearLiga /></MemoryRouter>);
        avanzarAPaso2();

        const inputDuracion = await screen.findByLabelText(/Duración de cada partido \(minutos\)/i);        
        const botonCrear = screen.getByRole('button', { name: /Crear Liga/i });

        fireEvent.change(inputDuracion, { target: { value: '0' } });
        fireEvent.click(botonCrear);
        expect(await screen.findByText(/El mínimo es de 1 minuto/i)).toBeInTheDocument();
    });

    it('envía datos combinados al backend y navega al lobby si todo es válido', async () => {
        mockCrearLiga.mockResolvedValue({ id_liga: 99 });

        render(<MemoryRouter><CrearLiga /></MemoryRouter>);
        avanzarAPaso2();

        const inputName = await screen.findByLabelText(/Nombre de la Liga/i);
        const inputMinimo = await screen.findByLabelText(/Minima cantidad de clubs/i);
        const inputMaximo = await screen.findByLabelText(/Maxima cantidad de clubs/i);
        const inputDuracion = await screen.findByLabelText(/Duración de cada partido \(minutos\)/i);
        const inputContraseña = await screen.findByLabelText(/Contraseña para la Liga \(Opcional\)/i);      
        const botonCrear = screen.getByRole('button', { name: /Crear Liga/i });

        fireEvent.change(inputName, { target: { value: 'Premier' } });
        fireEvent.change(inputMinimo, { target: { value: '3' } });
        fireEvent.change(inputMaximo, { target: { value: '5' } });
        fireEvent.change(inputDuracion, { target: { value: '5' } });
        fireEvent.change(inputContraseña, { target: { value: 'fairplay' } });
        fireEvent.click(botonCrear);

        await waitFor(() => {
            expect(mockCrearLiga).toHaveBeenCalledWith('1', {
                nombre:'Premier',
                min:3,
                max:5,
                password: 'fairplay',
                duracion: 5,
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
                '/ligas/lobby/99',
                { state: { esCreador: true } }
            );
        });
    });

    it('muestra un mensaje de error si el servidor falla', async () => {
        mockCrearLiga.mockRejectedValue(new Error('Error interno del servidor'));

        render(<MemoryRouter><CrearLiga /></MemoryRouter>);
        avanzarAPaso2();

        const inputName = await screen.findByLabelText(/Nombre de la Liga/);
        const inputMinimo = await screen.findByLabelText(/Minima cantidad de clubs/);
        const inputMaximo = await screen.findByLabelText(/Maxima cantidad de clubs/);
        const inputDuracion = await screen.findByLabelText(/Duración de cada partido \(minutos\)/i);
        const inputContraseña = await screen.findByLabelText(/Contraseña para la Liga \(Opcional\)/i);      
        const botonCrear = screen.getByRole('button', { name: /Crear Liga/});

        fireEvent.change(inputName, { target: { value: 'Premier' } });
        fireEvent.change(inputMinimo, { target: { value: '3' } });
        fireEvent.change(inputMaximo, { target: { value: '5' } });
        fireEvent.change(inputDuracion, { target: { value: '5' } });
        fireEvent.change(inputContraseña, { target: { value: 'fairplay' } });
        fireEvent.click(botonCrear);

        await waitFor(() => {
            expect(screen.getByText(/Error interno del servidor/i)).toBeInTheDocument();
            expect(mockNavigate).not.toHaveBeenCalled();
        });
    });

    it('vuelve al Paso 1 al presionar el botón "Volver"', async () => {
        render(<MemoryRouter><CrearLiga /></MemoryRouter>);
        avanzarAPaso2();

        expect(await screen.findByRole('heading', { name: /Crear Liga/i })).toBeInTheDocument();

        const botonVolver = screen.getByRole('button', { name: /Volver/i });
        fireEvent.click(botonVolver);

        expect(await screen.findByTestId('mock-armar-equipo')).toBeInTheDocument();
    });

    it('vuelve al menú de Liga al cancelar en ArmarEquipo', () => {
        render(<MemoryRouter><CrearLiga /></MemoryRouter>);
        
        const botonCancelarEquipo = screen.getByTestId('btn-cancelar-equipo');
        fireEvent.click(botonCancelarEquipo);
        
        expect(mockNavigate).toHaveBeenCalledWith('/ligas');
    });
});