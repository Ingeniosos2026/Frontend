import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import MenuAmistoso from './MenuAmistoso';
import { createHttpService } from '../../services/HttpService.js';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));

vi.mock('../../services/HttpService.js', () => ({
    createHttpService: vi.fn(),
}));

describe('MenuAmistoso', () => {
    let mockObtenerAmistosos;

    beforeEach(() => {
        vi.clearAllMocks();
        
        mockObtenerAmistosos = vi.fn();
        createHttpService.mockReturnValue({
            obtenerAmistosos: mockObtenerAmistosos,
        });
    });

    it('muestra el texto de carga y luego renderiza la lista de amistosos', async () => {
        const amistososSimulados = [
            { id: 1, nombre: 'Partido FAMAF' },
            { id: 2, nombre: 'Picadito UTN' }
        ];
        
        mockObtenerAmistosos.mockResolvedValue(amistososSimulados);

        render(<MenuAmistoso />);

        expect(screen.getByText('Cargando amistosos...')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.queryByText('Cargando amistosos...')).not.toBeInTheDocument();
        });

        expect(screen.getByText('Partido FAMAF')).toBeInTheDocument();
        expect(screen.getByText('Picadito UTN')).toBeInTheDocument();
    });

    it('despliega el botón "Unirse" al hacer clic en un partido', async () => {
        mockObtenerAmistosos.mockResolvedValue([{ id: 1, nombre: 'Partido FAMAF' }]);
        render(<MenuAmistoso />);

        await waitFor(() => {
            expect(screen.getByText('Partido FAMAF')).toBeInTheDocument();
        });

        expect(screen.queryByText('Unirse')).not.toBeInTheDocument();

        fireEvent.click(screen.getByText('Partido FAMAF'));

        expect(screen.getByText('Unirse')).toBeInTheDocument();
    });

    it('navega a /amistosos/crear al hacer clic en "Crear Amistoso"', async () => {
        mockObtenerAmistosos.mockResolvedValue([]);
        render(<MenuAmistoso />);

        await waitFor(() => {
            expect(screen.getByText('Crear Amistoso')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText('Crear Amistoso'));

        expect(mockNavigate).toHaveBeenCalledWith('/amistosos/crear');
    });
});