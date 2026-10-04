import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

//IMPORTACION DE CONTENEDORES
import ModuloConstruccion from './components/ModuloConstruccion';

//Layouts (Envolturas visuales)
import AuthLayout from './layouts/AuthLayout';
import AppLayout from './layouts/AppLayout';
import LobbyLayout from './layouts/LobbyLayout';
import GameLayout from './layouts/GameLayout';

//Contenedores Auth
import MenuInicio from './containers/Auth/MenuInicio';
import FormInicioSesion from './containers/Auth/InicioSesion';
import FormRegistro from './containers/Auth/Registro';

//Contenedores Dashboard/Menu/Hub
import MenuPrincipal from './components/MenuPrincipal';

import MenuJugador from './containers/Jugadores/MenuJugador';
import CrearJugador from './containers/Jugadores/CrearJugador';

// import MenuComp from './containers/Comportamientos/MenuComp';
// import CrearComp from './containers/Comportamientos/CrearComp';
// import EditarComp from './containers/Comportamientos/EditarComp';

//Contenedores Liga
import MenuLigaLogic from './containers/Ligas/MenuLiga';
// import CrearLiga from './containers/Ligas/CrearLiga';
// import LobbyLiga from './containers/Ligas/LobbyLiga';

// //Contenedores Amistoso
// import MenuAmistoso from './containers/Amistosos/MenuAmistoso';
// import CrearAmistoso from './containers/Amistosos/CrearAmistoso';
// import LobbyAmistoso from './containers/Amistosos/LobbyAmistoso';

// //Contenedor Partidp
// import Partido from './containers/partido';

export default function App() {
  const isAuthenticated = !!localStorage.getItem('usuario_id');
  return (
    <BrowserRouter>
      <Routes>
      
        {/*Rutas Auth*/}
        <Route element={<AuthLayout/>}>
          <Route path="/auth" element={<MenuInicio />} />
          <Route path="/auth/login" element={<FormInicioSesion/>} />
          <Route path="/auth/registro" element={<FormRegistro />} />
        </Route>

        <Route element={<AppLayout/>}>
          {/*Ruta MAIN_PAGE*/}
          <Route path="/main" element={<MenuPrincipal />}
        </Route>

        {/*Rutas liga*/}
        <Route path="/ligas" element={<MenuLigaLogic />} />
        <Route path="/ligas/crear" element={<ModuloConstruccion />} />

        {/*Rutas Amistoso*/}
        <Route path="/amistosos" element={<ModuloConstruccion />} />
        <Route path="/amistosos/crear" element={<ModuloConstruccion />} />

        {/*Rutas Jugador*/}
        <Route path="/jugadores" element={<MenuJugador />} />
        <Route path="/jugadores/crear" element={<CrearJugador/>} />

        {/*Rutas Comportamiento*/}          
        <Route path="/comportamientos" element={<ModuloConstruccion/>} />
        <Route path="/comportamientos/crear" element={<ModuloConstruccion/>} />
        <Route path="/comportamientos/editar/:comp_id" element={<ModuloConstruccion/>} />

        {/*Rutas Lobby*/} 
        <Route element={<LobbyLayout />}>   
          <Route path="/ligas/lobby/:liga_id" element={<ModuloConstruccion/>} />
          <Route path="/amistosos/lobby/:partido_id" element={<ModuloConstruccion/>} />
        </Route>

        {/*Ruta Partido*/} 
        <Route element={<GameLayout />}>
          <Route path="/partido/:partido_id" element={<ModuloConstruccion/>} />
        </Route>

        <Route 
          path="/" 
          element={<Navigate to={isAuthenticated ? "/main" : "/auth"} replace />} 
        />
        
        <Route 
          path="*" 
          element={<Navigate to={isAuthenticated ? "/main" : "/auth"} replace />} 
        />

      </Routes>
    </BrowserRouter>
  )
}

