# Utiliser l'image Node.js officielle comme base
FROM node:18-alpine

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers de configuration
COPY package*.json ./

# Installer les dépendances (y compris les devDependencies pour les tests)
RUN npm install

# Copier le reste de l'application
COPY . .

# Exposer le port 3000
EXPOSE 3000

# Commande par défaut : démarrer l'application
CMD ["npm", "start"]
