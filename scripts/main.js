import { PageRouter } from './PageRouter.js';
import { TransitionAnimator } from './TransitionAnimator.js';
import { revealOnScroll, setupMobileMenu } from './Utils.js';

let scrollTimeout;

function throttledReveal() {
    if (!scrollTimeout) {
        scrollTimeout = setTimeout(() => {
            revealOnScroll();
            scrollTimeout = null;
        }, 50);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const animator = new TransitionAnimator();
    new PageRouter(animator);

    revealOnScroll();
    setupMobileMenu();
});

window.addEventListener('scroll', throttledReveal, { passive: true });