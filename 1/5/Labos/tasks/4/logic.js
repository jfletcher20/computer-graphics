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

    function drawGrid(fieldSize = 5, unitSize = 1) {
        for (let i = -fieldSize; i <= fieldSize; i+=unitSize) {
            persp.postaviNa(i, 0, -fieldSize);
            persp.linijaDo(i, 0, fieldSize);
            persp.linijaDraw();
            persp.postaviNa(-fieldSize, 0, i);
            persp.linijaDo(fieldSize, 0, i);
            persp.linijaDraw();
        }
    }

    function cos(φ) {
        return Math.cos(φ * Math.PI / 180);
    }
    function sin(φ) {
        return Math.sin(φ * Math.PI / 180);
    }

    var dist = 0.5;

    function draw() {

        persp = new Persp(canvas, xmin, xmax, ymin, ymax, dist);
        persp.zoom = unitSlider.value;

        persp.initRenderer();
        matrix.identitet();
        persp.trans(matrix);
        const r = 100;

        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
        matrix.postaviKameru(
            r * cos(360 - φ), φ2, r * sin(360 - φ),
            0, 0, 0,
            0, 1, 0
        );
        persp.postaviBoju("purple");

        drawGrid(12, 2);
        persp.postaviBoju("red");
        persp.m.pomakni(0, -6, 0);
        persp.polukugla(6, 32, 17);

    }

    φ = 90, φ2 = 0;
    var rising = true;
    function animationLoop() {
        requestAnimationFrame(animationLoop);
        if (!document.getElementById("animate").checked) return;
        φ += 1;
        if (φ >= 360) φ = 0;
        φ2 += rising ? 1 : -1;
        if (φ2 <= 0 || Math.abs(φ2) >= 85) rising = !rising;
        draw();
    }


    unitSlider.oninput = function () {
        persp.zoom = this.value;
        draw();
    }

    draw();
    draw();
    animationLoop();

}