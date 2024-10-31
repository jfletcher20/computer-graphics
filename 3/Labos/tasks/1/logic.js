/*

    3.1. Upotrijebite klasu matričnih transformacija u 2D MT2D (zadatak 2.2.) i klasu GKS (zadatak 1.4.), te rutinu za crtanje elipsi (zadatak 2.1.) da bi isprogramirali animirani ventilator.

*/

const unit = 40;
const xmin = -10, xmax = 10, ymin = -10, ymax = 10;

window.onload = function() {

    const canvas = document.getElementById("renderer");

    const canvasHeightSlider = document.getElementById("canvas-height");
    const canvasWidthSlider = document.getElementById("canvas-width");
    const unitSlider = document.getElementById("unit");
    const rotationSlider = document.getElementById("rotation");

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
    gks.zoom = unitSlider.value;

    function drawEllipsis(a = 1, b = 3, angle = rotationSlider.value, x = 0, y = 0, pivot = 0) {

        gks = new GKS2(canvas, xmin, xmax, ymin, ymax);
        gks.unit = unitSlider.value;

        gks.koristiBoju("red");

        const m = new MT2D();
        m.pomakni(x, y);
        if (pivot) m.rotiraj_oko_tocke(x, y, pivot);
        gks.trans(m);
        
        
        m.rotiraj_oko_tocke(x, y, angle);
        gks.trans(m);
        // switch a and b
        const temp = a;
        a = b;
        b = temp;

        for (var t = 0; t <= 2 * Math.PI; t += 0.01) {
            const x = a * Math.cos(t);
            const y = b * Math.sin(t);
            gks.postaviNa(x, y);
            // gks.linijaDo(x + x > 0 ? 0.1 : -0.1, y + y > 0 ? 0.1 : -0.1);
            var xNext = a * Math.cos(t + 0.01);
            var yNext = b * Math.sin(t + 0.01);
            gks.linijaDo(xNext, yNext);
            gks.povuciLiniju();
        }

    }
    
    function draw() {
        
        gks.initRenderer();

        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
        gks.nacrtajKoordinatniSustav(false, false, true, 10000, 10000);
        
        const a = 1, b = 4;
        drawEllipsis(a, b, rotationSlider.value, -3, 0, -60);
        drawEllipsis(a, b, rotationSlider.value, 3, 0);
        drawEllipsis(a, b, rotationSlider.value, -3, 0, 60);

    }

    unitSlider.oninput = function() {
        gks.zoom = this.value;
        draw();
    }

    rotationSlider.oninput = draw;

    draw();

}