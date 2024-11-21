const cor = false;
const unit = 40;
const xmin = -3, xmax = 3, ymin = -3, ymax = 3;

window.onload = function () {

    const canvas = document.getElementById("renderer");

    const canvasHeightSlider = document.getElementById("canvas-height");
    const canvasWidthSlider = document.getElementById("canvas-width");
    const unitSlider = document.getElementById("unit");

    const cameraSlider = document.getElementById("camera-rotation");

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
    persp.zoom = 43;

    const matrix = new MT3D();

    function drawGrid(fieldSize = 5, unitSize = 1) {
        for (let i = -fieldSize; i <= fieldSize; i += unitSize) {
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

    function draw(rotation = 0) {

        persp = new Persp(canvas, xmin, xmax, ymin, ymax, 4);
        persp.zoom = unitSlider.value;

        function prepStage() {
            persp.initRenderer();
            matrix.identitet();
            if (cor) matrix.zrcaliNaX();
            matrix.pomakni(0, 2, 0);
            persp.trans(matrix);
        }

        prepStage();
        const r = 6;

        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
        var camPivot = cameraSlider.value;
        if(camPivot == 0) camPivot = 0.0001;
        θ = camPivot;
        matrix.postaviKameru(
            r * cos(φ) * sin(θ), r * cos(θ), r * sin(φ) * sin(θ),
            0, y, 0,
            0, 1, 0
        );

        persp.postaviBoju("purple");

    }

    var φ = 45;
    var θ = 50;
    var y = 1;

    var rot = 0;
    function animationLoop() {
        requestAnimationFrame(animationLoop);
        if (!document.getElementById("wind").checked) return;
        draw(!cor ? rot -= 3 : rot += 3);
    }

    unitSlider.oninput = function () {
        persp.zoom = unitSlider.value;
        draw();
    }

    cameraSlider.oninput = () => draw(rot);

    draw();
    draw();
    animationLoop();

}