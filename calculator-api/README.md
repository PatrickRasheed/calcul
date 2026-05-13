# 🎮 Calculatrice Retro — Frontend + API + Tests

**Fusion complète**: Calculatrice retro pixel art interactive + API REST + Tests Jest automatisés

Un projet full-stack JavaScript combinant une interface utilisateur retro avec une API REST documentée et une suite de tests complète.

## 🎯 Caractéristiques

### 🖥️ Frontend Retro
- **Interface pixel art retro** avec effet CRT authentique
- **Écran phosphorescent** vert avec scanlines
- **Clavier fonctionnel** avec toutes les opérations mathématiques
- **Clavier clavier** (0-9, +, −, ×, ÷, =, Backspace, Escape, etc.)
- **Sons retro** (optionnels) avec Web Audio API
- **Indicateurs LED** (ERR, NEG, MEM)
- **Support des opérations avancées**: parenthèses, racine carrée, pourcentage

### 📡 API REST
- **Routes documentées** pour chaque opération
- **Validation des paramètres**
- **Gestion complète des erreurs**
- **Endpoint `/api/health`** pour monitoring

### ✅ Tests Jest
- **25 tests automatisés** 
- **Couverture complète** des 4 opérations
- **Tests de cas limites**
- **Division par zéro** explicitement testée

### 🐳 DevOps
- **Dockerfile** inclus
- **Docker Compose** pour orchestration
- **Scripts npm** pour développement et tests

## 📁 Architecture

```
calculator-api/
├── public/                      # Frontend statique (retro UI)
│   ├── index.html              # HTML principal
│   ├── css/style.css           # Styles retro + CRT effects
│   └── js/calculator.js        # Logic frontend interactive
├── src/
│   ├── app.js                  # Express + routes API
│   └── calculator.js           # Logique mathématique
├── tests/
│   └── calculator.test.js      # Suite Jest (25 tests)
├── package.json                # Dépendances + scripts
├── Dockerfile                  # Image Docker
├── docker-compose.yml          # Orchestration
└── README.md                   # Cette documentation
```

## 🚀 Démarrage rapide

### Sans Docker

1. **Installer les dépendances**
```bash
npm install
```

2. **Démarrer l'application**
```bash
npm start
```
→ Ouvrir http://localhost:3000

3. **Lancer les tests**
```bash
npm test
```

### Avec Docker

```bash
# Démarrer
docker compose up

# Afficher les logs
docker compose logs -f

# Exécuter les tests dans le conteneur
docker compose exec api npm test

# Arrêter
docker compose down
```

## 📡 API Routes

### Addition
```
GET /api/add?a=4&b=2
Response: {"result": 6}
```

### Soustraction
```
GET /api/sub?a=9&b=3
Response: {"result": 6}
```

### Multiplication
```
GET /api/mul?a=5&b=4
Response: {"result": 20}
```

### Division
```
GET /api/div?a=12&b=2
Response: {"result": 6}

GET /api/div?a=10&b=0
Response: 400 Bad Request - "Division par zéro impossible"
```

### Health Check
```
GET /api/health
Response: {"status": "OK", "message": "API Calculatrice Retro en ligne", ...}
```

## 🧪 Tests Jest

### Exécuter tous les tests
```bash
npm test
```

### Mode watch (re-run on file change)
```bash
npm run test:watch
```

### Générer un rapport de couverture
```bash
npm run test:coverage
```

### Résultats attendus
```
PASS tests/calculator.test.js
✓ Addition (5 tests)
✓ Soustraction (5 tests)
✓ Multiplication (5 tests)  
✓ Division (7 tests)
✓ Cas limites (3 tests)

Test Suites: 1 passed, 1 total
Tests: 25 passed, 25 total
Time: ~1s
```

## 🎮 Utilisation du Frontend

### Avec la souris
Cliquer sur les boutons pour effectuer des calculs

### Avec le clavier
- **Chiffres**: 0-9
- **Opérations**: `+`, `-`, `*`, `/`
- **Décimal**: `,` ou `.`
- **Égal**: `Enter` ou `=`
- **Backspace**: `Backspace` ou `Suppr`
- **Clear all**: `Escape`
- **Parenthèses**: `(`, `)`
- **Racine carrée**: √
- **Pourcentage**: %

### Son
Cliquer sur 🔇/🔊 pour activer/désactiver les sons retro

## 🛠️ Technologies

