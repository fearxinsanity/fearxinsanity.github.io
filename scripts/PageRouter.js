import { Countdown } from './Countdown.js';

export class PageRouter {
    constructor(animator) {
        this.animator = animator;
        this.isTransitioning = false;
        this.initNavigation();
    }

    initNavigation() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && this.isInternalLink(link.href)) {
                e.preventDefault();
                this.transitionTo(link.href)
                    .catch(error => {
                        console.error("Navigation-Promise abgelehnt:", error);
                    });
            }
        });

        window.addEventListener('popstate', () => {
            this.transitionTo(window.location.href, false)
                .catch(error => {
                    console.error("Popstate-Promise abgelehnt:", error);
                });
        });
    }

    isInternalLink(href) {
        return new URL(href).hostname === window.location.hostname;
    }

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

            await this.animator.hideOverlay();
            await this.animator.fadeInContent();
            this.updateActiveNavLink(url);

        } catch (error) {
            console.error('Transition failed:', error);
            window.location.href = url;
        } finally {
            this.isTransitioning = false;
        }
    }

    async loadPage(url) {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Page not found: ${url}`);
        return await response.text();
    }

    replacePageContent(html) {
        const parser = new DOMParser();
        const newDoc = parser.parseFromString(html, 'text/html');

        document.title = newDoc.title;
        const newMain = newDoc.querySelector('main');
        const currentMain = document.querySelector('main');

        if (newMain && currentMain) {
            currentMain.innerHTML = newMain.innerHTML;
        }
    }

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

    handleContentSpecificInitials(url) {
        const path = new URL(url).pathname.split('/').pop() || 'index.html';
        if (path === 'index.html' || path === '') {
            if (window.countdownInstance) {
                clearInterval(window.countdownInstance.countdownInterval);
            }
            window.countdownInstance = new Countdown('2026-06-02T00:00:00', 'countdown-timer', 'countdown-message');
        }
    }
}