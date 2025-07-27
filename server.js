
const express = require('express');
const path = require('path');
const fs = require('fs').promises;

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

// Middleware de logging pour déboguer les requêtes
app.use((req, res, next) => {
    console.log(`📍 ${req.method} ${req.url} - ${new Date().toISOString()}`);
    next();
});

// Route principale
app.get('/', (req, res) => {
    console.log('✅ Serving index.html');
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route pour l'éditeur (optionnelle)
app.get('/editor', (req, res) => {
    console.log('✅ Serving editor.html');
    res.sendFile(path.join(__dirname, 'editor.html'));
});

// Routes pour tous les fichiers statiques
app.get('/css/*', (req, res) => {
    const filePath = path.join(__dirname, req.path);
    console.log(`📄 CSS file requested: ${filePath}`);
    res.sendFile(filePath);
});

app.get('/js/*', (req, res) => {
    const filePath = path.join(__dirname, req.path);
    console.log(`📄 JS file requested: ${filePath}`);
    res.sendFile(filePath);
});

app.get('/img/*', (req, res) => {
    const filePath = path.join(__dirname, req.path);
    console.log(`📄 Image file requested: ${filePath}`);
    res.sendFile(filePath);
});

app.get('/font-awesome/*', (req, res) => {
    const filePath = path.join(__dirname, req.path);
    console.log(`📄 Font file requested: ${filePath}`);
    res.sendFile(filePath);
});

// Route catch-all pour servir index.html pour toutes les autres routes
app.get('*', (req, res) => {
    console.log(`🔄 Fallback route for: ${req.url}`);
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Gestion des erreurs 404
app.use((req, res) => {
    res.status(404).send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Page non trouvée</title>
            <style>
                body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                h1 { color: #ec7014; }
            </style>
        </head>
        <body>
            <h1>404 - Page non trouvée</h1>
            <p>La page que vous recherchez n'existe pas.</p>
            <a href="/" style="color: #ec7014;">Retour à l'accueil</a>
        </body>
        </html>
    `);
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
    console.error('Erreur serveur:', err.stack);
    res.status(500).send('Erreur interne du serveur');
});

// Démarrer le serveur
app.listen(PORT, '0.0.0.0', () => {
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