| Couche | Technology |
|--------|------------|
| **Frontend** | HTML5 + CSS3 + Vanilla JavaScript |
| **Backend** | Node.js 18 + Express.js 4.18 |
| **Tests** | Jest 29 |
| **Runtime** | Docker + Docker Compose |
| **Font** | Press Start 2P (Google Fonts) |

## 📊 Cas de test couverts

### Addition ✅
- Deux nombres positifs
- Nombres négatifs
- Avec zéro
- Nombres décimaux
- Très grands nombres

### Soustraction ✅
- Deux nombres positifs
- Nombre négatif résultant
- Avec zéro
- Nombres décimaux

### Multiplication ✅
- Deux nombres positifs
- Avec nombres négatifs
- Avec zéro
- Nombres décimaux

### Division ✅
- Deux nombres positifs
- Résultat décimal
- Nombres négatifs
- Zéro divisé
- **Division par zéro (erreur attendue)**
- Nombres décimaux

### Cas limites ✅
- Très grands nombres
- Nombres très petits
- Opérations avec négatifs

## ⚙️ Configuration

### Variables d'environnement
```bash
PORT=3000              # Port d'écoute (défaut: 3000)
NODE_ENV=development   # Environnement (development/production)
```

### Dans Docker
```yml
environment:
  NODE_ENV: development
  PORT: 3000
```

## 📈 Performance

- **Démarrage**: < 100ms
- **Temps de réponse API**: < 1ms par opération
- **Tests**: ~1s pour les 25 tests
- **Taille image Docker**: ~200MB (Node 18-alpine)

## 🐛 Gestion des erreurs

### Paramètres invalides
```json
HTTP 400
{
  "error": "Paramètres invalides. Les paramètres a et b doivent être des nombres."
}
```

### Division par zéro
```json
HTTP 400
{
  "error": "Division par zéro impossible"
}
```

### Route non trouvée (API)
```json
HTTP 404
{
  "error": "Route API non trouvée",
  "available_routes": ["/api/add", "/api/sub", "/api/mul", "/api/div", "/api/health"]
}
```

## 🎓 Concepts d'apprentissage

### Jest
- Création de tests avec `test()` et `expect()`
- Matchers: `toBe()`, `toThrow()`, `toBeCloseTo()`
- Tests d'erreur avec `toThrow()`

### Express.js
- Routes API avec requête/réponse
- Query parameters
- Validation des données
- Middleware

### JavaScript moderne
- Modules CommonJS (`require/module.exports`)
- Arrow functions
- Template literals
- Gestion des erreurs

### Retro UI
- CSS Grid pour layout
- CSS Variables (custom properties)
- Animations CSS
- Web Audio API pour les sons

## 📚 Ressources

- [Jest Documentation](https://jestjs.io/)
- [Express.js Guide](https://expressjs.com/)
- [Node.js Docs](https://nodejs.org/docs/)
- [Docker Docs](https://docs.docker.com/)

## 🔄 Workflow typique

1. **Développement local**
   ```bash
   npm start           # Démarre le serveur
   npm run test:watch  # Tests en mode watch
   ```

2. **Avant commit**
   ```bash
   npm test           # S'assurer que tous les tests passent
   ```

3. **Déploiement Docker**
   ```bash
   docker compose up  # Lance l'application containerisée
   ```

## 📝 Logs

### Démarrage normal
```
╔════════════════════════════════════════════════╗
║   🎮 RETRO CALCULATOR API — ONLINE 🎮         ║
║   http://localhost:3000                        ║
║   Frontend: http://localhost:3000              ║
║   API Health: http://localhost:3000/api/health ║
╚════════════════════════════════════════════════╝
```

## ✨ Points forts du projet

✅ **Interface retro complète** - Pixel art authentique avec CRT effects  
✅ **API bien documentée** - Routes claires et cohérentes  
✅ **Tests exhaustifs** - 25 cas testés automatiquement  
✅ **DevOps ready** - Dockerisé et prêt pour production  
✅ **Code moderne** - ES6+, Express, Jest  
✅ **Clavier + Souris** - Interface complètement interactive  
✅ **Sans dépendances externes** - Vanilla JS pour le frontend  

## 🚀 Prochaines étapes

- [ ] Ajouter des tests d'intégration API
- [ ] Historique des calculs
- [ ] Sauvegarde en localStorage
- [ ] Mode sombre/clair
- [ ] CI/CD avec GitHub Actions
- [ ] Déploiement sur Vercel

## 📄 Licence

MIT

---

**Atelier**: Découverte des tests automatiques avec Jest en JavaScript  
**Fusion**: Retro Calculator + Calculator API  
**Année**: 2026
