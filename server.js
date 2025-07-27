const express = require('express');
const path = require('path');
const fs = require('fs').promises; // Import the promises version of fs

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware pour parser les données de formulaire
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname)));

// Route API pour sauvegarder le contenu
app.post('/api/save-content', async (req, res) => {
    try {
        const content = req.body;
        await fs.writeFile('content.json', JSON.stringify(content, null, 2));
        res.json({ success: true, message: 'Contenu sauvegardé avec succès' });
    } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error);
        res.status(500).json({ success: false, message: 'Erreur lors de la sauvegarde' });
    }
});

// Route API pour charger le contenu
app.get('/api/load-content', async (req, res) => {
    try {
        const data = await fs.readFile('content.json', 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        console.error('Erreur lors du chargement:', error);
        res.status(500).json({ success: false, message: 'Erreur lors du chargement' });
    }
});

// Route principale
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route pour l'éditeur
app.get('/editor', (req, res) => {
    res.sendFile(path.join(__dirname, 'editor.html'));
});

// Routes pour les assets
app.get('/css/*', (req, res) => {
    res.sendFile(path.join(__dirname, req.path));
});

app.get('/js/*', (req, res) => {
    res.sendFile(path.join(__dirname, req.path));
});

app.get('/img/*', (req, res) => {
    res.sendFile(path.join(__dirname, req.path));
});

app.get('/font-awesome/*', (req, res) => {
    res.sendFile(path.join(__dirname, req.path));
});

// Gestion des erreurs 404
app.use((req, res) => {
    res.status(404).send('Page non trouvée');
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
    console.error('Erreur serveur:', err.stack);
    res.status(500).send('Erreur interne du serveur');
});

// Démarrer le serveur
app.listen(PORT, '0.0.0.0', (err) => {
    if (err) {
        console.error('Erreur lors du démarrage du serveur:', err);
        process.exit(1);
    }
    console.log(`✅ Serveur démarré avec succès sur http://0.0.0.0:${PORT}`);
    console.log(`🌐 Votre site est accessible à l'adresse: http://0.0.0.0:${PORT}`);
});

// Gestion propre de l'arrêt du serveur
process.on('SIGTERM', () => {
    console.log('Arrêt du serveur...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('Arrêt du serveur...');
    process.exit(0);
});