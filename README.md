# 🐺 Coyohoot — versión final

Coyohoot es una app web estática de quizzes en tiempo real con Firebase/Firestore, panel de administración, participantes, avatares, ranking y varios modos de juego.

## Archivos principales

| Archivo | Uso |
|---|---|
| `index.html` | Inicio del sitio. |
| `admin.html` | Login, registro, menú de creación, editor de quizzes reutilizables, configuración de partida, control, ranking y detener/reiniciar. |
| `participante.html` | Entrada general de participantes; muestra los Coyohoots disponibles y redirige al modo correcto. |
| `clasico.html` | Participante en modo Clásico. |
| `supervivencia.html` | Participante en modo Supervivencia. |
| `carrera.html` | Participante en modo Carrera. |
| `boss-participante.html` | Participante en modo Boss. |
| `battle-participante.html` | Participante en modo Battle Royale. |
| `caos-participante.html` | Participante en modo Caos. |
| `pantalla.html` | Pantalla en vivo para Clásico, Supervivencia y Carrera. |
| `boss.html` | Pantalla en vivo del Boss Fight. |
| `battle.html` | Pantalla en vivo del Battle Royale. |
| `caos.html` | Pantalla en vivo del modo Caos. |
| `firebase.js` | Configuración compartida de Firebase. |
| `style.css` | Todos los estilos del proyecto. |
| `firestore.rules` | Reglas para copiar manualmente en Firebase Console. |
| `logo.jpeg` | Logo y favicon del sitio. |
| `Avatares/` | Avatares SVG. Solo se muestran en el selector los archivos existentes. |

## Login de administrador

- El registro pide la clave `Nachito`.
- Después del registro, cada admin entra con su usuario y contraseña.
- Cada admin ve sus propios Coyohoots.
- Los Coyohoots viejos sin dueño se pueden adoptar desde el panel.

## Quizzes reutilizables

Todos los quizzes usan la misma estructura base:

- pregunta,
- 4 opciones,
- índice de respuesta correcta,
- tiempo.

El quiz no queda amarrado permanentemente a un modo. Al crear solo capturas nombre y preguntas. Al controlar una partida, el admin elige el modo y el formato.

## Modos disponibles

- 🎯 Clásico: puntos por respuesta correcta y rapidez.
- ❤️ Supervivencia: vidas, eliminación y penalización por no responder.
- 🏁 Carrera: avance por niveles hasta la meta; preguntas en flujo continuo por participante.
- 👹 Boss: cooperativo contra un boss de 100 HP y equipo de 100 HP.
- ⚔️ Battle Royale: duelos 1 vs 1 hasta que quede un ganador.
- 🌀 Caos: cada pregunta tiene un efecto global aleatorio para todos.

## Formato individual/equipos

Desde admin se puede configurar:

- Individual.
- Equipos de 2 a 5 integrantes.

Boss no usa equipos normales porque ya es cooperativo por diseño.

## Avatares

El selector revisa los archivos existentes en `Avatares/` y muestra solo los que carguen correctamente.

Nombres visibles preparados:

- `Avatar1.svg` → El Vice
- `Avatar2.svg` → El Presi
- `Avatar3.svg` → La Secre
- `Avatar4.svg` → Nachito

Si agregas más SVG, usa la misma convención:

```txt
Avatares/Avatar5.svg
Avatares/Avatar6.svg
Avatares/Avatar7.svg
Avatares/Avatar8.svg
```

## Firebase

Colecciones usadas:

```txt
/coyohoot_admin_users/{uid}
/coyohoots/{quizId}
/coyohoots/{quizId}/participants/{participantId}
/coyohoots/{quizId}/responses/{responseId}
```

Campos principales nuevos/compatibles:

```js
gameMode: 'clasico' | 'supervivencia' | 'carrera' | 'boss' | 'battle' | 'caos'
playFormat: 'individual' | 'teams'
teamSize: 2..5
status: 'waiting' | 'active' | 'stopped' | 'finished' | 'archived'
isRunning: boolean
isStopped: boolean
sessionId: string
```

Campos de equipos en participantes:

```js
teamId
teamName
participantTeamId
participantTeamName
```

## GitHub Pages

Sube a GitHub Pages los archivos del proyecto. Las reglas de Firestore no se aplican desde GitHub Pages; debes copiarlas manualmente en:

```txt
Firebase Console > Firestore Database > Rules
```

## Revisión final incluida

En esta versión se revisó:

- sintaxis de JavaScript embebido en todos los HTML,
- referencias locales a archivos,
- ids usados por `getElementById`,
- balance visual de avatares,
- favicon con `logo.jpeg`,
- redirecciones entre modos,
- compatibilidad con quizzes viejos sin campos modernos.

## Ajuste final de admin estilo Heavy Metal

Se agregaron páginas dedicadas para facilitar el uso del panel:

- `admin.html`: centro de mando principal.
- `admin-crear.html`: entrada directa al editor de quizzes.
- `admin-controlar.html`: entrada directa al control de partida.
- `admin-jugadores.html`: entrada directa a participantes y ranking.

Todas comparten la misma lógica y sesión de administrador, pero separan visualmente las tareas para que el flujo sea más claro.
