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
            checkHeaderScroll(); // Neu hinzugefügt
            scrollTicking = false;
        });
        scrollTicking = true;
    }
}

/**
 * Überprüft die Scroll-Position und passt den Header an.
 */
function checkHeaderScroll() {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.classList.add('is-scrolling');
    } else {
        header.classList.remove('is-scrolling');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const animator = new TransitionAnimator();
    const router = new PageRouter(animator);

    router.handleContentSpecificInitials(window.location.href);

    // Initialisiert die Animationen beim ersten Laden der Seite
    revealOnScroll();
    setupMobileMenu();
    checkHeaderScroll(); // Führt die Prüfung beim Laden aus
});

// Fügt den Event-Listener für das gesperrte Scroll-Event hinzu
window.addEventListener('scroll', handleScroll, { passive: true });

// Neuer Event-Listener zur Initialisierung von dynamisch geladenen Seiten
document.addEventListener('pageLoaded', () => {
    revealOnScroll();
    setupMobileMenu();
    checkHeaderScroll(); // Führt die Prüfung nach dem Laden einer neuen Seite aus
});

// Aktualisiert dynamisch die Jahreszahl im Footer
const currentYearSpan = document.getElementById('current-year');
if (currentYearSpan) {
    currentYearSpan.textContent = `${new Date().getFullYear()}`;
}