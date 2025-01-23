window.onload = WebGLaplikacija;

const shapes = {
    CUBE: "cube", // no worky
    CUBOID: "cuboid", // no worky
    SPHERE: "sphere", // no worky
    CYLINDER: "cylinder",
    HOLLOW_CYLINDER: "hollow_cylinder",
    CONE: "cone",
    HEMISPHERE: "hemisphere", // no worky
    SOLID_HEMISPHERE: "solid_hemisphere", // no worky
    TORUS: "torus", // no worky
    PYRAMID: "pyramid",
    GRID: "grid",
    CAPSULE: "capsule",
    AMBIGUOUS: "ambiguous",
    NGON: "ngon",
};

function WebGLaplikacija() {
    var platno1 = document.getElementById("slika1");
    gl = platno1.getContext("webgl2");
    if (!gl) {
        alert("WebGL2 nije dostupan!");
        return;
    }

    let n = 72, r = 1, h = 3;
    const grid = { gridsizeX: 10, gridsizeY: 10, divisions: 10 };

    function drawShape(shape) {
        switch (shape) {
            case shapes.CUBE:
                return Shapes.cube(r);
            case shapes.CUBOID:
                return Shapes.cuboid(h, h * .5, h * .75);
            case shapes.HEMISPHERE:
                return Shapes.hollow_hemisphere(r, n);
            case shapes.SOLID_HEMISPHERE:
                return Shapes.solid_hemisphere(r, n);
            case shapes.CYLINDER:
                return Shapes.cylinder(r, h, n, true);
            case shapes.HOLLOW_CYLINDER:
                return Shapes.hollow_cylinder(r, r * 0.8, h, n);
            case shapes.CONE:
                return Shapes.pyramid(r, h, n);
            case shapes.SPHERE:
                return Shapes.sphere(r, 76);
            case shapes.TORUS:
                return Shapes.torus(h, r, n, n);
            case shapes.PYRAMID:
                return Shapes.pyramid(r, h, 4);
            case shapes.GRID:
                return Shapes.grid(grid.gridsizeX, grid.gridsizeY, grid.divisions);
            case shapes.CAPSULE:
                return Shapes.capsule(r, h, n);
            case shapes.NGON:
                return Shapes.ngon(r, h, 5);
            case shapes.AMBIGUOUS:
                return Shapes.ambiguous([
                    [1, 0],
                    [0, 1]
                ], 1, depth = 1, center = true);
        }
    }

    GPUprogram1 = pripremiGPUprogram(gl, "vertex-shader", "fragment-shader");
    GPUprogram1.u_mTrans = gl.getUniformLocation(GPUprogram1, "u_mTrans");
    GPUprogram1.u_izvorXYZ = gl.getUniformLocation(GPUprogram1, "u_izvorXYZ");
    GPUprogram1.u_kameraXYZ = gl.getUniformLocation(GPUprogram1, "u_kameraXYZ");
    GPUprogram1.u_boja = gl.getUniformLocation(GPUprogram1, "u_boja");
    gl.useProgram(GPUprogram1);

    function initAttributes() {
        GPUprogram1.a_vrhXYZ = gl.getAttribLocation(GPUprogram1, "a_vrhXYZ");
        GPUprogram1.a_normala = gl.getAttribLocation(GPUprogram1, "a_normala");
        gl.enableVertexAttribArray(GPUprogram1.a_vrhXYZ);
        gl.enableVertexAttribArray(GPUprogram1.a_normala);
        // obj.initBuffers();
        // gl.vertexAttribPointer(GPUprogram1.a_vrhXYZ, 3, gl.FLOAT, false, 24, 0);
        // gl.vertexAttribPointer(GPUprogram1.a_normala, 3, gl.FLOAT, false, 24, 12);
    }


    // var sphere = drawShape(shapes.CAPSULE);
    // const sphereob = new Draw3DObject(gl, GPUprogram1, sphere);

    const matrix = new MT3D();
    initAttributes();
    gl.enable(gl.DEPTH_TEST);

    const cameraLimits = { limitDownward: 0, limitUpward: 60 };
    let φ = 30, direction = 1;
    function orbit() {
        matrix.PerspektivnaProjekcija(-1, 1, -1, 1, 1, 100);

        let x = 7 * Math.sin(φ * Math.PI / 360);
        let y = 7 * Math.cos(φ * Math.PI / 360);
        let z = 2;

        // const vert = document.getElementById("animate-vertical").checked;
        matrix.postaviKameru(x, y, z, 0, 0, 1, 0, 0, 1);
    }

    function render(timestamp) {
        if (document.getElementById("animate-view").checked) {
            φ += direction;
            if (φ >= 270) direction = -direction;
            if (φ <= 30) direction = -direction;
            orbit();
        }

        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.viewport(0, 0, platno1.width, platno1.height);

        var tempMatrix = Object.assign(new MT3D(), matrix);
        tempMatrix.rotirajX(-30);
        var initialRad = 1;
        var initialHeight = 3;
        var mixerSpokeHeight = initialHeight * 0.275;
        var mixerSpokeRadius = initialRad * 0.05;
        function drawHandle() {
            var tempR = r, tempH = h;
            r = initialRad;
            h = initialHeight;
            var beforeState = Object.assign(new MT3D(), tempMatrix);
            new Draw3DObject(gl, GPUprogram1, drawShape(shapes.CYLINDER)).draw(tempMatrix);
            tempMatrix = beforeState;
            r = tempR;
            h = tempH;
        }
        function drawCollar() {
            var tempR = r, tempH = h;
            r = initialRad * 0.9;
            h = initialHeight * 0.4;
            var beforeState = Object.assign(new MT3D(), tempMatrix);
            tempMatrix.pomakni(0, 0, initialHeight * 0.6575).rotirajY(90);
            new Draw3DObject(gl, GPUprogram1, drawShape(shapes.CYLINDER)).draw(tempMatrix);
            drawMixers();
            // drawHolster();
            tempMatrix = beforeState;
            r = tempR;
            h = tempH;
        }
        function drawHolster() {
            var tempR = r;
            r = initialRad * 0.11;
            h = 0.175;
            var beforeState = Object.assign(new MT3D(), tempMatrix);
            tempMatrix.pomakni(0, 0, initialHeight * 0.6575 / 2 + 0.2);
            new Draw3DObject(gl, GPUprogram1, drawShape(shapes.CYLINDER)).draw(tempMatrix);
            drawMixer();
            tempMatrix.rotirajZ(90);
            drawMixer();
            r = tempR;
            tempMatrix = beforeState;
        }
        function drawShaft() {
            var tempR = r, tempH = h;
            r = mixerSpokeRadius;
            h = initialHeight * 1.5;
            var beforeState = Object.assign(new MT3D(), tempMatrix);
            new Draw3DObject(gl, GPUprogram1, drawShape(shapes.CYLINDER)).draw(tempMatrix);
            tempMatrix = beforeState;
            r = tempR;
            h = tempH;
        }
        function drawSingleSpoke() {
            var tempR = r, tempH = h;
            r = mixerSpokeRadius;
            h = mixerSpokeHeight;
            var beforeState = Object.assign(new MT3D(), tempMatrix);
            new Draw3DObject(gl, GPUprogram1, drawShape(shapes.CYLINDER)).draw(tempMatrix);
            tempMatrix = beforeState;
            r = tempR;
            h = tempH;
        }
        function drawMixer() {
            // draw a straight cylinder, then draw a hexagon on top of it, then rotate the hexagon by 360 / 6 degrees and draw another hexagon
            var degrees = 360 / 6;
            var tempR = r;
            r = mixerSpokeRadius;
            const spherecache = new Draw3DObject(gl, GPUprogram1, drawShape(shapes.SPHERE));
            r = tempR;
            var beforeState = Object.assign(new MT3D(), tempMatrix);
            // spherecache.draw(tempMatrix);
            tempMatrix.pomakni(0, 0, mixerSpokeHeight * 2);
            tempMatrix.rotirajY(-degrees);
            drawSingleSpoke();
            // spherecache.draw(tempMatrix);
            tempMatrix.pomakni(0, 0, mixerSpokeHeight)
            
            r = mixerSpokeRadius*1.125;
            new Draw3DObject(gl, GPUprogram1, drawShape(shapes.SPHERE)).draw(tempMatrix);
            r = tempR;
            tempMatrix.pomakni(0, 0, -mixerSpokeHeight);
            tempMatrix.rotirajY(degrees * 2);
            drawSingleSpoke();
            spherecache.draw(tempMatrix);
            tempMatrix.pomakni(0, 0, mixerSpokeHeight)
            tempMatrix.rotirajY(-degrees);
            drawSingleSpoke();
            spherecache.draw(tempMatrix);
            tempMatrix.pomakni(0, 0, mixerSpokeHeight)
            tempMatrix.rotirajY(-degrees);
            drawSingleSpoke();
            spherecache.draw(tempMatrix);
            tempMatrix.pomakni(0, 0, mixerSpokeHeight)
            tempMatrix.rotirajY(-degrees);
            drawSingleSpoke();
            spherecache.draw(tempMatrix);
            tempMatrix.pomakni(0, 0, mixerSpokeHeight)
            tempMatrix.rotirajY(-degrees);
            drawSingleSpoke();
            spherecache.draw(tempMatrix);
            tempMatrix.pomakni(0, 0, mixerSpokeHeight)
            tempMatrix = beforeState;
        }
        function drawMixers() {
            const mixingSpeed = -timestamp * 1.5;
            var beforeState = Object.assign(new MT3D(), tempMatrix);
            tempMatrix.rotirajZ(90);
            // move over by 0.5
            tempMatrix.pomakni(0.5, 0, 0);
            tempMatrix.rotirajZ(mixingSpeed);
            drawHolster();
            tempMatrix.rotirajZ(-mixingSpeed);
            drawShaft();
            // move over in the opposite direction by 1
            tempMatrix.pomakni(-0.5, 0, 0);
            tempMatrix.pomakni(-0.5, 0, 0);
            tempMatrix.rotirajZ(45);
            tempMatrix.rotirajZ(-mixingSpeed);
            drawHolster();
            tempMatrix.rotirajZ(mixingSpeed);
            drawShaft();
            // drawMixer();
            tempMatrix = beforeState;
        }
        drawHandle();
        drawCollar();

        gl.uniform3fv(GPUprogram1.u_izvorXYZ, [-10, 0, -10]);
        gl.uniform3fv(GPUprogram1.u_kameraXYZ, [0, 0, -10]);

        // gl.uniform3fv(GPUprogram1.u_boja, [0.98, 0.68, 0.68]);
        gl.uniform3fv(GPUprogram1.u_boja, [1, 1, 1]);

    }


    function animiraj(vrijeme) {
        render(vrijeme / 20);
        requestAnimationFrame(animiraj);
    }

    orbit();
    requestAnimationFrame(animiraj);

}
