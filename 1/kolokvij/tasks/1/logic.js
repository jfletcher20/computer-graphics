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

        const coneHeight = 3;
        const spokeLength = coneHeight * 0.567;
        drawGrid(3, 0.5);
        drawCone(coneHeight);

        matrix.rotirajZ(rotation);
        drawCollar(coneHeight);
        persp.postaviBoju("green");
        matrix.pomakni(0, 0, coneHeight / 8);
        if (!cor) matrix.rotirajX(-90)
        else matrix.rotirajX(90);
        drawSpoke(coneHeight, spokeLength);
        matrix.rotirajY(120);
        persp.trans(matrix);
        drawSpoke(coneHeight, spokeLength);
        matrix.rotirajY(120);
        persp.trans(matrix);
        drawSpoke(coneHeight, spokeLength);

    }

    function drawCone(coneHeight) {
        matrix.rotirajX(90);
        persp.postaviBoju("red");
        persp.trans(matrix);
        persp.stozac(coneHeight / 2, coneHeight, 15);
    }

    function drawCollar(coneHeight) {
        persp.postaviBoju("blue");
        matrix.pomakni(0, 0, coneHeight - coneHeight / 4);
        persp.trans(matrix);
        persp.valjak2(coneHeight / 2 / 4, coneHeight / 4, 10, 6);
    }

    function drawSpoke(coneHeight, spokeLength) {
        const spokeRadius = coneHeight * 0.04;
        persp.trans(matrix);
        persp.valjak(spokeRadius, spokeLength, 10);
        drawHalfSphere(coneHeight, spokeRadius, spokeLength);
    }

    function drawHalfSphere(coneHeight, spokeRadius, spokeLength) {
        const currentColor = persp.renderer.strokeStyle;
        const r = 0.15 * coneHeight;
        persp.postaviBoju("pink");
        matrix.pomakni(-spokeRadius * 1.1, 0, spokeLength + r / 1.2);
        matrix.rotirajX(90);
        matrix.rotirajZ(-90);
        persp.trans(matrix);
        persp.polukugla(r, 7, 12);
        matrix.rotirajZ(90);
        matrix.rotirajX(-90);
        matrix.pomakni(spokeRadius * 1.1, 0, -spokeLength - r / 1.2);
        persp.trans(matrix);
        persp.postaviBoju(currentColor);
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