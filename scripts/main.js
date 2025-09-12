import { PageRouter } from './PageRouter.js';
import { TransitionAnimator } from './TransitionAnimator.js';
import { revealOnScroll, setupMobileMenu } from './Utils.js';

let scrollTicking = false;

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
    const router = new PageRouter(animator);

    router.handleContentSpecificInitials(window.location.href);

    revealOnScroll();
    setupMobileMenu();
});

window.addEventListener('scroll', handleScroll, { passive: true });