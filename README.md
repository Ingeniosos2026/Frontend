# FutBot - Frontend

Interfaz web para la plataforma multijugador FutBot. Proyecto construido con React, Vite y Bootstrap.

## Requisitos previos
* **Node.js y NPM:** Deben estar instalados en el sistema para ejecutar el entorno de desarrollo. 
  * En distribuciones de Linux basadas en Ubuntu/Debian, puedes instalar todo lo necesario ejecutando:
    ```bash
    # Descarga e instala nvm
    $ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.7/install.sh | bash
    # en lugar de reiniciar la shell
    $ \. "$HOME/.nvm/nvm.sh"
    # Descarga e instala Node.js
    $ nvm install 22
    # Verifica la versión de Node.js, debería mostrar "v22.23.3"
    $ node -v
    # Verifica versión de npm, debería mostrar "10.9.9"
    $ npm -v
    ```
  * Para otros sistemas operativos, descárgalo directamente desde la página oficial de [Node.js](https://nodejs.org/).

## Instalación

1. Clonar el repositorio.
2. Abrir una terminal y posicionarse dentro del directorio del frontend:
   ```bash
   cd Frontend
   ```

3. Instalar todas las dependencias requeridas (incluyendo herramientas de testing y librerías de UI):
   ```bash
   npm install
   ```

## Ejecución en entorno local

Para iniciar el servidor de desarrollo con recarga rápida (Hot Module Replacement), ejecuta:
   ```bash
   npm run dev
   ```

La aplicación web estará disponible por defecto en `http://localhost:5173/`.

## Testing

Para correr la suite de pruebas (Vitest + React Testing Library), ejecuta:

   ```bash
   npm run test
   ```
