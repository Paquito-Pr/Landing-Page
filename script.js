// --- SISTEMA DE REVELACIÓN POR SCROLL (Intersection Observer) ---
const observerOptions = {
    threshold: 0.15
};

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    const elementsToReveal = document.querySelectorAll('.reveal');
    elementsToReveal.forEach(el => revealObserver.observe(el));
    
    // Trigger inicial de la transición de página
    const wipe = document.getElementById('pageWipe');
    wipe.classList.add('wipe-active');
});

// --- TRANSICIONES AL HACER CLICK EN LINKS ---
document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', (e) => {
        if (link.href.includes('#')) return; // No animar anclas
        e.preventDefault();
        const destination = link.href;
        const wipe = document.getElementById('pageWipe');
        if (wipe) {
            wipe.classList.remove('wipe-active');
            void wipe.offsetWidth; // Force reflow
            wipe.classList.add('wipe-active');
            
            setTimeout(() => {
                window.location.href = destination;
            }, 600);
        } else {
            window.location.href = destination;
        }
    });
});

// --- PARALLAX SUAVE EN EL HERO ---
document.addEventListener('mousemove', (e) => {
    const hero = document.getElementById('hero');
    if (hero) {
        const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
        const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
        hero.style.backgroundPosition = `calc(50% + ${moveX}px) calc(50% + ${moveY}px)`;
    }
});

// --- MARQUEE SPEED CONTROL ---
let lastScrollTop = 0;
window.addEventListener('scroll', () => {
    const marquee = document.getElementById('marquee');
    if (marquee) {
        const st = window.pageYOffset || document.documentElement.scrollTop;
        const diff = Math.abs(st - lastScrollTop);
        const speed = Math.max(15, 60 - (diff * 0.2)); 
        marquee.style.setProperty('--marquee-speed', `${speed}s`);
        lastScrollTop = st;
    }
});

// --- 3D TILT EFFECT FOR CARDS (Funcionalidad I) ---
const cards = document.querySelectorAll('.card');
cards.forEach(card => {
    card.addEventListener('mousemove', e => {
        const { left, top, width, height } = card.getBoundingClientRect();
        const x = (e.clientX - left) / width;
        const y = (e.clientY - top) / height;
        
        const rotateX = (y - 0.5) * 20; // Inclinacion max 20deg
        const rotateY = (x - 0.5) * -20;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
});

// --- MAGNETIC BUTTONS (Efecto de gama alta) ---
const magneticBtns = document.querySelectorAll('.btn, .play-btn-main');
magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', e => {
        const { left, top, width, height } = btn.getBoundingClientRect();
        const x = e.clientX - (left + width / 2);
        const y = e.clientY - (top + height / 2);
        
        btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });
    
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = `translate(0px, 0px)`;
    });
});

// --- BUSCADOR EN TIEMPO REAL (Funcionalidad G) ---
const searchInput = document.getElementById('musicSearch');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const cards = document.querySelectorAll('.card');
        
        cards.forEach(card => {
            const title = card.querySelector('h3').innerText.toLowerCase();
            const artist = card.querySelector('p').innerText.toLowerCase();
            if (title.includes(term) || artist.includes(term)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

// --- SISTEMA DE LIKES (Funcionalidad H) ---
async function likeTrack(trackId, btn) {
    try {
        const response = await fetch('/api/like', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: trackId })
        });
        const data = await response.json();
        if (data.likes) {
            btn.querySelector('.count').innerText = data.likes;
            btn.style.borderColor = 'var(--xxl-red)';
        }
    } catch (err) {
        console.error("Error al votar");
    }
}

// Lógica de Filtrado
function filterMusic(category, event) {
    // 1. Actualizar botones activos
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));

    event.target.classList.add('active');

    // 2. Filtrar tarjetas
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        if (category === 'all') {
            card.style.display = 'block';
            card.style.animation = 'revealUp 0.5s ease forwards';
        } else {
            if (card.getAttribute('data-category') === category) {
                card.style.display = 'block';
                card.style.animation = 'revealUp 0.5s ease forwards';
            } else {
                card.style.display = 'none';
            }
        }
    });
}

