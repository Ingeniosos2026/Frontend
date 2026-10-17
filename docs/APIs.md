# API FUTBOT

| Metodo | Ruta | Descripción |
|---|---|---|
| POST | /usuario | Crear usuario |
| PUT | /usuario | Iniciar sesion |
| GET | /usuarios | Obtener lista de usuarios |
| GET | /usuario/{usuario_id} | Obtener informacion de usuario |
| GET | /usuarios/ranking | Obtener ranking global |
| POST | /jugador/{usuario_id} | Crear jugador |
| GET | /jugadores/{usuario_id} | Obtener lista de jugadores |
| GET | /jugador/{usuario_id}/{jugador_id} | Obtener informacion del jugador |
| PUT | /jugador/{usuario_id}/{jugador_id} |Sustituir jugador |
| DELETE | /jugador/{usuario_id}/{jugador_id} |Eliminar jugador |
| POST | /comportamiento/{usuario_id} | Crear comportamiento |
| GET | /comportamientos/{usuario_id} | Obtener lista de comportamientos |
| GET | /comportamiento/{usuario_id}/{comp_id} | Obtener detalle de comportamiento |
| PUT | /comportamiento/{usuario_id}/{comp_id} | Editar comportamiento |
| DELETE | /comportamiento/{usuario_id}/{comp_id} | Eliminar comportamiento |
| PUT | /comportamiento/{usuario_id}/{comp_id}/asignar | Asignar comportamiento a jugador |
| POST | /liga/{usuario_id} | Crear liga |
| GET | /ligas | Obtener lista de ligas disponibles |
| GET | /liga/{liga_id}/fixture | Obtener Fixture de la liga |
| GET | /liga/{liga_id}/tabla | Obtener Tabla de la liga |
| PUT | /liga/{liga_id}/unirse/{usuario_id} | Unirse a una liga |
| PUT | /liga/{liga_id}/abandonar/{usuario_id} | Abandonar una liga |
| DELETE | /liga/{liga_id}/{usuario_id} | Cancelar liga |
| PUT | /liga/{liga_id}/{usuario_id} | Iniciar liga |
| POST | /partido/{usuario_id} | Crear partido amistoso |
| GET | /partidos | Obtener lista de amistosos disponibles |
| PUT | /partido/{partido_id}/unirse/{usuario_id} | Unirse a partido amistoso |
| PUT | /partido/{partido_id}/{usuario_id} | Iniciar partido amistoso |
| PUT | /partido/{partido_id}/abandonar/{usuario_id} | Abandonar partido amistoso |
| DELETE | /partido/cancelar/{partido_id}/{usuario_id} | Cancelar partido amistoso |
| WS | /ws/amistoso/{partido_id} | Eventos del Lobby para amistosos |
| WS | /ws/partido/{partido_id} | Eventos de Partido en curso |
| WS | /ws/notificaciones/{usuario_id} | Eventos globales de la App |  
| WS | Actualizacion de Ventana | Actualizacion de evento para realizar cambios |

---
### DETALLE DE ENDPOINTS HTTP

---

