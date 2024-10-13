import express from 'express';
import metricsController from '../controllers/metricsController.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.render('dashboard')
});

/* router.get('/Prometheus', async (req, res) => {
    res.set('Content-Type', metricsController.register.contentType);
    res.end(await metricsController.register.metrics());
}); */

router.get('/Prometheus', async (req, res) => {
    const metrics = await metricsController.register.metrics();
    res.render('prometheus', { metrics });
});

export default router;