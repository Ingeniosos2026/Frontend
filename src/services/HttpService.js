const createHttpService = () => {
  const baseUrl = import.meta.env.VITE_SERVER_URI || 'http://localhost:8000';

  const request = async (endpoint, options = {}) => {
    const url = `${baseUrl}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {

        let mensajeBackend = 'Error HTTP: ${response.status}';

        try {
            const errorData = await response.json();
            mensajeBackend = errorData.mensaje;
        } catch (e) {
            console.warn("El servidor no devolvió un JSON de error válido");
        }

        throw new Error(mensajeBackend);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  };

  // --- USUARIOS ---
  const crearUsuario = async (userData) => {
    return request('/usuario', {
        method: 'POST',
        body: JSON.stringify(userData)
    });
  };

  const iniciarSesion = async (credentials) => {
    return request('/usuario', {
        method: 'PUT',
        body: JSON.stringify(credentials)
    });
  };

  const obtenerRanking = async () => {
    return request('/usuarios/ranking');
  };

  // --- JUGADORES Y COMPORTAMIENTOS ---
  const crearJugador = async (usuarioId, jugadorData) => {
    return request(`/jugador/${usuarioId}`, {
        method: 'POST',
        body: JSON.stringify(jugadorData)
    });
  };

  const obtenerJugadores = async (usuarioId) => {
    return request(`/jugadores/${usuarioId}`);
  };

  const obtenerInformacionJugador = async (usuarioId, jugadorId) => {
    return request(`/jugador/${usuarioId}/${jugadorId}`);
  };

  const crearComportamiento = async (usuarioId, comportamientoData) => {
    return request(`/comportamiento/${usuarioId}`, {
        method: 'POST',
        body: JSON.stringify(comportamientoData)
    });
  };

  const obtenerComportamientos = async (usuarioId) => {
    return request(`/comportamientos/${usuarioId}`);
  };

  const obtenerInformacionComportamiento = async (usuarioId, compId) => {
    return request(`/comportamiento/${usuarioId}/${compId}`);
  };

  const asignarComportamiento = async (usuarioId, compId, jugadorId) => {
    return request(`/comportamiento/${usuarioId}/${compId}/asignar`, {
        method: 'PUT',
        body: JSON.stringify({ jugador_id: jugadorId }) 
    });
  };

  // --- LIGAS ---
  const obtenerLigas = async () => {
    return request('/ligas');
  };

  const crearLiga = async (usuarioId, ligaData) => {
    return request(`/liga/${usuarioId}`, {
        method: 'POST',
        body: JSON.stringify(ligaData)
    });
  };

  const unirseLiga = async (ligaId, usuarioId, equipoData) => {
    return request(`/liga/${ligaId}/unirse/${usuarioId}`, {
        method: 'PUT',
        body: JSON.stringify(equipoData)
    });
  };

  const abandonarLiga = async (ligaId, usuarioId) => {
    return request(`/liga/${ligaId}/abandonar/${usuarioId}`, {
        method: 'PUT'
    });
  };

  const cancelarLiga = async (ligaId, usuarioId) => {
    return request(`/liga/${ligaId}/${usuarioId}`, {
        method: 'DELETE'
    });
  };

    const iniciarLiga = async (ligaId, usuarioId) => {
    return request(`/liga/${ligaId}/${usuarioId}`, {
        method: 'PUT'
    });
  };

  // --- AMISTOSOS ---
  const obtenerAmistosos = async () => {
    return request('/partidos');
  };

  const crearAmistoso = async (usuarioId, partidoData) => {
    return request(`/partido/${usuarioId}`, {
        method: 'POST',
        body: JSON.stringify(partidoData)
    });
  };

  const unirseAmistoso = async (partidoId, usuarioId, equipoData) => {
    return request(`/partido/${partidoId}/unirse/${usuarioId}`, {
        method: 'PUT',
        body: JSON.stringify(equipoData)
    });
  };

  const iniciarAmistoso = async (partidoId, usuarioId) => {
    return request(`/partido/${partidoId}/${usuarioId}`, {
        method: 'PUT'
    });
  };

  return {
    crearUsuario,
    iniciarSesion,
    obtenerRanking,
    crearJugador,
    obtenerJugadores,
    obtenerInformacionJugador,
    crearComportamiento,
    obtenerComportamientos,
    obtenerInformacionComportamiento,
    asignarComportamiento,
    obtenerLigas,
    crearLiga,
    unirseLiga,
    abandonarLiga,
    cancelarLiga,
    iniciarLiga,
    obtenerAmistosos,
    crearAmistoso,
    unirseAmistoso,
    iniciarAmistoso
  };
};

export {
  createHttpService
};