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

        let mensajeBackend = `Error HTTP: ${response.status}`;
        let errorTipo = null;

        try {
          const errorData = await response.json();
          console.error("Respuesta de error del backend:", errorData);
          if (errorData.mensaje) {
            mensajeBackend = errorData.mensaje;
          } else if (errorData.detail) {
            mensajeBackend = JSON.stringify(errorData.detail);
          }
          if (errorData.error) {
            errorTipo = errorData.error;
          }
        } catch (e) {
            console.warn("El servidor no devolvió un JSON de error válido");
        }

        const err = new Error(mensajeBackend);
        if (errorTipo) {
          err.tipo = errorTipo;
        }
        throw err;
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

  const editarComportamiento = async (usuarioId,compId, comportamientoData) => {
    return request(`/comportamiento/${usuarioId}/${compId}`, {
        method: 'PUT',
        body: JSON.stringify(comportamientoData)
    });
  };

  const cambiarComportamiento = async (partidoId, cambioData) => {
    return request(`/partido/${partidoId}/cambiar/comportamiento`, {
        method: 'PUT',
        body: JSON.stringify(cambioData) 
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

  const obtenerFixtureLiga = async (ligaId) => {
    const data = await request(`/liga/${ligaId}/fixture`);
    return data.fixture;
  };

  const obtenerTablaLiga = async (ligaId) => {
    const data = await request(`/liga/${ligaId}/tabla`);
    return data.tabla;
  };

  // --- AMISTOSOS ---
  const obtenerAmistosos = async (usuarioId) => {
    return request(`/partidos/${usuarioId}`)
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

  const obtenerEquipoLiga = async (ligaId, equipoId) => {
    return request(`/liga/${ligaId}/equipo/${equipoId}`);
  }

  const actualizarEquipoLiga = async (ligaId, usuarioId, datos) => {
    return request(`/liga/${ligaId}/alineacion/${usuarioId}`, {
        method: "PUT",
        body: JSON.stringify(datos)
    });
  }
  // --- EQUIPO ---
  const realizarCambio = async (partidoId, usuarioId, cambioData) => {
    return request(`/partido/${partidoId}/${usuarioId}/cambio`, {
        method: 'PUT',
        body: JSON.stringify(cambioData)
    });
  };

  const obtenerEquipo = async (partidoId, usuarioId) => {
      return request(`/partido/${partidoId}/${usuarioId}`, {
          method: 'GET',
      });
  };

  const obtenervisualPartido = async (partidoId) => {
    return request(`/partido/${partidoId}/info`, {
        method: 'GET'
    });
  };
  
  const crearComportamientoDt = async (usuarioId, comportamientoData) => {
    return request(`/comportamiento_dt/${usuarioId}`, {
        method: 'POST',
        body: JSON.stringify(comportamientoData)
    });
  };

  const obtenerComportamientosDt = async (usuarioId) => {
    return request(`/comportamientos_dt/${usuarioId}`);
  };

  const cambiarEstadoDirectorTecnico = async (usuarioId, partidoId) => {
    return request(`/partido/${partidoId}/${usuarioId}/dt`, {
        method: 'PUT'
    });
  };

  const asignarComportamientoDt = async (usuarioId, compId) => {
    return request(`/comportamiento_dt/${usuarioId}/${compId}/asignar`, {
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
    editarComportamiento,
    cambiarComportamiento,
    obtenerLigas,
    obtenerFixtureLiga,
    obtenerTablaLiga,
    crearLiga,
    unirseLiga,
    abandonarLiga,
    cancelarLiga,
    iniciarLiga,
    obtenerAmistosos,
    crearAmistoso,
    unirseAmistoso,
    iniciarAmistoso,
    realizarCambio,
    obtenerEquipo,
    obtenervisualPartido,
    cambiarEstadoDirectorTecnico,
    crearComportamientoDt,
    obtenerComportamientosDt,
    asignarComportamientoDt,
    obtenerEquipoLiga,
    actualizarEquipoLiga
  };
};

export {
  createHttpService
};