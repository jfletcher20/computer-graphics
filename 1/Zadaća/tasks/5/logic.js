const unit = 40;
const xmin = -20, xmax = 20, ymin = -20, ymax = 20;

window.onload = function() {
    
    const canvas = document.getElementById("renderer");
    const unitSlider = document.getElementById("unit");
    const sizeSlider = document.getElementById("size");
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

    function _x(a, φ) { return _r(a, φ) * cos(φ); }
    function _y(a, φ) { return _r(a, φ) * sin(φ); }
    function _r(a, φ) { return a * cos(4 * φ); }

    const iteratorBump = 0.001;

    function drawFlower() {

        const a = sizeSlider.value / 2;

        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
        // gks.nacrtajKoordinatniSustav(true, true, true);
        gks.unit = unitSlider.value;
        gks.koristiBoju("red");
        gks.koristiDebljinu(1);

        function drawCurve(a = 1) {
            for (var t = 0; t <= 2 * Math.PI; t += iteratorBump) {
                const x = _x(a, t);
                const y = _y(a, t);
                var xNext = x + (x > 0 ? a * iteratorBump : a * -iteratorBump);

                var yNext = y + (y > 0 ? a * iteratorBump : a * -iteratorBump);

                gks.postaviNa(x, y);
                gks.linijaDo(xNext, yNext);
                gks.povuciLiniju();
            }
        }

        for (var i = a; i > 0; i -= 0.5) drawCurve(i);
    }

    unitSlider.oninput = drawFlower;
    sizeSlider.oninput = drawFlower;

    drawFlower();

}