// --- FETCH NEWS FROM BACKEND (Funcionalidad D) ---
async function fetchNews() {
    // Noticias de reserva por si el servidor falla o no está iniciado
    const fallbackNews = [
        { 
            title: "EDICIÓN DIGITAL XXL: EL FUTURO DEL TRAP", 
            date: "HOY", 
            image: "https://images.unsplash.com/photo-1514525253361-bee8a19740c1?auto=format&fit=crop&w=800&q=80",
            content: "Estamos analizando las tendencias que dominarán la calle este año. Desde el avance del drill hasta las nuevas voces del trap español." 
        },
        { 
            title: "NUEVAS PROMESAS EN EL RADAR", 
            date: "RECIENTE", 
            image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80",
            content: "Descubre a los artistas que están rompiendo los esquemas en la escena urbana actual." 
        }
    ];

    let news = fallbackNews;

    try {
        const response = await fetch('/api/news');
        if (response.ok) {
            news = await response.json();
        }
    } catch (err) {
        console.log("Servidor no detectado, cargando noticias de reserva.");
    }

        // Poblar Ticker Deslizante (Página Principal)
        const tickerContainer = document.getElementById('news-container');
        if (tickerContainer) {
            const newsString = news.map(item => ` <span class="news-item-bullet">⚡</span> [${item.date}] ${item.title.toUpperCase()}: ${item.content}`).join(' ');
            // Duplicamos el contenido para el bucle infinito del CSS
            tickerContainer.innerHTML = `<span>${newsString}</span><span>${newsString}</span>`;
        }

        // Poblar Archivo de Noticias (Página de Noticias)
        const archiveContainer = document.getElementById('news-archive-list');
        if (archiveContainer) {
            archiveContainer.innerHTML = news.map(item => `
                <article class="news-article-item reveal">
                    <span class="tag">${item.category || 'NEWS'} | ${item.date}</span>
                    <h2>${item.title}</h2>
                    ${item.author ? `<small style="display:block; margin-bottom:10px; font-weight:bold; text-transform:uppercase;">${item.author}</small>` : ''}
                    ${item.image ? `<img src="${item.image}" class="news-featured-img" alt="News">` : ''}
                    <p>${item.content}</p>
                </article>
            `).join('');
            const elementsToReveal = archiveContainer.querySelectorAll('.reveal');
            elementsToReveal.forEach(el => revealObserver.observe(el));
        }
}

document.addEventListener('DOMContentLoaded', fetchNews);

// --- CONTACT FORM (Funcionalidad E) ---
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
            email: document.getElementById('contact-email').value,
            message: document.getElementById('contact-message').value
        };
        
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            document.getElementById('form-response').innerText = result.success || result.error;
        } catch (err) {
            document.getElementById('form-response').innerText = "Error al conectar con el servidor.";
        }
    });
}

// --- VISUALIZADOR DE MÚSICA & REPRODUCCIÓN ---
let audioContext, analyser, source;
let isInitialized = false;
const audioElement = document.getElementById('audio-player');
const canvas = document.getElementById('visualizer');
const ctx = canvas ? canvas.getContext('2d') : null;

// Elementos del Player
const mainPlayBtn = document.getElementById('main-play-btn');
const progressBar = document.getElementById('progress');
const currTimeText = document.getElementById('curr-time');
const durTimeText = document.getElementById('dur-time');
let activeCardBtn = null; // Para sincronizar botón de la tarjeta

function initAudio() {
    if (!audioElement || !canvas || !ctx) return;
    if (isInitialized) return;
    
    // Crear contexto de audio (compatible con Safari/Chrome)
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    source = audioContext.createMediaElementSource(audioElement);
    
    // Conectar: Audio -> Analizador -> Altavoces
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    
    analyser.fftSize = 64; // Menos barras para el mini visualizador
    
    // Ajustar tamaño del canvas una sola vez o al redimensionar
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    
    isInitialized = true;
    animateVisualizer();
}

function animateVisualizer() {
    if (!analyser || !canvas || !ctx) return;
    requestAnimationFrame(animateVisualizer);
    
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const barWidth = (canvas.width / bufferLength) * 2.5;
    let x = 0;
    
    for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height; // Ajustar altura al contenedor
        
        // Gradiente XXL (Rojo a Blanco)
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#e31b23');
        gradient.addColorStop(1, '#ffffff');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        
        x += barWidth + 1;
    }
}

const playButtons = document.querySelectorAll('.play-btn');
playButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        // Inicializar AudioContext al primer clic (Política de navegadores)
        if (!isInitialized) initAudio();
        if (audioContext.state === 'suspended') audioContext.resume();

        playTrack(this);
    });
});

