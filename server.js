
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware pour parser les données de formulaire
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Servir les fichiers statiques
app.use(express.static('.'));

// Route principale
app.get('/', (req, res) => {
    try {
        res.sendFile(path.join(__dirname, 'index.html'));
    } catch (error) {
        console.error('Erreur lors du chargement de la page:', error);
        res.status(500).send('Erreur serveur');
    }
});

// Gestion des erreurs 404
app.use((req, res) => {
    res.status(404).send('Page non trouvée');
});

// Démarrer le serveur
app.listen(PORT, '0.0.0.0', (err) => {
    if (err) {
        console.error('Erreur lors du démarrage du serveur:', err);
        return;
    }
    console.log(`✅ Serveur démarré avec succès sur http://0.0.0.0:${PORT}`);
    console.log(`🌐 Votre site est accessible à l'adresse: http://0.0.0.0:${PORT}`);
});
