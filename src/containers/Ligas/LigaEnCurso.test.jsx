import '@testing-library/jest-dom';
import { render, screen, waitFor, within, act, fireEvent } from '@testing-library/react';import { describe, it, expect, vi, beforeEach } from 'vitest';
import LigaEnCurso from './LigaEnCurso';

// metodos mockeados

const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
    useParams: () => ({ liga_id: '1' }),
    useNavigate: () => mockNavigate,
    useLocation: () => ({ state: {} })
}));

const mockHttpService = {
    obtenerTablaLiga: vi.fn(),
    obtenerFixtureLiga: vi.fn()
};
vi.mock('../../services/HttpService', () => ({
    createHttpService: () => mockHttpService
}));

let wsCallbacks = {};
const mockWsService = {
    connect: vi.fn(),
    disconnect: vi.fn(),
    on: vi.fn((evento, callback) => {
        wsCallbacks[evento] = callback;
    }),
    off: vi.fn((evento) => {
        delete wsCallbacks[evento];
    })
};
vi.mock('../../services/WSService', () => ({
    createWSService: () => mockWsService
}));

// datos mockeados

const MI_USUARIO_ID = 10;

const mockTablaInicial = [
    { id_equipo: 1, nombre_club: 'Equipo A', puntos: 3, partidos_ganados: 1, partidos_empatados: 0, partidos_perdidos: 0, goles_a_favor: 2, goles_en_contra: 0 },
    { id_equipo: 2, nombre_club: 'Mi Equipo', puntos: 0, partidos_ganados: 0, partidos_empatados: 0, partidos_perdidos: 1, goles_a_favor: 0, goles_en_contra: 2 }
];

const mockFixtureInicial = [
    { 
        turno: 1, 
        id_partido: null,
        goles_izq: null,
        goles_der: null,
        equipo_izq: { id_equipo: 1, id_usuario: 5, nombre_club: 'Equipo A' }, 
        equipo_der: { id_equipo: 2, id_usuario: MI_USUARIO_ID, nombre_club: 'Mi Equipo' } 
    }
];


