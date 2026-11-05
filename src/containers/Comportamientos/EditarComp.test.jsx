import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import EditarComp from './EditarComp';
import { createHttpService } from '../../services/HttpService.js';
import { MemoryRouter } from 'react-router-dom';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        useParams: () => ({ comp_id: '4' }),
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

describe('EditarComp Logic Container', () => {
    const mockEditarComp = vi.fn();
    const mockObtenerInfo = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        
        createHttpService.mockReturnValue({
            editarComportamiento: mockEditarComp,
            obtenerInformacionComportamiento: mockObtenerInfo,
        });

        vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('1');
        
        mockObtenerInfo.mockResolvedValue({
            nombre: 'Controlar Area',
            codigo: 'def original():\n  pass'
        });
    });

    it('muestra error por omision de campos', async () => {
        render(<MemoryRouter><EditarComp /></MemoryRouter>);
        
        const botonEditar = await screen.findByRole('button', { name: /Editar/i });
        const inputNombre = screen.getByLabelText(/Nombre del comportamiento/i);
        const editorTexto = screen.getByTestId('mock-editor-texto');
        
        fireEvent.change(inputNombre, { target: { value: '' } });
        fireEvent.change(editorTexto, { target: { value: '' } });
        fireEvent.click(botonEditar);

        await waitFor(() => {
            expect(screen.getByText(/Ingrese un nombre/i)).toBeInTheDocument();
            expect(screen.getByText(/Ingrese un codigo de comportamiento/i)).toBeInTheDocument();
        });
    });

    it('muestra error por nombre o codigo invalido', async () => {

        mockEditarComp.mockRejectedValue(new Error('El nombre o los datos del comportamiento no son validos'));

        render(<MemoryRouter><EditarComp /></MemoryRouter>);
        
        const botonEditar = await screen.findByRole('button', { name: /Editar/i });
        const inputNombre = screen.getByLabelText(/Nombre del comportamiento/i);
        const editorTexto = screen.getByTestId('mock-editor-texto');

        fireEvent.change(inputNombre, { target: { value: 'Invalidar' } });
        fireEvent.change(editorTexto, { target: { value: 'def nada (' } });
        fireEvent.click(botonEditar);

        await waitFor(() => {
            expect(screen.getByText(/El nombre o los datos del comportamiento no son validos/i)).toBeInTheDocument();
        });
    });

    it('envía los datos al backend si el formulario es válido', async () => {
        mockEditarComp.mockResolvedValue({
            nombre: 'traicionar',
            codigo: "def traicionar():\nprimitivas.patear(primitivas.direccionArcoPropio())"
        });

        render(<MemoryRouter><EditarComp/></MemoryRouter>);
        
        const botonEditar = await screen.findByRole('button', { name: /Editar/i });
        const inputNombre = screen.getByLabelText(/Nombre del comportamiento/i);
        const inputComp = screen.getByTestId('mock-editor-texto');

        fireEvent.change(inputNombre, { target: { value: 'traicionar' } });
        fireEvent.change(inputComp, { target: { value: "def traicionar():\nprimitivas.patear(primitivas.direccionArcoPropio())" } });
        fireEvent.click(botonEditar);

        await waitFor(() => {
            expect(mockEditarComp).toHaveBeenCalledWith('1','4', {
                nombre: 'traicionar',
                codigo: "def traicionar():\nprimitivas.patear(primitivas.direccionArcoPropio())"
            });
            expect(mockNavigate).toHaveBeenCalledWith('/comportamientos');
        });
    });

    it('muestra un mensaje de error si la petición HTTP falla', async () => {
        mockEditarComp.mockRejectedValue(new Error('Servidor caído'));

        render(<MemoryRouter><EditarComp /></MemoryRouter>);
        
        const botonEditar = await screen.findByRole('button', { name: /Editar/i });
        const inputNombre = screen.getByLabelText(/Nombre del comportamiento/i);
        const inputComp = screen.getByTestId('mock-editor-texto');

        fireEvent.change(inputNombre, { target: { value: 'traicionar' } });
        fireEvent.change(inputComp, { target: { value: "def traicionar():\nprimitivas.patear(primitivas.direccionArcoPropio())" } });
        fireEvent.click(botonEditar);

        await waitFor(() => {
            expect(screen.getByText(/Servidor caído/i)).toBeInTheDocument();
            expect(mockNavigate).not.toHaveBeenCalled();
        });
    });

    it('navega a /comportamientos al presionar el botón "Cancelar"', async () => {
        render(<MemoryRouter><EditarComp /></MemoryRouter>);
        
        const botonVolver = await screen.findByRole('button', { name: /Cancelar/i });
        fireEvent.click(botonVolver);

        expect(mockNavigate).toHaveBeenCalledWith('/comportamientos');
    });
});