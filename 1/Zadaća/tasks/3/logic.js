const unit = 40;
const xmin = -20, xmax = 20, ymin = -20, ymax = 20;

window.onload = function() {

    
    const canvas = document.getElementById("renderer");
    const unitSlider = document.getElementById("unit");
    const displacementSlider = document.getElementById("displacement");
    if (!canvas) alert("Greška - nema platna!");

    var gks = new GKS(canvas, xmin, xmax, ymin, ymax);
    gks.unit = unitSlider.value;
    
    /*

        Zadatak 3

        Nacrtajte leptira koji je zadan parametarskim jednadžbama:

            x = ((e ^ (cos t)) − 2 cos 4t + (sin ^ (5) (t / 12))) sin t
            y = ((e ^ (cos t)) − 2 cos 4t + (sin ^ (5) (t / 12))) cos t

        Parametar t ograničite na segment [0, 12π]. Po želji možete dodati slider pomoću kojeg će se interaktivno mijenjati gornja i donja granica segmenta na kojemu se crta leptir.
        
        Koristite GKS klasu.

    */

    gks.koristiBoju("red");
    gks.koristiDebljinu(1)

    function cos(x) { return Math.cos(x); }
    function sin(x) { return Math.sin(x); }

    const e = Math.E;
    function _x(t) {
        return ((e ** cos(t)) - 2 * cos(4 * t) + (sin(t / 12) ** 5)) * sin(t);
    }

    function _y(t) {
        return ((e ** cos(t)) - 2 * cos(4 * t) + (sin(t / 12) ** 5)) * cos(t);
    }

    const iteratorBump = 0.0015;

    function drawButterfly() {
        const displacementValue = displacementSlider.value / 100;
        gks.displace(0, -0.2 - 5 * displacementValue);

        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
        gks.unit = unitSlider.value;
        gks.koristiBoju("red");
        gks.koristiDebljinu(1);

        for (var t = 0; t <= 12 * Math.PI; t += iteratorBump) {
            const x = _x(t);
            const y = _y(t);
            var xNext = x + (x < 12 * Math.PI ? 2 * iteratorBump : 2 * -iteratorBump);
            var yNext = y + (x < 12 * Math.PI ? 2 * iteratorBump : 2 * -iteratorBump);
            gks.postaviNa(x, y - 0.5 - 5 * displacementValue);
            gks.linijaDo(xNext, yNext - 0.5 - 5 * displacementValue);
            gks.povuciLiniju();
        }
    }

    unitSlider.oninput = drawButterfly;
    displacementSlider.oninput = drawButterfly;

    drawButterfly();

}