describe('contenedor LigaEnCurso con render de LigaEnCursoComp', () => {

    beforeEach(() => {
        vi.resetAllMocks();
        wsCallbacks = {};
        
        Storage.prototype.getItem = vi.fn((key) => {
            if (key === 'usuario_id') return MI_USUARIO_ID.toString();
            return null;
        });
        Storage.prototype.setItem = vi.fn();
    });

    it('renderiza los datos reales de HTTP al montar', async () => {
        mockHttpService.obtenerTablaLiga.mockResolvedValueOnce(mockTablaInicial);
        mockHttpService.obtenerFixtureLiga.mockResolvedValueOnce(mockFixtureInicial);

        render(<LigaEnCurso />);

        expect(await screen.findByText('Estadisticas de la Liga')).toBeInTheDocument();

        const filas = screen.getAllByRole('row');
        const filaEquipoA = filas.find(fila => fila.textContent.includes('Equipo A'));
        const filaMiEquipo = filas.find(fila => fila.textContent.includes('Mi Equipo'));
        
        expect(filaEquipoA).toBeDefined();
        expect(filaMiEquipo).toBeDefined();
        expect(within(filaEquipoA).getByText('3')).toBeInTheDocument();
        expect(within(filaMiEquipo).getByText('2')).toBeInTheDocument();
    });

    it('actualiza la tabla visualmente al recibir evento "resultado_partido"', async () => {
        mockHttpService.obtenerTablaLiga.mockResolvedValueOnce(mockTablaInicial);
        mockHttpService.obtenerFixtureLiga.mockResolvedValueOnce(mockFixtureInicial);

        render(<LigaEnCurso />);
        await screen.findByText('Estadisticas de la Liga');

        const payloadResultado = {
            fixture: { 
                turno: 1, 
                id_partido: 100, 
                goles_izq: 1, 
                goles_der: 1,
                equipo_izq: { id_equipo: 1, id_usuario: 5, nombre_club: 'Equipo A' }, 
                equipo_der: { id_equipo: 2, id_usuario: MI_USUARIO_ID, nombre_club: 'Mi Equipo' } 
            },
            tabla_actualizada: [
                { id_equipo: 1, nombre_club: 'Equipo A', puntos: 6, partidos_ganados: 1, partidos_empatados: 1, partidos_perdidos: 0, goles_a_favor: 3, goles_en_contra: 1 },
                { id_equipo: 2, nombre_club: 'Mi Equipo', puntos: 9, partidos_ganados: 0, partidos_empatados: 1, partidos_perdidos: 1, goles_a_favor: 1, goles_en_contra: 3 }
            ]
        };

        act(() => {
            wsCallbacks['resultado_partido'](payloadResultado);
        });

        const filas = screen.getAllByRole('row');
        const filaEquipoA = filas.find(fila => fila.textContent.includes('Equipo A'));
        const filaMiEquipo = filas.find(fila => fila.textContent.includes('Mi Equipo'));
        
        await waitFor(() => {
            expect(within(filaEquipoA).getByText('6')).toBeInTheDocument();
            expect(within(filaMiEquipo).getByText('9')).toBeInTheDocument();
            expect(screen.getByText('Finalizado')).toBeInTheDocument();
        });
    });

    it('renderiza pantalla de Finalizada al recibir error LIGA_NO_DISPONIBLE', async () => {
        mockHttpService.obtenerTablaLiga.mockRejectedValueOnce({ 
            tipo: "LIGA_NO_DISPONIBLE", 
            message: "La liga terminó" 
        });

        render(<LigaEnCurso />);

        const tituloFinalizada = await screen.findByText('Resultados Finales');
        expect(tituloFinalizada).toBeInTheDocument();
        expect(screen.getByText('LIGA FINALIZADA')).toBeInTheDocument();
    });

    it('navega automáticamente al recibir "proximo_partido" y es nuestro turno', async () => {
        mockHttpService.obtenerTablaLiga.mockResolvedValue(mockTablaInicial);
        mockHttpService.obtenerFixtureLiga.mockResolvedValue(mockFixtureInicial);

        render(<LigaEnCurso />);

        await screen.findAllByText('Equipo A');

        act(() => {
            wsCallbacks['proximo_partido']({ 
                id_partido: 100, 
                id_proximo_partido: 100, 
                turno: 1 
            });
        });

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/partido/100', { 
                state: { returnTo: '/ligas/en_curso/1' } 
            });
        });
    });

    it('al montar redirige automaticamente al partido si es nuestro turno', async () => {
        const mockFixtureConPartidoCreado = [
            { 
                turno: 1, 
                id_partido: 250, 
                goles_izq: null,
                goles_der: null,
                equipo_izq: { id_equipo: 1, id_usuario: 5, nombre_club: 'Equipo A' }, 
                equipo_der: { id_equipo: 2, id_usuario: MI_USUARIO_ID, nombre_club: 'Mi Equipo' } 
            }
        ];

        mockHttpService.obtenerTablaLiga.mockResolvedValue(mockTablaInicial);
        mockHttpService.obtenerFixtureLiga.mockResolvedValue(mockFixtureConPartidoCreado);

        render(<LigaEnCurso />);

        await screen.findAllByText('Equipo A');

        expect(mockNavigate).toHaveBeenCalledWith('/partido/250', { 
            state: { returnTo: '/ligas/en_curso/1' } 
        });
    });

    it('no redirige automáticamente al montar si el partido actual no es del usuario, pero permite verlo con el botón', async () => {
        const mockFixtureEspectador = [
            { 
                turno: 1, 
                id_partido: 300,
                goles_izq: null,
                goles_der: null,
                equipo_izq: { id_equipo: 1, id_usuario: 5, nombre_club: 'Equipo A' }, 
                equipo_der: { id_equipo: 2, id_usuario: 6, nombre_club: 'Equipo B' } 
            }
        ];

        mockHttpService.obtenerTablaLiga.mockResolvedValue(mockTablaInicial);
        mockHttpService.obtenerFixtureLiga.mockResolvedValue(mockFixtureEspectador);

        render(<LigaEnCurso />);

        await screen.findAllByText('Equipo A');

        expect(mockNavigate).not.toHaveBeenCalled();

        const botonVerPartido = await screen.findByRole('button', { name: /ver partido/i });
        fireEvent.click(botonVerPartido);

        expect(mockNavigate).toHaveBeenCalledWith('/partido/300', { 
            state: { returnTo: '/ligas/en_curso/1' } 
        });
    });
});