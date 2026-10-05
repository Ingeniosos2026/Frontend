import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import LobbyAmistoso from './LobbyAmistoso';
import { createHttpService } from '../../services/HttpService';
import { createWSService } from '../../services/WSService';

const mockNavigate = vi.fn();
let mockLocationState = { esCreador: false };

vi.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
    useParams: () => ({ partido_id: '15' }),
    useLocation: () => ({ state: mockLocationState })
}));

vi.mock('../../services/HttpService', () => ({
    createHttpService: vi.fn(),
}));

vi.mock('../../services/WSService', () => ({
    createWSService: vi.fn(),
}));

describe('LobbyAmistoso', () => {
    let mockIniciarAmistoso;
    let wsHandlers;
    let mockWsConnect, mockWsDisconnect, mockWsOn, mockWsOff;

    beforeEach(() => {
        vi.clearAllMocks();
        
        mockIniciarAmistoso = vi.fn();
        createHttpService.mockReturnValue({
            iniciarAmistoso: mockIniciarAmistoso,
        });

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

        mockLocationState = { esCreador: false };
    });

    it('renderiza como visitante esperando al rival y al creador', () => {
        render(<LobbyAmistoso />);
        
        expect(screen.getByText('Lobby del Partido')).toBeInTheDocument();
        expect(screen.getByText('Esperando a que un rival se una a la sala...')).toBeInTheDocument();
        expect(screen.getByText('Esperando a que el creador inicie el partido...')).toBeInTheDocument();
        
        expect(createWSService).toHaveBeenCalledWith('/ws/partido/15');
        expect(mockWsConnect).toHaveBeenCalled();
    });

    it('renderiza como creador con el botón deshabilitado hasta que haya rival', () => {
        mockLocationState = { esCreador: true };
        render(<LobbyAmistoso />);
        
        expect(screen.getByText('Eres el creador de la sala.')).toBeInTheDocument();
        
        const botonIniciar = screen.getByRole('button', { name: /Iniciar Amistoso/i });
        expect(botonIniciar).toBeDisabled();
    });

    it('actualiza la UI cuando el WebSocket emite "usuario_unido"', () => {
        mockLocationState = { esCreador: true };
        render(<LobbyAmistoso />);
        
        act(() => {
            wsHandlers['usuario_unido']({
                owner: { nombre: 'Juan', club: 'FAMAF FC' },
                usuario_unido: { nombre: 'Pedro', club: 'Sistemas Club' }
            });
        });

        expect(screen.getByText('¡Rival listo!')).toBeInTheDocument();
        expect(screen.getByText('Juan')).toBeInTheDocument();
        expect(screen.getByText('FAMAF FC')).toBeInTheDocument();
        expect(screen.getByText('Pedro')).toBeInTheDocument();
        expect(screen.getByText('Sistemas Club')).toBeInTheDocument();

        const botonIniciar = screen.getByRole('button', { name: /Iniciar Amistoso/i });
        expect(botonIniciar).not.toBeDisabled();
    });

    it('llama al servicio HTTP al hacer clic en Iniciar Amistoso y deshabilita el botón', async () => {
        mockLocationState = { esCreador: true };
        mockIniciarAmistoso.mockResolvedValue({});
        
        render(<LobbyAmistoso />);
        
        act(() => {
            wsHandlers['usuario_unido']({
                owner: { nombre: 'Juan', club: 'A' },
                usuario_unido: { nombre: 'Pedro', club: 'B' }
            });
        });

        const botonIniciar = screen.getByRole('button', { name: /Iniciar Amistoso/i });
        fireEvent.click(botonIniciar);

        expect(mockIniciarAmistoso).toHaveBeenCalledWith('15');
        
        await waitFor(() => {
            expect(screen.getByRole('button', { name: /Iniciando.../i })).toBeDisabled();
        });
    });

    it('muestra un mensaje de error si falla la petición HTTP de iniciar', async () => {
        mockLocationState = { esCreador: true };
        mockIniciarAmistoso.mockRejectedValue(new Error('Servidor caído'));
        
        render(<LobbyAmistoso />);
        
        act(() => {
            wsHandlers['usuario_unido']({
                owner: { nombre: 'A', club: 'A' },
                usuario_unido: { nombre: 'B', club: 'B' }
            });
        });

        fireEvent.click(screen.getByRole('button', { name: /Iniciar Amistoso/i }));

        await waitFor(() => {
            expect(screen.getByText('Error: Servidor caído')).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /Iniciar Amistoso/i })).not.toBeDisabled();
        });
    });

    it('navega a la cancha cuando el WebSocket emite "iniciar_partido"', () => {
        render(<LobbyAmistoso />);
        
        act(() => {
            wsHandlers['iniciar_partido']();
        });

        expect(mockNavigate).toHaveBeenCalledWith('/partido/15');
    });

    it('desconecta el WebSocket y remueve los listeners al desmontar el componente', () => {
        const { unmount } = render(<LobbyAmistoso />);
        
        unmount();

        expect(mockWsOff).toHaveBeenCalledWith('usuario_unido', expect.any(Function));
        expect(mockWsOff).toHaveBeenCalledWith('iniciar_partido', expect.any(Function));
        expect(mockWsDisconnect).toHaveBeenCalled();
    });
});