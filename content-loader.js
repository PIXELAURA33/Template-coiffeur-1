
class ContentLoader {
    constructor() {
        this.content = {};
        this.init();
    }

    async init() {
        await this.loadContent();
        this.applyContent();
        this.setupMessageListener();
    }

    async loadContent() {
        try {
            const response = await fetch('content.json');
            this.content = await response.json();
        } catch (error) {
            console.error('Erreur lors du chargement du contenu:', error);
        }
    }

    applyContent() {
        this.applyTheme();
        this.applySiteInfo();
        this.applyHeroSection();
        this.applyServicesSection();
        this.applyContactInfo();
    }

    applyTheme() {
        if (!this.content.theme) return;

        const { primaryColor, secondaryColor, accentColor } = this.content.theme;

        // Créer des variables CSS personnalisées
        const root = document.documentElement;
        root.style.setProperty('--primary-color', primaryColor);
        root.style.setProperty('--secondary-color', secondaryColor);
        root.style.setProperty('--accent-color', accentColor);

        // Appliquer les couleurs aux éléments existants
        this.updateElementStyles('.bg-primary-600', 'background-color', primaryColor);
        this.updateElementStyles('.text-primary-600', 'color', primaryColor);
        this.updateElementStyles('.bg-green-500', 'background-color', accentColor);
        this.updateElementStyles('.hover\\:bg-green-600:hover', 'background-color', this.darkenColor(accentColor, 10));
    }

    applySiteInfo() {
        if (!this.content.site) return;

        // Titre du site
        if (this.content.site.title) {
            document.title = this.content.site.title;
        }

        // Logo
        if (this.content.site.logo?.text) {
            const logoElements = document.querySelectorAll('[data-field="logo_text"]');
            logoElements.forEach(el => {
                el.textContent = this.content.site.logo.text;
            });

            // Si pas de data-field, chercher dans la nav
            const navLogo = document.querySelector('nav h1');
            if (navLogo) {
                const icon = navLogo.querySelector('i');
                navLogo.innerHTML = '';
                if (icon) navLogo.appendChild(icon);
                navLogo.innerHTML += this.content.site.logo.text;
            }
        }
    }

    applyHeroSection() {
        if (!this.content.hero) return;

        // Titre principal
        if (this.content.hero.title) {
            const titleElement = document.querySelector('#home h1');
            if (titleElement) {
                const parts = this.content.hero.title.split(' ');
                if (parts.length > 2) {
                    const lastWord = parts.pop();
                    titleElement.innerHTML = `${parts.join(' ')} <span class="text-primary-400">${lastWord}</span>`;
                } else {
                    titleElement.textContent = this.content.hero.title;
                }
            }
        }

        // Sous-titre
        if (this.content.hero.subtitle) {
            const subtitleElement = document.querySelector('#home p[data-editable="text"]');
            if (subtitleElement) {
                subtitleElement.textContent = this.content.hero.subtitle;
            }
        }

        // Boutons
        if (this.content.hero.ctaButton?.text) {
            const ctaButtons = document.querySelectorAll('a[href="#contact"]:not([target="_blank"])');
            ctaButtons.forEach(btn => {
                if (btn.textContent.includes('Prendre RDV') || btn.textContent.includes('Réserver')) {
                    btn.innerHTML = btn.innerHTML.replace(/Prendre RDV|Réserver/g, this.content.hero.ctaButton.text);
                }
            });
        }

        if (this.content.hero.whatsappButton?.text) {
            const whatsappButtons = document.querySelectorAll('a[href*="wa.me"]');
            whatsappButtons.forEach(btn => {
                if (btn.textContent.includes('WhatsApp')) {
                    btn.innerHTML = btn.innerHTML.replace('WhatsApp', this.content.hero.whatsappButton.text);
                }
            });
        }

        // Image d'arrière-plan
        if (this.content.hero.backgroundImage) {
            const heroSection = document.querySelector('#home');
            if (heroSection) {
                heroSection.style.backgroundImage = `linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.7)), url('${this.content.hero.backgroundImage}')`;
            }
        }

        // Spécialités
        if (this.content.hero.specialties) {
            const specialtyContainer = document.querySelector('#home .space-y-4');
            if (specialtyContainer) {
                specialtyContainer.innerHTML = '';
                this.content.hero.specialties.forEach(specialty => {
                    const div = document.createElement('div');
                    div.className = 'flex items-center text-white';
                    div.innerHTML = `
                        <i class="fas fa-check-circle text-primary-400 mr-3"></i>
                        <span>${specialty}</span>
                    `;
                    specialtyContainer.appendChild(div);
                });
            }
        }
    }

