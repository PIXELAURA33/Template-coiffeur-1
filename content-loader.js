
// Content Loader - Gestion dynamique du contenu
(function() {
    'use strict';
    
    // Configuration par défaut
    const defaultContent = {
        site: {
            title: "Salon Premium - Coiffure Professionnelle",
            logo: "Salon Premium"
        },
        loaded: true
    };

    // Charger le contenu sauvegardé ou utiliser les valeurs par défaut
    function loadContent() {
        try {
            const savedContent = localStorage.getItem('salon_content');
            if (savedContent && savedContent.trim() !== '') {
                const parsed = JSON.parse(savedContent);
                if (parsed && typeof parsed === 'object' && parsed.loaded) {
                    return parsed;
                }
            }
        } catch (error) {
            console.warn('Erreur lors du chargement du contenu sauvegardé:', error);
            // Nettoyer le localStorage en cas d'erreur
            try {
                localStorage.removeItem('salon_content');
            } catch (removeError) {
                console.warn('Impossible de nettoyer le localStorage:', removeError);
            }
        }
        return { ...defaultContent };
    }

    // Sauvegarder le contenu
    function saveContent(content) {
        try {
            localStorage.setItem('salon_content', JSON.stringify(content));
            return true;
        } catch (error) {
            console.warn('Erreur lors de la sauvegarde:', error);
            return false;
        }
    }

    // Exposer les fonctions globalement
    window.ContentLoader = {
        load: loadContent,
        save: saveContent,
        default: defaultContent
    };

    console.log('✅ Content Loader initialisé');
})();
