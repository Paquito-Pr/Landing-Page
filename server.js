const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname));

// Estado en memoria para likes (Simulando DB)
let trackLikes = {
    'barras-oro': 0,
    'atlanta-nights': 0,
    'perreo-intenso': 0
};

// Endpoint para obtener noticias (Funcionalidad D)
app.get('/api/news', (req, res) => {
    const news = [
        { title: "Young Thug Libertad", date: "Hace 2h", content: "Nuevas actualizaciones sobre el caso YSL." },
        { title: "Rolling Loud 2024", date: "Ayer", content: "Cartel confirmado con Travis Scott a la cabeza." },
        { title: "Novedad: Drill ES", date: "Hoy", content: "El nuevo álbum de Morad rompe récords." }
    ];
    res.json(news);
});

// Endpoint para Likes (Funcionalidad H)
app.post('/api/like', (req, res) => {
    const { id } = req.body;
    if (id in trackLikes) {
        trackLikes[id]++;
        res.json({ likes: trackLikes[id] });
    } else {
        trackLikes[id] = 1;
        res.json({ likes: 1 });
    }
});

// Endpoint para contacto (Funcionalidad E)
app.post('/api/contact', (req, res) => {
    const { email, message } = req.body;
    if (!email || !message) {
        return res.status(400).json({ error: "Faltan campos obligatorios" });
    }
    console.log(`Mensaje recibido de ${email}: ${message}`);
    res.json({ success: "Mensaje recibido correctamente. ¡Te contactaremos!" });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor XXL ejecutándose en http://localhost:${PORT}`);
});