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

    
    const xSlider = document.getElementById("x-coord");
    const ySlider = document.getElementById("y-coord");
    const rotationSlider = document.getElementById("rotation");

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
    const iteratorBump = 0.04;

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

    function calculateDistance(a) {
        // 120 degrees in radians
        const angle = (120 * Math.PI) / 180;
      
        // Calculate the distance between two points separated by 120 degrees
        const distance = Math.sqrt(2 * Math.pow(a, 2) * (1 - Math.cos(angle)));
        
        return distance;
    }
      
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
        // drawFlower();

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

        function nacrtajLeptireCrvene(gks) {
            gks.koristiBoju("red");
          
            let distX = 13;
            let distY = 5;
          
            let transformacija = new MT2D();
          
            transformacija.rotiraj_oko_tocke(-distX, distY, -30);
            transformacija.pomakni(-distX, distY);
            transformacija.skaliraj(0.6, 0.5);
            gks.trans(transformacija);
            nacrtajLeptir(gks, 0, 12 * Math.PI);
          
            transformacija.identitet();
            gks.trans(transformacija);
          
            transformacija.zrcaliNaY();
            transformacija.rotiraj_oko_tocke(-distX, distY, -30);
            transformacija.pomakni(-distX, distY);
            transformacija.skaliraj(0.6, 0.5);
            gks.trans(transformacija);
            nacrtajLeptir(gks, 0, 12 * Math.PI);
          
            transformacija.identitet();
            gks.trans(transformacija);
          }
          
          function nacrtajLeptireCrne(gks) {
            gks.koristiBoju("black");
          
            let distX = 8;
            let distY = -10;
          
            let transformacija = new MT2D();
          
            transformacija.pomakni(-distX, distY);
            transformacija.rotiraj(130);
            transformacija.skaliraj(0.5, 1.3);
            gks.trans(transformacija);
            nacrtajLeptir(gks, 0, 12 * Math.PI);
          
            transformacija.identitet();
            gks.trans(transformacija);
          
            transformacija.zrcaliNaY();
            transformacija.pomakni(-distX, distY);
            transformacija.rotiraj(130);
            transformacija.skaliraj(0.5, 1.3);
            gks.trans(transformacija);
            nacrtajLeptir(gks, 0, 12 * Math.PI);
          
            transformacija.identitet();
            gks.trans(transformacija);
          }
          
          function nacrtajCvjetove(gks) {
            gks.koristiBoju("blue");
            let transformacija = new MT2D();
          
            let dist = 10;
          
            transformacija.pomakni(0, -dist);
            transformacija.skaliraj(0.3, 0.3);
            transformacija.rotiraj(22);
            gks.trans(transformacija);
            nacrtajCvijet(gks, 0, 12 * Math.PI, 9);
          
            transformacija.identitet();
            gks.trans(transformacija);
          
            transformacija.pomakni(-dist, dist);
            transformacija.skaliraj(0.3, 0.3);
            transformacija.rotiraj(22);
            gks.trans(transformacija);
            nacrtajCvijet(gks, 0, 12 * Math.PI, 9);
          
            transformacija.identitet();
            gks.trans(transformacija);
          
            transformacija.pomakni(dist, dist);
            transformacija.skaliraj(0.3, 0.3);
            transformacija.rotiraj(22);
            gks.trans(transformacija);
            nacrtajCvijet(gks, 0, 12 * Math.PI, 9);
          
            transformacija.identitet();
            gks.trans(transformacija);
          }
          
          function poveziCvjetove(gks) {
            gks.koristiBoju("blue");
          
            gks.postaviNa(-10, 10);
            gks.linijaDo(0, 0);
            gks.povuciLiniju();
          
            gks.postaviNa(10, 10);
            gks.linijaDo(0, 0);
            gks.povuciLiniju();
          
            gks.postaviNa(0, -10);
            gks.linijaDo(0, 0);
            gks.povuciLiniju();
          }

          function nacrtajLeptir(gks, tMin, tMax) {
            gks.postaviNa(
              (Math.pow(Math.E, Math.cos(tMin)) -
                2 * Math.cos(4 * tMin) +
                Math.pow(Math.sin(tMin / 12), 5)) *
                Math.sin(tMin),
              (Math.pow(Math.E, Math.cos(tMin)) -
                2 * Math.cos(4 * tMin) +
                Math.pow(Math.sin(tMin / 12), 5)) *
                Math.cos(tMin)
            );
          
            for (let t = tMin; t <= tMax; t += 0.01) {
              let x =
                (Math.pow(Math.E, Math.cos(t)) -
                  2 * Math.cos(4 * t) +
                  Math.pow(Math.sin(t / 12), 5)) *
                Math.sin(t);
              let y =
                (Math.pow(Math.E, Math.cos(t)) -
                  2 * Math.cos(4 * t) +
                  Math.pow(Math.sin(t / 12), 5)) *
                Math.cos(t);
          
              gks.linijaDo(x, y);
            }
            gks.povuciLiniju();
          }
          
          function nacrtajCvijet(gks, tMin, tMax, aParam) {
            gks.postaviNa(tMin, aParam * Math.cos(4 * tMin) * Math.sin(tMin));
          
            for (let a = aParam; a > 0; a--) {
              for (let t = tMin; t <= tMax; t += 0.01) {
                let x = a * Math.cos(4 * t) * Math.cos(t);
                let y = a * Math.cos(4 * t) * Math.sin(t);
                gks.linijaDo(x, y);
              }
            }
            gks.povuciLiniju();
          }

          var gks = new GKS2(canvas, xmin, xmax, ymin, ymax);
          gks.zoom = unitSlider.value;
          
          nacrtajLeptireCrvene(gks);
            nacrtajLeptireCrne(gks);
            nacrtajCvjetove(gks);
            poveziCvjetove(gks);
    }

    unitSlider.oninput = function() {
        gks.zoom = this.value;
        draw();
    }

    xSlider.oninput = ySlider.oninput = rotationSlider.oninput = draw;

    draw();

}