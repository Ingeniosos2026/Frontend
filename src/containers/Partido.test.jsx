import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import Partido from './Partido'; 
import { createWSService } from '../services/WSService';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        useParams: () => ({ partido_id: '99' }), 
        useLocation: () => ({ state: { returnTo: '/amistosos' } })
    };
});

vi.mock('../services/WSService', () => ({
    createWSService: vi.fn(),
}));

vi.mock('../services/HttpService', () => ({
    createHttpService: vi.fn(() => ({}))
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
            wsHandlers[evento] = callback; 
        });
        mockWsOff = vi.fn();

        createWSService.mockReturnValue({
            connect: mockWsConnect,
            disconnect: mockWsDisconnect,
            on: mockWsOn,
            off: mockWsOff
        });
    });

    it('muestra la pantalla de carga inicial y se suscribe a TODOS los eventos WebSocket', () => {
        render(<Partido />);
        
        expect(screen.getByText('El partido ya no esta disponible')).toBeInTheDocument();
        
        expect(createWSService).toHaveBeenCalledWith('/partido/99/ws');
        expect(mockWsConnect).toHaveBeenCalled();

        expect(mockWsOn).toHaveBeenCalledWith('estado_partido', expect.any(Function));
        expect(mockWsOn).toHaveBeenCalledWith('partido_terminado', expect.any(Function));
        expect(mockWsOn).toHaveBeenCalledWith('reconexion_partido', expect.any(Function));
        expect(mockWsOn).toHaveBeenCalledWith('partido_pausado', expect.any(Function));
        expect(mockWsOn).toHaveBeenCalledWith('partido_reanudado', expect.any(Function));
        expect(mockWsOn).toHaveBeenCalledWith('cambio_jugador_realizado', expect.any(Function));
    });

    it('renderiza la cancha y el scoreboard al recibir "estado_partido"', () => {
        render(<Partido />);
        
        const mockPayload = {
            tiempo: 65.5, 
            pelota: { x: 50, y: 30 },
            jugadores: [
                { id_jugador: 1, id_usuario: 10, id_equipo: 1, x: 40, y: 25 },
                { id_jugador: 2, id_usuario: 20, id_equipo: 2, x: 60, y: 25 }
            ],
            goles: { izquierdo: 7, derecho: 5 },
            estados_jugadores: [
                { id_jugador: 1, id_usuario: 10, estado: "corriendo" }
            ]
        };

        act(() => {
            wsHandlers['estado_partido'](mockPayload);
        });

        expect(screen.getByText('01:05')).toBeInTheDocument(); 
        
        expect(screen.getByText('7')).toBeInTheDocument(); 
        expect(screen.getByText('5')).toBeInTheDocument(); 

        expect(screen.getByText('corriendo')).toBeInTheDocument();
    });

    it('filtra correctamente los jugadores al recibir "reconexion_partido"', () => {
        render(<Partido />);
        
        act(() => {
            wsHandlers['reconexion_partido']({
                cancha: { ancho: 100, alto: 60 },
                jugadores: [
                    { id_jugador: 7, id_usuario: 10, nombre: 'Mi Jugador' },
                    { id_jugador: 9, id_usuario: 20, nombre: 'Jugador Rival' }
                ]
            });

            wsHandlers['estado_partido']({ tiempo: 0, pelota: {x:0, y:0}, goles: {izquierdo:0, derecho:0}, jugadores: [], estados_jugadores: [] });
            
        });

        expect(screen.getByRole('button', { name: /7/i })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /9/i })).not.toBeInTheDocument();
    });

    it('muestra la pantalla final y formatea el resultado al recibir "partido_terminado"', () => {
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
    });

    it('navega de regreso al menú anterior al hacer clic en "Volver al Menú"', () => {
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
        expect(mockWsOff).toHaveBeenCalledWith('reconexion_partido', expect.any(Function));
        expect(mockWsOff).toHaveBeenCalledWith('partido_pausado', expect.any(Function));
        expect(mockWsOff).toHaveBeenCalledWith('partido_reanudado', expect.any(Function));
        expect(mockWsOff).toHaveBeenCalledWith('cambio_jugador_realizado', expect.any(Function));
        
        expect(mockWsDisconnect).toHaveBeenCalled();
    });
});