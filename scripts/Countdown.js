/**
 * @file Countdown.js
 * @description Stellt einen Countdown-Timer für ein bestimmtes Zieldatum bereit.
 */

/**
 * Klasse zur Verwaltung und Anzeige eines Countdowns.
 */
export class Countdown {
    /**
     * Erstellt eine Instanz des Countdowns.
     * @param {string} targetDateString - Das Zieldatum im Format "YYYY-MM-DDT-HH:MM:SS".
     * @param {string} timerElementId - Die ID des HTML-Elements, das den Timer anzeigt.
     * @param {string} messageElementId - Die ID des HTML-Elements, das eine Nachricht anzeigt.
     */
    constructor(targetDateString, timerElementId, messageElementId) {
        this.targetDate = new Date(targetDateString).getTime();
        this.timerElement = document.getElementById(timerElementId);
        this.messageElement = document.getElementById(messageElementId);
        this.countdownInterval = null;

        if (this.timerElement && this.messageElement) {
            this.startCountdown();
        }
    }

    /**
     * Startet oder aktualisiert den Countdown-Timer.
     * Stoppt jeden zuvor gestarteten Interval, um Doppelung zu verhindern.
     */
    startCountdown() {
        this.updateCountdown();
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
        }
        this.countdownInterval = setInterval(() => this.updateCountdown(), 1000);
    }

    /**
     * Aktualisiert die Anzeige des Countdowns jede Sekunde.
     * Berechnet die verbleibende Zeit und zeigt sie in den entsprechenden HTML-Elementen an.
     * Stoppt den Timer, wenn das Zieldatum erreicht ist.
     */
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