    applyServicesSection() {
        if (!this.content.services) return;

        // Titre de section
        if (this.content.services.title) {
            const titleElement = document.querySelector('#services h2');
            if (titleElement) {
                titleElement.textContent = this.content.services.title;
            }
        }

        // Sous-titre
        if (this.content.services.subtitle) {
            const subtitleElement = document.querySelector('#services p[data-editable="text"]');
            if (subtitleElement) {
                subtitleElement.textContent = this.content.services.subtitle;
            }
        }

        // Items de service
        if (this.content.services.items) {
            const serviceItems = document.querySelectorAll('#services [data-editable="service-item"]');
            this.content.services.items.forEach((item, index) => {
                if (serviceItems[index]) {
                    const serviceItem = serviceItems[index];
                    
                    // Icône
                    const iconImg = serviceItem.querySelector('img');
                    if (iconImg && item.icon) {
                        iconImg.src = item.icon;
                        iconImg.alt = item.title;
                    }

                    // Titre
                    const titleEl = serviceItem.querySelector('h3');
                    if (titleEl && item.title) {
                        titleEl.textContent = item.title;
                    }

                    // Description
                    const descEl = serviceItem.querySelector('p[data-editable="text"]');
                    if (descEl && item.description) {
                        descEl.textContent = item.description;
                    }
                }
            });
        }
    }

    applyContactInfo() {
        if (!this.content.contact) return;

        // Numéro WhatsApp
        if (this.content.contact.whatsappNumber) {
            const whatsappLinks = document.querySelectorAll('a[href*="wa.me"]');
            whatsappLinks.forEach(link => {
                const href = link.getAttribute('href');
                const newHref = href.replace(/wa\.me\/\d+/, `wa.me/${this.content.contact.whatsappNumber}`);
                link.setAttribute('href', newHref);
            });
        }

        // Téléphone
        if (this.content.contact.phone) {
            const phoneElements = document.querySelectorAll('p:contains("+229")');
            phoneElements.forEach(el => {
                if (el.textContent.includes('+229')) {
                    el.textContent = this.content.contact.phone;
                }
            });

            // Liens téléphone
            const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
            phoneLinks.forEach(link => {
                link.href = `tel:${this.content.contact.phone}`;
            });
        }

        // Adresse
        if (this.content.contact.address) {
            const addressElements = document.querySelectorAll('#contact p');
            addressElements.forEach(el => {
                if (el.textContent.includes('Avenue') || el.textContent.includes('Paris')) {
                    el.textContent = this.content.contact.address;
                }
            });
        }

        // Horaires
        if (this.content.contact.hours) {
            const hoursElements = document.querySelectorAll('#contact p');
            hoursElements.forEach(el => {
                if (el.textContent.includes('Lun-Sam')) {
                    el.textContent = this.content.contact.hours;
                }
            });
        }
    }

    updateElementStyles(selector, property, value) {
        try {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                el.style[property] = value;
            });
        } catch (error) {
            // Ignore les erreurs de sélecteur CSS invalides
        }
    }

    darkenColor(color, percent) {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) - amt;
        const G = (num >> 8 & 0x00FF) - amt;
        const B = (num & 0x0000FF) - amt;
        return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    }

    setupMessageListener() {
        // Écouter les messages de l'éditeur
        window.addEventListener('message', (event) => {
            if (event.data.type === 'updateContent') {
                this.content = event.data.content;
                this.applyContent();
            }
        });
    }

    // Méthode pour mettre à jour le contenu depuis l'extérieur
    updateContent(newContent) {
        this.content = { ...this.content, ...newContent };
        this.applyContent();
    }
}

// Initialiser le chargeur de contenu
document.addEventListener('DOMContentLoaded', () => {
    window.contentLoader = new ContentLoader();
});

// Helper pour jQuery-like contains
document.addEventListener('DOMContentLoaded', function() {
    NodeList.prototype.forEach = Array.prototype.forEach;
    
    // Fonction helper pour sélectionner des éléments contenant du texte
    window.selectByText = function(text) {
        const elements = [];
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
        
        let node;
        while (node = walker.nextNode()) {
            if (node.textContent.includes(text)) {
                elements.push(node.parentElement);
            }
        }
        return elements;
    };
});
