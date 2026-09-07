# CASOS DE USO

## Caso de uso #1 : Crear Usuario
#### Actor primario: Agente externo
#### Precondición: No debe existir una cuenta ya asociada al correo electrónico ingresado.
#### Escenario exitoso principal:
1) El agente externo ingresa sus datos en los campos requeridos.
2) El sistema valida que el formato y contenido de los datos sean correcto, crea un usuario y notifica al agente externo.

#### Escenario excepcionales:
2.a) El agente externo no completa algún campo requerido (nombre, correo, contraseña o nombre del club).  
El sistema notifica al agente externo que debe completar los campos vacíos.

2.b) El agente externo ingresa un formato de dato no válido.  
El sistema informa al agente externo que debe corregir el formato de algún dato ingresado.

## Caso de uso #2 : Iniciar sesión
#### Actor primario: Usuario
#### Precondición: El usuario debe haberse creado previamente.
#### Escenario exitoso principal:
1) El Usuario ingresa su correo y contraseña.
2) El sistema valida los datos ingresados e inicia sesión.

#### Escenario excepcionales:
2.a) El usuario no completa algún campo requerido para iniciar sesión.  
El sistema informa al usuario que falta algún campo necesario para iniciar sesión.

2.b) El usuario ingresa datos incorrectos en los campos requeridos.  
El sistema notifica al usuario que no se encontró ningún usuario correspondiente a esos datos.

## Caso de uso #3: Ver usuario
#### Actor primario: Usuario
#### Precondición: El usuario debe haberse creado previamente y debe tener sesión iniciada.
#### Escenario exitoso principal:
1) El usuario selecciona la opción para ver su perfil.
2) El sistema consulta los datos del usuario y los muestra por pantalla

## Caso de uso #4:  Ver Ranking
#### Actor Primario: Usuario
#### Precondición: Existe al menos un usuario con puntos de ranking.
#### Escenario Exitoso Principal:
1) El usuario solicita ver el ranking global.
2) El sistema muestra la tabla del ranking global y la posición que ocupa el usuario solicitante.

## Caso de uso #5 : Crear Jugador
#### Actor Primario: Usuario
#### Escenario Exitoso Principal:
1) El usuario ingresa nombre del jugador a crear y valores válidos para los atributos de Poder, Agilidad, Control, Velocidad y Fuerza (PACSS) con valores de puntos individuales desde 20 a 100 para cada uno y una suma total de 300 entre todos los puntos.
2) El sistema valida que los datos sean válidos dentro de los límites, carga al jugador en la base de datos y notifica al usuario.

#### Escenario excepcionales:
2.a) Los valores para los atributos PACSS no alcanzan los 300 puntos en total.  
El sistema notifica al usuario.  
2.b) Algún valor para los atributos PACSS supera los 100 puntos o  no alcanza los 20 puntos. El sistema notifica al usuario.

## Caso de uso #6 : Eliminar Jugador
#### Actor Primario: Usuario
#### Precondición: El usuario tiene al menos un jugador.
#### Escenario Exitoso Principal:
1) El usuario selecciona un jugador a eliminar.
2) El sistema elimina al jugador de la base de datos y notifica al usuario que el jugador se eliminó correctamente.

#### Escenario excepcionales:
 2.a) El jugador se encuentra jugando un partido o participando de una liga. El sistema le avisa al usuario que el jugador no se puede eliminar.  
 
## Caso de uso #7 : Sustituir jugador
#### Actor Primario: Usuario
#### Precondición: El usuario tiene un jugador disponible entre los suplentes de su equipo y todavía hay ventanas de cambio disponibles.  
#### Escenario Exitoso Principal:
1) El usuario selecciona al jugador a sustituir.
2) El sistema muestra los jugadores disponibles en el banco de suplentes.
3) El usuario elige al jugador que va a ingresar.
4) El sistema pone en cola el cambio que se realizará en la próxima pausa y le notifica al usuario.  

#### Escenario excepcionales:
2.a) Ya se alcanzó el máximo de cambios permitido, no se realiza el cambio y el sistema le notifica al usuario.  

2.b) No quedan más pausas en el partido, no se realiza el cambio y el sistema le notifica al usuario.

## Caso de uso #8: Seleccionar Jugador
#### Actor Primario: Usuario
#### Precondición: El usuario cuenta con al menos un jugador.
#### Escenario Exitoso Principal:
1) El usuario escoge un jugador de su registro de jugadores.  
2) El sistema le muestra al usuario las acciones disponibles para realizar sobre el jugador.