### POST /usuario

  #### Request Body

  ```json
  {
      "nombre": "string",
      "email": "string",
      "contraseña": "string",
      "avatar": "int",
      "club": "string"
  }
  ```
  <!-- QUE TIPO TIENE AVATAR? BLOB PNG JPG ETC -->
  #### Body Response

  201 Created
  ```json
  {
      "mensaje": "string"
      "id": "int",
      "email": "string",
      "nombre": "string",
      "avatar": "int",
      "club": "string"
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

### PUT /usuario

  #### Request Body
  ```json
  {
      "email": "string",
      "contraseña": "string"
  }
  ```

  #### Body response

  200 OK
  ```json
  {
    "mensaje": "string",
    "id": "int"
  }
  ```
  <!--token de sesion? -->

  400 Bad Request
  ```json
  {
    "error": "DATOS_INVALIDOS",
    "mensaje": "Datos de sesion invalidos u omitidos"
  }
  ```
  401 Unauthorized
  ```json
  {
    "error": "CREDENCIALES_INVALIDAS",
    "mensaje": "El email o la contasena son incorrectos"
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
      "email": "string",
      "club": "string",
      "avatar": "int",
      "pts_ranking": "int"
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

### GET	/usuario/{usuario_id}

  #### Request Body
  ```json
  No tiene
  ```

  #### Body Response

  200 OK
  ```json
    {
      "id": "int",
      "nombre": "string",
      "email": "string",
      "club": "string",
      "avatar": "int",
      "pts_ranking": "int"
    }
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
  <!--MOSTRAMOS EL AVATAR EN EL RANKING?-->
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
    "power": "int",
    "agility": "int",
    "control": "int",
    "speed": "int",
    "strength": "int"
  }
  ```

  #### Body Response
  201 Created
  ```json
  {
    "id": "int",
    "nombre": "string",
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
    "mensaje": "Las estadísticas no pueden ser mayores a 100 ni menores a 20 y el total debe ser menor o igual a 300"
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
      "nombre": "string",
      "power": "int",
      "agility": "int",
      "control": "int",
      "speed": "int",
      "strength": "int"
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

### GET /jugador/{usuario_id}/{jugador_id}

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

### PUT /jugador/{usuario_id}/{jugador_id}

  #### Request Body
  ```json
  {
    "comportamiento":"{comp_id}"
  }
  ```

  #### Body Response
200 OK
```json
{
  "mensaje": "El comportamiento del jugador fue asignado"
}
```

404 Not Found
```json
{
  "error": "JUGADOR_USUARIO_COMP_NO_ENCONTRADO",
  "mensaje": "El jugador, comportamiento o usuario no existe"
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

### DELETE /jugador/{usuario_id}/{jugador_id}

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

### GET /comportamiento/{usuario_id}/{comp_id}

  #### Request Body
  ```json
  No tiene
  ```

  #### Body Response
  200 OK
  ```json
    {
      "id": "int",
      "nombre": "string",
      "codigo": "string"
    }
  ```

  404 Not Found
  ```json
  {
    "error": "COMPORTAMIENTO_NO_ENCONTRADO",
    "mensaje": "No existe el comportamiento"
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

### PUT /comportamiento/{usuario_id}/{comp_id}/asignar

  #### Request Body
  ```json
  {
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
    "mensaje": "El usuario, jugador o comportamiento no existe"
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
      "duracion_partido": "int",
      "jugadores": "[({jugador_id},{comp_id})]",
      "formacion": "string"
      }
  ```

  #### Body Response
  201 Created
  ```json
  {
      "id": "int",
      "nombre": "str",
      "min": "int",
      "max": "int",
      "contraseña": "str",
      "duracion_partido": "int",
      "jugadores": "[({jugador_id},{comp_id})]",
      "formacion": "string"
  }
  ```
  400 Bad Request
  ```json
  {
    "error": "DATOS_INVALIDOS",
    "mensaje": "Los datos de la liga no son válidos"
  }
  ```
  404 Not Found
  ```json

  {
      "error": "RECURSO_NO_ENCONTRADO",
      "mensaje": "El jugador o el comportamiento no existe"
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
          "participantes": "int"
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

### GET /liga/{liga_id}/fixture

  #### Request Body
  ```json
  No tiene
  ```

  #### Body Response
  200 OK
  ```json
  {
      "fixture_liga": "[({usuario_id},{usuario_id})]"
  }
  ```
  <!--lista ordenada de tuplas de usuario_id-->
  404 Not Found
  ```json
  {
      "error": "RECURSO_NO_ENCONTRADO",
      "mensaje": "La liga no existe"
  }
  ```

  409 Conflict
  ```json
  {
      "error": "LIGA_NO_DISPONIBLE",
      "mensaje": "La liga esta finalizada o no esta iniciada"
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

### GET /liga/{liga_id}/tabla

  #### Request Body
  ```json
  No tiene
  ```

  #### Body Response
  200 OK
  ```json
  [
    {
      "usuario":"string",
      "partidos_jugados":"int",
      "puntos":"int",
      "diferencia_goles":"int",
    }
  ]
  ```
  <!--Array de objetos tipo: Fila de Tabla-->
  404 Not Found
  ```json
  {
      "error": "RECURSO_NO_ENCONTRADO",
      "mensaje": "La liga no existe"
  }
  ```

  409 Conflict
  ```json
  {
      "error": "LIGA_NO_DISPONIBLE",
      "mensaje": "La liga no esta iniciada"
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


### PUT /liga/{liga_id}/unirse/{usuario_id}

  #### Request Body
  ```json
  {
    "jugadores": "[({jugador_id},{comp_id})]", 
    "formacion": "string"
  }

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
      "mensaje": "La liga, el usuario, el jugador o el comportamiento no existe"
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
      "mensaje": "Liga cancelada"
  }
  ```

  404 Not Found
  ```json
  {
      "error": "LIGA_NO_ENCONTRADA",
      "mensaje": "La liga no existe"
  }
  ```

  405 Not Allowed
  ```json
  {
    "error": "CANCELAR_NO_PERMITIDO",
    "mensaje": "No se puede cancelar una liga que no creaste"
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
      "mensaje": "Liga iniciada"
  }
  ```

  404 Not Found
  ```json
  {
      "error": "LIGA_NO_ENCONTRADA",
      "mensaje": "La liga no existe"
  }
  ```

  405 Not Allowed
  ```json
  {
    "error": "INICIAR_NO_PERMITIDO",
    "mensaje": "No se puede iniciar una liga que no creaste"
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
    "duracion": "int",
    "jugadores": "[
      {
        "id_jugador": "int",
        "id_comportamiento": "int"
      }
    ]",
    "formacion": "string"
  }
  ```

  #### Body Response
  201 Created
  ```json
  {
    "id_partido": "int",
    "id_usuario_1": "int",
    "id_usuario_2": "int",
    "id_equipo_1": "int",
    "id_equipo_2": "int",
    "duracion": "int",
    "formacion_1": "string",
    "formacion_2": "string",
    "tipo": "string",
    "estado": "string"
  }
  ```

  400 Bad Request
  ```json
  {
    "error": "DATOS_INVALIDOS",
    "mensaje": "Los datos del partido no son válidos"
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
  {
    "jugadores": "[
      {
        "id_jugador": "int",
        "id_comportamiento": "int"
      }
    ]",
    "formacion": "string"
  }
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
    "mensaje": "El partido, el usuario, jugador o comportamiento no existen"
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
    "mensaje": "Partido amistoso iniciado",
    "id_partido": "int",
    "cancha": {
      "ancho": "int",
      "alto": "int",
      "arco_izquierdo": {
        "poste_superior": {
          "x": "int",
          "y": "int"
        },
        "poste_inferior": {
          "x": "int",
          "y": "int
        }
      },
      "arco_derecho": {
        "poste_superior": {
          "x": "int",
          "y": "int"
        },
        "poste_inferior": {
          "x": "int",
          "y": "int"
        }
      }
    }
  }
  ```

  404 Not Found
  ```json
  {
      "error": "AMISTOSO_NO_ENCONTRADO",
      "mensaje": "El amistoso no existe"
  }
  ```
  405 Not Allowed
  ```json
  {
    "error": "INICIAR_NO_PERMITIDO",
    "mensaje": "No se puede iniciar un partido que no creaste"
  }
  ```

  409 Conflict
  ```json
  {
      "error": "AMISTOSO_NO_PUEDE_INICIAR",
      "mensaje": "El partido amistoso no puede iniciarse en su estado actual"
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
  404 Not Found
  ```json
  {
      "error": "PARTIDO_USUARIO_NO_ENCONTRADO",
      "mensaje": "El partido amistoso o el usuario no existen"
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
  404 Not Found
  ```json
  {
      "error": "PARTIDO_USUARIO_NO_ENCONTRADO",
      "mensaje": "El  partido amistoso o el usuario no existen"
  }
  ```

  405 Not Allowed
  ```json
  {
    "error": "CANCELAR_NO_PERMITIDO",
    "mensaje": "No se puede cancelar un partido que no creaste"
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
### WS /ws/amistoso/{partido_id}

#### Body Response
Se unio un jugador al amistoso
```json
{
  "action": "usuario_unido",
  "payload": {
    "owner": {
      "nombre": "string",
      "club": "string"
    },
    "usuario_unido": {
      "nombre": "string",
      "club": "string"
    }
  }
}
```
Inicio el partido
```json
{
  "action": "iniciar_partido",
  "payload": {}
}
```

### WS /partido/{partido_id}/ws

#### Body Response
Partido iniciado
```json
{
  "action": "partido_iniciado",
  "payload": {
    "tiempo": 0
  }
}
```
Estado partido
```json
{
  "action": "estado_partido",
  "payload": {
    "tiempo": "float",
    "pelota": {
      "x": "float",
      "y": "float"
    },
    "jugadores": [
      {
        "id_jugador": "int",
        "id_usuario": "int",
        "id_equipo": "int",
        "x": "float",
        "y": "float"
      }
    ],
    "goles": {
      "izquierdo": "int",
      "derecho": "int"
    },
    "estados_jugadores": [
      {
        "id_jugador": "int",
        "id_usuario": "int",
        "estado": "string"
      }
    ],
    "acciones": [
      {
        "id_jugador": "int",
        "id_usuario": "int",
        "accion": "string"
      }
    ]
  }
}
```
Partido terminado
```json
{
  "action": "partido_terminado",
  "payload": {
    "tiempo": "float",
    "goles": {
      "izquierdo": "int",
      "derecho": "int"
    }
  }
}
```

### WS /ws/notificaciones/{usuario_id}

#### Body Response
Amistoso creado
```json
{
  "action": "amistoso_creado",
  "payload": {
    "id_partido": "int",
    "duracion": "int",
    "tipo": "string",
    "estado": "string"
  }
}
```

### WS Actualizacion de Ventana

  #### Body Response
```json
{
  "action": "window_game",
  "payload": "string"

}
```
<!--tipo enumerado: Mediotiempo | Pausa de hidratacion -->