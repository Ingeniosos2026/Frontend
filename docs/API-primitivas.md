# Primitivas
## De Accion:
---
     correr(destino: coordenadas)
##### Argumento: 
        destino: coordenadas a las que se desea desplazar el jugador.
##### Resultado: modifica el estado de la partida actualizando la posición del jugador.
---
     patear(direccion: coordenadas)
##### Argumento:
        direccion: coordenadas de la direccion a la que se desea enviar la pelota.

##### Resultado: modifica el estado de la partida actualizando el estado de la pelota.
---
 ## De Consulta:
      direccionPelota()
##### Argumento: ninguno.
##### Resultado: devuelve las coordenadas donde se encuentra la pelota.
---
    direccionCompanero(companero: int)
##### Argumento: recibe un id de un companero de equipo.
##### Resultado: devuelve las coordenadas donde se encuentra el companero de equipo.
---
    direccionRival(rival: int)
##### Argumento: recibe un id de un jugador rival.
##### Resultado: devuelve las coordenadas donde se encuentra ese jugador rival.
---
    direccionArcoRival()
##### Argumento: ninguno.
##### Resultado: devuelve las coordenadas donde se encuentra el arco del equipo rival.
---
    pelotaCerca(jugador: int)
##### Argumento: recibe un id de un jugador.
##### Resultado: verdadero si la pelota se encuentra dentro de la distancia considerada cercana al jugador, falso en caso contrario.
---
    direccionArcoPropio()
##### Argumento: ninguno.
##### Resultado: devuelve las coordenadas donde se encuentra el arco del equipo propio.
