# Documentación Técnica - XXL TRAP HOUSE (Landing Page)

## 1. Instrucciones de inicio/ejecución (Obligatorio)
Siga estos pasos para desplegar el proyecto en un entorno de desarrollo local:
1. **Node.js:** Asegúrese de tener instalado Node.js (versión 16+ recomendada).
2. **Dependencias:** Abra una terminal en la carpeta raíz del proyecto y ejecute `npm install express cors`.
3. **Lanzamiento:** Ejecute el comando `node server.js`. El terminal confirmará que el servidor está activo en el puerto 3000.
4. **Visualización:** Abra su navegador y acceda a `http://localhost:3000`.

## 2. Enumeración de funcionalidades principales (Obligatorio)
1. **Reproductor de Audio y Visualizador en Tiempo Real:** Análisis de ondas sonoras en Canvas.
2. **Buscador y Filtrado Dinámico de Música:** Gestión del DOM para búsqueda instantánea.
3. **Cursor Personalizado y Estela de Partículas:** Interacción visual avanzada con el ratón.
4. **Scroll Reveal y Efectos Glitch:** Animaciones inmersivas basadas en la visibilidad del usuario.
5. **Transiciones de Página con Page Wipe:** Navegación fluida entre documentos HTML.

## 3. Funcionalidad 1: Reproductor y Visualizador
**3.1. Descripción:** Sistema persistente en la parte inferior que reproduce audio y genera una representación visual del espectro sonoro.
**3.2. Funcionamiento:** Utiliza la **Web Audio API** para conectar el audio a un `AnalyserNode`. Este nodo extrae los datos de frecuencia que luego se dibujan mediante un bucle de animación en un `<canvas>`.
**3.3. Código Relevante:**
```javascript
// En script.js: Dibujo de frecuencias en el canvas
function animateVisualizer() {
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(dataArray); // Obtiene volumen/frecuencia
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dataArray.forEach((value, i) => {
        const barHeight = (value / 255) * canvas.height;
        ctx.fillStyle = '#e31b23'; // Color rojo XXL
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
    });
}
```
*Relación:* Conecta el `audioElement` de `index.html` con el estilo `.player-bar` de `styles.css`.

## 4. Funcionalidad 2: Buscador y Filtrado
**4.1. Descripción:** Filtra las tarjetas de artistas y tracks según el texto ingresado o la categoría (Trap, Drill, etc.).
**4.2. Funcionamiento:** Al escribir, un evento `input` captura el valor. JavaScript recorre todas las tarjetas con la clase `.card` y utiliza `style.display = 'none'` para ocultar aquellas que no coinciden con el título o el atributo `data-category`.
**4.3. Código Relevante:**
```javascript
// En script.js: Lógica de búsqueda
searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    document.querySelectorAll('.card').forEach(card => {
        const title = card.querySelector('h3').innerText.toLowerCase();
        card.style.display = title.includes(term) ? 'block' : 'none';
    });
});
```
*Relación:* Afecta a la rejilla `.music-grid` en `index.html`.

## 5. Funcionalidad 3: Cursor y Estela
**6.1. Descripción:** El puntero nativo se sustituye por un emoji de diamante que deja partículas blancas al moverse.
**6.2. Funcionamiento:** CSS oculta el cursor con `cursor: none`. JavaScript sigue el movimiento del mouse (`clientX/Y`) para posicionar el div `#customCursor` y crea `divs` efímeros (`.cursor-trail`) que se eliminan tras 600ms.
**6.3. Código Relevante:**
```javascript
// En script.js: Creación de la estela
function createTrail(x, y) {
    const trail = document.createElement('div');
    trail.className = 'cursor-trail'; // Definido en styles.css
    trail.style.left = x + 'px';
    trail.style.top = y + 'px';
    document.body.appendChild(trail);
    setTimeout(() => trail.remove(), 600); // Limpieza de memoria
}
```
- **Explicación:** Se crea un `AudioContext` que conecta el elemento de audio a un `AnalyserNode`, permitiendo renderizar gráficos basados en el ritmo.

### B. Sistema de Filtrado de Contenido Dinámico
- **Descripción:** Permite clasificar la música por géneros sin recargar la página.
- **Explicación:** Utiliza atributos `data-category` en el DOM para manipular la propiedad `display` y aplicar animaciones de entrada `revealUp`.

### C. Cursor Personalizado con Estela de Partículas
- **Descripción:** Sustituye el cursor nativo por un emoji interactivo que deja rastro.
- **Explicación:** Escucha el evento `mousemove` para actualizar la posición de un div fijo y crea elementos temporales en el DOM que se eliminan tras una animación CSS.

### F. Sistema de Scroll Reveal y Transiciones de Página
- **Descripción:** Las secciones aparecen suavemente al hacer scroll y los cambios de página incluyen un barrido de color.
- **Código Clave:**
```javascript
const revealObserver = new IntersectionObserver((entries) => { ... });
```
- **Explicación:** Utiliza la API `IntersectionObserver` para detectar cuándo un elemento entra en el viewport y aplicarle la clase `active`, disparando animaciones CSS optimizadas.

### D. Integración de Back-end (Fetch API)
- **Descripción:** La sección de "News" se carga dinámicamente consultando un servidor Node.js.
- **Explicación:** Se utiliza `fetch('/api/news')` para obtener un JSON. El servidor actúa como puente entre los archivos de datos y la interfaz.

### E. Persistencia de Datos (Base de Datos JSON)
- **Descripción:** Los likes y mensajes de contacto se guardan de forma permanente en la carpeta `/data`.
- **Explicación:** Se utiliza el módulo `fs` (File System) de Node.js para leer y escribir en archivos `.json`. Esto permite que la información no se pierda al reiniciar el servidor, cumpliendo con los requisitos de un backend robusto.

## 3. Tecnologías Utilizadas
- **Front-end:** HTML5 semántico, CSS3 (Variables, Grid, Flexbox), JavaScript Vanilla.
- **Back-end:** Node.js, Express.js, FileSystem API (Persistencia).
- **Tipografías:** Montserrat (Cuerpo), Impact (Headers), Syncopate (Acentos).

## 4. Guía de Ejecución
1. Instalar dependencias: `npm install`
2. Ejecutar servidor: `node server.js`
<<<<<<< ours
3. Abrir `http://localhost:3000`
=======
3. Abrir `http://localhost:3000`
>>>>>>> theirs
