const unit = 40;
const xmin = -10, xmax = 10, ymin = -10, ymax = 10;

window.onload = function () {

    const canvas = document.getElementById("renderer");

    const canvasHeightSlider = document.getElementById("canvas-height");
    const canvasWidthSlider = document.getElementById("canvas-width");
    const unitSlider = document.getElementById("unit");

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

    var persp = new Persp(canvas, xmin, xmax, ymin, ymax, 1);
    persp.zoom = unitSlider.value;

    const matrix = new MT3D();

    function drawCube(a = 1) {
        persp.postaviNa(0, 0, 0);
        persp.linijaDo(a, 0, 0);
        persp.linijaDo(a, a, 0);
        persp.linijaDo(0, a, 0);
        persp.linijaDo(0, 0, 0);
        persp.linijaDo(0, 0, a);
        persp.linijaDo(a, 0, a);
        persp.linijaDo(a, a, a);
        persp.linijaDo(0, a, a);
        persp.linijaDo(0, 0, a);
        persp.linijaDraw();

        persp.postaviNa(a, 0, 0);
        persp.linijaDo(a, 0, a);
        persp.linijaDraw();

        persp.postaviNa(a, a, 0);
        persp.linijaDo(a, a, a);
        persp.linijaDraw();

        persp.postaviNa(0, a, 0);
        persp.linijaDo(0, a, a);
        persp.linijaDraw();
    }

    function drawGrid() {
        for (let i = -5; i <= 5; i += 0.5) {
            persp.postaviNa(i, 0, -5);
            persp.linijaDo(i, 0, 5);
            persp.linijaDraw();
            persp.postaviNa(-5, 0, i);
            persp.linijaDo(5, 0, i);
            persp.linijaDraw();
        }
    }
    const phi = 45;

    function cos(φ) {
        return Math.cos(φ * Math.PI / 180);
    }
    function sin(φ) {
        return Math.sin(φ * Math.PI / 180);
    }

    var dist = 1;

    function draw() {

        persp = new Persp(canvas, xmin, xmax, ymin, ymax, dist);
        persp.zoom = unitSlider.value;

        persp.initRenderer();
        matrix.identitet();
        matrix.pomakni(0, 2, 0);
        persp.trans(matrix);
        const r = 150;

        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
        matrix.postaviKameru(
            r * cos(360 - φ), φ2, r * sin(360 - φ),
            0, 0, 0,
            0, 1, 0
        );
        persp.postaviBoju("purple");
        drawGrid();
        persp.postaviBoju("red");
        persp.valjak(2, 5, 6);

    }

    φ = 0, φ2 = 69;
    var rising = true;
    function animationLoop() {
        requestAnimationFrame(animationLoop);
        φ += 1;
        if (φ >= 360) φ = 0;
        φ2 += rising ? 1 : -1;
        if (φ2 <= 10 || Math.abs(φ2) >= 70) rising = !rising;
        draw();
    }


    unitSlider.oninput = function () {
        persp.zoom = this.value;
        draw();
    }

    animationLoop();

}