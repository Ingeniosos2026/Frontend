import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createHttpService } from './HttpService';

describe('HttpService - Cobertura del Sprint 1', () => {
  let http;
  const mockBaseUrl = 'http://localhost:8000';

  beforeEach(() => {
    http = createHttpService();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('crearUsuario: debe enviar un POST a /usuario con los datos correctos', async () => {
    const mockData = { nombre: 'Carlitos', email: 'elloquillo@gmail.com', password: 'hola777', avatar: 1, club: 'Carlitos FC' };
    const mockResponse = { id: 7, ...mockData };
    
    global.fetch.mockResolvedValue({ ok: true, json: async () => mockResponse });

    const result = await http.crearUsuario(mockData);

    expect(global.fetch).toHaveBeenCalledWith(`${mockBaseUrl}/usuario`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mockData),
    });
    expect(result).toEqual(mockResponse);
  });

  it('crearJugador: debe enviar un POST a /jugador/{usuarioId}', async () => {
    const usuarioId = 7;
    const mockData = { nombre: 'Fattori', power: 80, agility: 80, control: 80, speed: 80, strength: 100 };
    const mockResponse = { id: 8, ...mockData };

    global.fetch.mockResolvedValue({ ok: true, json: async () => mockResponse });

    const result = await http.crearJugador(usuarioId, mockData);

    expect(global.fetch).toHaveBeenCalledWith(`${mockBaseUrl}/jugador/${usuarioId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mockData),
    });
    expect(result).toEqual(mockResponse);
  });

  it('obtenerInformacionJugador: debe enviar un GET a /jugador/{usuarioId}/{jugadorId}', async () => {
    const usuarioId = 7;
    const jugadorId = 5;
    const mockResponse = { nombre: 'Galarza', power: 80, agility: 80, control: 100, speed: 80, strength: 80 };

    global.fetch.mockResolvedValue({ ok: true, json: async () => mockResponse });

    const result = await http.obtenerInformacionJugador(usuarioId, jugadorId);

    expect(global.fetch).toHaveBeenCalledWith(`${mockBaseUrl}/jugador/${usuarioId}/${jugadorId}`, {
      headers: { 'Content-Type': 'application/json' }
    });
    expect(result).toEqual(mockResponse);
  });

  it('crearComportamiento: debe enviar un POST a /comportamiento/{usuarioId}', async () => {
    const usuarioId = 7;
    const mockData = { nombre: 'Defensivo', codigo: 'def defender()' };
    const mockResponse = { id: 2, ...mockData };

    global.fetch.mockResolvedValue({ ok: true, json: async () => mockResponse });

    const result = await http.crearComportamiento(usuarioId, mockData);

    expect(global.fetch).toHaveBeenCalledWith(`${mockBaseUrl}/comportamiento/${usuarioId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mockData),
    });
    expect(result).toEqual(mockResponse);
  });

  it('obtenerInformacionComportamiento: debe enviar un GET a /comportamiento/{usuarioId}/{compId}', async () => {
    const usuarioId = 7;
    const compId = 3;
    const mockResponse = { nombre: 'Ofensivo', codigo: 'def atacar()' };

    global.fetch.mockResolvedValue({ ok: true, json: async () => mockResponse });

    const result = await http.obtenerInformacionComportamiento(usuarioId, compId);

    expect(global.fetch).toHaveBeenCalledWith(`${mockBaseUrl}/comportamiento/${usuarioId}/${compId}`, {
       headers: { 'Content-Type': 'application/json' }
    });
    expect(result).toEqual(mockResponse);
  });

  it('crearLiga: debe enviar un POST a /liga/{usuarioId}', async () => {
    const usuarioId = 7;
    const mockData = { nombre: 'Chiqui League', min: 20, max: 30, contraseña: '', duracion_partido: 5, jugadores: '[(8,2), (5,2), (6,2), (9,3), (10,3), (11,3)]', formacion: 'C-FORMACION' };
    const mockResponse = { id: 1, ...mockData };

    global.fetch.mockResolvedValue({ ok: true, json: async () => mockResponse });

    const result = await http.crearLiga(usuarioId, mockData);

    expect(global.fetch).toHaveBeenCalledWith(`${mockBaseUrl}/liga/${usuarioId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mockData),
    });
    expect(result).toEqual(mockResponse);
  });

  it('crearAmistoso: debe enviar un POST a /partido/{usuarioId}', async () => {
    const usuarioId = 7;
    const mockData = { duracion_partido: 10, jugadores: '[(8,2), (5,2), (6,2), (9,3), (10,3), (11,3)]', formacion: 'C-FORMACION' };
    const mockResponse = { id: 8, ...mockData };

    global.fetch.mockResolvedValue({ ok: true, json: async () => mockResponse });

    const result = await http.crearAmistoso(usuarioId, mockData);

    expect(global.fetch).toHaveBeenCalledWith(`${mockBaseUrl}/partido/${usuarioId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mockData),
    });
    expect(result).toEqual(mockResponse);
  });
});