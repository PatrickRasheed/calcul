/**
 * Calculatrice Retro — API REST + Frontend
 * Fusion de la calculatrice retro avec l'API REST et les tests Jest
 */

const express = require('express');
const path    = require('path');
const client = require('prom-client');
const { add, sub, mul, div } = require('./calculator');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration Prometheus
const register = new client.Registry();
client.collectDefaultMetrics({ register });

// Compteur de requêtes
const requestCounter = new client.Counter({
  name: 'api_requests_total',
  help: 'Nombre total de requêtes API',
  labelNames: ['method', 'route', 'status']
});
register.registerMetric(requestCounter);

// Histogramme des temps de réponse
const responseTime = new client.Histogram({
  name: 'api_response_time_seconds',
  help: 'Temps de réponse en secondes',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1]
});
register.registerMetric(responseTime);

// Middleware pour parser les données
app.use(express.json());

// Middleware pour enregistrer les métriques
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const route = req.route ? req.route.path : req.path;
    requestCounter.inc({ method: req.method, route, status: res.statusCode });
    responseTime.observe({ method: req.method, route, status: res.statusCode }, duration);
  });
  next();
});

/* ── Servir les fichiers statiques (frontend retro) ────────────────── */
app.use(express.static(path.join(__dirname, '../public')));

/* ── Route racine → index.html ────────────────────────────────────── */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

/* ══════════════════════════════════════════════════════════════════
   Routes Prometheus /metrics
   ══════════════════════════════════════════════════════════════════ */

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

/* ══════════════════════════════════════════════════════════════════
   API Routes
   ══════════════════════════════════════════════════════════════════ */

/**
 * Route pour l'addition
 * @route GET /api/add?a=4&b=2
 * @returns {json} {"result": 6}
 */
app.get('/api/add', (req, res) => {
  try {
    const a = parseFloat(req.query.a);
    const b = parseFloat(req.query.b);

    if (isNaN(a) || isNaN(b)) {
      return res.status(400).json({
        error: 'Paramètres invalides. Les paramètres a et b doivent être des nombres.'
      });
    }

    const result = add(a, b);
    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Route pour la soustraction
 * @route GET /api/sub?a=9&b=3
 * @returns {json} {"result": 6}
 */
app.get('/api/sub', (req, res) => {
  try {
    const a = parseFloat(req.query.a);
    const b = parseFloat(req.query.b);

    if (isNaN(a) || isNaN(b)) {
      return res.status(400).json({
        error: 'Paramètres invalides. Les paramètres a et b doivent être des nombres.'
      });
    }

    const result = sub(a, b);
    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Route pour la multiplication
 * @route GET /api/mul?a=5&b=4
 * @returns {json} {"result": 20}
 */
app.get('/api/mul', (req, res) => {
  try {
    const a = parseFloat(req.query.a);
    const b = parseFloat(req.query.b);

    if (isNaN(a) || isNaN(b)) {
      return res.status(400).json({
        error: 'Paramètres invalides. Les paramètres a et b doivent être des nombres.'
      });
    }

    const result = mul(a, b);
    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Route pour la division
 * @route GET /api/div?a=12&b=2
 * @returns {json} {"result": 6}
 */
app.get('/api/div', (req, res) => {
  try {
    const a = parseFloat(req.query.a);
    const b = parseFloat(req.query.b);

    if (isNaN(a) || isNaN(b)) {
      return res.status(400).json({
        error: 'Paramètres invalides. Les paramètres a et b doivent être des nombres.'
      });
    }

    const result = div(a, b);
    res.json({ result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * Route de santé pour vérifier que l'API est en ligne
 */
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'API Calculatrice Retro en ligne',
    api_version: '1.0.0',
    endpoints: ['/api/add', '/api/sub', '/api/mul', '/api/div', '/api/health']
  });
});

/**
 * Route 404 - Non trouvée (pour les routes qui ne matchent pas)
 */
app.use((req, res) => {
  // Si c'est une requête API, retourner du JSON
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({
      error: 'Route API non trouvée',
      available_routes: ['/api/add', '/api/sub', '/api/mul', '/api/div', '/api/health']
    });
  }
  // Sinon, retourner le frontend (SPA)
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

/* ── Démarrage du serveur ───────────────────────────────────────────– */
app.listen(PORT, () => {
  console.log(`
  ╔════════════════════════════════════════════════╗
  ║   🎮 RETRO CALCULATOR API — ONLINE 🎮         ║
  ║   http://localhost:${PORT}                    ║
  ║                                                ║
  ║   Frontend: http://localhost:${PORT}           ║
  ║   API Health: http://localhost:${PORT}/api/health ║
  ╚════════════════════════════════════════════════╝
  `);
});

module.exports = app;
