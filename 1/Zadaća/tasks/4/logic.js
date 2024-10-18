const unit = 40;
const xmin = -8, xmax = 8, ymin = -3, ymax = 3;

window.onload = function() {
    
    const canvas = document.getElementById("renderer");
    const unitSlider = document.getElementById("unit");
    const displacementSlider = document.getElementById("displacement");
    if (!canvas) alert("Greška - nema platna!");

    var gks = new GKS(canvas, xmin, xmax, ymin, ymax);
    gks.unit = unitSlider.value;
    
    /*

        Zadatak 4

        Nacrtajte graf funkcije f(x) = sin x na segmentu [0, 2π].
        
        Koordinatni sustav zajedno s oznakama na koordinatnim osima postavite kako je prikazano na slici.
        
        Uočite da su granice na x-osi malo dulje od segmenta na kojemu se crta sinusoida.

    */

    gks.koristiBoju("red");
    gks.koristiDebljinu(1)

    function cos(x) { return Math.cos(x); }
    function sin(x) { return Math.sin(x); }

    // function _x(r, φ) { return r * cos(φ); }
    // function _y(r, φ) { return r * sin(φ); }

    function _x(t) {
        return t;
    }

    function _y(t) {
        return Math.sin(t);
    }

    const iteratorBump = 0.01;

    function drawCurve() {

        const displacementValue = displacementSlider.value / 100;
        gks.placeCenterAt(displacementValue, 0.5);

        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
        gks.nacrtajKoordinatniSustav(true, true, true, 10000, 1);
        gks.unit = unitSlider.value;
        gks.koristiBoju("red");
        gks.koristiDebljinu(1);

        for (var t = 0; t <= 2 * Math.PI; t += iteratorBump) {
            const x = _x(t);
            const y = _y(t);
            var xNext = x + iteratorBump;
            var yNext = y + (x < 2 * Math.PI ? 2 * iteratorBump : 2 * -iteratorBump);
            gks.postaviNa(x, y);
            gks.linijaDo(xNext, yNext);
            gks.povuciLiniju();
        }
    }

    unitSlider.oninput = drawCurve;
    displacementSlider.oninput = drawCurve;

    drawCurve();

}