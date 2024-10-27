/*

    Zadatak 2
    Koristeći klase GKS i MT2D nacrtajte leptire i cvjetove kako je prikazano na slici.

        Za leptire i cvjetove koristite formule iz prve zadaće.
        Primijenite odgovarajuće transformacije na leptire i cvjetove da ih dovedete u odgovarajući položaj i dobijete odgovarajući oblik (uočite da postoje veći i manji leptiri).


*/

const xmin = -7, xmax = 10, ymin = -2, ymax = 10;

window.onload = function() {

    const canvas = document.getElementById("renderer");

    const canvasHeightSlider = document.getElementById("canvas-height");
    const canvasWidthSlider = document.getElementById("canvas-width");
    const unitSlider = document.getElementById("unit");

    if (!canvas) alert("Greška - nema platna!");

    canvasHeightSlider.oninput = function() {
        canvas.height = this.value;
        canvas.width = canvasWidthSlider.value;
        gks.initRenderer();
        draw();
    }

    canvasWidthSlider.oninput =  function() {
        canvas.width = this.value;
        canvas.height = canvasHeightSlider.value;
        gks.initRenderer();
        draw();
    }

    var gks = new GKS2(canvas, xmin, xmax, ymin, ymax);
    gks.unit = unitSlider.value;

    function pravac(x) { return 3 * x + 6; }

    function calculateSlopeFromPravac() {
        const x1 = 0;
        const y1 = pravac(x1);
      
        const x2 = 1;
        const y2 = pravac(x2);
      
        const slope = (y2 - y1) / (x2 - x1);
        return slope;
    }

    function perpendicularSlope(slope) {
        return -1 / slope;
    }

    function findIntersection(slope1, intercept1, slope2, intercept2) {
        const x = (intercept2 - intercept1) / (slope1 - slope2);
        const y = slope1 * x + intercept1;
        return { x: x, y: y };
    }

    function calculateIntersectionWithPerpendicular() {
        const slope1 = calculateSlopeFromPravac();
        const intercept1 = pravac(0);
        
        const slope2 = perpendicularSlope(slope1);
        const intercept2 = 0;
        
        return findIntersection(slope1, intercept1, slope2, intercept2);
    }

    function cos(x) { return Math.cos(x); }
    function sin(x) { return Math.sin(x); }
    const iteratorBump = 0.02;

    function drawButterfly(color = "black") {

        gks.koristiBoju(color);

        const e = Math.E;
        function _x(t) {
            return ((e ** cos(t)) - 2 * cos(4 * t) + (sin(t / 12) ** 5)) * sin(t);
        }
    
        function _y(t) {
            return ((e ** cos(t)) - 2 * cos(4 * t) + (sin(t / 12) ** 5)) * cos(t);
        }
    
        for (var t = 0; t <= 12 * Math.PI; t += iteratorBump) {
            const x = _x(t);
            const y = _y(t);
            var xNext = x + (x < 12 * Math.PI ? _x(t + iteratorBump) : -_x(t + iteratorBump));
            var yNext = y + (x < 12 * Math.PI ? _x(t + iteratorBump) : -_x(t + iteratorBump));
            gks.postaviNa(x, y);
            gks.linijaDo(xNext, yNext);
            gks.povuciLiniju();
        }

    }

    const flowerSize = 2.5;

    function drawFlower(color = "blue", baseX = 0, baseY = 0) {

        gks.koristiBoju(color);

        function _x(a, φ) { return _r(a, φ) * cos(φ); }
        function _y(a, φ) { return _r(a, φ) * sin(φ); }
        function _r(a, φ) { return a * cos(4 * φ); }

        function drawCurve(a = 1) {
            for (var t = 0; t <= 2 * Math.PI; t += iteratorBump) {
                const x = _x(a, t) + baseX;
                const y = _y(a, t) + baseY;
                var xNext = _x(a, t + iteratorBump) + baseX;
                var yNext = _y(a, t + iteratorBump) + baseY;
                gks.postaviNa(x, y);
                gks.linijaDo(xNext, yNext);
                gks.povuciLiniju();
            }
        }

        for (var i = flowerSize; i > 0; i -= 0.25) drawCurve(i);
    }

    function sequence(butterflyColor, flowerColor) {
        drawButterfly(butterflyColor);
        drawFlower(flowerColor);
    }

    const lineLength = 2.7;
    const yDisplacement = -3.75;

    function middleFlower() {
        gks.initRenderer();
        gks.displace(0, yDisplacement);

        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
        var matrix = new MT2D();
        matrix.rotiraj(45 / 2);
        gks.trans(matrix);
        drawFlower();
        gks.koristiBoju("blue");
        matrix = new MT2D();
        gks.trans(matrix);
        gks.postaviNa(0, 0);
        gks.linijaDo(0, flowerSize * lineLength);
        gks.povuciLiniju();
    }

    function flower(matrix = new MT2D(), mirror = false) {
        gks.initRenderer();

        if (mirror) matrix.zrcaliNaY();
        matrix.rotiraj(-60);
        gks.trans(matrix);
        gks.koristiBoju("orange");
        gks.displace(0, yDisplacement + flowerSize * lineLength);
        gks.postaviNa(0, 0);
        gks.linijaDo(0, flowerSize * lineLength);
        gks.povuciLiniju();
        
        matrix = new MT2D();
        if (mirror) matrix.zrcaliNaY();
        matrix.pomakni(0, -yDisplacement-flowerSize * lineLength);
        matrix.rotiraj(240);
        matrix.pomakni(0, flowerSize * lineLength);
        gks.initRenderer();
        gks.trans(matrix);
        matrix.identitet();
        matrix.rotiraj(20);
        gks.trans(matrix);
        drawFlower("orange");
    }
    
    function draw() {
        
        middleFlower();

        flower();
        flower(new MT2D(), true);

    }

    unitSlider.oninput = function() {
        gks.unit = this.value;
        draw();
    }

    draw();

}