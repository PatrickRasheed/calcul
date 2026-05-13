/**
 * Calculatrice Retro — API REST + Frontend
 * Fusion de la calculatrice retro avec l'API REST et les tests Jest
 */

const express = require('express');
const path    = require('path');
const { add, sub, mul, div } = require('./calculator');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware pour parser les données
app.use(express.json());

/* ── Servir les fichiers statiques (frontend retro) ────────────────── */
app.use(express.static(path.join(__dirname, '../public')));

/* ── Route racine → index.html ────────────────────────────────────── */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
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
