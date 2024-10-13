import os from "os-utils";
import client from 'prom-client';

// Crear un registro (Registry) para almacenar las métricas
const register = new client.Registry();
client.collectDefaultMetrics({ register });

// Definir métricas personalizadas
const cpuUsageGauge = new client.Gauge({
    name: 'app_cpu_usage_percentage',
    help: 'Porcentaje de uso de CPU'
});

const memoryUsageGauge = new client.Gauge({
    name: 'app_memory_usage_percentage',
    help: 'Porcentaje de uso de memoria'
});

// Añadir las métricas personalizadas al registro
register.registerMetric(cpuUsageGauge);
register.registerMetric(memoryUsageGauge);

// Función para obtener métricas y actualizar las métricas de Prometheus
const updateMetrics = () => {
    return new Promise((resolve) => {
        os.cpuUsage((cpuUsage) => {
            const memoryUsage = os.freememPercentage();
            const metrics = {
                cpuUsage: (cpuUsage * 100).toFixed(2),
                memoryUsage: ((1 - memoryUsage) * 100).toFixed(2)
            };

            // Actualizar métricas para Prometheus
            cpuUsageGauge.set(cpuUsage * 100);
            memoryUsageGauge.set((1 - memoryUsage) * 100);

            resolve(metrics);
        });
    });
};

// Exportar funciones del controlador
export default {
    updateMetrics,
    register,
};
