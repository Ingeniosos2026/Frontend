# API FUTBOT

| Metodo | Ruta | Descripción |
|---|---|---|
| POST | /usuario | Crear usuario |
| GET | /usuarios | Obtener lista de usuarios |
| GET | /usuarios/{usuario_id} | Obtener informacion de usuario |
| GET | /usuarios/ranking | Obtener ranking global |
| POST | /jugador/{usuario_id} | Crear jugador |
| GET | /jugadores/{usuario_id} | Obtener lista de jugadores |
| GET | /jugadores/{usuario_id}/{jugador_id} | Obtener info de jugador |
| DELETE | /jugadores/{usuario_id}/{jugador_id} |Eliminar jugador |
| POST | /comportamiento/{usuario_id} | Crear comportamiento |
| GET | /comportamientos/{usuario_id} | Obtener lista de comportamientos |
| PUT | /comportamiento/{usuario_id}/{comp_id} | Editar comportamiento |
| DELETE | /comportamiento/{usuario_id}/{comp_id} | Eliminar comportamiento |
| PUT | /comportamientos/asignar | Asignar comportamiento a jugador |
| POST | /liga/{usuario_id} | Crear liga |
| GET | /ligas | Obtener lista de ligas disponibles |
| PUT | /liga/{liga_id}/unirse/{usuario_id} | Unirse a una liga |
| PUT | /liga/{liga_id}/abandonar/{usuario_id} | Abandonar un liga |
| DELETE | /liga/{liga_id}/{usuario_id} | Cancelar liga |
| PUT | /liga/{liga_id}/{usuario_id} | Iniciar liga |
| POST | /partido/{usuario_id} | Crear partido amistoso |
| GET | /partidos | Obtener lista de amistosos disponibles |
| PUT | /partido/{partido_id}/unirse/{usuario_id} | Unirse a partido amistoso |
| PUT | /partido/{partido_id}/{usuario_id} | Iniciar partido amistoso |
| PUT | /partido/{partido_id}/abandonar/{usuario_id} | Abandonar partido amistoso |
| DELETE | /partido/cancelar/{partido_id}/{usuario_id} | Cancelar partido amistoso |
| WS | Actualizacion de Entidades | Actualizacion de la nueva posicion (X,Y) de los 6 titulares y la Pelota |
| WS | Actualizacion de Cronometro | Actualizacion del cronometro del partido |
| WS | Actualizacion de Marcador | Actualizacion de las anotaciones en el partido |
| WS | Inicio de Partido | Mensaje de partido inciado |
| WS | Final del Partido |  Mensaje de partido finalizado |
| WS | Actualizacion de Ventana | Actualizacion de evento para realizar cambios |

---
### DESARROLLO HTTPS

---

### POST /usuario

#### Request Body

```json
{
    "nombre": "string",
    "email": "string",
    "password": "string",
    "avatar": "int",
    "club": "string"
}
```

#### Body Response

201 Created
```json
{
  "nombre": "string",
  "id": "string"
}
```

400 Bad Request
```json

{
  "error": "DATOS_INVALIDOS",
  "mensaje": "Los datos enviados no son válidos"
}
```

409 Conflict
```json

{
  "error": "USUARIO_YA_EXISTE",
  "mensaje": "Ya existe un usuario con esos datos"
}
```

422 Unprocessable Entity
```json
{
  "error": "ERROR_VALIDACION",
  "mensaje": "Los datos no cumplen con las reglas de validación"
}
```

500 Internal Server Error
```json
{
  "error": "ERROR_INTERNO",
  "mensaje": "Ocurrió un error interno del servidor"
}
```
---

### GET /usuarios

#### Request Body
```json
No tiene
```

#### Body response

200 OK
```json
[
  {
    "id": "int",
    "nombre": "string",
    "avatar": "int"
  }
]
```

500 Internal Server Error
```json
{
  "error": "ERROR_INTERNO",
  "mensaje": "Ocurrió un error interno del servidor"
}
```

---

### GET	/usuarios/{usuario_id}

#### Request Body
```json
No tiene
```

#### Body Response

200 OK
```json
[
  {
    "id": "int",
    "nombre": "string",
    "email": "string",
    "club": "string",
    "avatar": "int"
  }
]
```

404 Not Found
```json
{
  "error": "USUARIO_NO_ENCONTRADO",
  "mensaje": "El usuario no existe"
}
```

500 Internal Server Error

```json
{
  "error": "ERROR_INTERNO",
  "mensaje": "Ocurrió un error interno del servidor"
}
```

---

### GET	/usuarios/ranking

#### Request Body
```json
No tiene
```

#### Body Response

200 ok
```json
[
  {
    "usuario_id": "int",
    "nombre": "string",
    "puntos_ranking": "int"
  }
]
```

