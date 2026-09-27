# FutBot - Frontend

Interfaz web para la plataforma multijugador FutBot. Proyecto construido con React, Vite y Bootstrap.

## Requisitos previos
* **Node.js y NPM:** Deben estar instalados en el sistema para ejecutar el entorno de desarrollo. 
  * En distribuciones de Linux basadas en Ubuntu/Debian, puedes instalar todo lo necesario ejecutando:
    ```bash
    sudo apt update
    sudo apt install npm
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

La cátedra exige que todo el código nuevo esté respaldado por Unit Tests antes de considerarlo DONE y mergearlo a la rama de desarrollo. Para correr la suite de pruebas (Vitest + React Testing Library), ejecuta:

   ```bash
   npm run test
   ```