function playTrack(btn) {
    if (!audioElement || !mainPlayBtn) return;
    const isPlaying = btn.innerText === '⏸';
    
    // Resetear todos los botones de las tarjetas
    playButtons.forEach(b => {
        b.innerText = '▶';
        b.style.background = 'var(--xxl-red)';
    });

    if (!isPlaying) {
        const playerBar = document.querySelector('.player-bar');
        if (playerBar) playerBar.classList.add('active');
        const card = btn.closest('.card');
        const title = card.querySelector('h3').innerText;
        const artist = card.querySelector('p').innerText.replace('Artista: ', '');
        
        document.getElementById('current-title').innerText = title;
        document.getElementById('current-artist').innerText = artist;
        
        const playerCover = document.getElementById('current-cover');
        const cardImg = card.querySelector('.card-img').style.backgroundImage;
        playerCover.style.backgroundImage = cardImg;
        playerCover.style.backgroundSize = 'cover';
        playerCover.innerText = '';

        btn.innerText = '⏸';
        btn.style.background = '#000'; 
        mainPlayBtn.innerText = '⏸';
        activeCardBtn = btn;
        audioElement.play();
    } else {
        btn.innerText = '▶';
        mainPlayBtn.innerText = '▶';
        audioElement.pause();
    }
}

// Control Play/Pause de la barra principal
function toggleMainPlay() {
    if (!audioElement || !mainPlayBtn) return;
    if (!isInitialized) initAudio();
    if (audioElement.paused) {
        audioElement.play();
        mainPlayBtn.innerText = '⏸';
        if(activeCardBtn) {
            activeCardBtn.innerText = '⏸';
            activeCardBtn.style.background = '#000';
        }
    } else {
        audioElement.pause();
        mainPlayBtn.innerText = '▶';
        if(activeCardBtn) {
            activeCardBtn.innerText = '▶';
            activeCardBtn.style.background = 'var(--xxl-red)';
        }
    }
}

// Lógica de la Barra de Progreso y Tiempo
if (audioElement && progressBar && currTimeText && durTimeText) {
    audioElement.addEventListener('timeupdate', (e) => {
        const { duration, currentTime } = e.srcElement;
        if (duration) {
            const progressPercent = (currentTime / duration) * 100;
            progressBar.value = progressPercent;
            
            // Actualizar textos de tiempo
            currTimeText.innerText = formatTime(currentTime);
            durTimeText.innerText = formatTime(duration);
        }
    });
}

// Funcionalidad de "Seek" (Mover la barra)
if (audioElement && progressBar) {
    progressBar.addEventListener('input', () => {
        const duration = audioElement.duration;
        audioElement.currentTime = (progressBar.value * duration) / 100;
    });
}

// --- FUNCIÓN PARA CERRAR REPRODUCTOR ---
function closePlayer() {
    if (!audioElement || !mainPlayBtn) return;
    audioElement.pause();
    const playerBar = document.querySelector('.player-bar');
    if (playerBar) playerBar.classList.remove('active');
    
    // Resetear iconos a Play
    mainPlayBtn.innerText = '▶';
    if(activeCardBtn) {
        activeCardBtn.innerText = '▶';
        activeCardBtn.style.background = 'var(--xxl-red)';
        activeCardBtn = null;
    }
}

// REPRODUCCIÓN SIGUIENTE AUTOMÁTICA
if (audioElement) {
    audioElement.addEventListener('ended', () => {
        if (activeCardBtn) {
            const currentCard = activeCardBtn.closest('.card');
            let nextCard = currentCard.nextElementSibling;
            
            if (!nextCard || !nextCard.classList.contains('card')) {
                nextCard = document.querySelector('.card');
            }
            
            if (nextCard && nextCard.style.display !== 'none') {
                playTrack(nextCard.querySelector('.play-btn'));
            } else {
                closePlayer();
            }
        } else {
            closePlayer();
        }
    });
}

function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' + sec : sec}`;
}

// Lógica del Menú Lateral
function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    if (sidebar) sidebar.classList.toggle('active');
    if (overlay) overlay.classList.toggle('active');
}

// --- CURSOR PERSONALIZADO & ESTELA ---
const cursor = document.getElementById('customCursor');
let lastTrailTime = 0;

document.addEventListener('mousemove', (e) => {
    if (cursor) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        // Optimización: Solo crear estela cada 50ms para evitar lag
        const now = Date.now();
        if (now - lastTrailTime > 50) {
            createTrail(e.clientX, e.clientY);
            lastTrailTime = now;
        }
    }
});

function createTrail(x, y) {
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    trail.style.left = x + 'px';
    trail.style.top = y + 'px';
    document.body.appendChild(trail);

    setTimeout(() => {
        trail.remove();
    }, 600);
}
