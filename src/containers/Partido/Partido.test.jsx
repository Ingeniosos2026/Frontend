import { render, screen, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi, describe, it, expect, beforeEach} from 'vitest';
import Partido from '../../containers/Partido/Partido';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { createWSService } from '../../services/WSService.js';
import { createHttpService } from '../../services/HttpService.js';

vi.mock('../../services/WSService.js');
vi.mock('../../services/HttpService.js');


vi.mock('../../components/Partido/PantallaInicial', () => ({
    default: ({ visual }) => <div data-testid="pantalla-inicial" data-izq={visual?.club_usuario_izq}>Pantalla Inicial</div>
}));

vi.mock('../../components/Partido/PantallaFinal', () => ({
    default: ({ resultadoFinal, alVolver }) => (
        <div 
            data-testid="pantalla-final" 
            data-golesizq={resultadoFinal?.goles?.izquierdo}
            data-tiene-volver={!!alVolver}
        >
            Pantalla Final
        </div>
    )
}));

vi.mock('../../components/Partido/Marcador', () => ({
    default: ({ izquierda, derecha, espectador, tiempo, alVolver }) => (
        <div 
            data-testid="marcador" 
            data-izq={izquierda} 
            data-der={derecha} 
            data-espectador={espectador} 
            data-tiempo={tiempo}
            data-tiene-volver={!!alVolver}
        >
            Marcador
        </div>
    )
}));

vi.mock('../../components/Partido/TableroCambios', () => ({
    default: () => <div data-testid="tablero-cambios">Tablero Cambios</div>
}));

vi.mock('../../components/Partido/JugadoresTabla', () => ({
    default: ({ esMio }) => <div data-testid={esMio ? "jugadores-tabla-mio" : "jugadores-tabla-rival"}>Tabla Jugadores</div>
}));

vi.mock('../../components/Partido/ActivarDt', () => ({
    default: () => <div data-testid="activar-dt">Activar DT</div>
}));

vi.mock('../../components/Partido/FondoCancha', () => ({
    default: () => <div data-testid="fondo-cancha">Fondo Cancha</div>
}));

vi.mock('../../components/Partido/JugadorRender', () => ({
    default: ({ jugador }) => <div data-testid="jugador-render" data-id={jugador.id_jugador}>Jugador</div>
}));

vi.mock('react-confetti', () => ({
    default: () => <div data-testid="confetti">Confetti</div>
}));

