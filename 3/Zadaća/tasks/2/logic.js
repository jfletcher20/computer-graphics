/*

    Zadatak 2
    Koristeći klase ortho i MT2D nacrtajte leptire i cvjetove kako je prikazano na slici.

        Za leptire i cvjetove koristite formule iz prve zadaće.
        Primijenite odgovarajuće transformacije na leptire i cvjetove da ih dovedete u odgovarajući položaj i dobijete odgovarajući oblik (uočite da postoje veći i manji leptiri).


*/

const xmin = -10, xmax = 10, ymin = -10, ymax = 10;

window.onload = function() {

    const canvas = document.getElementById("renderer");

    const canvasHeightSlider = document.getElementById("canvas-height");
    const canvasWidthSlider = document.getElementById("canvas-width");
    const unitSlider = document.getElementById("unit");

    const rotationSliderX = document.getElementById("rotation-x");
    const rotationSliderY = document.getElementById("rotation-y");
    const rotationSliderZ = document.getElementById("rotation-z");

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

    // we're only going to be using x and y coordinates; this task is 2D

    var ortho = new Ortho(canvas, xmin, xmax, ymin, ymax);
    ortho.zoom = unitSlider.value;

    function circle(r = 1, angle = 30, x = 0, y = 0, pivot = 0) {

        const m = new MT3D();
        m.rotirajZ(angle);
        ortho.trans(m);
        for (var t = 0; t <= 2 * Math.PI; t += 0.01) {
            const x = r * Math.cos(t);
            const y = r * Math.sin(t);
            var xNext = r * Math.cos(t + 0.01);
            var yNext = r * Math.sin(t + 0.01);
            ortho.postaviNa(x, y, 0);
            ortho.linijaDo(xNext, yNext, 0);
            ortho.povuciLiniju();
        }
        ortho.linijaDo(0, 0, 0);
        ortho.povuciLiniju();
    }
    
    function draw() {
        
        ortho.initRenderer();

        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
        // ortho.nacrtajKoordinatniSustav(false, false, true, 10000, 10000);
        
        const a = 1, b = 4;
        const angle = 0;
        circle();

    }

    unitSlider.oninput = function() {
        ortho.zoom = this.value;
        draw();
    }

    draw();

}