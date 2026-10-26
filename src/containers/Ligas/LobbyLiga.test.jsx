import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import LobbyLiga from './LobbyLiga';
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

describe('LobbyLiga Logic Container', () => {
    const mockNavigate = vi.fn();
    const mockIniciarLiga = vi.fn();
    
    let wsHandlers;
    let mockWsConnect, mockWsDisconnect, mockWsOn, mockWsOff;

    beforeEach(() => {
        vi.clearAllMocks();
        
        useNavigate.mockReturnValue(mockNavigate);
        useParams.mockReturnValue({ liga_id: '20' });
  
        useLocation.mockReturnValue({ state: { esCreador: false, minimo: 3 } });

        vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('1');

        createHttpService.mockReturnValue({
            iniciarLiga: mockIniciarLiga,
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

    it('se muestra lobby a usuario unido no creador con botón de espera', () => {
        render(<LobbyLiga />);
        
        act(() => {
            wsHandlers['usuario_unido_liga']({ usuario_unido: { id: 1, nombre: 'Visitante', club: 'Club V' } });
            wsHandlers['usuario_unido_liga']({ usuario_unido: { id: 2, nombre: 'Creador', club: 'Club C' } });
        });

        expect(screen.getByText(/Lobby de la Liga/i)).toBeInTheDocument();
        expect(screen.getByText('Tú')).toBeInTheDocument();
        expect(screen.getByText('Creador')).toBeInTheDocument();
        expect(screen.getByText(/Esperando a que el creador inicie la Liga.../i)).toBeInTheDocument();
        
        expect(createWSService).toHaveBeenCalledWith('/ws/liga/20');
        expect(mockWsConnect).toHaveBeenCalled();
    });

    it('se muestra lobby vacío al creador apenas se une', () => {
        useLocation.mockReturnValue({ state: { esCreador: true, minimo: 3 } });
        render(<LobbyLiga />);

        act(() => {
            wsHandlers['usuario_unido_liga']({ usuario_unido: { id: 1, nombre: 'Creador', club: 'Club C' } });
        });
        
        expect(screen.getByText(/Esperando competidores.../i)).toBeInTheDocument();
        expect(screen.getByText(/Faltan 2 competidores para poder iniciar la liga/i)).toBeInTheDocument();
        
        const botonIniciar = screen.getByRole('button', { name: /Iniciar Liga/i });
        expect(botonIniciar).toBeDisabled();
    });

    it('habilita el botón iniciar cuando se alcanza la cantidad mínima de jugadores', () => {
        useLocation.mockReturnValue({ state: { esCreador: true, minimo: 3 } });
        render(<LobbyLiga />);
        
        act(() => {
            wsHandlers['usuario_unido_liga']({ usuario_unido: { id: 1, nombre: 'Roman', club: 'Boca' } });
            wsHandlers['usuario_unido_liga']({ usuario_unido: { id: 2, nombre: 'Di Carlo', club: 'River' } });
            wsHandlers['usuario_unido_liga']({ usuario_unido: { id: 3, nombre: 'Luifa', club: 'Belgrano' } });
        });

        expect(screen.getByText(/Eres el creador de la sala. Cuando estés listo, inicia la Liga/i)).toBeInTheDocument();
        
        const botonIniciar = screen.getByRole('button', { name: /▶ Iniciar Liga/i });
        expect(botonIniciar).not.toBeDisabled();
    });

    it('se renderiza un usuario nuevo cuando se une, sumado a los demás', () => {
        useLocation.mockReturnValue({ state: { esCreador: true, minimo: 3 } });
        render(<LobbyLiga />);
        
        act(() => {
            wsHandlers['usuario_unido_liga']({ usuario_unido: { id: 1, nombre: 'Fassi', club: 'Talleres' } });
        });
        expect(screen.getByText(/Faltan 2 competidores/i)).toBeInTheDocument();

        act(() => {
            wsHandlers['usuario_unido_liga']({ usuario_unido: { id: 2, nombre: 'Grindetti', club: 'Independiente' } });
        });
        
        expect(screen.getByText('Tú')).toBeInTheDocument();
        expect(screen.getByText('Grindetti')).toBeInTheDocument();
        expect(screen.getByText(/Faltan 1 competidores/i)).toBeInTheDocument();
    });

    it('se invoca al endpoint Iniciar Liga y se deshabilita la opcion de volver a llamar', async () => {
        useLocation.mockReturnValue({ state: { esCreador: true, minimo: 2 } });
        mockIniciarLiga.mockResolvedValue({});
        
        render(<LobbyLiga />);
        
        act(() => {
            wsHandlers['usuario_unido_liga']({ usuario_unido: { id: 1, nombre: 'Florentino', club: 'Madrid' } });
            wsHandlers['usuario_unido_liga']({ usuario_unido: { id: 2, nombre: 'Laporta', club: 'Barcelona' } });
        });

        const botonIniciar = screen.getByRole('button', { name: /▶ Iniciar Liga/i });
        fireEvent.click(botonIniciar);

        expect(mockIniciarLiga).toHaveBeenCalledWith('20', '1');
        
        await waitFor(() => {
            expect(screen.getByRole('button', { name: /Iniciando.../i })).toBeDisabled();
        });
    });

    it('se imprimen correctamente casos de error', async () => {
        useLocation.mockReturnValue({ state: { esCreador: true, minimo: 2 } });
        mockIniciarLiga.mockRejectedValue(new Error('Servidor caído'));
        
        render(<LobbyLiga />);
        
        act(() => {
            wsHandlers['usuario_unido_liga']({ usuario_unido: { id: 1, nombre: 'Tapia', club: 'Barracas' } });
            wsHandlers['usuario_unido_liga']({ usuario_unido: { id: 2, nombre: 'Veron', club: 'Estudiantes' } });
        });

        fireEvent.click(screen.getByRole('button', { name: /▶ Iniciar Liga/i }));

        await waitFor(() => {
            expect(screen.getByText(/Servidor caído/i)).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /▶ Iniciar Liga/i })).not.toBeDisabled();
        });
    });

    it('se desmonta correctamente el websocket y listeners', () => {
        const { unmount } = render(<LobbyLiga />);
        
        unmount();

        expect(mockWsOff).toHaveBeenCalledWith('usuario_unido_liga', expect.any(Function));
        expect(mockWsOff).toHaveBeenCalledWith('iniciar_partido', expect.any(Function));
        expect(mockWsDisconnect).toHaveBeenCalled();
    });
});