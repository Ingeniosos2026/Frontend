// src/layouts/AppLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import fondoGlobal from '../assets/fondoMenuPrincipal.jpg';

export default function AppLayout() {
  return (
    <div 
      className="min-vh-100 w-100 d-flex flex-column"
      style={{
        backgroundImage: `url(${fondoGlobal})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="flex-grow-1">
        <Outlet /> 
      </div>
    </div>
  );
}