500 Internal Server Error
```json
{
  "error": "ERROR_INTERNO",
  "mensaje": "No se pudo obtener el ranking"
}
```

---

### POST /jugador/{usuario_id}

#### Request Body
```json
{
  "nombre": "string",
  "power": "int (20-100)",
  "agility": "int (20-100)",
  "control": "int (20-100)",
  "speed": "int (20-100)",
  "strength": "int (20-100)"
}
```
#### Body Response
201 Created
```json
{
  "id": "int",
  "nombre": "str",
  "power": "int",
  "agility": "int",
  "control": "int",
  "speed": "int",
  "strength": "int"
}
```

400 Bad Request
```json
{
  "error": "DATOS_INVALIDOS",
  "mensaje": "Las estadísticas no pueden ser mayores a 100 y el total debe ser menor a 300"
}
```

500 Internal Server Error
```json
{
  "error": "ERROR_INTERNO",
  "mensaje": "Ocurrió un error interno del servidor"
}
```

---

### GET	/jugadores/{usuario_id}

#### Request Body
```json
No tiene
```
#### Body Response

200 ok
```json
[
  {
    "id": "int",
    "nombre": "string"
  }
]
```

500 Internal Server Error
```json
{
  "error": "ERROR_INTERNO",
  "mensaje": "No se pudo obtener la lista de jugadores"
}
```

---

### GET /jugadores/{usuario_id}/{jugador_id}
#### Request Body
```json
No tiene
```
#### Body Response
200 OK
```json
{
  "nombre": "str",
  "power": "int",
  "agility": "int",
  "control": "int",
  "speed": "int",
  "strength": "int"
}
```

404 Not Found
```json
{
  "error": "JUGADOR_NO_ENCONTRADO",
  "mensaje": "El jugador no existe"
}
```

500 Internal Server Error
```json
{
  "error": "ERROR_INTERNO",
  "mensaje": "Ocurrió un error interno del servidor"
}
```

---

### DELETE /jugadores/{usuario_id}/{jugador_id}
#### Request Body
```json
No tiene
```
#### Body Response
200 OK
```json
{
  "mensaje": "Se eliminó el jugador: {jugador_id}"
}
```

404 Not Found
```json
{
  "error": "JUGADOR_NO_ENCONTRADO",
  "mensaje": "El jugador no existe"
}
```

409 Conflict
```json
{
  "error": "JUGADOR_EN_USO",
  "mensaje": "No se puede eliminar un jugador en uso"
}
```

500 Internal Server Error
```json
{
  "error": "ERROR_INTERNO",
  "mensaje": "Ocurrió un error interno del servidor"
}
```

---

### POST /comportamiento/{usuario_id}
#### Request Body
```json
{
  "nombre": "string",
  "codigo": "string"
}
```

#### Body Response
201 Created
```json
{
  "id": "int",
  "nombre": "str",
  "codigo": "str"
}
```

400 Bad Request
```json
{
  "error": "DATOS_INVALIDOS",
  "mensaje": "El código ingresado para el comportamiento no es válido"
}
```

409 Conflict
```json
{
  "error": "COMPORTAMIENTO_YA_EXISTE",
  "mensaje": "No puede haber comportamientos con el mismo nombre"
}
```

422 Unprocessable Entity
```json
{
  "error": "ERROR_VALIDACION",
  "mensaje": "Los datos ingresados no cumplen con las reglas de validación"
}
```

500 Internal Server Error
```json
{
  "error": "ERROR_INTERNO",
  "mensaje": "Ocurrió un error interno del servidor"
}
```

---

### GET /comportamientos/{usuario_id}
#### Request Body
```json
No tiene
```
#### Body Response
200 OK
```json
[
  {
    "id": "int",
    "nombre": "str",
    "codigo": "str"
  }
]
```

404 Not Found
```json
{
  "error": "COMPORTAMIENTOS_NO_ENCONTRADOS",
  "mensaje": "No hay comportamientos disponibles"
}
```

500 Internal Server Error
```json
{
  "error": "ERROR_INTERNO",
  "mensaje": "Ocurrió un error interno del servidor"
}
```

---

### PUT /comportamiento/{usuario_id}/{comp_id}
#### Request Body
```json
{
    "nombre": "str",
    "codigo": "str"
}
```
#### Body Response
200 OK
```json
{
    "comp_id": "int",
}
```
400 Bad Request
```json
{
  "error": "DATOS_INVALIDOS",
  "mensaje": "Los datos enviados no son válidos"
}
```
404 Not Found
```json
{
  "error": "COMPORTAMIENTO_NO_ENCONTRADO",
  "mensaje": "El comportamiento no existe"
}
```
409 Conflict
```json
{
  "error": "NOMBRE_EN_USO",
  "mensaje": "Ya existe otro comportamiento con ese nombre"
}
```
422 Unprocessable Entity
```json
{
  "error": "ERROR_VALIDACION",
  "mensaje": "El codigo no cumple con las reglas de validación"
}
```
500 Internal Server Error
```json
{
  "error": "ERROR_INTERNO",
  "mensaje": "No se pudo modificar el comportamiento"
}
```

