/*

    Zadatak 1
    
        Koristeći jednostavne geometrijske likove (pravokutnike, kružnice, elipse, . . . ) nacrtajte lokomotivu (kamion, automobil ili slično) u crnoj boji.
        Nakona toga crvenom bojom nacrtajte pravac y = 3x + 6.
        Konačno, plavom bojom nacrtajte zrcalnu sliku početnog objekta s obzirom na crveni pravac.
    
    Koristite metode iz klasa GKS i MT2D.
    Nije poanta da ručno računate koordinate zrcalnog objekta, nego da to radite pomoću metoda iz navedenih klasa

*/

const unit = 40;
const xmin = -7, xmax = 10, ymin = -2, ymax = 10;

window.onload = function() {

    const canvas = document.getElementById("renderer");

    const canvasHeightSlider = document.getElementById("canvas-height");
    const canvasWidthSlider = document.getElementById("canvas-width");
    const unitSlider = document.getElementById("unit");

    if (!canvas) alert("Greška - nema platna!");

    canvasHeightSlider.oninput = function() {
        canvas.height = this.value;
        canvas.width = canvasWidthSlider.value;
        gks.initRenderer();
        draw();
    }

    canvasWidthSlider.oninput =  function() {
        canvas.width = this.value;
        canvas.height = canvasHeightSlider.value;
        gks.initRenderer();
        draw();
    }

    var gks = new GKS2(canvas, xmin, xmax, ymin, ymax);
    gks.unit = unitSlider.value;

    function drawTruck(color = "black") {

        gks.koristiBoju(color);
        drawRectangle(a = [1, 2], b = [5, 4]);
        drawRectangle(a = [5, 2], b = [7, 5]);
        drawRectangle(a = [5.3, 4], b = [6.7, 4.8]);
        drawCircle(r = 0.5, x = 2, y = 2);
        drawCircle(r = 0.5, x = 6, y = 2);

    }

    function drawCircle(r = 1, x = 0, y = 0) {

        gks.postaviNa(x + r, y);
        for (var i = 0; i <= 360; i++) {
            var rad = i * Math.PI / 180;
            gks.linijaDo(x + r * Math.cos(rad), y + r * Math.sin(rad));
        }
        gks.povuciLiniju();

    }

    function drawRectangle(a = [1, 2], b = [5, 4]) {
        
        gks.postaviNa(a[0], a[1]);
        gks.linijaDo(b[0], a[1]);
        gks.linijaDo(b[0], b[1]);
        gks.linijaDo(a[0], b[1]);
        gks.linijaDo(a[0], a[1]);
        gks.povuciLiniju();

    }

    function pravac(x) { return 3 * x + 6; }

    function draw() {
        
        gks.initRenderer();
        gks.placeCenterAt(0.425, 0.65);

        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
        gks.nacrtajKoordinatniSustav(false, false, true, 10000, 10000);

        drawTruck();

        gks.koristiBoju("red");
        gks.postaviNa(-7.1 / 3, pravac(-7.1 / 3));
        gks.linijaDo(1, pravac(1));
        gks.povuciLiniju();

        let matrix = new MT2D();
        // calculate the reflection matrix m
        const m = 3;
        const m2 = m * m;
        const scalar = 1 / (m2 + 1);
        // matrix.mult([
            // [scalar * ( m2 -1  ), scalar * 2 * m, -4],
            // [scalar * 2 * m, scalar * ( m2-1 ), -2],
            // [0, 0, 1]
        // ]);
        matrix.zrcaliNaX();
        
        matrix.rotiraj(2 * Math.atan(m) * 180 / Math.PI);
        // matrix.pomakni(0, pravac(0));

        gks.trans(matrix);
        gks.koristiBoju("purple");
        gks.nacrtajKoordinatneOsi();
        drawTruck("blue");

    }

    unitSlider.oninput = function() {
        gks.unit = this.value;
        draw();
    }

    draw();

}