## Caso de uso #9 : Ver jugador
#### Actor Primario: Usuario
#### Precondición: El usuario cuenta con al menos un jugador y tiene un jugador seleccionado
#### Escenario Exitoso Principal:
1) El usuario solicita ver el detalle del jugador.
2) El sistema retorna el detalle del jugador con su nombre, atributos PACSS y el comportamiento asignado.

## Caso de uso #10: Crear Comportamiento 
#### Actor Primario: Usuario
#### Escenario Exitoso Principal:
1) El usuario escribe un bloque de código utilizando la API de primitivas de comportamiento.
2) El sistema valida el bloque de código, crea el comportamiento y le notifica al usuario.

#### Escenario excepcionales:
2.a) El usuario ingresó un bloque de código no válido.  
El sistema no valida el código, no se crea el comportamiento y se notifica al usuario ante errores de sintaxis, bloques vacíos, acciones inválidas, fallas de la API, excepciones en tiempo de ejecución, consumo excesivo de recursos o violaciones de seguridad del entorno.

## Caso de uso #11: Editar comportamiento 
#### Actor Primario: Usuario
#### Precondición: El comportamiento existe y pertenece al usuario.
#### Escenario Exitoso Principal:
1) El usuario reescribe el bloque de código agregando las modificaciones deseadas.
2) El sistema valida el bloque de código, actualiza el comportamiento y le notifica al usuario.

#### Escenario excepcionales:
2.a) El usuario ingresó un bloque de código no válido.  
El sistema no valida el código modificado, no se actualizan los cambios y se notifica al usuario ante errores de sintaxis, bloques vacíos, acciones inválidas, fallas de la API, excepciones en tiempo de ejecución, consumo excesivo de recursos o violaciones de seguridad del entorno.

## Caso de uso #12: Eliminar comportamiento
#### Actor Primario: Usuario
#### Precondición: El comportamiento existe, pertenece al usuario y no se está utilizando en ningún partido en curso.
#### Escenario Exitoso Principal:
1) El usuario selecciona el comportamiento a eliminar.
2) El  sistema elimina el comportamiento y le notifica al usuario.

## Caso de uso #13: Asignar Comportamiento
#### Actor Primario: Usuario
#### Precondición: El comportamiento y el jugador existen, pertenecen al usuario y el jugador no tiene el comportamiento a asignar.
#### Escenario Exitoso Principal:
1) El usuario elige al jugador y el comportamiento a ser asignado.
2) El  sistema reemplaza o agrega la asignación y le notifica al usuario.

## Caso de uso #14: Crear liga
#### Actor primario: Usuario
#### Precondición: El usuario debe tener sesión iniciada.
#### Escenario exitoso principal:
1) El usuario ingresa el nombre de liga, contraseña, mínimo de jugadores, máximo de jugadores y duración para crear una liga.
2) El sistema valida el formato y contenido de los datos, crea la liga, crea la tabla de la liga y notifica al usuario.

#### Escenario excepcionales:
2.a) El usuario ingresa algún campo no válido.  
El sistema no crea la liga y notifica al usuario que el formato y/o contenido de los datos ingresados es invalido.

## Caso de uso #15: Unirse a liga
#### Actor primario: Usuario
#### Precondición: La liga debe existir, tener lugar y no estar iniciada.
#### Escenario Exitoso Principal:
1) El usuario selecciona unirse a una liga.
2) El sistema lista todos las ligas disponibles al usuario. 
3) El usuario elige la liga a la que se quiere unir.
4) El sistema corrobora que la liga no esté llena o iniciada y/o, agrega al usuario a la liga y le notifica la adhesión a la liga.

#### Escenario Exitoso Alternativo:
4.a) El sistema le pide al usuario que ingrese una contraseña para unirse a la liga privada.  
5.a) El usuario ingresa la contraseña.  
6.a) El sistema valida la contraseña, agrega al usuario a la liga y le notifica la adhesión a la liga.

#### Escenario excepcionales:
6.a) El usuario ingresa una contraseña incorrecta.  
El sistema verifica la invalidez de la contraseña y notifica al usuario que debe reingresar la contraseña.

## Caso de uso #16: Abandonar liga
#### Actor primario: Usuario
#### Precondición: El usuario debe tener sesión iniciada, estar en una liga existente no iniciada y no es el dueño.
#### Escenario Exitoso Principal:
1) El usuario abandona la liga.
2) El sistema valida el abandono, elimina al usuario, modifica el estado de la liga y notifica al usuario que abandonó la liga y al dueño de la liga que el usuario abandonó la liga.

## Caso de uso #17: Cancelar liga
#### Actor primario: Usuario
#### Precondición: El usuario debe tener sesión iniciada, estar en una liga existente no iniciada y ser el dueño.
#### Escenario Exitoso Principal:
1) El usuario dueño cancela la liga.
2) El sistema elimina la liga, notifica a todos los ex participantes que la liga fue eliminada.