---

### DELETE /comportamiento/{usuario_id}/{comp_id}
#### Request Body
```json
No tiene
```
#### Body Response
200 OK
```json
{
    "mensaje": "Comportamiento eliminado correctamente"
}
```
404 Not Found
```json
{
  "error": "COMPORTAMIENTO_NO_ENCONTRADO",
  "mensaje": "El comportamiento no existe"
}
```
409 Conflict
```json
{
  "error": "COMPORTAMIENTO_EN_USO",
  "mensaje": "No se puede eliminar el comportamiento porque está asignado a un jugador activo en un partido"
}
```
500 Internal Server Error
```json
{
  "error": "ERROR_INTERNO",
  "mensaje": "No se pudo eliminar el comportamiento"
}
```

---

### PUT /comportamientos/asignar
#### Request Body
```json
{
    "comp_id" : "int",
    "jugador_id": "int" 
}
```
#### Body Response
200 OK
```json
{
    "comp_id": "int",
    "jugador_id": "int"
}
```
404 Not Found
```json
{
  "error": "RECURSO_NO_ENCONTRADO",
  "mensaje": "El jugador o el comportamiento no existe"
}
```
500 Internal Server Error
```json
{
  "error": "ERROR_INTERNO",
  "mensaje": "No se pudo asignar el comportamiento"
}
```

---

### POST /liga/{usuario_id}
#### Request Body
```json
{
    "nombre": "str",
    "min": "int",
    "max": "int",
    "contraseña": "str",
    "duracion": "int"
}
```
#### Body Response
200 OK
```json
{
    "liga_id": "int"
}
```
400 Bad Request
```json
{
  "error": "DATOS_INVALIDOS",
  "mensaje": "Los datos de la liga no son válidos"
}
```
422 Unprocessable Entity
```json
{
  "error": "ERROR_VALIDACION",
  "mensaje": "El minimo de jugadores debe ser mayor o igual a 3"
}
```
500 Internal Server Error
```json
{
  "error": "ERROR_INTERNO",
  "mensaje": "No se pudo crear la liga"
}
```

---

### GET /ligas
#### Request Body
```json
No tiene
```
#### Body Response
200 OK
```json
[
    {
        "nombre": "int",
        "max": "int",
        "conectados": "int"
    }
]
```
500 Internal Server Error
```json
{
  "error": "ERROR_INTERNO",
  "mensaje": "No se pudo obtener la lista de ligas"
}
```

---

### PUT /liga/{liga_id}/unirse/{usuario_id}
#### Request Body
```json
No tiene
```
#### Body Response
200 OK
```json

{
    "liga_id": "int",
    "mensaje": "string"
}
```

404 Not Found
```json

{
    "error": "RECURSO_NO_ENCONTRADO",
    "mensaje": "La liga o el usuario no existe"
}
```

409 Conflict
```json

{
    "error": "NO_SE_PUEDE_UNIR",
    "mensaje": "El usuario no puede unirse a la liga"
}
```

500 Internal Server Error
```json
{
    "error": "ERROR_INTERNO",
    "mensaje": "No se pudo unir el usuario a la liga"
}
```

---

### PUT /liga/{liga_id}/abandonar/{usuario_id}
#### Request Body
```json
No tiene
```
#### Body Response
200 OK
```json
{
    "liga_id": "int",
    "mensaje": "string"
}
```

404 Not Found
```json
{
    "error": "RECURSO_NO_ENCONTRADO",
    "mensaje": "La liga o el usuario no existe"
}
```

409 Conflict
```json
{
    "error": "NO_SE_PUEDE_ABANDONAR",
    "mensaje": "El usuario no puede abandonar la liga"
}
```

500 Internal Server Error
```json
{
    "error": "ERROR_INTERNO",
    "mensaje": "No se pudo abandonar la liga"
}
```
 ---
### DELETE /liga/{liga_id}/{usuario_id}
#### Request Body
```json
No tiene
```
#### Body Response
200 OK
```json
{
    "mensaje": "string"
}
```

404 Not Found
```json
{
    "error": "LIGA_NO_ENCONTRADA",
    "mensaje": "La liga no existe"
}
```

409 Conflict
```json
{
    "error": "LIGA_NO_PUEDE_CANCELARSE",
    "mensaje": "La liga no puede cancelarse en su estado actual"
}
```

500 Internal Server Error
```json
{
    "error": "ERROR_INTERNO",
    "mensaje": "No se pudo cancelar la liga"
}
```
---
### PUT /liga/{liga_id}/{usuario_id}
#### Request Body
```json
No tiene
```
#### Body Response
200 OK
```json
{
    "estado": "string",
    "mensaje": "string"
}
```

