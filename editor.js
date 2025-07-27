
class SiteEditor {
    constructor() {
        this.content = {};
        this.previewFrame = document.getElementById('previewFrame');
        this.init();
    }

    async init() {
        await this.loadContent();
        this.populateForm();
        this.bindEvents();
        this.setupRealtimePreview();
    }

    async loadContent() {
        try {
            const response = await fetch('content.json');
            this.content = await response.json();
        } catch (error) {
            console.error('Erreur lors du chargement du contenu:', error);
            this.content = this.getDefaultContent();
        }
    }

    getDefaultContent() {
        return {
            site: { title: "Salon Premium", logo: { text: "Salon Premium", icon: "fas fa-cut" } },
            theme: { primaryColor: "#ec7014", secondaryColor: "#0f172a", accentColor: "#22c55e" },
            hero: { 
                title: "L'Excellence en Coiffure", 
                subtitle: "Découvrez une expérience unique...",
                ctaButton: { text: "Prendre RDV", link: "#contact" },
                whatsappButton: { text: "WhatsApp", link: "https://wa.me/22900000000" }
            },
            services: { title: "Nos Services Premium", subtitle: "Découvrez notre gamme..." },
            contact: { whatsappNumber: "22900000000", phone: "+229 00 00 00 00", address: "123 Avenue...", hours: "Lun-Sam..." }
        };
    }

    populateForm() {
        // Site
        document.getElementById('site_title').value = this.content.site?.title || '';
        document.getElementById('logo_text').value = this.content.site?.logo?.text || '';

        // Thème
        document.getElementById('primary_color').value = this.content.theme?.primaryColor || '#ec7014';
        document.getElementById('secondary_color').value = this.content.theme?.secondaryColor || '#0f172a';
        document.getElementById('accent_color').value = this.content.theme?.accentColor || '#22c55e';

        // Hero
        document.getElementById('hero_title').value = this.content.hero?.title || '';
        document.getElementById('hero_subtitle').value = this.content.hero?.subtitle || '';
        document.getElementById('cta_button_text').value = this.content.hero?.ctaButton?.text || '';
        document.getElementById('whatsapp_button_text').value = this.content.hero?.whatsappButton?.text || '';

        // Services
        document.getElementById('services_title').value = this.content.services?.title || '';
        document.getElementById('services_subtitle').value = this.content.services?.subtitle || '';

        // Contact
        document.getElementById('whatsapp_number').value = this.content.contact?.whatsappNumber || '';
        document.getElementById('phone_number').value = this.content.contact?.phone || '';
        document.getElementById('address').value = this.content.contact?.address || '';
        document.getElementById('hours').value = this.content.contact?.hours || '';
    }

    bindEvents() {
        // Sauvegarde
        document.getElementById('saveBtn').addEventListener('click', () => this.saveContent());

        // Export
        document.getElementById('exportBtn').addEventListener('click', () => this.exportSite());

        // Aperçu plein écran
        document.getElementById('previewBtn').addEventListener('click', () => {
            window.open('index.html', '_blank');
        });

        // Reset
        document.getElementById('resetBtn').addEventListener('click', () => {
            if (confirm('Êtes-vous sûr de vouloir réinitialiser toutes les modifications ?')) {
                this.resetToDefault();
            }
        });

        // Upload d'image
        document.getElementById('hero_background').addEventListener('change', (e) => {
            this.handleImageUpload(e, 'hero.backgroundImage');
        });
    }

