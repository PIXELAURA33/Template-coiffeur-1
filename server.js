
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Servir les fichiers statiques
app.use(express.static('.'));

// Route principale
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Démarrer le serveur
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Serveur démarré sur http://0.0.0.0:${PORT}`);
});
