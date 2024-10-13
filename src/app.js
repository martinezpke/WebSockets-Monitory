import express from 'express';
import { createServer } from 'http';
import { Server } from "socket.io"; // Corrección aquí
import os from "os-utils"
import { join } from 'path';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import router from './routes/index.js';
import metricsController from './controllers/metricsController.js';

const app = express();
const server = createServer(app);
const io = new Server(server); // Corrección aquí

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.set('view engine', 'ejs');
app.set('views', join(__dirname, 'views'));

app.use(router);

// Comunicación en tiempo real con WebSockets
io.on('connection', (socket) => {
    console.log('Cliente conectado');

    // Enviar métricas de CPU y RAM cada 2 segundos
    setInterval(() => {
        os.cpuUsage((cpuUsage) => {
            const memoryUsage = os.freememPercentage();
            const metrics = {
                cpuUsage: (cpuUsage * 100).toFixed(2),
                memoryUsage: ((1 - memoryUsage) * 100).toFixed(2) 
            };

            // Enviar métricas al frontend
            socket.emit('serverMetrics', metrics);
        });
    }, 900);

    // Enviar métricas de CPU y RAM cada 1 segundo
    setInterval(async () => {
        const metrics = await metricsController.updateMetrics();
        socket.emit('serverMetricsprometheus', metrics);
    }, 2000);

    // Cuando el cliente se desconecta
    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`[Server] corriendo en el puerto ${PORT}`);
});
