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

    // need to construct a 3d letter F out of cubes, stacked as such (each cube is 2x2x2):
    /*
        1 1 1 0 0
        1 0 0 0 0
        1 1 0 0 0
        1 0 0 0 0
        1 0 0 0 0
    */
    // where the base of the letter F is located at 0, 0, 0
    // draw a grid on the floor to help with orientation, which is 16x16, each square being 1x1, so that the letter F is centered in the middle of the grid

    function drawCube(x, y, z) {
        ortho.postaviNa(x, y, z);
        ortho.linijaDo(x + 2, y, z);
        ortho.linijaDo(x + 2, y + 2, z);
        ortho.linijaDo(x, y + 2, z);
        ortho.linijaDo(x, y, z);
        ortho.linijaDo(x, y, z + 2);
        ortho.linijaDo(x + 2, y, z + 2);
        ortho.linijaDo(x + 2, y + 2, z + 2);
        ortho.linijaDo(x, y + 2, z + 2);
        ortho.linijaDo(x, y, z + 2);
        ortho.linijaDo(x, y, z);
        ortho.linijaDo(x, y + 2, z);
        ortho.linijaDo(x, y + 2, z + 2);
        ortho.linijaDo(x + 2, y + 2, z + 2);
        ortho.linijaDo(x + 2, y + 2, z);
        ortho.linijaDo(x + 2, y, z);
    }

    function drawLetterF() {
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                if (i === 0 || i === 2 || (i === 1 && j === 0)) {
                    drawCube(i * 2, j * 2, 0);
                }
            }
        }
    }

    function drawGrid() {
        for (let i = -8; i < 8; i++) {
            ortho.postaviNa(i, -8, 0);
            ortho.linijaDo(i, 8, 0);
            ortho.postaviNa(-8, i, 0);
            ortho.linijaDo(8, i, 0);
        }
    }
    function draw() {
        
        ortho.initRenderer();

        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
        drawGrid();
        ortho.m.rotirajX(45);
        ortho.m.pomakni(0, 0, 0);
        ortho.m.rotirajZ(rotationSlider.value);
        drawLetterF();

    }

    unitSlider.oninput = function() {
        ortho.zoom = this.value;
        draw();
    }

    rotationSlider.oninput = draw;

    draw();

}