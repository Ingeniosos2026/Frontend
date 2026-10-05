import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import Partido from './Partido'; 
import { createWSService } from '../services/WSService';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
    useParams: () => ({ partido_id: '99' }) // Simulamos la URL /partido/99
}));

vi.mock('../services/WSService', () => ({
    createWSService: vi.fn(),
}));

describe('Contenedor Partido', () => {
    let wsHandlers;
    let mockWsConnect, mockWsDisconnect, mockWsOn, mockWsOff;

    beforeEach(() => {
        vi.clearAllMocks();
        
        vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('10');

        wsHandlers = {}; 
        mockWsConnect = vi.fn();
        mockWsDisconnect = vi.fn();
        mockWsOn = vi.fn((evento, callback) => {
            wsHandlers[evento] = callback; // Guardamos las funciones para ejecutarlas luego
        });
        mockWsOff = vi.fn();

        createWSService.mockReturnValue({
            connect: mockWsConnect,
            disconnect: mockWsDisconnect,
            on: mockWsOn,
            off: mockWsOff
        });
    });

    it('muestra la pantalla de carga inicial y se conecta al WebSocket correcto', () => {
        render(<Partido />);
        
        expect(screen.getByText('Cargando motor de físicas...')).toBeInTheDocument();
        
        expect(createWSService).toHaveBeenCalledWith('/partido/99/ws');
        expect(mockWsConnect).toHaveBeenCalled();
        expect(mockWsOn).toHaveBeenCalledWith('estado_partido', expect.any(Function));
    });

    it('renderiza la cancha y el scoreboard al recibir "estado_partido"', () => {
        render(<Partido />);
        
        const mockPayload = {
            tiempo: 65.5, // 1 minuto, 5 segundos
            pelota: { x: 50, y: 30 },
            jugadores: [
                { id_jugador: 1, id_usuario: 10, id_equipo: 1, x: 40, y: 25 },
                { id_jugador: 2, id_usuario: 20, id_equipo: 2, x: 60, y: 25 }
            ],
            goles: { izquierdo: 2, derecho: 1 },
            estados_jugadores: [
                { id_jugador: 1, id_usuario: 10, estado: "corriendo" }
            ]
        };

        act(() => {
            wsHandlers['estado_partido'](mockPayload);
        });

        expect(screen.getByText('01:05')).toBeInTheDocument(); 
        
        expect(screen.getAllByText('2')).toHaveLength(2); 
        expect(screen.getAllByText('1')).toHaveLength(2); 

        expect(screen.getByText('corriendo')).toBeInTheDocument();
    });

    it('muestra la pantalla final, formatea el resultado y desconecta el WS al recibir "partido_terminado"', () => {
        render(<Partido />);
        
        const mockResultado = {
            tiempo: 300,
            goles: { izquierdo: 3, derecho: 0 }
        };

        act(() => {
            wsHandlers['partido_terminado'](mockResultado);
        });

        expect(screen.getByText('¡Final del Partido!')).toBeInTheDocument();
        expect(screen.getByText('3 - 0')).toBeInTheDocument(); 
        expect(screen.getByText('Tiempo total: 05:00')).toBeInTheDocument();

        expect(mockWsDisconnect).toHaveBeenCalled();
    });

    it('navega de regreso al menú de amistosos al hacer clic en "Volver al Menú"', () => {
        render(<Partido />);
        
        act(() => {
            wsHandlers['partido_terminado']({ goles: {}, tiempo: 0 });
        });

        const botonVolver = screen.getByRole('button', { name: /Volver al Menú/i });
        fireEvent.click(botonVolver);

        expect(mockNavigate).toHaveBeenCalledWith('/amistosos');
    });

    it('limpia los eventos y desconecta el socket si el componente se desmonta prematuramente', () => {
        const { unmount } = render(<Partido />);
        
        unmount();

        expect(mockWsOff).toHaveBeenCalledWith('estado_partido', expect.any(Function));
        expect(mockWsOff).toHaveBeenCalledWith('partido_terminado', expect.any(Function));
        expect(mockWsDisconnect).toHaveBeenCalled();
    });
});