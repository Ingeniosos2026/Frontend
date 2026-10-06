import React from 'react';
import { Outlet } from 'react-router-dom';

const GameLayout = () => {
  return (
    <div className="layout-temporal">
      {/* El Outlet funciona como un "hueco" donde React Router inyectará FormInicioSesion o MenuInicio */}
      <Outlet /> 
    </div>
  );
}

export default GameLayout;