const unit = 40;
const xmin = -3, xmax = 3, ymin = -3, ymax = 3;

window.onload = function () {

    const canvas = document.getElementById("renderer");

    const canvasHeightSlider = document.getElementById("canvas-height");
    const canvasWidthSlider = document.getElementById("canvas-width");
    const unitSlider = document.getElementById("unit");

    const camRotSlider = document.getElementById("camera-rotation");
    const camPivSlider = document.getElementById("camera-pivot");

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
            persp.trans(matrix);
        }

        prepStage();
        const r = 6;

        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
        var camRot = camRotSlider.value, camPiv = camPivSlider.value;
        if (camRot == 0) camRot = 0.0001;
        if (camPiv == 0) camPiv = 0.0001;
        θ = camRot;
        φ = camPiv;

        const baseHeight = 1, baseDivs = 24, baseRad = 3, standDivs = 10;
        const holsterHeight = baseHeight * 2.25;

        matrix.postaviKameru(
            r * cos(φ) * sin(θ), r * cos(θ), r * sin(φ) * sin(θ),
            0, y, 0,
            0, 1, 0
        );

        // making a 3d lamp
        matrix.pomakni(-4, 8, 0);

        /* base of lamp */
        matrix.rotirajX(90);
        persp.trans(matrix);
        persp.postaviBoju("red");
        persp.valjak3(baseRad, baseHeight, baseDivs, baseRad / 1.85);
        matrix.rotirajX(-90);
        matrix.pomakni(0, -baseHeight, 0);
        matrix.rotirajX(90);
        persp.trans(matrix);
        persp.postaviBoju("blue");
        persp.valjak3(baseRad / 1.85, baseHeight / 2, baseDivs, baseRad / 1.85 / 5);
        matrix.rotirajX(-90);
        matrix.pomakni(0, -baseHeight / 2, 0);
        matrix.rotirajX(90);
        persp.trans(matrix);
        /* base of lamp */

        /* stand of lamp */
        persp.postaviBoju("#065535");
        persp.valjak(baseRad / 1.85 / 5, baseHeight * 5, standDivs)
        matrix.pomakni(0, 0, baseHeight * 5);

        /* holster of lamp */
        persp.postaviBoju("magenta");
        matrix.rotirajX(90);
        matrix.pomakni(0, baseRad / 4.05, -(holsterHeight / 2) * 1.3);
        persp.trans(matrix);

        persp.valjak2(baseRad / 4, holsterHeight, baseDivs, 6);

        matrix.pomakni(0, -baseRad / 4.05, (holsterHeight / 2) * 1.3);
        matrix.rotirajX(-90);

        /* stand of lamp top */
        persp.postaviBoju("#065535");
        matrix.pomakni(0, 0, baseRad / 2.025);
        persp.trans(matrix);

        persp.valjak(baseRad / 1.85 / 5, baseHeight * 1, standDivs);
        matrix.pomakni(0, 0, -baseRad / 2.025);
        matrix.rotirajY(-15);
        matrix.rotirajY(90);

        /* lamp holster pole */
        matrix.pomakni(-baseRad / 4, holsterHeight * 0.5, baseRad / 3.5);
        persp.trans(matrix);
        persp.valjak(baseRad / 1.85 / 5, baseHeight * 4, standDivs);

        const holderHeight = baseHeight * 2;
        const holderRad = baseRad / 4;

        /* lamp holder */
        matrix.pomakni(-baseRad / 1.85 / 5, 0, baseHeight * 4 + holderRad);
        matrix.rotirajY(90);
        persp.trans(matrix);
        persp.postaviBoju("blue");
        persp.valjak2(holderRad, holderHeight, baseDivs / 2, 4);

        /* lamp shade */
        matrix.rotirajX(180);
        matrix.pomakni(0, 0, -holderHeight * 0.9 - holderRad * 2);
        persp.trans(matrix);
        persp.postaviBoju("black");
        persp.polukugla2(holderRad * 2, baseDivs, 13);
        /* bulb */
        matrix.pomakni(0, 0, holderRad * 0.1);
        matrix.skaliraj(0.75, 1, 1);
        persp.trans(matrix);
        persp.postaviBoju("red");
        persp.kugla(holderRad * 1.75, baseDivs, standDivs);
    }

    var φ = 45;
    var θ = 50;
    var y = 1;

    var rot = 0;
    function animationLoop() {
        requestAnimationFrame(animationLoop);
        if (!document.getElementById("wind").checked) return;
        draw(rot -= 3);
    }

    unitSlider.oninput = function () {
        persp.zoom = unitSlider.value;
        draw();
    }

    camRotSlider.oninput = () => draw(rot);

    draw();
    draw();
    animationLoop();

}