## Caso de uso #18: Iniciar liga
#### Actor primario: Usuario
#### Precondición: El usuario debe tener sesión iniciada, estar en una liga existente no iniciada y ser el dueño.
#### Escenario Exitoso Principal:
1) El usuario dueño da inicio a la liga.
2) El sistema inicia la liga, genera el fixture notificando a todos los participantes que la liga fue iniciada y procesa los partidos de acuerdo al orden del fixture hasta su finalización, actualizando la tabla de posiciones conforme a los resultados obtenidos.

#### Escenario excepcionales:
2.a) La liga no tiene su capacidad de usuarios completamente llena.  
El sistema cancela la iniciación y notifica al usuario que faltan usuarios.

## Caso de uso #19: Ver Tabla de Liga
#### Actor Primario: Usuario
#### Precondición: El usuario debe tener sesión iniciada y estar en una liga existente creada.
#### Escenario Exitoso Principal:
1) El Usuario consulta la Tabla de la liga.
2) El sistema devuelve al usuario la Tabla de la liga actualizada hasta el último partido jugado.

## Caso de uso #20: Ver Fixture
#### Actor Primario: Usuario
#### Precondición: El usuario debe tener sesión iniciada y estar en una liga existente iniciada pero no finalizada.
#### Escenario Exitoso Principal:
1) El Jugador consulta el Fixture de la Liga.
2) El sistema devuelve el Fixture de la liga con los próximos partidos a jugarse.

## Caso de uso #21: Crear Partido Amistoso
#### Actor Primario: Usuario
#### Precondición: El usuario debe tener sesión iniciada, formación seleccionada, seis  jugadores y al menos un comportamiento asignado a cada uno.
#### Escenario Exitoso Principal:
1) El usuario solicita crear el partido amistoso.
2) El sistema valida la formación seleccionada, los seis jugadores y sus comportamientos asignados, el partido figura como disponible para otros usuarios.

## Caso de uso #22: Unirse a Partido Amistoso
#### Actor Primario: Usuario
#### Precondición: Existe al menos un partido amistoso disponible.
#### Escenario Exitoso Principal:
1) El usuario selecciona unirse a un partido.
2) El sistema lista todos los partidos amistosos disponibles al usuario.
3) El usuario selecciona un partido en específico.

## Caso de uso #23: Iniciar Partido Amistoso
#### Actor Primario: Usuario
#### Precondición: Debe haber dos usuarios con sesión iniciada, ambos están unidos al mismo partido amistoso no iniciado.
#### Escenario Exitoso Principal:
1) El usuario creador selecciona la opción de iniciar el partido.
2) El sistema da inicio al partido amistoso empezando cada usuario con su formación de arranque y el usuario dueño con el saque inicial del partido.

## Caso de uso #24: Abandonar Partido Amistoso
#### Actor Primario: Usuario
#### Precondición: El usuario debe tener sesión iniciada, formar parte de un partido amistoso no iniciado y no ser el dueño.
#### Escenario Exitoso Principal:
1) El usuario solicita abandonar el partido.
2) El sistema valida el abandono, elimina al usuario de la partida, modifica el estado del amistoso, notifica al usuario que abandonó el amistoso y al dueño de la liga que el usuario abandonó el amistoso.

## Caso de uso #25: Cancelar Partido Amistoso
#### Actor Primario: Usuario
#### Precondición: El usuario debe tener sesión iniciada y el partido no fue iniciado
#### Escenario Exitoso Principal:
1) El usuario solicita cancelar el partido.
2) El sistema elimina el partido amistoso, notifica a los dos participantes que el amistoso fue eliminado.

## Caso de uso #26: Armar Equipo
#### Actor Primario: Usuario
#### Precondición: El usuario debe tener sesión iniciada, al menos seis jugadores y un comportamiento para cada uno, inmediatamente antes de unirse a una liga o amistoso.
#### Escenario Exitoso Principal:
1) El usuario selecciona a los jugadores que jugarán el partido y asigna el comportamiento que utilizara en el partido a cada jugador.
2) El sistema asigna a los jugadores, siendo los 3 primeros titulares y los 3 restantes suplentes.

## Caso de uso #27: Seleccionar formacion
#### Actor Primario: Usuario
#### Precondición: El usuario debe tener sesión iniciada y un equipo creado.
#### Escenario Exitoso Principal:
1) El usuario selecciona una de las cuatro formaciones iniciales para su equipo.
2) El sistema valida y establece las posiciones iniciales de cada jugador por orden de elección.
