import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import MenuAmistoso from './MenuAmistoso';
import { createHttpService } from '../../services/HttpService.js';
import { useNavigate } from 'react-router-dom';

// 1. Mock de react-router-dom: Ahora useNavigate es una función espía de Vitest
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
    useNavigate: vi.fn(), 
}));

// 2. Mock del servicio HTTP
vi.mock('../../services/HttpService.js', () => ({
    createHttpService: vi.fn(),
}));

// 3. Mock del componente visual (MenuAmistosoComp)
vi.mock('../../components/Amistosos/MenuAmistosoComp.jsx', () => ({
    default: (props) => (
        <div data-testid="mock-menu-amistoso">
            <span data-testid="cargando">{props.cargando.toString()}</span>
            <span data-testid="error">{props.mensajeError || 'no-error'}</span>
            <span data-testid="amistosos-count">{props.amistosos?.length || 0}</span>

            <button data-testid="btn-crear" onClick={props.alCrear}>Crear</button>
            <button data-testid="btn-unirse" onClick={() => props.alUnirse(99)}>Unirse</button>
            <button data-testid="btn-volver" onClick={props.alVolver}>Volver</button>
        </div>
    )
}));

describe('MenuAmistoso Logic Container', () => {
    const mockObtenerAmistosos = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        
        // Asignamos la función espía al servicio HTTP
        createHttpService.mockReturnValue({
            obtenerAmistosos: mockObtenerAmistosos,
        });

        // Como useNavigate ahora es un vi.fn(), esto funcionará perfectamente
        useNavigate.mockReturnValue(mockNavigate);
    });

    it('muestra el estado de carga y luego inyecta los amistosos obtenidos', async () => {
        mockObtenerAmistosos.mockResolvedValue([{ id: 1, nombre: 'Partido FAMAF' }]);

        render(<MenuAmistoso />);

        // El estado inicial debe ser cargando: true
        expect(screen.getByTestId('cargando').textContent).toBe('true');

        // Esperamos a que termine la llamada HTTP
        await waitFor(() => {
            expect(screen.getByTestId('cargando').textContent).toBe('false');
        });

        // Verificamos que el contenedor pasó correctamente los datos al presentador
        expect(screen.getByTestId('amistosos-count').textContent).toBe('1');
        expect(screen.getByTestId('error').textContent).toBe('no-error');
    });

    it('maneja errores si la API falla y los envía al componente visual', async () => {
        mockObtenerAmistosos.mockRejectedValue(new Error('Servidor caído'));

        render(<MenuAmistoso />);

        // Esperamos a que el catch(error) haga su trabajo
        await waitFor(() => {
            expect(screen.getByTestId('error').textContent).toBe('Servidor caído');
        });
        
        expect(screen.getByTestId('cargando').textContent).toBe('false');
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
});