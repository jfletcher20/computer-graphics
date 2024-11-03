/*

    Zadaća 3.1. Klasi MT3D matričnih reprezentacija geometrijskih transformacija u 3D (zadatak 3.2) dodajte rotaciju oko proizvoljne osi koja se zadaje dvjema točkama: rotiraj(x1, y1, z1, x2, y2, z2, kut).
    
    Animirajte rotaciju kocke oko osi zadane točkama P1 = (2, -5, 2) i P2 = (-3, 5, -3).
    U početnom položaju, lijevi donji vrh kocke je u ishodištu, a stranice duljine a = 2 su na koordinatnim osima.

*/

const unit = 40;
const xmin = -10, xmax = 10, ymin = -10, ymax = 10;

window.onload = function () {

    const canvas = document.getElementById("renderer");

    const canvasHeightSlider = document.getElementById("canvas-height");
    const canvasWidthSlider = document.getElementById("canvas-width");
    const unitSlider = document.getElementById("unit");

    const rotSlider = document.getElementById("rotation");
    const rotSliderX = document.getElementById("rotation-x");
    const rotSliderY = document.getElementById("rotation-y");
    const rotSliderZ = document.getElementById("rotation-z");

    const animateView = document.getElementById("animate-view");
    const animateCube = document.getElementById("animate-cube");

    const uX = document.getElementById("ux");
    const uY = document.getElementById("uy");
    const uZ = document.getElementById("uz");

    if (!canvas) alert("Greška - nema platna!");

    canvasHeightSlider.oninput = function () {
        canvas.height = this.value;
        canvas.width = canvasWidthSlider.value;
        ortho.initRenderer();
        draw();
    }

    canvasWidthSlider.oninput = function () {
        canvas.width = this.value;
        canvas.height = canvasHeightSlider.value;
        ortho.initRenderer();
        draw();
    }

    var ortho = new Ortho(canvas, xmin, xmax, ymin, ymax);
    ortho.zoom = unitSlider.value;

    function drawCube(baseX = 0, baseY = 0, baseZ = 0) {

        const side = 2;

        ortho.postaviBoju("red");
        ortho.postaviNa(baseX, baseY, baseZ);
        ortho.linijaDo(baseX + side, baseY, baseZ);
        ortho.linijaDo(baseX + side, baseY + side, baseZ);
        ortho.linijaDo(baseX, baseY + side, baseZ);
        ortho.linijaDo(baseX, baseY, baseZ);
        ortho.povuciLiniju();

        ortho.postaviBoju("blue");
        ortho.postaviNa(baseX, baseY, baseZ + side);
        ortho.linijaDo(baseX + side, baseY, baseZ + side);
        ortho.linijaDo(baseX + side, baseY + side, baseZ + side);
        ortho.linijaDo(baseX, baseY + side, baseZ + side);
        ortho.linijaDo(baseX, baseY, baseZ + side);
        ortho.povuciLiniju();

        ortho.postaviBoju("green");
        ortho.postaviNa(baseX, baseY, baseZ);
        ortho.linijaDo(baseX, baseY, baseZ + side);
        ortho.povuciLiniju();

        ortho.postaviNa(baseX + side, baseY, baseZ);
        ortho.linijaDo(baseX + side, baseY, baseZ + side);
        ortho.povuciLiniju();

        ortho.postaviNa(baseX + side, baseY + side, baseZ);
        ortho.linijaDo(baseX + side, baseY + side, baseZ + side);
        ortho.povuciLiniju();

        ortho.postaviNa(baseX, baseY + side, baseZ);
        ortho.linijaDo(baseX, baseY + side, baseZ + side);
        ortho.povuciLiniju();

    }

    const p1 = [2, -5, 2], p2 = [-3, 5, -3];
    uX.value = p2[0] - p1[0];
    uY.value = p2[1] - p1[1];
    uZ.value = p2[2] - p1[2];

    function draw() {

        ortho.initRenderer();

        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);

        ortho.m.identitet();

        const rotX = rotSliderX.value;
        const rotY = animateView.checked ? iView : rotSliderY.value;
        const rotZ = rotSliderZ.value;
        ortho.m.rotirajX(rotX);
        ortho.m.rotirajY(rotY);
        ortho.m.rotirajZ(rotZ);
        
        ortho.postaviBoju("black");
        ortho.postaviNa(p1[0], p1[1], p1[2]);
        ortho.linijaDo(p2[0], p2[1], p2[2]);
        ortho.povuciLiniju();

        var u = [uX.value, uY.value, uZ.value];
        u = [
            u[0] / Math.sqrt(u[0] ** 2 + u[1] ** 2 + u[2] ** 2),
            u[1] / Math.sqrt(u[0] ** 2 + u[1] ** 2 + u[2] ** 2),
            u[2] / Math.sqrt(u[0] ** 2 + u[1] ** 2 + u[2] ** 2)
        ]

        const rotCube = animateCube.checked ? iCube : rotSlider.value;
        ortho.m.rotiraj_oko_osi(p1[0], p1[1], p1[2], u[0], u[1], u[2], rotCube);

        ortho.postaviBoju("red");
        drawCube();

    }

    unitSlider.oninput = function () {
        ortho.zoom = this.value;
        draw();
    }

    rotSlider.oninput = rotSliderX.oninput = rotSliderY.oninput = rotSliderZ.oninput = draw;
    uX.oninput = uY.oninput = uZ.oninput = draw;

    var iView = 0, iCube = 0;
    setInterval(() => {
        if (animateView.checked) {
            iView += 1;
            if (iView > 360) iView = 0;
        }
        if (animateCube.checked) {
            iCube += 1;
            if (iCube > 360) iCube = 0;
        }
        if (animateCube.checked || animateView.checked) draw();
    }, 1000 / 60);

    draw();

}