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
                return Shapes.sphere(r, n);
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

    const obj = new Draw3DObject(gl, GPUprogram1, drawShape(shapes.PYRAMID));

    // var sphere = drawShape(shapes.CAPSULE);
    // const sphereob = new Draw3DObject(gl, GPUprogram1, sphere);

    const matrix = new MT3D(), m2 = new MT3D();
    initAttributes();
    gl.enable(gl.DEPTH_TEST);

    const cameraLimits = { limitDownward: 0, limitUpward: 60 };
    let φ = 0, θ = 0, θDirection = 1;
    function orbit() {
        matrix.PerspektivnaProjekcija(-1, 1, -1, 1, 1, 100);
        θ += θDirection * cameraLimits.limitUpward / 180;
        if (θ >= cameraLimits.limitUpward) θDirection = -1;
        if (θ <= cameraLimits.limitDownward) θDirection = 1;

        let x = 8 * Math.sin(φ * Math.PI / 180);
        let y = 8 * Math.cos(φ * Math.PI / 180);
        let z = 4 + 4 * Math.sin(θ * Math.PI / 180) * 0;

        // const vert = document.getElementById("animate-vertical").checked;
        matrix.postaviKameru(x, y, z, 0, 0, 0, 0, 0, 1);
    }

    function render(timestamp) {
        φ += 1;
        if (φ >= 360) φ = 0;
        if (document.getElementById("animate-view").checked) {
            orbit();
        }

        gl.clearColor(0.5, 0.5, 0.5, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.viewport(0, 0, platno1.width, platno1.height);

        var tempMatrix = Object.assign(new MT3D(), matrix);
        new Draw3DObject(gl, GPUprogram1, drawShape(shapes.GRID)).draw(matrix);
        new Draw3DObject(gl, GPUprogram1, drawShape(shapes.CONE)).draw(matrix);
        function drawCatcher() {
            var tempR = r;
            r = 0.7;
            var beforeState = Object.assign(new MT3D(), tempMatrix);
            tempMatrix.rotirajY(90);
            tempMatrix.rotirajX(90);
            tempMatrix.pomakni(0, h + 0.1, 0);
            new Draw3DObject(gl, GPUprogram1, drawShape(shapes.HEMISPHERE)).draw(tempMatrix);
            r = tempR;
            tempMatrix = beforeState;
        }
        function drawSpoke() {
            var tempR = r, tempH = h;
            drawCatcher();
            r = 0.2;
            h = 2.5;
            var beforeState = Object.assign(new MT3D(), tempMatrix);
            tempMatrix.rotirajY(90);
            new Draw3DObject(gl, GPUprogram1, drawShape(shapes.CYLINDER)).draw(tempMatrix);
            tempMatrix = beforeState;
            r = tempR;
            h = tempH;
        }
        function drawCollar() {
            var tempR = r, tempH = h;
            r = 0.6;
            h = 0.8;
            var beforeState = Object.assign(new MT3D(), tempMatrix);
            tempMatrix.pomakni(0, 0, 1.75);
            new Draw3DObject(gl, GPUprogram1, drawShape(shapes.CYLINDER)).draw(tempMatrix);
            tempMatrix = beforeState;
            r = tempR;
            h = tempH;
        }
        drawCollar();
        tempMatrix.rotirajZ(φ);
        tempMatrix.pomakni(0, 0, 1.75 + 0.4);
        drawSpoke();
        tempMatrix.rotirajZ(120);
        drawSpoke();
        tempMatrix.rotirajZ(120);
        drawSpoke();

        if (document.getElementById("animate-light").checked)
            gl.uniform3fv(GPUprogram1.u_izvorXYZ, [10*Math.sin(φ * Math.PI / 180),0, 10* Math.cos(φ * Math.PI / 180)]);
        else
            gl.uniform3fv(GPUprogram1.u_izvorXYZ, [-10, 0, -10]);
        gl.uniform3fv(GPUprogram1.u_kameraXYZ, [0, 0, -10]);

        gl.uniform3fv(GPUprogram1.u_boja, [1.0, 1.0, 0.0]);

    }


    function animiraj(vrijeme) {
        render(vrijeme / 20);
        requestAnimationFrame(animiraj);
    }

    orbit();
    requestAnimationFrame(animiraj);

}
