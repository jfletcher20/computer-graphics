/*

    3.1. Upotrijebite klasu matričnih transformacija u 2D MT3D (zadatak 2.2.) i klasu ortho (zadatak 1.4.), te rutinu za crtanje elipsi (zadatak 2.1.) da bi isprogramirali animirani ventilator.

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
        ortho.initRenderer();
        draw();
    }

    canvasWidthSlider.oninput =  function() {
        canvas.width = this.value;
        canvas.height = canvasHeightSlider.value;
        ortho.initRenderer();
        draw();
    }

    var ortho = new Ortho(canvas, xmin, xmax, ymin, ymax);
    ortho.zoom = unitSlider.value;

    function drawEllipsis(a = 1, b = 3, angle = rotationSlider.value, x = 0, y = 0, pivot = 0) {

        ortho = new Ortho(canvas, xmin, xmax, ymin, ymax);
        ortho.unit = unitSlider.value;

        // ortho.koristiBoju("red");

        const m = new MT3D();
        m.pomakni(x, y, 0);
        // if (pivot) m.rotiraj_oko_tocke(x, y, pivot);
        m.rotirajZ(pivot);
        ortho.trans(m);

        // m.identitet();
        m.rotirajZ(angle);
        
        
        // m.rotiraj_oko_tocke(x, y, angle);
        ortho.trans(m);
        // switch a and b
        const temp = a;
        a = b;
        b = temp;

        for (var t = 0; t <= 2 * Math.PI; t += 0.01) {
            const x = a * Math.cos(t);
            const y = b * Math.sin(t);
            ortho.postaviNa(x, y, 0);
            // ortho.linijaDo(x + x > 0 ? 0.1 : -0.1, y + y > 0 ? 0.1 : -0.1);
            var xNext = a * Math.cos(t + 0.01);
            var yNext = b * Math.sin(t + 0.01);
            ortho.linijaDo(xNext, yNext, 0);
            ortho.povuciLiniju();
        }

    }
    
    function draw() {
        
        ortho.initRenderer();

        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
        // ortho.nacrtajKoordinatniSustav(false, false, true, 10000, 10000);
        
        const a = 1, b = 4;
        drawEllipsis(a, b, rotationSlider.value, -3, 0, -60);
        drawEllipsis(a, b, rotationSlider.value, 3, 0);
        drawEllipsis(a, b, rotationSlider.value, -3, 0, 60);

    }

    unitSlider.oninput = function() {
        ortho.zoom = this.value;
        draw();
    }

    rotationSlider.oninput = draw;

    draw();

}