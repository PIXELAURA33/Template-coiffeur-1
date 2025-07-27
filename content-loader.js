
// Content Loader simplifié et optimisé
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Content Loader initialisé');
    
    // Fonction pour charger le contenu depuis le localStorage
    function loadContent() {
        const savedContent = localStorage.getItem('salonContent');
        if (savedContent) {
            try {
                const content = JSON.parse(savedContent);
                applyContentToPage(content);
            } catch (e) {
                console.error('Erreur lors du chargement du contenu:', e);
            }
        }
    }
    
    // Appliquer le contenu à la page
    function applyContentToPage(content) {
        Object.keys(content).forEach(key => {
            const elements = document.querySelectorAll(`[data-field="${key}"]`);
            elements.forEach(element => {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.value = content[key];
                } else {
                    element.textContent = content[key];
                }
            });
        });
    }
    
    // Sauvegarder le contenu
    function saveContent() {
        const content = {};
        const editableElements = document.querySelectorAll('[data-field]');
        
        editableElements.forEach(element => {
            const field = element.dataset.field;
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                content[field] = element.value;
            } else {
                content[field] = element.textContent;
            }
        });
        
        localStorage.setItem('salonContent', JSON.stringify(content));
        return content;
    }
    
    // Exposer les fonctions globalement
    window.salonContentLoader = {
        load: loadContent,
        save: saveContent,
        apply: applyContentToPage
    };
    
    // Charger le contenu au démarrage
    loadContent();
});
