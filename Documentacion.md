# Documentación Técnica - XXL Trap House Landing Page

## 1. Introducción
Este proyecto es una Landing Page de alto impacto visual dedicada a la cultura urbana. Se ha diseñado siguiendo una estética de revista física (estilo XXL) con funcionalidades interactivas avanzadas.
La aplicación utiliza una arquitectura desacoplada donde el Front-end consume servicios de una API REST construida en Node.js/Express.

## 2. Funcionalidades Implementadas

### A. Reproductor de Audio con Visualizador en Tiempo Real
- **Descripción:** Un reproductor fijo que utiliza la Web Audio API para analizar frecuencias y dibujarlas en un `<canvas>`.
- **Código Clave:** 
```javascript
analyser.getByteFrequencyData(dataArray);
ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
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
- **Explicación:** Se utiliza `fetch('/api/news')` para obtener un JSON y construir elementos HTML dinámicamente, demostrando la integración Front-Back.

### E. Formulario de Contacto con Validación y Servidor
- **Descripción:** Formulario que envía datos al Back-end mediante el método POST.
- **Explicación:** El servidor Express recibe los datos, los valida y responde con un mensaje de éxito, simulando un sistema de registro de usuarios.

## 3. Tecnologías Utilizadas
- **Front-end:** HTML5 semántico, CSS3 (Variables, Grid, Flexbox), JavaScript Vanilla.
- **Back-end:** Node.js, Express.js.
- **Tipografías:** Montserrat (Cuerpo), Impact (Headers), Syncopate (Acentos).

## 4. Guía de Ejecución
1. Instalar dependencias: `npm install`
2. Ejecutar servidor: `node server.js`
3. Abrir `http://localhost:3000`