/*

    Kombiniranjem odgovarajućih geometrijskih transformacija nacrtajte sljedeće elipse:

        Poluosi a = 6, b = 3, velika os elipse je pod kutem od -30° prema osi x, a središte je u točki (4, 0) (nacrtajte crvenom bojom);
        Isto kao i gore, ali promijenite poredak transformacija: prvo pomaknite, pa rotirajte (nacrtajte plavom bojom);
        Poluosi a = 4, b = 1, elipsa je najprije zarotirana za 75°, potom pomaknuta za 3 u desno, te zrcaljena na osi y (zelena boja)

*/


const unit = 30;
const xmin = -20, xmax = 20, ymin = -20, ymax = 20;

window.onload = function() {

    const canvas = document.getElementById("renderer");
    const canvasHeightSlider = document.getElementById("canvas-height");
    const canvasWidthSlider = document.getElementById("canvas-width");

    const unitSlider = document.getElementById("unit");
    const rotation3dCheckbox = document.getElementById("3d");

    if (!canvas) alert("Greška - nema platna!");

    canvasHeightSlider.oninput = function() {
        canvas.height = this.value;
        canvas.width = canvasWidthSlider.value;
        gks.initRenderer();
        gksCoordsDrawer.initRenderer();
        draw();
    }

    canvasWidthSlider.oninput = function() {
        canvas.width = this.value;
        canvas.height = canvasHeightSlider.value;
        gks.initRenderer();
        gksCoordsDrawer.initRenderer();
        draw();
    }

    var gks = new GKS2(canvas, xmin, xmax, ymin, ymax), gksCoordsDrawer = new GKS2(canvas, xmin, xmax, ymin, ymax);
    gks.unit = unitSlider.value;
    gksCoordsDrawer.unit = unitSlider.value;

    function drawEllipsis(a, b, color, color2) {

        gks.koristiBoju(color);

        for (var t = 0; t <= 2 * Math.PI; t += 0.01) {
            if(color2 != undefined && t >= Math.PI) gks.koristiBoju(color2);
            const x = a * Math.cos(t);
            const y = b * Math.sin(t);
            gks.postaviNa(x, y);
            var xNext = a * Math.cos(t + 0.01 <= 2 * Math.PI ? t + 0.01 : 2 * Math.PI);
            var yNext = b * Math.sin(t + 0.01 <= 2 * Math.PI ? t + 0.01 : 2 * Math.PI);
            gks.linijaDo(xNext, yNext);
            gks.povuciLiniju();
        }

    }


    function draw() {
        
        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
        gksCoordsDrawer.nacrtajKoordinatniSustav(false, false, true, 10000, 10000);

        gks.initRenderer();
        gks.unit = unitSlider.value;

        var m = new MT2D();
        m.rotiraj(-30, rotation3dCheckbox.checked);
        m.pomakni(4, 0);
        gks.trans(m);

        drawEllipsis(6, 3, "red");

        gks.initRenderer();
        gks.unit = unitSlider.value;
        m = new MT2D();

        m.pomakni(4, 0);
        m.rotiraj(-30, rotation3dCheckbox.checked);
        gks.trans(m);

        drawEllipsis(6, 3, "blue");

        gks.initRenderer();
        gks.unit = unitSlider.value;
        m = new MT2D();

        m.rotiraj(75, rotation3dCheckbox.checked);
        m.pomakni(3, 0);
        m.zrcaliNaY();
        gks.trans(m);

        drawEllipsis(4, 1, "green", "lime");
    
    }

    unitSlider.oninput = function() {
        gks.unit = this.value;
        gksCoordsDrawer.unit = this.value;
        draw();
    }

    rotation3dCheckbox.oninput = draw;
    draw();

}