const cor = true;
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

    var dist = (cor ? -1 : 1) * 0.5;

    function draw(rotation = 0) {

        persp = new Persp(canvas, xmin, xmax, ymin, ymax, dist);
        persp.zoom = unitSlider.value;

        function prepStage() {
            persp.initRenderer();
            matrix.identitet();
            if (cor) matrix.zrcaliNaX();
            matrix.pomakni(0, 4, 0);
            persp.trans(matrix);
        }

        prepStage();
        const r = 100;

        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
        matrix.postaviKameru(
            r * cos(360 - φ), φ2, r * sin(360 - φ),
            0, 0, 0,
            0, 1, 0
        );
        persp.postaviBoju("purple");

        const coneHeight = 13;
        const spokeLength = 6;
        drawGrid(12, 2);
        drawCone(coneHeight);

        matrix.rotirajZ(rotation);
        drawCollar(coneHeight);
        persp.postaviBoju("green");
        matrix.pomakni(0, 0, coneHeight / 8);
        if (cor) matrix.rotirajX(-90)
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
        persp.stozac(6, coneHeight, 15)
    }

    function drawCollar(coneHeight) {
        persp.postaviBoju("blue");
        matrix.pomakni(0, 0, coneHeight - coneHeight / 4);
        persp.trans(matrix);
        persp.valjak(1.5, coneHeight / 4, 10);
    }

    function drawSpoke(coneHeight, spokeLength) {
        const spokeRadius = coneHeight / 4 / 5;
        persp.trans(matrix);
        persp.valjak(spokeRadius, spokeLength, 10);
        drawHalfSphere(coneHeight, spokeRadius, spokeLength);
    }

    function drawHalfSphere(coneHeight, spokeRadius, spokeLength) {
        const currentColor = persp.renderer.strokeStyle;
        const r = coneHeight / 6;
        persp.postaviBoju("pink");
        matrix.pomakni(-spokeRadius * 1.1, 0, spokeLength + r / 1.2);
        matrix.rotirajX(90);
        matrix.rotirajZ(-90);
        persp.trans(matrix);
        persp.polukugla(r, 8, 12);
        matrix.rotirajZ(90);
        matrix.rotirajX(-90);
        matrix.pomakni(spokeRadius * 1.1, 0, -spokeLength - r / 1.2);
        persp.trans(matrix);
        persp.postaviBoju(currentColor);
    }

    φ = 45 + (cor ? 0 : 90 * 2), φ2 = 30;
    var rot = 0;
    function animationLoop() {
        requestAnimationFrame(animationLoop);
        if (!document.getElementById("wind").checked) return;
        draw(rot--);
    }


    unitSlider.oninput = function () {
        persp.zoom = this.value;
        draw();
    }

    draw();
    draw();
    animationLoop();

}