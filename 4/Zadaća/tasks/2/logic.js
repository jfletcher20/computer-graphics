const xmin = -10, xmax = 10, ymin = -10, ymax = 10;

window.onload = function() {

    const canvas = document.getElementById("renderer");

    const canvasHeightSlider = document.getElementById("canvas-height");
    const canvasWidthSlider = document.getElementById("canvas-width");
    const unitSlider = document.getElementById("unit");

    const rotationSlider = document.getElementById("rotation");

    const animateCheckbox = document.getElementById("animate");

    if (!canvas) alert("Greška - nema platna!");

    canvasHeightSlider.oninput = function() {
        canvas.height = this.value;
        canvas.width = canvasWidthSlider.value;
        ortho.initRenderer();
        draw();
    }

    canvasWidthSlider.oninput =  function() {
        canvas.width = this.value;
        canvas.height = canvasHeightSlider.value;
        ortho.initRenderer();
        draw();
    }

    var ortho = new Ortho(canvas, xmin, xmax, ymin, ymax);
    ortho.zoom = unitSlider.value;

    function astroid(r = 4, progress = 1) {
        var temp = ortho.renderer.strokeStyle;
        ortho.m.rotirajZ(-90);
        ortho.postaviBoju("red");
        var x = r * Math.pow(Math.cos(t), 3);
        var y = r * Math.pow(Math.sin(t), 3);
        ortho.postaviNa(y, x, 0);
        for (var t = 0; t <= 2 * Math.PI * (1-progress); t += 0.01) {
            x = r * Math.pow(Math.cos(t), 3);
            y = r * Math.pow(Math.sin(t), 3);
            ortho.linijaDo(y, x, 0);
        }
        ortho.povuciLiniju();
        t += Math.PI / 2;
        const x2 = 3 * Math.cos(t);
        const y2 = 3 * Math.sin(t);
        ortho.postaviBoju(temp);
        circle(1, -progress * 3 * 360, y2, x2, true);
        temp = ortho.renderer.strokeStyle;
        ortho.postaviBoju("blue");
        circle(4, 0, 0, 0, false)
        ortho.postaviBoju(temp);
    }

    function circle(r = 1, angle = 0, x = 0, y = 0, extraStuff = true) {
        const m = new MT3D();
        m.pomakni(x, y, 0);
        m.rotirajZ(angle);
        ortho.trans(m);
        for (var t = 0; t <= 2 * Math.PI; t += 0.01) {
            const x = r * Math.cos(t);
            const y = r * Math.sin(t);
            var xNext = r * Math.cos(t + 0.01);
            var yNext = r * Math.sin(t + 0.01);
            ortho.postaviNa(x, y, 0);
            ortho.linijaDo(xNext, yNext, 0);
            ortho.povuciLiniju();
        }
        if (!extraStuff) return;
        // circle at the end of the line
        var temp = ortho.renderer.strokeStyle;
        ortho.postaviBoju("red");
        for (var t = 0; t <= 2 * Math.PI; t += 0.01) {
            const x = r + 0.04 * Math.cos(t);
            const y = 0 + 0.04 * Math.sin(t);
            var xNext = r + 0.04 * Math.cos(t + 0.01);
            var yNext = 0 + 0.04 * Math.sin(t + 0.01);
            ortho.postaviNa(x, y, 0);
            ortho.linijaDo(xNext, yNext, 0);
            ortho.povuciLiniju();
        }
        ortho.postaviBoju(temp);
        ortho.postaviNa(r * Math.cos(0), r * Math.sin(0), 0);
        ortho.linijaDo(0, 0, 0);
        ortho.povuciLiniju();
        for (var t = 0; t <= 2 * Math.PI; t += 0.01) {
            const x = 0.05 * Math.cos(t);
            const y = 0.05 * Math.sin(t);
            var xNext = 0.05 * Math.cos(t + 0.01);
            var yNext = 0.05 * Math.sin(t + 0.01);
            ortho.postaviNa(x, y, 0);
            ortho.linijaDo(xNext, yNext, 0);
            ortho.povuciLiniju();
        }
    }

    var iProgress = 0;
    
    function draw() {
        
        ortho.initRenderer();

        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
        
        const rot = animateCheckbox.checked ? iProgress : rotationSlider.value;
        astroid(4, 1 - rot / 360);

    }

    unitSlider.oninput = function() {
        ortho.zoom = this.value;
        draw();
    }

    rotationSlider.oninput = draw;

    setInterval(() => {
        if (animateCheckbox.checked) iProgress++;
        if (iProgress > 360) iProgress = 0;
        draw();
    }, 1000 / 60);

    draw();

}