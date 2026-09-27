const createWSService = (endpoint) => {
  let ws = null;
  let isConnected = false;
  const baseUrl = import.meta.env.VITE_WS_URI || 'ws://localhost:8000';
  const wsUrl = `${baseUrl}${endpoint}`; 
  const listeners = {};

  const emit = (event, data) => {
    if (listeners[event]) {
      listeners[event].forEach(callback => callback(data));
    }
  };

  const connect = () => {
    try {
      ws = new WebSocket(wsUrl);
      
      ws.onopen = () => {
        isConnected = true;
        console.log(`WebSocket conectado en: ${endpoint}`);
      };
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          emit(data.action, data.payload); 
        } catch (error) {
          console.error('Error parseando mensaje WS:', error);
        }
      };
      
      ws.onclose = () => {
        console.log(`WebSocket desconectado de: ${endpoint}`);
        isConnected = false;
        setTimeout(() => connect(), 3000);
      };
      
      ws.onerror = (error) => {
        isConnected = false;
        console.error(`WebSocket error en ${endpoint}:`, error);
      };
    } catch (error) {
      isConnected = false;
      console.error(`Fallo al conectar WebSocket en ${endpoint}:`, error);
    }
  };

  const on = (event, callback) => {
    if (!listeners[event]) {
      listeners[event] = [];
    }
    listeners[event].push(callback);
  };

  const off = (event, callback) => {
    if (listeners[event]) {
      listeners[event] = listeners[event].filter(cb => cb !== callback);
    }
  };

  const disconnect = () => {
    if (ws) {
      ws.close();
    }
  };

  return {
    isConnected,
    connect,
    on,
    off,
    disconnect
  };
};

export {
  createWSService
};