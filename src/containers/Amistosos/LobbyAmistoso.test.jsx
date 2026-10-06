import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import LobbyAmistoso from './LobbyAmistoso';
import { createHttpService } from '../../services/HttpService';
import { createWSService } from '../../services/WSService';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: vi.fn(),
        useParams: vi.fn(),
        useLocation: vi.fn(),
    };
});

vi.mock('../../services/HttpService', () => ({
    createHttpService: vi.fn(),
}));

vi.mock('../../services/WSService', () => ({
    createWSService: vi.fn(),
}));

describe('LobbyAmistoso Logic Container', () => {
    const mockNavigate = vi.fn();
    const mockIniciarAmistoso = vi.fn();
    
    let wsHandlers;
    let mockWsConnect, mockWsDisconnect, mockWsOn, mockWsOff;

    beforeEach(() => {
        vi.clearAllMocks();
        
        useNavigate.mockReturnValue(mockNavigate);
        useParams.mockReturnValue({ partido_id: '15' });
        useLocation.mockReturnValue({ state: { esCreador: false } });

        vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('1');

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
    });

    it('renderiza como visitante esperando al rival y al creador', () => {
        render(<LobbyAmistoso />);
        
        expect(screen.getByText(/Lobby del Partido/i)).toBeInTheDocument();
        expect(screen.getByText(/Esperando rival/i)).toBeInTheDocument();
        expect(screen.getByText(/Esperando a que el creador inicie el partido/i)).toBeInTheDocument();
        
        expect(createWSService).toHaveBeenCalledWith('/ws/amistoso/15');
        expect(mockWsConnect).toHaveBeenCalled();
    });

    it('renderiza como creador con el botón deshabilitado hasta que haya rival', () => {
        useLocation.mockReturnValue({ state: { esCreador: true } });
        render(<LobbyAmistoso />);
        
        expect(screen.getByText(/Eres el creador de la sala/i)).toBeInTheDocument();
        
        const botonIniciar = screen.getByRole('button', { name: /Iniciar Amistoso/i });
        expect(botonIniciar).toBeDisabled();
    });

    it('actualiza la UI cuando el WebSocket emite "usuario_unido"', () => {
        useLocation.mockReturnValue({ state: { esCreador: true } });
        render(<LobbyAmistoso />);
        
        act(() => {
            wsHandlers['usuario_unido']({
                owner: { nombre: 'Juan', club: 'FAMAF FC' },
                usuario_unido: { nombre: 'Pedro', club: 'Sistemas Club' }
            });
        });

        expect(screen.getByText(/¡Rival listo!/i)).toBeInTheDocument();
        expect(screen.getByText('Juan')).toBeInTheDocument();
        expect(screen.getByText(/FAMAF FC/i)).toBeInTheDocument();
        expect(screen.getByText('Pedro')).toBeInTheDocument();
        expect(screen.getByText(/Sistemas Club/i)).toBeInTheDocument();
        
        const botonIniciar = screen.getByRole('button', { name: /Iniciar Amistoso/i });
        expect(botonIniciar).not.toBeDisabled();
    });

    it('llama al servicio HTTP al hacer clic en Iniciar Amistoso y deshabilita el botón', async () => {
        useLocation.mockReturnValue({ state: { esCreador: true } });
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

        expect(mockIniciarAmistoso).toHaveBeenCalledWith('15', '1');
        
        await waitFor(() => {
            expect(screen.getByRole('button', { name: /Iniciando/i })).toBeDisabled();
        });
    });

    it('muestra un mensaje de error si falla la petición HTTP de iniciar', async () => {
        useLocation.mockReturnValue({ state: { esCreador: true } });
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
            expect(screen.getByText(/Servidor caído/i)).toBeInTheDocument();
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