describe('Pruebas de Integración: Partido.jsx y PartidoComp.jsx', () => {
    let mockWsService;
    let mockHttpService;
    let wsCallbacks;

    beforeEach(() => {
        vi.clearAllMocks();

        global.ResizeObserver = class {
            observe = vi.fn();
            disconnect = vi.fn();
        };

        Storage.prototype.getItem = vi.fn((key) => {
            if (key === 'usuario_id') return '1';
            return null;
        });

        wsCallbacks = {};
        mockWsService = {
            connect: vi.fn(),
            disconnect: vi.fn(),
            on: vi.fn((event, cb) => { wsCallbacks[event] = cb; }),
            off: vi.fn((event, cb) => { 
                if(wsCallbacks[event] === cb) delete wsCallbacks[event]; 
            }),
        };
        createWSService.mockReturnValue(mockWsService);

        mockHttpService = {
            obtenerEquipo: vi.fn().mockResolvedValue({ usuario: { dt: true, club: 'Club 1' } }),
            obtenervisualPartido: vi.fn().mockResolvedValue({
                id_usuario_izq: 1,
                id_usuario_der: 2,
                club_usuario_izq: 'Riber',
                club_usuario_der: 'Boca',
                avatar_usuario_izq: 'avatar1.png',
                avatar_usuario_der: 'avatar2.png'
            }),
        };
        createHttpService.mockReturnValue(mockHttpService);
    });

    const renderizarPartido = () => {
        return render(
            <MemoryRouter initialEntries={['/partido/123']}>
                <Routes>
                    <Route path="/partido/:partido_id" element={<Partido />} />
                </Routes>
            </MemoryRouter>
        );
    };

    it('Al montar el componente se llama a PantallaInicial pasándole visual', async () => {
        renderizarPartido();
        expect(screen.getByTestId('pantalla-inicial')).toBeInTheDocument();
    });

    it('Al ocurrir evento partido_iniciado se llaman a los servicios HTTP', async () => {
        renderizarPartido();

        await act(async () => {
            wsCallbacks['partido_iniciado']();
        });

        expect(mockHttpService.obtenerEquipo).toHaveBeenCalledWith('123', 1);
        expect(mockHttpService.obtenervisualPartido).toHaveBeenCalledWith('123');
    });

    it('Al ocurrir evento reconexion_partido se llaman a los servicios HTTP', async () => {
        renderizarPartido();
        
        await act(async () => { 
            wsCallbacks['reconexion_partido']({ tiempo: 10, goles: { izquierdo: 0, derecho: 0 } }); 
        });

        expect(mockHttpService.obtenerEquipo).toHaveBeenCalledWith('123', 1);
        expect(mockHttpService.obtenervisualPartido).toHaveBeenCalledWith('123');
    });

    it('Al terminar el partido se llama a PantallaFinal con los props correctos', async () => {
        renderizarPartido();

        act(() => { wsCallbacks['partido_iniciado'](); });
        act(() => { wsCallbacks['partido_terminado']({ goles: { izquierdo: 2, derecho: 1 }, tiempo: 90 }); });

        await waitFor(() => {
            const pantallaFinal = screen.getByTestId('pantalla-final');
            expect(pantallaFinal).toBeInTheDocument();
            expect(pantallaFinal).toHaveAttribute('data-golesizq', '2');
        });
    });

    it('Al iniciar partido se llama a Marcador con los props correspondientes (sin alVolver)', async () => {
        renderizarPartido();
        
        act(() => { wsCallbacks['partido_iniciado'](); });
        act(() => { wsCallbacks['estado_partido']({ tiempo: 45, goles: { izquierdo: 0, derecho: 0 } }); });

        await waitFor(() => {
            const marcador = screen.getByTestId('marcador');
            expect(marcador).toBeInTheDocument();
            expect(marcador).toHaveAttribute('data-izq', 'Riber');
            expect(marcador).toHaveAttribute('data-tiempo', '45');
        });
    });

    it('En evento de gol se muestra Confetti siempre y cuando NO haya una pausa activa', async () => {
        renderizarPartido();

        act(() => { wsCallbacks['partido_iniciado'](); });

        await waitFor(() => {
            expect(screen.getByTestId('marcador')).toBeInTheDocument();
        });

        act(() => { wsCallbacks['estado_partido']({ tiempo: 10, goles: { izquierdo: 0, derecho: 0 } }); });
        act(() => { wsCallbacks['estado_partido']({ tiempo: 10, goles: { izquierdo: 1, derecho: 0 } }); });

        await waitFor(() => {
            expect(screen.getByTestId('confetti')).toBeInTheDocument();
            expect(screen.getByText('¡GOL!')).toBeInTheDocument();
        });

        act(() => { wsCallbacks['partido_pausado']({ tiempo: 10, numero_pausa: 2, duracion_pausa: 15 }); });

        await waitFor(() => {
            expect(screen.queryByTestId('confetti')).not.toBeInTheDocument();
            expect(screen.queryByText('¡GOL!')).not.toBeInTheDocument();
        });
    });

    it('Si soy usuario izquierdo, se renderiza mi tabla y ActivarDt a la izquierda', async () => {
        renderizarPartido();
        
        act(() => { wsCallbacks['partido_iniciado'](); });

        await waitFor(() => {
            expect(screen.getByTestId('jugadores-tabla-mio')).toBeInTheDocument();
            expect(screen.getByTestId('activar-dt')).toBeInTheDocument();
        });
    });

    it('Si soy usuario derecho, se renderizan los componentes de forma invertida', async () => {
        Storage.prototype.getItem = vi.fn(() => '2');
        renderizarPartido();
        
        act(() => { wsCallbacks['partido_iniciado'](); });

        await waitFor(() => {
            expect(screen.getByTestId('jugadores-tabla-mio')).toBeInTheDocument();
        });
    });

    it('Si soy espectador, no se llama a JugadoresTabla ni ActivarDt', async () => {
        Storage.prototype.getItem = vi.fn(() => '3');
        renderizarPartido();
        
        act(() => { wsCallbacks['partido_iniciado'](); });

        await waitFor(() => {
            expect(screen.queryByTestId('jugadores-tabla-mio')).not.toBeInTheDocument();
            expect(screen.queryByTestId('activar-dt')).not.toBeInTheDocument();
        });
    });

    it('Si ocurre pausa con cambios se llama a Tablero Cambios', async () => {
        renderizarPartido();
        act(() => { wsCallbacks['partido_iniciado'](); });

        act(() => {
            wsCallbacks['partido_pausado']({ tiempo: 45, numero_pausa: 2, duracion_pausa: 10 });
            wsCallbacks['cambio_jugador_realizado']({ sale: 1, entra: 2 });
        });

        await waitFor(() => {
            expect(screen.getByTestId('tablero-cambios')).toBeInTheDocument();
        });
    });

    it('Pausa por COOLING BREAK sin cambios muestra el texto correspondiente', async () => {
        renderizarPartido();
        act(() => { wsCallbacks['partido_iniciado'](); });

        act(() => {
            wsCallbacks['partido_pausado']({ tiempo: 30, numero_pausa: 1, duracion_pausa: 10 });
        });

        await waitFor(() => {
            expect(screen.getByText('COOLING BREAK')).toBeInTheDocument();
            expect(screen.getByText('Vuelves en 10 segundos...')).toBeInTheDocument();
        });
    });

    it('Pausa por MEDIO-TIEMPO sin cambios muestra el texto correspondiente', async () => {
        renderizarPartido();
        act(() => { wsCallbacks['partido_iniciado'](); });

        act(() => {
            wsCallbacks['partido_pausado']({ tiempo: 45, numero_pausa: 2, duracion_pausa: 15 });
        });

        await waitFor(() => {
            expect(screen.getByText('MEDIO-TIEMPO')).toBeInTheDocument();
            expect(screen.getByText('Vuelves en 15 segundos...')).toBeInTheDocument();
        });
    });

    it('Al iniciar, se llama a FondoCancha, y se renderizan Pelota y Jugadores', async () => {
        renderizarPartido();
        act(() => { wsCallbacks['partido_iniciado'](); });

        act(() => {
            wsCallbacks['estado_partido']({ 
                tiempo: 1, 
                goles: { izquierdo: 0, derecho: 0 },
                pelota: { x: 50, y: 30 },
                jugadores: [ { id_usuario: 1, id_jugador: 9, x: 20, y: 20 } ]
            });
        });

        await waitFor(() => {
            expect(screen.getByTestId('fondo-cancha')).toBeInTheDocument();
        });
        
        const pelotaElement = document.querySelector('.pelota');
        expect(pelotaElement).toBeInTheDocument();

        expect(screen.getByTestId('jugador-render')).toBeInTheDocument();
        expect(screen.getByTestId('jugador-render')).toHaveAttribute('data-id', '9');
    });

    it('Limpia los eventos y desconecta el websocket al desmontar', async () => {
        const { unmount } = renderizarPartido();
        unmount(); 

        expect(mockWsService.off).toHaveBeenCalledWith('partido_iniciado', expect.any(Function));
        expect(mockWsService.off).toHaveBeenCalledWith('estado_partido', expect.any(Function));
        expect(mockWsService.disconnect).toHaveBeenCalled();
    });

    it('En Evento partido_reanudado limpia las pantallas de pausa', async () => {
        renderizarPartido();
        act(() => { wsCallbacks['partido_iniciado'](); });

        act(() => { wsCallbacks['partido_pausado']({ tiempo: 45, numero_pausa: 2, duracion_pausa: 10 }); });
        
        await waitFor(() => {
            expect(screen.getByText('MEDIO-TIEMPO')).toBeInTheDocument();
        });

        act(() => { wsCallbacks['partido_reanudado'](); });
        
        await waitFor(() => {
            expect(screen.queryByText('MEDIO-TIEMPO')).not.toBeInTheDocument();
        });
    });

    it('Si soy espectador, el Marcador recibe espectador=true habilitando la salida', async () => {
        Storage.prototype.getItem = vi.fn(() => '3');
        renderizarPartido();
        
        act(() => { wsCallbacks['partido_iniciado'](); });
        act(() => { wsCallbacks['estado_partido']({ tiempo: 10, goles: { izquierdo: 0, derecho: 0 } }); });

        await waitFor(() => {
            const marcador = screen.getByTestId('marcador');
            expect(marcador).toHaveAttribute('data-espectador', 'true');
            expect(marcador).toHaveAttribute('data-tiene-volver', 'true');
        });
    });

    it('Al finalizar el partido, PantallaFinal recibe la función alVolver sin importar el rol', async () => {
        Storage.prototype.getItem = vi.fn(() => '1');
        renderizarPartido();
        
        act(() => { wsCallbacks['partido_iniciado'](); });
        act(() => { wsCallbacks['partido_terminado']({ goles: { izquierdo: 2, derecho: 1 }, tiempo: 90 }); });

        await waitFor(() => {
            const pantallaFinal = screen.getByTestId('pantalla-final');
            expect(pantallaFinal).toBeInTheDocument();
            expect(pantallaFinal).toHaveAttribute('data-tiene-volver', 'true');
        });
    });
});