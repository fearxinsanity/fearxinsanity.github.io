export class TransitionAnimator {
    constructor() {
        this.eyeOverlay = document.getElementById('eye-overlay');
        this.mainContent = document.querySelector('main');
    }

    waitForTransition(element) {
        return new Promise(resolve => {
            const onTransitionEnd = () => {
                element.removeEventListener('transitionend', onTransitionEnd);
                resolve();
            };
            element.addEventListener('transitionend', onTransitionEnd);
        });
    }

    async showOverlay() {
        if (this.eyeOverlay) {
            this.eyeOverlay.classList.add('active');
            await this.waitForTransition(this.eyeOverlay);
        }
    }

    async hideOverlay() {
        if (this.eyeOverlay) {
            this.eyeOverlay.classList.remove('active');
            await this.waitForTransition(this.eyeOverlay);
        }
    }

    async fadeOutContent() {
        if (this.mainContent) {
            this.mainContent.classList.add('fade-out');
            await this.waitForTransition(this.mainContent);
        }
    }

    async fadeInContent() {
        if (this.mainContent) {
            this.mainContent.classList.remove('fade-out');
            this.mainContent.classList.add('fade-in');
            await this.waitForTransition(this.mainContent);
            this.mainContent.classList.remove('fade-in');
        }
    }
}