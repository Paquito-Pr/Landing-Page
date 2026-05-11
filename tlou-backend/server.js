const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Habilita CORS para todas las rutas
app.use(express.json()); // Para parsear cuerpos de solicitud JSON
app.use(express.static(path.join(__dirname, 'public'))); // Sirve archivos estáticos desde 'public'

// Ruta del archivo de datos
const PEDIDOS_FILE = path.join(__dirname, 'data', 'pedidos.json');

// Asegurar que la carpeta 'data' existe
if (!fs.existsSync(path.join(__dirname, 'data'))) {
    fs.mkdirSync(path.join(__dirname, 'data'));
}

// Función de ayuda para leer pedidos
const readPedidos = () => {
    if (!fs.existsSync(PEDIDOS_FILE)) {
        return [];
    }
    const data = fs.readFileSync(PEDIDOS_FILE, 'utf8');
    return JSON.parse(data);
};


const writePedidos = (pedidos) => {
    fs.writeFileSync(PEDIDOS_FILE, JSON.stringify(pedidos, null, 2), 'utf8');
};


app.get('/api/pedidos', (req, res) => {
    const pedidos = readPedidos();
    res.json(pedidos);
});

app.post('/api/pedidos', (req, res) => {
    const newPedido = req.body;
    if (!newPedido.producto || !newPedido.cantidad) {
        return res.status(400).json({ message: 'Producto y cantidad son obligatorios.' });
    }
    const pedidos = readPedidos();
    pedidos.push({ id: Date.now(), ...newPedido }); // Añade un ID único basado en el timestamp
    writePedidos(pedidos);
    res.status(201).json({ message: 'Pedido recibido con éxito.', pedido: newPedido });
});


app.listen(PORT, () => {
    console.log(`TLOU Backend corriendo en http://localhost:${PORT}`);
    console.log(`Base de datos: ${PEDIDOS_FILE}`);
    console.log('Rutas disponibles:');
    console.log('  GET /api/pedidos');
    console.log('  POST /api/pedidos');
    console.log('  Accede a la app en http://localhost:3000');
    console.log('  Visor de JSON en http://localhost:3000/viewer.html');
    console.log('  Lista de pedidos en http://localhost:3000/pedidos.html');
});