import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom';
import MenuAmistoso from './MenuAmistoso';
import { createHttpService } from '../../services/HttpService.js';
import { createWSService } from '../../services/WSService';
import { useNavigate } from 'react-router-dom';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
    useNavigate: vi.fn(), 
}));

vi.mock('../../services/HttpService.js', () => ({
    createHttpService: vi.fn(),
}));

const mockWsConnect = vi.fn();
const mockWsDisconnect = vi.fn();
const mockWsOn = vi.fn();
const mockWsOff = vi.fn();

vi.mock('../../services/WSService', () => ({
    createWSService: vi.fn(() => ({
        connect: mockWsConnect,
        disconnect: mockWsDisconnect,
        on: mockWsOn,
        off: mockWsOff
    }))
}));

vi.mock('../../components/Amistosos/MenuAmistosoComp.jsx', () => ({
    default: (props) => (
        <div data-testid="mock-menu-amistoso">
            <span data-testid="cargando">{props.cargando.toString()}</span>
            <span data-testid="error">{props.mensajeError || 'no-error'}</span>
            <span data-testid="amistosos-count">{props.amistosos?.length || 0}</span>
            <ul data-testid="amistosos-list">
                {props.amistosos?.map((a, i) => (
                    <li key={i} data-testid={`amistoso-item-${a.id}`}>{a.nombre}</li>
                ))}
            </ul>

            <button data-testid="btn-crear" onClick={props.alCrear}>Crear</button>
            <button data-testid="btn-unirse" onClick={() => props.alUnirse(99)}>Unirse</button>
            <button data-testid="btn-volver" onClick={props.alVolver}>Volver</button>
        </div>
    )
}));

describe('MenuAmistoso Logic Container', () => {
    const mockObtenerAmistosos = vi.fn();
    const mockUsuarioId = '123';

    beforeEach(() => {
        vi.clearAllMocks();
        
        createHttpService.mockReturnValue({
            obtenerAmistosos: mockObtenerAmistosos,
        });

        useNavigate.mockReturnValue(mockNavigate);
        
        Storage.prototype.getItem = vi.fn(() => mockUsuarioId);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('muestra el estado de carga y luego inyecta los amistosos obtenidos', async () => {
        mockObtenerAmistosos.mockResolvedValue([{ id: 1, nombre: 'Partido FAMAF' }]);

        render(<MenuAmistoso />);

        expect(screen.getByTestId('cargando').textContent).toBe('true');

        await waitFor(() => {
            expect(screen.getByTestId('cargando').textContent).toBe('false');
        });

        expect(screen.getByTestId('amistosos-count').textContent).toBe('1');
        expect(screen.getByTestId('amistoso-item-1').textContent).toBe('Partido FAMAF');
        expect(screen.getByTestId('error').textContent).toBe('no-error');
        
        expect(createWSService).toHaveBeenCalledWith(`/ws/notificaciones/${mockUsuarioId}`);
        expect(mockWsConnect).toHaveBeenCalled();
        expect(mockWsOn).toHaveBeenCalledWith('amistoso_creado', expect.any(Function));
    });

    it('maneja errores si la API falla y los envía al componente visual', async () => {
        mockObtenerAmistosos.mockRejectedValue(new Error('Servidor caído'));

        render(<MenuAmistoso />);

        await waitFor(() => {
            expect(screen.getByTestId('error').textContent).toBe('Servidor caído');
        });
        
        expect(screen.getByTestId('cargando').textContent).toBe('false');
    });

    it('añade un nuevo amistoso cuando se recibe por WebSocket', async () => {
        mockObtenerAmistosos.mockResolvedValue([{ id: 1, nombre: 'Partido FAMAF' }]);
        
        let wsCallback;
        mockWsOn.mockImplementation((event, callback) => {
            if (event === 'amistoso_creado') {
                wsCallback = callback;
            }
        });

        render(<MenuAmistoso />);

        await waitFor(() => expect(screen.getByTestId('cargando').textContent).toBe('false'));
        expect(screen.getByTestId('amistosos-count').textContent).toBe('1');

        wsCallback({ id_partido: 2, nombre: 'Nuevo Amistoso WS' });

        await waitFor(() => {
            expect(screen.getByTestId('amistosos-count').textContent).toBe('2');
            expect(screen.getByTestId('amistoso-item-2').textContent).toBe('Nuevo Amistoso WS');
        });
    });

    it('navega a /amistosos/crear al ejecutar la acción alCrear', async () => {
        mockObtenerAmistosos.mockResolvedValue([]);
        render(<MenuAmistoso />);

        await waitFor(() => expect(screen.getByTestId('cargando').textContent).toBe('false'));

        fireEvent.click(screen.getByTestId('btn-crear'));

        expect(mockNavigate).toHaveBeenCalledWith('/amistosos/crear');
    });

    it('navega a /amistosos/unir/:id al ejecutar la acción alUnirse', async () => {
        mockObtenerAmistosos.mockResolvedValue([]);
        render(<MenuAmistoso />);

        await waitFor(() => expect(screen.getByTestId('cargando').textContent).toBe('false'));

        fireEvent.click(screen.getByTestId('btn-unirse'));

        expect(mockNavigate).toHaveBeenCalledWith('/amistosos/unir/99');
    });

    it('navega a /main al ejecutar la acción alVolver', async () => {
        mockObtenerAmistosos.mockResolvedValue([]);
        render(<MenuAmistoso />);

        await waitFor(() => expect(screen.getByTestId('cargando').textContent).toBe('false'));

        fireEvent.click(screen.getByTestId('btn-volver'));

        expect(mockNavigate).toHaveBeenCalledWith('/main');
    });
    
    it('desconecta el WebSocket y remueve el listener al desmontar', async () => {
        mockObtenerAmistosos.mockResolvedValue([]);
        const { unmount } = render(<MenuAmistoso />);
        
        await waitFor(() => expect(screen.getByTestId('cargando').textContent).toBe('false'));
        
        unmount();
        
        expect(mockWsOff).toHaveBeenCalledWith('amistoso_creado', expect.any(Function));
        expect(mockWsDisconnect).toHaveBeenCalled();
    });
});