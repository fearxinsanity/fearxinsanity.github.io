document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault(); // Verhindert das Standardverhalten des Links (sofortiges Springen)

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth' // Hier ist der Zauber für das sanfte Scrollen
        });
    });
});

// Fügt sanftes Scrollen auch für interne Links hinzu, die nicht in der Navigation sind
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    if (!anchor.closest('nav')) { // Überspringt Navigationslinks, da sie oben schon behandelt werden
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    }
});

// Funktion zum Ein-/Ausblenden von Elementen beim Scrollen
function revealElements() {
    const revealPoints = document.querySelectorAll('.reveal'); // Elemente mit der Klasse 'reveal'

    for (let i = 0; i < revealPoints.length; i++) {
        let windowHeight = window.innerHeight; // Höhe des Browserfensters
        let revealTop = revealPoints[i].getBoundingClientRect().top; // Position des Elements vom oberen Rand

        // Der Punkt, an dem das Element eingeblendet werden soll (z.B. 150px vom unteren Rand des Fensters)
        let revealPoint = 150;

        // Wenn das Element in den sichtbaren Bereich scrollt
        if (revealTop < windowHeight - revealPoint) {
            revealPoints[i].classList.add('active'); // Füge die Klasse 'active' hinzu
        } else {
            // Optional: Wenn das Element wieder aus dem Sichtfeld scrollt, blende es wieder aus
            // revealPoints[i].classList.remove('active');
        }
    }
}

// Füge den Event Listener für das Scrollen hinzu
window.addEventListener('scroll', revealElements);
// Führe die Funktion einmal beim Laden der Seite aus, falls Elemente schon sichtbar sind
window.addEventListener('load', revealElements);