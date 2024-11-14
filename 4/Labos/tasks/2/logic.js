/*

    3.1. Upotrijebite klasu matričnih transformacija u 2D MT3D (zadatak 2.2.) i klasu persp (zadatak 1.4.), te rutinu za crtanje elipsi (zadatak 2.1.) da bi isprogramirali animirani ventilator.

*/

const unit = 40;
const xmin = -10, xmax = 10, ymin = -10, ymax = 10;

window.onload = function () {

    const canvas = document.getElementById("renderer");

    const canvasHeightSlider = document.getElementById("canvas-height");
    const canvasWidthSlider = document.getElementById("canvas-width");
    const unitSlider = document.getElementById("unit");
    const rotationSlider = document.getElementById("rotation");

    if (!canvas) alert("Greška - nema platna!");

    canvasHeightSlider.oninput = function () {
        canvas.height = this.value;
        canvas.width = canvasWidthSlider.value;
        persp.initRenderer();
        draw();
    }

    canvasWidthSlider.oninput = function () {
        canvas.width = this.value;
        canvas.height = canvasHeightSlider.value;
        persp.initRenderer();
        draw();
    }

    var persp = new Persp(canvas, xmin, xmax, ymin, ymax, 10);
    persp.zoom = unitSlider.value;

    const matrix = new MT3D();

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
        persp.postaviNa(x, y, z);
        persp.linijaDo(x + 2, y, z);
        persp.linijaDo(x + 2, y + 2, z);
        persp.linijaDo(x, y + 2, z);
        persp.linijaDo(x, y, z);
        persp.linijaDo(x, y, z + 2);
        persp.linijaDo(x + 2, y, z + 2);
        persp.linijaDo(x + 2, y + 2, z + 2);
        persp.linijaDo(x, y + 2, z + 2);
        persp.linijaDo(x, y, z + 2);
        persp.linijaDo(x, y, z);
        persp.linijaDo(x, y + 2, z);
        persp.linijaDo(x, y + 2, z + 2);
        persp.linijaDo(x + 2, y + 2, z + 2);
        persp.linijaDo(x + 2, y + 2, z);
        persp.linijaDo(x + 2, y, z);
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
        for (let i = -5; i <= 5; i += 0.5) {
            persp.postaviNa(i, 0, -5);
            persp.linijaDo(i, 0, 5);
            persp.povuciLiniju();
            persp.postaviNa(-5, 0, i);
            persp.linijaDo(5, 0, i);
            persp.povuciLiniju();
        }
    }
    const phi = 45;

    function cos(φ) {
        return Math.cos(φ * Math.PI / 180);
    }
    function sin(φ) {
        return Math.sin(φ * Math.PI / 180);
    }

    var rising = true;

    function draw() {

        persp.initRenderer();
        const r = 10;

        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
        matrix.postaviKameru(r * cos(phi), rising ? 1 : 0, r * sin(phi), 0, 0, 0, 0, 1, 0);
        drawGrid();
        drawLetterF();

    }

    unitSlider.oninput = function () {
        persp.zoom = this.value;
        draw();
    }

    rotationSlider.oninput = draw;

    draw();

}