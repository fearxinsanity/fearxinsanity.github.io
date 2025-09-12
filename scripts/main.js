/**
 * @file main.js
 * @description Der Haupteinstiegspunkt für die Website-Logik.
 * Importiert und initialisiert alle notwendigen Skripte.
 */

import { PageRouter } from './PageRouter.js';
import { TransitionAnimator } from './TransitionAnimator.js';
import { revealOnScroll, setupMobileMenu } from './Utils.js';

let scrollTicking = false;

/**
 * Throttling-Funktion für das Scroll-Event.
 * Verwendet requestAnimationFrame, um die Performance zu verbessern und die
 * CPU-Last zu reduzieren.
 */
function handleScroll() {
    if (!scrollTicking) {
        window.requestAnimationFrame(() => {
            revealOnScroll();
            scrollTicking = false;
        });
        scrollTicking = true;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const animator = new TransitionAnimator();
    window.router = new PageRouter(animator);

    // Aktualisiert dynamisch die Jahreszahl im Footer
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = `${new Date().getFullYear()}`;
    }

    // Initialisiert die Animationen beim ersten Laden der Seite
    revealOnScroll();
    setupMobileMenu();
    window.router.handleContentSpecificInitials(window.location.href);
});

// Fügt den Event-Listener für das gesperrte Scroll-Event hinzu
window.addEventListener('scroll', handleScroll, { passive: true });

// Neuer Event-Listener zur Initialisierung von dynamisch geladenen Seiten
document.addEventListener('pageLoaded', () => {
    revealOnScroll();
    setupMobileMenu();
    window.router.handleContentSpecificInitials(window.location.href);
});