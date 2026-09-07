# Alcance del Proyecto

El sistema es un videojuego sobre una plataforma web multijugador que está basado en una versión simplificada del fútbol, donde cada usuario administra un club, crea jugadores, escribe comportamientos y arma su equipo.

Cada usuario dispondrá de 3 jugadores activos en cancha y 3 suplentes, los partidos se juegan solos, en vivo y la única forma que tiene el usuario de interactuar con el partido es asignando un comportamiento, a cada jugador, previamente desarrollados por el usuario y validados por el sistema.

Existen dos formas de jugar partidos, la primera es compitiendo en una liga contra otros usuarios. La otra es mediante partidos amistosos, donde dos usuarios eligen y juegan un partido único.

Las ligas cuentan con una tabla en la que se posicionan los usuarios de acuerdo a los criterios de ordenamiento.

Además existe un ranking global que ordena a los usuarios de acuerdo al puntaje que van sumando en las ligas públicas o amistosos que juegan.

#### Este sistema presenta los siguientes requerimientos:


1. **Usuario**: Al ingresar por primera vez un visitante o actor externo debe registrarse para agregar su usuario al sistema:
- Nombre de Usuario y contraseña
- Email único: (No puede repetirse entre los distintos usuarios)
- Nombre del club: (Si puede repetirse entre los distintos usuarios)
- Avatar: Imagen representativa del club
2. **Jugador**: Los usuarios pueden crear cantidad ilimitadas de jugadores para el club con sus respectivos atributos, estos no se pueden editar una vez creados, pero sí se pueden eliminar. Los campos para crear al jugador son: 
- Nombre
- Atributos: Tales como velocidad, control, fuerza, poder, agilidad. A cada uno de estos se le debe asignar un valor entre 20 y 100, y la suma total de los atributos debe ser exactamente 300.
3. **Liga**: Los usuarios pueden crear ligas, a los cuales se le unen otros usuarios para participar. Para crear una liga se necesitan los siguientes campos: 
- Nombre de liga.
- Privacidad: Puede ser pública o privada (esta última requiere contraseña). 
- Cantidad de clubes: Un mínimo (no puede ser menor a 3) y un máximo de clubes.
- Duración del partido: Se configura a nivel de liga (ej. 5 minutos)

4. **Tabla de Liga**: Muestra los resultados de los partidos finalizados. El criterio de ordenamiento es en orden descendente y se define por el puntaje acumulado (tres puntos por victoria y uno por empate) y, en caso de igualdad, por diferencia de goles. Cada fila representa a un usuario e incluye las siguientes columnas:
- Puntos totales obtenidos.
- Goles a favor, goles en contra y diferencia de goles.
- Cantidad de partidos jugados.
  
5. **Comportamiento**: Los jugadores se controlan mediante comportamientos previamente programados. Para crear un comportamiento se necesita:
- Nombre del comportamiento.
- Código de Python: El usuario debe codificar el comportamiento en python empleando la API de primitivas de comportamientos.
- Edición: El código de los comportamientos no se puede editar durante un partido en juego para garantizar seguridad y consistencia.

6. **Partido**: Al unirse a una liga o un partido amistoso, el usuario debe seleccionar exactamente 6 jugadores con un comportamientos asignado por jugador (3 titulares y 3 suplentes) y una formación inicial del equipo, además se debe tener en cuenta que: 
- Cambios de comportamientos: Durante el partido, a un jugador se le puede reasignar otro comportamiento.
- Cambios: Se pueden hacer cambios de hasta 3 jugadores por partido, únicamente durante las pausas, que constituyen  el medio tiempo y dos pausas de hidratación.
- Las formaciones del equipo son posiciones en las que arrancan los tres jugadores en cancha al principio y luego de cada pausa. Se debe elegir entre las formaciones: defensiva, ofensiva, C-formación y D-formación.
- Por partido se asignan tres puntos por victoria, uno por empate y cero por derrota, que se determinan por la diferencia de goles en el resultado final.

#### Fuera del alcance de este proyecto se encuentran las siguientes restricciones:

- El usuario no puede controlar a los jugadores directamente, únicamente  puede declarar el comportamiento mediante bloques de código predefinidos.
- El sistema no contempla el desarrollo de faltas, penales, tiros libres, tarjetas, fueras de juego, saques laterales, tiros de esquina, lesiones o la figura reglamentaria del arquero.
- La pelota no sale del campo de juego y rebota de forma continua en los límites del mínimo, la simulación física resuelve choques e impulsos de manera determinista.
