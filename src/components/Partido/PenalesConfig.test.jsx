import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom'; // <-- SOLUCIÓN 1: Importar matchers del DOM
import PenalesConfig from './PenalesConfig';
import * as HttpServiceModule from '../../services/HttpService';

// Mocks de datos
const mockTitulares = [
    { id_jugador: 10, nombre: 'Messi' },
    { id_jugador: 7, nombre: 'Ronaldo' },
    { id_jugador: 9, nombre: 'Suarez' },
    { id_jugador: 1, nombre: 'Dibu Martinez' }
];

const mockComportamientos = [
    { id: 100, nombre: 'Asegurar al medio' },
    { id: 101, nombre: 'Apuntar a un palo' }
];

const mockObtenerComportamientos = vi.fn();
const mockConfigurarPenales = vi.fn();

vi.mock('../../services/HttpService', () => ({
    createHttpService: () => ({
        obtenerComportamientos: mockObtenerComportamientos,
        configurarPenales: mockConfigurarPenales
    })
}));

describe('PenalesConfig Component', () => {
    
    beforeEach(() => {
        vi.clearAllMocks();
        mockObtenerComportamientos.mockResolvedValue(mockComportamientos);
    });

    it('renderiza correctamente el componente y carga los comportamientos', async () => {
        render(<PenalesConfig titulares={mockTitulares} idUsuario={1} idPartido={99} />);

        expect(screen.getByText('Preparación de Penales')).toBeInTheDocument();

        await waitFor(() => {
            const selectsJugadores = screen.getAllByRole('combobox');
            expect(selectsJugadores[0]).toHaveValue('10');
        });

        expect(mockObtenerComportamientos).toHaveBeenCalledWith(1);
    });

    it('asigna valores por defecto correctamente al iniciar', async () => {
        render(<PenalesConfig titulares={mockTitulares} idUsuario={1} idPartido={99} />);

        await waitFor(() => {
            const selectsJugadores = screen.getAllByRole('combobox');
            expect(selectsJugadores[0]).toHaveValue('10');
            expect(selectsJugadores[2]).toHaveValue('10');
            expect(selectsJugadores[4]).toHaveValue('7');
            expect(selectsJugadores[6]).toHaveValue('9');
        });
    });

    it('muestra mensaje de error si se intentan enviar jugadores repetidos', async () => {
        render(<PenalesConfig titulares={mockTitulares} idUsuario={1} idPartido={99} />);

        await waitFor(() => {
            expect(screen.getAllByRole('combobox')[0]).toHaveValue('10');
        });

        const selects = screen.getAllByRole('combobox');
        const selectPateador2 = selects[4]; 
        
        fireEvent.change(selectPateador2, { target: { value: '10' } });

        const btnConfirmar = screen.getByRole('button', { name: /CONFIRMAR SELECCIÓN/i });
        fireEvent.click(btnConfirmar);

        expect(await screen.findByText(/No podés repetir jugadores en la tanda/i)).toBeInTheDocument();
        expect(mockConfigurarPenales).not.toHaveBeenCalled();
    });

});