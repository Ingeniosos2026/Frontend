import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import ApiModal from './ApiModal';

describe('ApiModal Component', () => {
    
    it('renderiza el botón de icono inicial correctamente', () => {
        render(<ApiModal />);

        const botonIcono = screen.getByRole('button');

        expect(botonIcono).toBeInTheDocument();
        expect(screen.queryByText(/API de Primitivas/i)).not.toBeInTheDocument();
    });

    it('abre el modal y muestra la tabla de la API al clickear el botón', async () => {
        render(<ApiModal />);
        
        const botonIcono = screen.getByRole('button');
        fireEvent.click(botonIcono);

        expect(await screen.findByText(/API de Primitivas/i)).toBeInTheDocument();

        expect(screen.getByText('Metodo')).toBeInTheDocument();
        expect(screen.getByText('Código')).toBeInTheDocument();
        expect(screen.getByText('Argumento')).toBeInTheDocument();
        expect(screen.getByText('Resultado')).toBeInTheDocument();

        expect(screen.getByText('Correr')).toBeInTheDocument();
        expect(screen.getByText('correr(destino: coordenadas)')).toBeInTheDocument();
        expect(screen.getByText('Dirección Arco Propio')).toBeInTheDocument();
    });

    it('cierra el modal al clickear el botón "Close"', async () => {
        render(<ApiModal />);
        
        const botonIcono = screen.getByRole('button');
        fireEvent.click(botonIcono);

        expect(await screen.findByText(/API de Primitivas/i)).toBeInTheDocument();

        const botonCerrar = screen.getByRole('button', { name: /Close/i });
        fireEvent.click(botonCerrar);

        await waitFor(() => {
            expect(screen.queryByText(/API de Primitivas/i)).not.toBeInTheDocument();
        });
    });
});