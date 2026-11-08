import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { createHttpService } from '../../services/HttpService.js';
import { MemoryRouter } from 'react-router-dom';
import CrearCompDt from './CrearCompDT.jsx';

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
    const mockCrearCompDt = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        
        createHttpService.mockReturnValue({
            crearComportamientoDt: mockCrearCompDt,
        });

        vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('1');
    });

    it('muestra error por omision de campos', async () => {
        render(<MemoryRouter><CrearCompDt /></MemoryRouter>);
        
        const editorTexto = screen.getByTestId('mock-editor-texto');
        fireEvent.change(editorTexto, { target: { value: '' } });

        const botonCrear = screen.getByRole('button', { name: /Crear/i });
        fireEvent.click(botonCrear);

        await waitFor(() => {
            expect(screen.getByText(/Ingrese un nombre/i)).toBeInTheDocument();
            expect(screen.getByText(/Ingrese un codigo de comportamiento/i)).toBeInTheDocument();
        });
    });

    it('muestra error por nombre o codigo invalido', async () => {

        mockCrearCompDt.mockRejectedValue(new Error('El nombre o los datos del comportamiento no son validos'));

        render(<MemoryRouter><CrearCompDt /></MemoryRouter>);
        
        const editorTexto = screen.getByTestId('mock-editor-texto');
        const inputNombre = screen.getByLabelText(/Nombre del comportamiento/i);
        const botonCrear = screen.getByRole('button', { name: /Crear/i });

        fireEvent.change(inputNombre, { target: { value: 'Invalidar' } });
        fireEvent.change(editorTexto, { target: { value: 'def nada (' } });
        fireEvent.click(botonCrear);

        await waitFor(() => {
            expect(screen.getByText(/El nombre o los datos del comportamiento no son validos/i)).toBeInTheDocument();
        });
    });

    it('envía los datos, crea un comportamiento DT y navega al menú', async () => {
        mockCrearCompDt.mockResolvedValue({
            nombre: 'estrategia_dt',
            codigo: 'def estrategia_dt():\n    if voy_perdiendo():\n        cambiar_comportamiento()'
        });

        render(<MemoryRouter><CrearCompDt /></MemoryRouter>);

        const botonCrear = screen.getByRole('button', { name: /Crear/i });
        const inputNombre = screen.getByLabelText(/Nombre del comportamiento/i);
        const inputComp = screen.getByTestId('mock-editor-texto');

        fireEvent.change(inputNombre, { target: { value: 'estrategia_dt' } });
        fireEvent.change(inputComp, {
            target: {
                value: 'def estrategia_dt():\n    if voy_perdiendo():\n        cambiar_comportamiento()'
            }
        });

        fireEvent.click(botonCrear);

        await waitFor(() => {
            expect(mockCrearCompDt).toHaveBeenCalledWith('1', {
                nombre: 'estrategia_dt',
                codigo: 'def estrategia_dt():\n    if voy_perdiendo():\n        cambiar_comportamiento()'
            });

            expect(mockNavigate).toHaveBeenCalledWith('/comportamientos');
        });
    });

    it('muestra un mensaje de error si la petición HTTP falla', async () => {
        mockCrearCompDt.mockRejectedValue(new Error('Servidor caído'));

        render(<MemoryRouter><CrearCompDt /></MemoryRouter>);
        
        const botonCrear = screen.getByRole('button', { name: /Crear/i });
        const inputNombre = screen.getByLabelText(/Nombre del comportamiento/i);
        const inputComp = screen.getByTestId('mock-editor-texto');

        fireEvent.change(inputNombre, { target: { value: 'estrategia_dt' } });
        fireEvent.change(inputComp, {
            target: {
                value: 'def estrategia_dt():\n    if voy_perdiendo():\n        cambiar_comportamiento()'
            }
        });
        fireEvent.click(botonCrear);

        await waitFor(() => {
            expect(screen.getByText(/Servidor caído/i)).toBeInTheDocument();
            expect(mockNavigate).not.toHaveBeenCalled();
        });
    });

    it('navega a /comportamientos al presionar el botón "Cancelar"', () => {
        render(<MemoryRouter><CrearCompDt /></MemoryRouter>);
        
        const botonVolver = screen.getByRole('button', { name: /Cancelar/i });
        fireEvent.click(botonVolver);

        expect(mockNavigate).toHaveBeenCalledWith('/comportamientos');
    });
});