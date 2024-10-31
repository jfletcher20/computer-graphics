/*

    3.4. Animirajte rotaciju kocke i to tako da se kocka istovremeno okreće oko sve tri koordinatne osi.

*/

const xmin = -10, xmax = 10, ymin = -10, ymax = 10;

window.onload = function() {

    const canvas = document.getElementById("renderer");

    const canvasHeightSlider = document.getElementById("canvas-height");
    const canvasWidthSlider = document.getElementById("canvas-width");
    const unitSlider = document.getElementById("unit");

    const animationCheckbox = document.getElementById("animation");

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

    var i = 0, k = 0, j = 0;
    
    function draw() {

        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
        
        ortho.m.rotirajX(i);
        ortho.m.rotirajY(k);
        ortho.m.rotirajZ(j);

        if (animationCheckbox.checked) {
            i += 0.1;
            k += 0.2;
            j += 0.3;
            if (i >= 360) {
                i = 0;
            }
            if (k >= 360) {
                k = 0;
            }
            if (j >= 360) {
                j = 0;
            }
        }
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
        // draw();
    }

    // draw();
    setInterval(draw, 25);

}