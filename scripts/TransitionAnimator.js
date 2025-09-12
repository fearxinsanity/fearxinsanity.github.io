/**
 * @file TransitionAnimator.js
 * @description Verwaltet die Übergangsanimationen wie das Ein- und Ausblenden des Augen-Overlays.
 */

/**
 * Klasse zur Steuerung der Seitenübergangsanimationen.
 */
export class TransitionAnimator {
    /**
     * Erstellt eine Instanz des TransitionAnimators und holt die relevanten DOM-Elemente.
     */
    constructor() {
        this.eyeOverlay = document.getElementById('eye-overlay');
        this.mainContent = document.querySelector('main');
    }

    /**
     * Erstellt ein Promise, das auflöst, wenn eine CSS-Transition abgeschlossen ist.
     * @param {HTMLElement} element - Das Element, dessen Transition überwacht werden soll.
     * @returns {Promise<void>}
     */
    waitForTransition(element) {
        return new Promise(resolve => {
            const onTransitionEnd = () => {
                element.removeEventListener('transitionend', onTransitionEnd);
                resolve();
            };
            element.addEventListener('transitionend', onTransitionEnd);
        });
    }

    /**
     * Zeigt das Augen-Overlay mit einer Animation an.
     * @async
     */
    async showOverlay() {
        if (this.eyeOverlay) {
            this.eyeOverlay.classList.add('active');
            await this.waitForTransition(this.eyeOverlay);
        }
    }

    /**
     * Blendet das Augen-Overlay mit einer Animation aus.
     * @async
     */
    async hideOverlay() {
        if (this.eyeOverlay) {
            this.eyeOverlay.classList.remove('active');
            await this.waitForTransition(this.eyeOverlay);
        }
    }

    /**
     * Blendet den Hauptinhalt der Seite aus.
     * @async
     */
    async fadeOutContent() {
        if (this.mainContent) {
            this.mainContent.classList.add('fade-out');
            await this.waitForTransition(this.mainContent);
        }
    }

    /**
     * Blendet den Hauptinhalt der Seite ein.
     * @async
     */
    async fadeInContent() {
        if (this.mainContent) {
            this.mainContent.classList.remove('fade-out');
            this.mainContent.classList.add('fade-in');
            await this.waitForTransition(this.mainContent);
            this.mainContent.classList.remove('fade-in');
        }
    }
}