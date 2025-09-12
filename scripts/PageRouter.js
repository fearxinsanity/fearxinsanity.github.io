/**
 * @file PageRouter.js
 * @description Eine Klasse für die Single-Page-Application (SPA)-ähnliche Navigation.
 * Führt flüssige Seitenübergänge und asynchrone Inhalt-Nachladefunktionen aus.
 */
import { Countdown } from './Countdown.js';
import { TransitionAnimator } from './TransitionAnimator.js';

/**
 * Klasse für die Navigation zwischen statischen HTML-Seiten.
 * Verwaltet den Seitenübergang mit Animationen und der History-API.
 */
export class PageRouter {
    /**
     * Erstellt eine Instanz des PageRouters.
     * @param {TransitionAnimator} animator - Eine Instanz der TransitionAnimator-Klasse.
     */
    constructor(animator) {
        this.animator = animator;
        this.isTransitioning = false;
        this.initNavigation();
    }

    /**
     * Initialisiert die Event-Listener für interne Links und den Browser-Verlauf (popstate).
     */
    initNavigation() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && this.isInternalLink(link.href)) {
                e.preventDefault();
                this.transitionTo(link.href).catch(error => console.error('Transition failed:', error));
            }
        });

        window.addEventListener('popstate', () => {
            this.transitionTo(window.location.href, false).catch(error => console.error('Popstate transition failed:', error));
        });
    }

    /**
     * Überprüft, ob ein Link eine interne Seite der Website ist.
     * @param {string} href - Die URL des Links.
     * @returns {boolean} - Gibt true zurück, wenn es ein interner Link ist.
     */
    isInternalLink(href) {
        return new URL(href).hostname === window.location.hostname;
    }

    /**
     * Führt den Seitenübergang mit Animationen und asynchronem Laden durch.
     * @param {string} url - Die URL der Zielseite.
     * @param {boolean} [pushState=true] - Gibt an, ob der URL zum Browser-Verlauf hinzugefügt werden soll.
     * @async
     */
    async transitionTo(url, pushState = true) {
        if (this.isTransitioning) return;
        this.isTransitioning = true;

        try {
            await this.animator.showOverlay();
            await this.animator.fadeOutContent();

            const newContent = await this.loadPage(url);
            this.replacePageContent(newContent);

            if (pushState) {
                history.pushState(null, '', url);
            }

            this.handleContentSpecificInitials(url);

            document.dispatchEvent(new CustomEvent('pageLoaded'));

            await this.animator.hideOverlay();
            await this.animator.fadeInContent();
            this.updateActiveNavLink(url);
        } catch (error) {
            console.error('Transition failed, falling back to hard reload:', error);
            window.location.href = url;
        } finally {
            this.isTransitioning = false;
        }
    }

    /**
     * Lädt den Inhalt einer Seite asynchron vom Server.
     * @param {string} url - Die URL der zu ladenden Seite.
     * @returns {Promise<string>} - Ein Promise, das den HTML-Inhalt der Seite auflöst.
     * @async
     */
    async loadPage(url) {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Page not found: ${url}`);
        return await response.text();
    }

    /**
     * Ersetzt den Inhalt des <main>-Elements mit dem neuen HTML-Inhalt.
     * Aktualisiert auch den Dokumenttitel.
     * @param {string} html - Der vollständige HTML-Inhalt der neuen Seite.
     */
    replacePageContent(html) {
        const parser = new DOMParser();
        const newDoc = parser.parseFromString(html, 'text/html');

        const newMain = newDoc.querySelector('main');
        const currentMain = document.querySelector('main');

        if (!newMain || !currentMain) {
            throw new Error('Could not find <main> element in the new page content.');
        }

        document.title = newDoc.title;
        currentMain.innerHTML = newMain.innerHTML;
    }

    /**
     * Aktualisiert den 'aria-current' Status für den aktiven Navigationslink.
     * @param {string} url - Die URL der aktuell geladenen Seite.
     */
    updateActiveNavLink(url) {
        const navLinks = document.querySelectorAll('nav a');
        const currentPath = new URL(url).pathname;

        navLinks.forEach(link => {
            const linkPath = new URL(link.href).pathname;
            if (linkPath === currentPath || (linkPath.endsWith('index.html') && currentPath === '/')) {
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    }

    /**
     * Führt seiten-spezifische Initialisierungen durch.
     * Aktuell wird der Countdown-Timer nur auf der Startseite initialisiert.
     * @param {string} url - Die URL der aktuell geladenen Seite.
     */
    handleContentSpecificInitials(url) {
        const path = new URL(url).pathname.split('/').pop() || 'index.html';
        if (path === 'index.html' || path === '') {
            if (!window.countdownInstance || window.countdownInstance.countdownInterval === null) {
                if (window.countdownInstance) {
                    clearInterval(window.countdownInstance.countdownInterval);
                }
                window.countdownInstance = new Countdown('2026-06-02T00:00:00', 'countdown-timer', 'countdown-message');
            }
        }
    }
}