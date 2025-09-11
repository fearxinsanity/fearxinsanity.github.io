// scripts/utils.js

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

export function setupMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('nav');
    const navLinks = document.querySelectorAll('nav a');

    if (navToggle && nav) {
        navToggle.addEventListener('click', () => {
            nav.classList.toggle('nav-open');
            navToggle.classList.toggle('nav-open');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('nav-open')) {
                nav.classList.remove('nav-open');
                navToggle.classList.remove('nav-open');
            }
        });
    });
}