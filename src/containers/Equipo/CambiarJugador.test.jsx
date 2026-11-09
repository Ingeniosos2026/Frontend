import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CambiarJugador from './CambiarJugador';

const mockRealizarCambio = vi.fn();
vi.mock('../../services/HttpService', () => ({
    createHttpService: () => ({
        realizarCambio: mockRealizarCambio
    })
}));

vi.mock('../../components/Equipo/CambiarJugadorComp', () => ({
    default: (props) => (
        <div data-testid="mock-visual">
            <div data-testid="estado-mostrar">{props.mostrarOpciones.toString()}</div>
            <div data-testid="estado-cargando">{props.cargando.toString()}</div>
            <div data-testid="estado-mensaje">{props.mensaje ? JSON.stringify(props.mensaje) : 'null'}</div>
            
            <button data-testid="btn-abrir" onClick={() => props.setMostrarOpciones(true)}>Abrir</button>
            <button data-testid="btn-confirmar-vacio" onClick={() => props.confirmarCambio(null)}>Confirmar Sin Jugador</button>
            <button data-testid="btn-confirmar" onClick={() => props.confirmarCambio("99")}>Confirmar Con Jugador</button>
            <button data-testid="btn-cancelar" onClick={props.cancelarCambio}>Cancelar</button>
        </div>
    )
}));

describe('Contenedor CambiarJugador', () => {
    const propsBase = {
        jugadorSaliente: 5,
        jugadoresSuplentes: [{ id_jugador: 99, nombre: 'Suplente 1' }],
        idPartido: 100,
        idUsuario: 10
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renderiza los estados iniciales por defecto', () => {
        render(<CambiarJugador {...propsBase} />);

        expect(screen.getByTestId('estado-mostrar')).toHaveTextContent('false');
        expect(screen.getByTestId('estado-cargando')).toHaveTextContent('false');
        expect(screen.getByTestId('estado-mensaje')).toHaveTextContent('null');
    });

    it('actualiza los estados al abrir el menú', () => {
        render(<CambiarJugador {...propsBase} />);

        fireEvent.click(screen.getByTestId('btn-abrir'));
        expect(screen.getByTestId('estado-mostrar')).toHaveTextContent('true');
    });

    it('limpia los estados correctamente al cancelar el cambio', () => {
        render(<CambiarJugador {...propsBase} />);

        fireEvent.click(screen.getByTestId('btn-abrir'));
        fireEvent.click(screen.getByTestId('btn-cancelar'));

        expect(screen.getByTestId('estado-mostrar')).toHaveTextContent('false');
        expect(screen.getByTestId('estado-mensaje')).toHaveTextContent('null');
    });

    it('no hace la petición HTTP si se intenta confirmar sin jugador seleccionado', async () => {
        render(<CambiarJugador {...propsBase} />);
        
        fireEvent.click(screen.getByTestId('btn-confirmar-vacio'));

        expect(mockRealizarCambio).not.toHaveBeenCalled();
    });

    it('flujo exitoso: Llama a la API, actualiza mensaje de éxito y cierra el menú', async () => {
        mockRealizarCambio.mockResolvedValueOnce({ status: 'ok' });
        
        render(<CambiarJugador {...propsBase} />);
        fireEvent.click(screen.getByTestId('btn-confirmar'));

        expect(screen.getByTestId('estado-cargando')).toHaveTextContent('true');

        await waitFor(() => {
            expect(mockRealizarCambio).toHaveBeenCalledWith(
                propsBase.idPartido, 
                propsBase.idUsuario, 
                { jugador_sale_id: 5, jugador_entra_id: 99 }
            );
        });

        expect(screen.getByTestId('estado-cargando')).toHaveTextContent('false');
        expect(screen.getByTestId('estado-mostrar')).toHaveTextContent('false');
        expect(screen.getByTestId('estado-mensaje')).toHaveTextContent(
            JSON.stringify({ tipo: 'success', mensaje: "Cambio realizado con éxito" })
        );
    });

    it('flujo de error: Atrapa el error de la API y muestra el mensaje de falla', async () => {
        mockRealizarCambio.mockRejectedValueOnce(new Error("Jugador no disponible"));
        
        render(<CambiarJugador {...propsBase} />);

        fireEvent.click(screen.getByTestId('btn-confirmar'));

        await waitFor(() => {
            expect(mockRealizarCambio).toHaveBeenCalled();
        });

        expect(screen.getByTestId('estado-cargando')).toHaveTextContent('false');
        expect(screen.getByTestId('estado-mensaje')).toHaveTextContent(
            JSON.stringify({ tipo: 'danger', mensaje: "Jugador no disponible" })
        );
    });
});