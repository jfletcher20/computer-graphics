/*

    Definirajte koordinatni sustav s donjim lijevim uglom (­-10, -­5) i gornjim desnim uglom (10, 5), te uz pomoć metode trans(m) nad GKS2 i odgovarajućih matrica transformacije (klasa MT2D) nacrtajte sljedeće elipse:

        1. Poluosi od html-a, a središte elipse je u točki (4, ­2);
        2. Poluosi od html-a, velika os elipse je pod kutem od 30° prema osi x, a središte je u ishodištu.

*/


const unit = 30;
const xmin = -20, xmax = 20, ymin = -20, ymax = 20;

window.onload = function() {

    const canvas = document.getElementById("renderer");
    const canvasHeightSlider = document.getElementById("canvas-height");
    const canvasWidthSlider = document.getElementById("canvas-width");

    const unitSlider = document.getElementById("unit");
    
    const aFocusSlider = document.getElementById("focus-a");
    const bFocusSlider = document.getElementById("focus-b");
    const degreesSlider = document.getElementById("degrees");

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

    function drawEllipsis1(a = aFocusSlider.value, b = bFocusSlider.value, angle = degreesSlider.value) {

        gks = new GKS2(canvas, xmin, xmax, ymin, ymax);
        gks.unit = unitSlider.value;

        gks.koristiBoju("red");

        const m = new MT2D();
        m.rotiraj(angle, rotation3dCheckbox.checked);

        gks.trans(m);

        for (var t = 0; t <= 2 * Math.PI; t += 0.01) {
            const x = a * Math.cos(t);
            const y = b * Math.sin(t);
            if(t < Math.PI) gks.koristiBoju("red");
            else gks.koristiBoju("purple");
            gks.postaviNa(x, y);
            // gks.linijaDo(x + x > 0 ? 0.1 : -0.1, y + y > 0 ? 0.1 : -0.1);
            var xNext = a * Math.cos(t + 0.01 <= 2 * Math.PI ? t + 0.01 : 2 * Math.PI);
            var yNext = b * Math.sin(t + 0.01 <= 2 * Math.PI ? t + 0.01 : 2 * Math.PI);
            gks.linijaDo(xNext, yNext);
            gks.povuciLiniju();
        }

    }

    function drawEllipsis2() {

        gks.initRenderer();
        gks.koristiBoju("blue");
        const a = aFocusSlider.value, b = bFocusSlider.value;
        const m = new MT2D();
        m.identitet();
        m.pomakni(4, -2);
        gks.trans(m);

        for (var t = 0; t <= 2 * Math.PI; t += 0.01) {
            var x = a * Math.cos(t);
            var y = b * Math.sin(t);
            var xNext = a * Math.cos(t + 0.01 <= 2 * Math.PI ? t + 0.01 : 2 * Math.PI);
            var yNext = b * Math.sin(t + 0.01 <= 2 * Math.PI ? t + 0.01 : 2 * Math.PI);
            gks.postaviNa(x, y);
            gks.linijaDo(xNext, yNext);
            gks.povuciLiniju();
        }
    
    }


    function draw() {
        
        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
        gksCoordsDrawer.nacrtajKoordinatniSustav(false, false, true, 10000, 10000);

        drawEllipsis1();
        drawEllipsis2();
    
    }

    unitSlider.oninput = function() {
        gks.unit = this.value;
        gksCoordsDrawer.unit = this.value;
        draw();
    }

    aFocusSlider.oninput = bFocusSlider.oninput = degreesSlider.oninput = rotation3dCheckbox.oninput = draw;
    draw();

}