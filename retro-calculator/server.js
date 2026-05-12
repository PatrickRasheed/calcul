/**
 * RetroCalc — Express Server
 * Serves static files and provides a clean entry point for Vercel/local deployment.
 */

const express = require('express');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

/* ── Static files ─────────────────────────────────────────────────── */
app.use(express.static(path.join(__dirname, 'public')));

/* ── Root → index.html ────────────────────────────────────────────── */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

/* ── 404 fallback ─────────────────────────────────────────────────── */
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', 'index.html'));
});

/* ── Start ────────────────────────────────────────────────────────── */
app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════╗
  ║   🎮 RETRO CALCULATOR — ONLINE 🎮   ║
  ║   http://localhost:${PORT}              ║
  ╚══════════════════════════════════════╝
  `);
});

module.exports = app; // For Vercel serverless
