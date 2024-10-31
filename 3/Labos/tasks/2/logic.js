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
    gks.zoom = unitSlider.value;

    function cos(x) { return Math.cos(x); }
    function sin(x) { return Math.sin(x); }
    const iteratorBump = 0.02;

    function drawButterfly() {

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
            var xNext = _x(t + iteratorBump);
            var yNext = _y(t + iteratorBump);
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

    const lineLength = 2.7;
    const yDisplacement = -4.5;

    function middleFlower(mirror = false) {

        var matrix = new MT2D();
        gks.initRenderer();

        if (mirror) matrix.zrcaliNaX();
        matrix.rotiraj(180);
        gks.trans(matrix);
        gks.displace(0, yDisplacement + flowerSize * lineLength);
        gks.postaviNa(0, 0);
        gks.linijaDo(0, flowerSize * lineLength);
        gks.povuciLiniju();
        
        matrix = new MT2D();
        if (mirror) matrix.zrcaliNaY();
        matrix.pomakni(0, flowerSize * lineLength);
        matrix.rotiraj(45 / 2);
        gks.trans(matrix);
        drawFlower();

    }

    function flower(mirror = false) {
        
        var matrix = new MT2D();
        gks.initRenderer();

        // nacrtaj liniju
        if (mirror) matrix.zrcaliNaY();
        // line is drawn at 60 degrees
        matrix.rotiraj(60);
        gks.trans(matrix);
        // move the coordinate system's center
        gks.displace(0, yDisplacement + flowerSize * lineLength);
        gks.postaviNa(0, 0);
        gks.linijaDo(0, flowerSize * lineLength);
        gks.povuciLiniju();
        
        matrix = new MT2D();
        if (mirror) matrix.zrcaliNaY();

        // move the coordinate system's center
        matrix.rotiraj(120);
        matrix.pomakni(0, flowerSize * lineLength);
        gks.trans(matrix);
        // flower needs to be rotated with regards to the line
        matrix.rotiraj(-45 / 2);
        // adjust size because matrix has scaled the flower size
        matrix.skaliraj(0.75, 0.75);
        gks.trans(matrix);
        // gks.nacrtajKoordinatnuMrezu();
        drawFlower();

    }

    function elongatedButterfly(mirror = false) {
        gks.initRenderer();
        var m = new MT2D();
        if (mirror) m.zrcaliNaY();
        gks.displace(0, yDisplacement-0.5);
        m.rotiraj(225);
        m.pomakni(4, 4);
        let ratio = 0.875;
        m.skaliraj(0.5 * ratio, 1.2 * ratio);
        gks.trans(m);
        gks.displace(0, -9.2);
        drawButterfly();
    }

    function squishedButterfly(mirror = false) {
        gks.initRenderer();
        var m = new MT2D();
        if (mirror) m.zrcaliNaY();
        m.rotiraj(-30);
        m.pomakni(2.25, -12);
        let ratio = 0.6;
        m.skaliraj(1.3 * ratio, 0.8 * ratio);
        gks.trans(m);
        gks.displace(0, -9.6);
        drawButterfly();
    }
    
    function draw() {

        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
                
        gks.koristiBoju("blue");
        middleFlower();
        flower();
        flower(true);
        
        gks.koristiBoju("black");
        elongatedButterfly();
        elongatedButterfly(true);

        gks.koristiBoju("red");
        squishedButterfly();
        squishedButterfly(true);

    }

    unitSlider.oninput = function() {
        gks.zoom = this.value;
        draw();
    }

    draw();

}