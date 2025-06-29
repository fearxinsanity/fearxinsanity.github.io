// script.js - Illuminati/Freimaurer Stil

class SecretSocietyTransition {
    constructor() {
        this.isTransitioning = false;
        this.setupEyeOverlay();
        this.initNavigation();
        this.initGlobalClickEffect();
    }

    setupEyeOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'eye-overlay';
        overlay.innerHTML = `
            <div class="eye-container">
                <div class="eye"></div>
            </div>
        `;
        document.body.appendChild(overlay);

        const style = document.createElement('style');
        style.textContent = `
            #eye-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                z-index: 9999;
                pointer-events: none;
                opacity: 0;
                background: var(--bg);
                display: flex;
                justify-content: center;
                align-items: center;
                transition: opacity 0.5s ease-in-out;
            }

            #eye-overlay.active {
                pointer-events: all;
                opacity: 1;
            }

            .eye-container {
                width: 150px;
                height: 150px;
                position: relative;
                animation: pulse 2s infinite;
            }

            .eye {
                width: 100%;
                height: 100%;
                background: var(--primary);
                border-radius: 50%;
                position: relative;
                clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
                transform: rotate(180deg);
            }
            
            .eye::before {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                width: 50px;
                height: 50px;
                background: var(--secondary);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                border: 2px solid var(--primary);
            }

            @keyframes pulse {
                0% { transform: scale(1); box-shadow: 0 0 10px var(--primary); }
                50% { transform: scale(1.05); box-shadow: 0 0 25px var(--primary); }
                100% { transform: scale(1); box-shadow: 0 0 10px var(--primary); }
            }
            
            .page-transition.fade-out {
                opacity: 0;
                transition: opacity 0.3s ease-out;
            }
        `;
        document.head.appendChild(style);

        const loading = document.createElement('div');
        loading.className = 'loading-text';
        document.body.appendChild(loading);
    }

    initGlobalClickEffect() {
        document.addEventListener('click', (e) => {
            // Optional: Hier könnte ein subtiler Klick-Effekt hinzugefügt werden
        });
    }

    initNavigation() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && this.isInternalLink(link.href)) {
                e.preventDefault();
                this.transitionToPage(link.href);
            }
        });

        window.addEventListener('popstate', (e) => {
            this.transitionToPage(window.location.href, false);
        });
    }

    isInternalLink(href) {
        return href.includes(window.location.host) &&
            (href.endsWith('.html') || href === window.location.origin + '/');
    }

    async transitionToPage(url, pushState = true) {
        if (this.isTransitioning) return;
        this.isTransitioning = true;

        try {
            await this.showEyeOverlay();
            await this.fadeOutCurrentPage();

            const newContent = await this.loadPage(url);
            this.replacePageContent(newContent);

            if (pushState) {
                history.pushState(null, '', url);
            }

            await this.hideEyeOverlay();
            this.revealSections();

        } catch (error) {
            console.error('Transition failed:', error);
            window.location.href = url;
        } finally {
            this.isTransitioning = false;
        }
    }

    showEyeOverlay() {
        return new Promise((resolve) => {
            const overlay = document.getElementById('eye-overlay');
            overlay.classList.add('active');
            setTimeout(resolve, 500);
        });
    }

    hideEyeOverlay() {
        return new Promise((resolve) => {
            const overlay = document.getElementById('eye-overlay');
            overlay.classList.remove('active');
            setTimeout(resolve, 500);
        });
    }

    fadeOutCurrentPage() {
        return new Promise((resolve) => {
            const main = document.querySelector('main');
            main.classList.add('fade-out');
            setTimeout(resolve, 300);
        });
    }

    revealSections() {
        const main = document.querySelector('main');
        main.classList.remove('fade-out');
        const reveals = document.querySelectorAll('.reveal');
        reveals.forEach((el, index) => {
            setTimeout(() => {
                if (el.getBoundingClientRect().top < window.innerHeight) {
                    el.classList.add('revealed');
                }
            }, index * 100);
        });
    }

    async loadPage(url) {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Page not found');
        return await response.text();
    }

    replacePageContent(html) {
        const parser = new DOMParser();
        const newDoc = parser.parseFromString(html, 'text/html');

        document.title = newDoc.title;

        const newMain = newDoc.querySelector('main');
        const currentMain = document.querySelector('main');
        currentMain.innerHTML = newMain.innerHTML;

        this.updateActiveNavLink();
        this.handleContentSpecificInitials(window.location.href);
    }

    updateActiveNavLink() {
        const navLinks = document.querySelectorAll('nav a');
        const current = window.location.pathname.split('/').pop() || 'index.html';

        navLinks.forEach(link => {
            link.removeAttribute('aria-current');
            if (link.getAttribute('href') === current) {
                link.setAttribute('aria-current', 'page');
            }
        });
    }

    handleContentSpecificInitials(url) {
        const path = url.split('/').pop() || 'index.html';
        if (path === 'index.html') {
            if (window.countdownInstance) {
                clearInterval(window.countdownInstance.countdownInterval);
            }
            window.countdownInstance = new Countdown('2026-03-01T00:00:00', 'countdown-timer', 'countdown-message');
        }
    }
}

class Countdown {
    constructor(targetDateString, timerElementId, messageElementId) {
        this.targetDate = new Date(targetDateString).getTime();
        this.timerElement = document.getElementById(timerElementId);
        this.messageElement = document.getElementById(messageElementId);
        this.countdownInterval = null;

        if (this.timerElement && this.messageElement) {
            this.startCountdown();
        }
    }

    startCountdown() {
        this.updateCountdown();
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
        }
        this.countdownInterval = setInterval(() => this.updateCountdown(), 1000);
    }

    updateCountdown() {
        const now = new Date().getTime();
        const distance = this.targetDate - now;

        if (distance < 0) {
            this.timerElement.innerHTML = 'PROJEKT GESTARTET!';
            this.messageElement.textContent = 'Das Warten hat ein Ende! Tauchen Sie ein in die Simulation.';
            clearInterval(this.countdownInterval);
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        this.timerElement.querySelector('#days').textContent = days;
        this.timerElement.querySelector('#hours').textContent = hours;
        this.timerElement.querySelector('#minutes').textContent = minutes;
        this.timerElement.querySelector('#seconds').textContent = seconds;
        this.messageElement.textContent = 'Die Zeit läuft...';
    }
}

function revealOnScroll() {
    const reveals = document.querySelectorAll('.reveal:not(.revealed)');
    const windowHeight = window.innerHeight;

    reveals.forEach(el => {
        const elementTop = el.getBoundingClientRect().top;
        if (elementTop < windowHeight - 100) {
            el.classList.add('revealed');
        }
    });
}

let scrollTimeout;

function throttledReveal() {
    if (!scrollTimeout) {
        scrollTimeout = setTimeout(() => {
            revealOnScroll();
            scrollTimeout = null;
        }, 16);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const secretTransition = new SecretSocietyTransition();
    if (window.location.pathname.split('/').pop() === 'index.html' || window.location.pathname === '/') {
        window.countdownInstance = new Countdown('2026-03-01T00:00:00', 'countdown-timer', 'countdown-message');
    }
    revealOnScroll();

    const navLinks = document.querySelectorAll('nav a');
    const current = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(link => {
        if (link.getAttribute('href') === current) {
            link.setAttribute('aria-current', 'page');
        }
    });
});

window.addEventListener('scroll', throttledReveal, {passive: true});