404 Not Found
```json
{
    "error": "LIGA_NO_ENCONTRADA",
    "mensaje": "La liga no existe"
}
```

409 Conflict
```json
{
    "error": "LIGA_NO_PUEDE_INICIAR",
    "mensaje": "La liga no puede iniciarse en su estado actual"
}
```

500 Internal Server Error
```json
{
    "error": "ERROR_INTERNO",
    "mensaje": "No se pudo iniciar la liga"
}
```
---
### POST /partido/{usuario_id}
#### Request Body
```json
{
  "nombre": "str",
  "duracion": "int"
}
```
#### Body Response
201 OK
```json
{
  "partido_id": "int",
  "duracion": "int"
}
```

400 Bad Request
```json
{
  "error": "DATOS_INVALIDOS",
  "mensaje": "Los datos del partido no son válidos"
}
```

500 Internal Server Error
```json
{
  "error": "ERROR_INTERNO",
  "mensaje": "No se pudo crear el partido"
}
```

---
### GET /partidos
#### Request Body
```json
No tiene
```
#### Body Response
200 OK
```json
[
  {
    "id": "int",
    "nombre": "string",
    "estado": "string",
    "cantidad_jugadores": "int",
    "max_jugadores": "int"
  }
]
```

500 Internal Server Error
```json
{
  "error": "ERROR_INTERNO",
  "mensaje": "No se pudo obtener la lista de partidos"
}
```
---
### PUT /partido/{partido_id}/unirse/{usuario_id}
#### Request Body
```json
No tiene
```
#### Body Response
200 OK
```json
{
  "mensaje": "Te has unido al partido"
}
```

400 Bad Request
```json
{
  "error": "PARTIDO_LLENO",
  "mensaje": "El partido ya cuenta con los 2 jugadores necesarios"
}
```

404 Not foubnd
```json
{
  "error": "NO_ENCONTRADO",
  "mensaje": "El partido o el usuario no existen"
}
```

500 Internal server error
```json
{
  "error": "ERROR_INTERNO",
  "mensaje": "No se pudo completar la accion de unirse al partido"
}
```
---
### PUT /partido/{partido_id}/{usuario_id}
#### Request Body
```json
No tiene
```
#### Body Response
200 OK
```json
{
  "mensaje": "El partido ha comenzado"
}
```

400 Bad Request
```json
{
  "error": "FALTAN_JUGADORES",
  "mensaje": "Se necesitan 2 jugadores unidos para poder iniciar el partido"
}
```
500 Internal server error
```json
{
  "error": "ERROR_INTERNO",
  "mensaje": "Ocurrio un error al intentar iniciar el partido"
}
```
---
### PUT /partido/{partido_id}/abandonar/{usuario_id}
#### Request Body
```json
No tiene
```
#### Body Response
200 OK
```json
{
  "mensaje": "Has abandonado el partido"
}
```

400 Bad Request
```json
{
  "error": "PARTIDO_EN_CURSO",
  "mensaje": "No puedes abandonar un partido que ya ha comenzado"
}
```

500 Internal server error
```json
{
  "error": "ERROR_INTERNO",
  "mensaje": "Ocurrio un error al intentar abandonar el partido"
}
```
---
### DELETE /partido/cancelar/{partido_id}/{usuario_id}
#### Request Body
```json
No tiene
```
#### Body Response

200 OK
```json
{
  "mensaje": "Partido cancelado"
}
```

400 Bad Request
```json
{
  "error": "PARTIDO_EN_CURSO",
  "mensaje": "No se puede cancelar un partido que ya esta en curso o finalizado"
}
```

500 Internal Server Error
```json
{
  "error": "ERROR_INTERNO",
  "mensaje": "No se pudo cancelar el partido debido a un error del servidor"
}
```

---
### DESARROLLO WEBSOCKETS
---

<!-- Entidades: (Jugadores, pelota)-->
### WS Actualizacion de Entidades


#### Body Response
```json
{
  "action": "Position_update",
  "payload": "json"
}
```

### WS Actualizacion de Cronometro
#### Body Response
```json
{
  "action": "Time_update",
  "payload": "json"
}
```

### WS Actualizacion de Marcador
#### Body Response
```json
{
  "action": "Score_update",
  "payload": "json"
}
```

### WS Inicio de Partido
#### Body Response
```json
{
  "action": "Start_game",
  "payload": "json"
}
```

### WS Final de Partido
#### Body Response
```json
{
  "action": "end_game",
  "payload": "json"
}
```
<!-- Ventana de partido =(Mediotiempo, Pausa de hidratacion) -->

### WS Actualizacion de Ventana
#### Body Response
```json
{
  "action": "window_game",
  "payload": "json"
}
```
