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

    var ortho = new Ortho(canvas, xmin, xmax, ymin, ymax);
    ortho.zoom = unitSlider.value;
    
    function draw() {

        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
        ortho = new Ortho(canvas, xmin, xmax, ymin, ymax);
        ortho.zoom = unitSlider.value;
        
        ortho.m.identitet();
        ortho.m.rotirajX(rotationSliderX.value);
        drawCube("red");
        ortho.m.identitet();
        ortho.m.rotirajY(rotationSliderY.value);
        drawCube("green");
        ortho.m.identitet();
        ortho.m.rotirajZ(rotationSliderZ.value);
        drawCube("blue");
        ortho.m.identitet();
        ortho.m.rotirajX(rotationSliderX.value);
        ortho.m.rotirajY(rotationSliderY.value);
        ortho.m.rotirajZ(rotationSliderZ.value);
        drawCube("black");

    }

    function drawCube(color) {
            
        if (color) ortho.postaviBoju(color);
        ortho.postaviNa(-1, -1, -1);
        ortho.linijaDo(1, -1, -1);
        ortho.linijaDo(1, 1, -1);
        ortho.linijaDo(-1, 1, -1);
        ortho.linijaDo(-1, -1, -1);
        ortho.povuciLiniju();

        ortho.postaviNa(-1, -1, 1);
        ortho.linijaDo(1, -1, 1);
        ortho.linijaDo(1, 1, 1);
        ortho.linijaDo(-1, 1, 1);
        ortho.linijaDo(-1, -1, 1);
        ortho.povuciLiniju();

        ortho.postaviNa(-1, -1, -1);
        ortho.linijaDo(-1, -1, 1);
        ortho.povuciLiniju();

        ortho.postaviNa(1, -1, -1);
        ortho.linijaDo(1, -1, 1);
        ortho.povuciLiniju();

        ortho.postaviNa(1, 1, -1);
        ortho.linijaDo(1, 1, 1);
        ortho.povuciLiniju();

        ortho.postaviNa(-1, 1, -1);
        ortho.linijaDo(-1, 1, 1);
        ortho.povuciLiniju();
    }

    unitSlider.oninput = function() {
        ortho.zoom = this.value;
        draw();
    }

    rotationSliderX.oninput = rotationSliderY.oninput = rotationSliderZ.oninput = draw;

    draw();

}