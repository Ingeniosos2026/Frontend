import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import CrearJugador from './CrearJugador';
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

describe('CrearJugador Logic Container', () => {
    const mockCrearJugador = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        
        createHttpService.mockReturnValue({
            crearJugador: mockCrearJugador,
        });

        vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('1');
    });

    it('renderiza con valores por defecto que suman 300 y el botón habilitado', () => {
        render(<MemoryRouter><CrearJugador /></MemoryRouter>);
        
        const textoTotal = screen.getByText(/Total Asignado: 300 \/ 300/i);
        const botonCrear = screen.getByRole('button', { name: /Crear Jugador/i });

        expect(textoTotal).toBeInTheDocument();
        expect(botonCrear).not.toBeDisabled();
    });

    it('deshabilita el botón de crear si los puntos no suman 300', async () => {
        render(<MemoryRouter><CrearJugador /></MemoryRouter>);
        
        const inputPower = screen.getByLabelText(/power/i);
        const botonCrear = screen.getByRole('button', { name: /Crear Jugador/i });

        fireEvent.change(inputPower, { target: { value: '50' } });

        await waitFor(() => {
            expect(screen.getByText(/Total Asignado: 290 \/ 300/i)).toBeInTheDocument();
            expect(botonCrear).toBeDisabled();
        });
    });

    it('muestra error de validación al intentar enviar si un atributo es menor a 20', async () => {
        render(<MemoryRouter><CrearJugador /></MemoryRouter>);
        
        const inputAgility = screen.getByLabelText(/agility/i);
        const inputPower = screen.getByLabelText(/power/i);
        const inputSpeed = screen.getByLabelText(/speed/i);
        const botonCrear = screen.getByRole('button', { name: /Crear Jugador/i });
        
        fireEvent.change(inputAgility, { target: { value: '10' } });
        
        fireEvent.change(inputPower, { target: { value: '85' } });
        fireEvent.change(inputSpeed, { target: { value: '85' } });
        
        expect(botonCrear).not.toBeDisabled();
        fireEvent.click(botonCrear);

        await waitFor(() => {
            expect(screen.getByText(/Mínimo 20/i)).toBeInTheDocument();
        });
    });

    it('envía los datos al backend y navega al éxito si el formulario es válido', async () => {
        mockCrearJugador.mockResolvedValue({
            id: 10,
            nombre: 'Schott',
            power: 50,
            agility: 60,
            control: 60,
            speed: 70,
            strength: 60
        });

        render(<MemoryRouter><CrearJugador /></MemoryRouter>);
        
        const inputNombre = screen.getByLabelText(/Nombre del Jugador/i);
        const inputPower = screen.getByLabelText(/power/i);
        const inputSpeed = screen.getByLabelText(/speed/i);
        const botonCrear = screen.getByRole('button', { name: /Crear Jugador/i });

        fireEvent.change(inputNombre, { target: { value: 'Schott' } });
        fireEvent.change(inputPower, { target: { value: '50' } });
        fireEvent.change(inputSpeed, { target: { value: '70' } });
        expect(botonCrear).not.toBeDisabled();
        fireEvent.click(botonCrear);

        await waitFor(() => {
            expect(mockCrearJugador).toHaveBeenCalledWith('1', {
                nombre: 'Schott',
                power: 50,
                agility: 60,
                control: 60,
                speed: 70,
                strength: 60
            });
            expect(mockNavigate).toHaveBeenCalledWith('/jugadores');
        });
    });

    it('muestra un mensaje de error si la petición HTTP falla', async () => {
        mockCrearJugador.mockRejectedValue(new Error('Servidor caído'));

        render(<MemoryRouter><CrearJugador /></MemoryRouter>);
        
        const inputNombre = screen.getByLabelText(/Nombre del Jugador/i);
        const botonCrear = screen.getByRole('button', { name: /Crear Jugador/i });

        fireEvent.change(inputNombre, { target: { value: 'Depietri' } });
        fireEvent.click(botonCrear);

        await waitFor(() => {
            expect(screen.getByText(/Servidor caído/i)).toBeInTheDocument();
            expect(mockNavigate).not.toHaveBeenCalled();
        });
    });

    it('navega a /jugadores al presionar el botón "Cancelar"', () => {
        render(<MemoryRouter><CrearJugador /></MemoryRouter>);
        
        const botonVolver = screen.getByRole('button', { name: /Cancelar/i });
        fireEvent.click(botonVolver);

        expect(mockNavigate).toHaveBeenCalledWith('/jugadores');
    });
});