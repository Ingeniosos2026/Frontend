import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import CrearComp from './CrearComp';
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

vi.mock('../../containers/Comportamientos/EditorTexto', () => {
    return {
        default: ({ value, onChange }) => (
            <textarea 
                data-testid="mock-editor-texto"
                value={value} 
                onChange={onChange} 
            />
        )
    };
});

describe('CrearComp Logic Container', () => {
    const mockCrearComp = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        
        createHttpService.mockReturnValue({
            crearComportamiento: mockCrearComp,
        });

        vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('1');
    });

    it('muestra error por omision de campos', async () => {
        render(<MemoryRouter><CrearComp /></MemoryRouter>);
        

        const botonCrear = screen.getByRole('button', { name: /Crear/i });
        fireEvent.click(botonCrear);

        await waitFor(() => {
            expect(screen.getByText(/Ingrese un nombre/i)).toBeInTheDocument();
            expect(screen.getByText(/Ingrese un codigo de comportamiento/i)).toBeInTheDocument();
        });
    });

    it('envía los datos al backend y navega al éxito si el formulario es válido', async () => {
        mockCrearComp.mockResolvedValue({
            nombre: 'traicionar',
            codigo: "def traicionar():\nprimitivas.patear(primitivas.direccionArcoPropio())"
        });

        render(<MemoryRouter><CrearComp/></MemoryRouter>);
        
        const botonCrear = screen.getByRole('button', { name: /Crear/i });
        const inputNombre = screen.getByLabelText(/Nombre del comportamiento/i);
        const inputComp = screen.getByTestId('mock-editor-texto');

        fireEvent.change(inputNombre, { target: { value: 'traicionar' } });
        fireEvent.change(inputComp, { target: { value: "def traicionar():\nprimitivas.patear(primitivas.direccionArcoPropio())" } });
        fireEvent.click(botonCrear);

        await waitFor(() => {
            expect(mockCrearComp).toHaveBeenCalledWith('1', {
                nombre: 'traicionar',
                codigo: "def traicionar():\nprimitivas.patear(primitivas.direccionArcoPropio())"
            });
            expect(mockNavigate).toHaveBeenCalledWith('/comportamientos');
        });
    });

    it('muestra un mensaje de error si la petición HTTP falla', async () => {
        mockCrearComp.mockRejectedValue(new Error('Servidor caído'));

        render(<MemoryRouter><CrearComp /></MemoryRouter>);
        
        const botonCrear = screen.getByRole('button', { name: /Crear/i });
        const inputNombre = screen.getByLabelText(/Nombre del comportamiento/i);
        const inputComp = screen.getByTestId('mock-editor-texto');

        fireEvent.change(inputNombre, { target: { value: 'traicionar' } });
        fireEvent.change(inputComp, { target: { value: "def traicionar():\nprimitivas.patear(primitivas.direccionArcoPropio())" } });
        fireEvent.click(botonCrear);

        await waitFor(() => {
            expect(screen.getByText(/Servidor caído/i)).toBeInTheDocument();
            expect(mockNavigate).not.toHaveBeenCalled();
        });
    });

    it('navega a /comportamientos al presionar el botón "Cancelar"', () => {
        render(<MemoryRouter><CrearComp /></MemoryRouter>);
        
        const botonVolver = screen.getByRole('button', { name: /Cancelar/i });
        fireEvent.click(botonVolver);

        expect(mockNavigate).toHaveBeenCalledWith('/comportamientos');
    });
});