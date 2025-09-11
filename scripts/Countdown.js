export class Countdown {
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
            if (this.timerElement) this.timerElement.innerHTML = 'PROJEKT GESTARTET!';
            if (this.messageElement) this.messageElement.textContent = 'Das Warten hat ein Ende! Tauchen Sie ein in die Simulation.';
            clearInterval(this.countdownInterval);
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (this.timerElement && this.timerElement.querySelector('#days')) {
            this.timerElement.querySelector('#days').textContent = `${days}`;
            this.timerElement.querySelector('#hours').textContent = `${hours}`;
            this.timerElement.querySelector('#minutes').textContent = `${minutes}`;
            this.timerElement.querySelector('#seconds').textContent = `${seconds}`;
            if (this.messageElement) this.messageElement.textContent = 'Die Zeit läuft...';
        }
    }
}