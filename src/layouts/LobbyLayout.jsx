import React from 'react';
import { Outlet } from 'react-router-dom';

const LobbyLayout = () => {
  return (
    <div className="layout-temporal">
      {/* El Outlet funciona como un "hueco" donde React Router inyectará FormInicioSesion o MenuInicio */}
      <Outlet /> 
    </div>
  );
}

export default LobbyLayout;