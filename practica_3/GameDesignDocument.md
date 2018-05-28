# Game Design Document: Tanks n' ducks

## Personajes

Los personajes que aparecen en este juego son básicamente 2 modelos:

- Los patos: son los objetivos a alcanzar por el tanque.
- El tanque: es el jugador, que se desplaza por el mapa y lanza proyectiles a los patos que se encuentre en él.
- En el modo 1vs1 no existirían patos, sólo se encontrarían dos tanques.

## Diseño de niveles

El diseño de niveles consiste en el aumento de la dificultad dependiendo de la
velocidad de juego (alternable en el menú opciones) entre 1, 2 y 3.

En los tres niveles se resta una unidad a la munición del jugador cuando al
lanzar un proyectil, no intercepta ningun pato.

En el nivel 1, al interceptar un pato con un proyectil, a parte de recuperar
el proyectil disparado, se consiguen 3 más. La velocidad tanto del tanque como
de los patos es de una unidad (la mínima).

En el nivel 2, se consiguen 2 más el proyectil disparado. La velocidad de los
personajes presentes en el juego es de 2 unidades

En el nivel 3, sólo se recupera el proyectil disparado, es decir, una vez has
gastado munición, no se podrá volver a recuperar. La velocidad de los
personajes presentes en el juego es de 3 unidades (la máxima).

## Jugabilidad

## Arte

El apartado visual del juego se puede agrupar principalmente en arte
2D y arte 3D.

En el **arte 2D** se encuentran las texturas *metal1*, *wheel* y
*water* que se han obtenido de fuentes libres, del mismo modo que las
skyboxes de *park* y *galaxy*. El diseño de las *instrucciones*
in-game así como el de la imagen *see_you_later* ha sido realizado por
el equipo de producción.

El arte 3D tiene por una parte el modelo del tanque, diseñado por el
equipo haciendo uso de `Three.js`, y por otra, para los modelos del
proyectil (corazón) y del pato modelos gratis
de [***turbosquid***](www.turbosquid.com) y
de [***free3d***](www.free3d.com) respectivamente. La textura del
pato, sin embargo, fue realizada manualmente.

## Sonido y música

El 100% de los sonidos del juego han sido realizados por el equipo.

La música del tema principal y la música in-game han sido compuestas
por el equipo. Los efectos sonoros han sido también producidos
*“manualmente”*, sin hacer uso de nada más que una guitarra acústica,
nuestras voces y un editor de audio simple.

## Interfaz de usuario, controles de juego

La interfaz de usuario estará compuesta de lo siguiente:

- Un sistema de menús para entrar/salir del juego, cambiar opciones, seleccionar mapas y ver controles básicos.
- Información acerca de los FPS (fotogramas por segundo) y los milisegundos que tarda en renderizarse cada fotograma.
- Una barra con información del jugador (su nombre, su munición restante y el número de amigos que ha hecho).

En cuanto a los controles del juego, se utilizará:

- El click izquierdo del ratón para navegar por las opciones de los menús.
- La tecla escape para alternar entre menú de pausa y el juego, y volver atrás en un submenú.
- Las teclas W, A, S, D para mover el tanque adelante, girar a la izquierda, mover el tanque hacia atrás y girar a la derecha respectivamente.
- Las teclas Q y E para rotar la torreta del tanque a izquierda y derecha respectivamente.
- La tecla V para alternar entre primera y tercera persona (sólo en modo un jugador).
- La rueda del raton para acercar y alejar la cámara de tercera persona.
- El espacio para disparar un proyectil.
