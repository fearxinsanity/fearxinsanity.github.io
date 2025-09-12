/**
 * @file Utils.js
 * @description Enthält allgemeine Dienstprogramme und Helferfunktionen für die Website.
 */

/**
 * Fügt allen Elementen mit der Klasse 'reveal' die Klasse 'revealed' hinzu,
 * wenn sie in den sichtbaren Bereich gescrollt werden.
 */
export function revealOnScroll() {
    const reveals = document.querySelectorAll('.reveal:not(.revealed)');
    const windowHeight = window.innerHeight;

    reveals.forEach(el => {
        const elementTop = el.getBoundingClientRect().top;
        if (elementTop < windowHeight - 50) {
            el.classList.add('revealed');
        }
    });
}

/**
 * Initialisiert das mobile Menü mit dem Hamburger-Button und der Navigation.
 * Fügt Event-Listener zum Umschalten der Menü-Sichtbarkeit hinzu.
 */
export function setupMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('nav');
    const navLinks = document.querySelectorAll('nav a');

    if (navToggle && nav) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', `${!isExpanded}`);
            nav.classList.toggle('nav-open');
            navToggle.classList.toggle('nav-open');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('nav-open')) {
                const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
                navToggle.setAttribute('aria-expanded', `${!isExpanded}`);
                nav.classList.remove('nav-open');
                navToggle.classList.remove('nav-open');
            }
        });
    });
}