    setupRealtimePreview() {
        // Écouter tous les changements de formulaire
        const inputs = document.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                this.updatePreview();
            });
            input.addEventListener('change', () => {
                this.updatePreview();
            });
        });
    }

    updatePreview() {
        // Mettre à jour le contenu avec les valeurs du formulaire
        this.updateContentFromForm();
        
        // Envoyer les nouvelles données à l'iframe
        this.previewFrame.contentWindow.postMessage({
            type: 'updateContent',
            content: this.content
        }, '*');
    }

    updateContentFromForm() {
        // Site
        this.content.site = this.content.site || {};
        this.content.site.title = document.getElementById('site_title').value;
        this.content.site.logo = this.content.site.logo || {};
        this.content.site.logo.text = document.getElementById('logo_text').value;

        // Thème
        this.content.theme = this.content.theme || {};
        this.content.theme.primaryColor = document.getElementById('primary_color').value;
        this.content.theme.secondaryColor = document.getElementById('secondary_color').value;
        this.content.theme.accentColor = document.getElementById('accent_color').value;

        // Hero
        this.content.hero = this.content.hero || {};
        this.content.hero.title = document.getElementById('hero_title').value;
        this.content.hero.subtitle = document.getElementById('hero_subtitle').value;
        this.content.hero.ctaButton = this.content.hero.ctaButton || {};
        this.content.hero.ctaButton.text = document.getElementById('cta_button_text').value;
        this.content.hero.whatsappButton = this.content.hero.whatsappButton || {};
        this.content.hero.whatsappButton.text = document.getElementById('whatsapp_button_text').value;

        // Services
        this.content.services = this.content.services || {};
        this.content.services.title = document.getElementById('services_title').value;
        this.content.services.subtitle = document.getElementById('services_subtitle').value;

        // Contact
        this.content.contact = this.content.contact || {};
        this.content.contact.whatsappNumber = document.getElementById('whatsapp_number').value;
        this.content.contact.phone = document.getElementById('phone_number').value;
        this.content.contact.address = document.getElementById('address').value;
        this.content.contact.hours = document.getElementById('hours').value;
    }

    async saveContent() {
        this.updateContentFromForm();
        
        try {
            const response = await fetch('/api/save-content', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.content)
            });

            if (response.ok) {
                this.showNotification('Contenu sauvegardé avec succès !', 'success');
            } else {
                throw new Error('Erreur lors de la sauvegarde');
            }
        } catch (error) {
            console.error('Erreur:', error);
            this.showNotification('Erreur lors de la sauvegarde', 'error');
        }
    }

    handleImageUpload(event, contentPath) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            // Ici, vous pourriez uploader l'image vers un serveur
            // Pour la démo, nous utilisons l'URL de données
            const imageUrl = e.target.result;
            
            // Mettre à jour le contenu
            const keys = contentPath.split('.');
            let obj = this.content;
            for (let i = 0; i < keys.length - 1; i++) {
                obj = obj[keys[i]];
            }
            obj[keys[keys.length - 1]] = imageUrl;

            this.updatePreview();
            this.showNotification('Image uploadée avec succès !', 'success');
        };
        reader.readAsDataURL(file);
    }

    exportSite() {
        // Créer un objet avec tous les fichiers nécessaires
        const files = {
            'content.json': JSON.stringify(this.content, null, 2),
            'index.html': this.generateUpdatedHTML(),
            'editor.html': document.documentElement.outerHTML,
            'editor.js': this.getEditorJS()
        };

        // Créer et télécharger le ZIP (simulation)
        this.downloadAsJSON(files, 'salon-premium-site.json');
        this.showNotification('Site exporté avec succès !', 'success');
    }

    generateUpdatedHTML() {
        // Ici vous pourriez générer une version mise à jour du HTML
        // Pour simplifier, nous retournons un message
        return `<!-- Site généré automatiquement -->
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>${this.content.site.title}</title>
    <!-- Contenu mis à jour avec les nouvelles données -->
</head>
<body>
    <!-- Le HTML sera généré dynamiquement avec les nouvelles données -->
    <script>
        // Charger content.json et appliquer les modifications
    </script>
</body>
</html>`;
    }

    getEditorJS() {
        return `// Code de l'éditeur
// ${new Date().toISOString()}
// Généré automatiquement`;
    }

    downloadAsJSON(data, filename) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    resetToDefault() {
        this.content = this.getDefaultContent();
        this.populateForm();
        this.updatePreview();
        this.showNotification('Contenu réinitialisé aux valeurs par défaut', 'info');
    }

    showNotification(message, type = 'info') {
        // Créer une notification simple
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg text-white max-w-sm ${
            type === 'success' ? 'bg-green-500' :
            type === 'error' ? 'bg-red-500' :
            type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
        }`;
        notification.innerHTML = `
            <div class="flex items-center">
                <i class="fas fa-${
                    type === 'success' ? 'check-circle' :
                    type === 'error' ? 'exclamation-circle' :
                    type === 'warning' ? 'exclamation-triangle' : 'info-circle'
                } mr-2"></i>
                ${message}
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialiser l'éditeur
document.addEventListener('DOMContentLoaded', () => {
    new SiteEditor();
});
