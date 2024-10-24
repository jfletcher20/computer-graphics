const unit = 40;
const xmin = -6, xmax = 6, ymin = -6, ymax = 6;

window.onload = function() {

    const canvas = document.getElementById("renderer");
    const canvasHeightSlider = document.getElementById("canvas-height");
    const canvasWidthSlider = document.getElementById("canvas-width");

    const unitSlider = document.getElementById("unit");
    
    const aFocusSlider = document.getElementById("focus-a");
    const bFocusSlider = document.getElementById("focus-b");
    const radiusSlider = document.getElementById("radius-r");

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

    /*

        2.1. Nacrtajte koordinatne osi te kružnicu polumjera r = 4 i elipsu s poluosima a = 4 i b = 2 sa središtem u ishodištu uz pomoć metoda klase GKS iz zadatka 1.4. Raspon vrijednosti x i y koordinata neka bude od -5 do 5.

    */

    function drawCircle() {

        gks.koristiBoju("blue");
        const r = radiusSlider.value;

        for (var t = 0; t <= 2 * Math.PI; t += 0.01) {
            var x = r * Math.cos(t);
            var y = r * Math.sin(t);
            var xNext = r * Math.cos(t + 0.01 <= 2 * Math.PI ? t + 0.01 : 2 * Math.PI);
            var yNext = r * Math.sin(t + 0.01 <= 2 * Math.PI ? t + 0.01 : 2 * Math.PI);
            gks.postaviNa(x, y);
            gks.linijaDo(xNext, yNext);
            gks.povuciLiniju();
        }

    }

    function drawEllipsis() {

        gks.koristiBoju("red");
        const a = aFocusSlider.value, b = bFocusSlider.value;

        for (var t = 0; t <= 2 * Math.PI; t += 0.01) {
            var x = a * Math.cos(t);
            var y = b * Math.sin(t);
            var xNext = a * Math.cos(t + 0.01 <= 2 * Math.PI ? t + 0.01 : 2 * Math.PI);
            var yNext = b * Math.sin(t + 0.01 <= 2 * Math.PI ? t + 0.01 : 2 * Math.PI);
            gks.postaviNa(x, y);
            gks.linijaDo(xNext, yNext);
            gks.povuciLiniju();
        }

        gks.nacrtajSlova("Elipsa", 3, -4.2, 1, /*"purple"*/ "lavender");
        
    }


    function draw() {
        
        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
        gks.nacrtajKoordinatniSustav(false, false, true, 10000, 10000);

        drawCircle();
        drawEllipsis();
    
    }

    unitSlider.oninput = function() {
        gks.unit = this.value;
        draw();
    }

    aFocusSlider.oninput = bFocusSlider.oninput = radiusSlider.oninput = draw;
    draw();

}