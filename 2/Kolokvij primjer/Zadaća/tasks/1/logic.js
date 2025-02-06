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
                return Shapes.hollow_cylinder(r, r * 0.85, h, n);
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
        let z = 3;

        // const vert = document.getElementById("animate-vertical").checked;
        matrix.postaviKameru(x, y, z, 0, 0, 0, 0, 0, 1);
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

        gl.uniform3fv(GPUprogram1.u_boja, [0.7, 0.7, 0.7]);

        var tempMatrix;
        var initialRad = 1, initialHeight = 1;
        function resetRadiusAndHeightAndMatrix() {
            tempMatrix = Object.assign(new MT3D(), matrix);
            r = initialRad, h = initialHeight;
        }
        resetRadiusAndHeightAndMatrix();

        function setRadiusAndHeight(radius, height) {
            r = radius;
            h = height;
        }

        setRadiusAndHeight(4, 0.75);
        gl.uniform3fv(GPUprogram1.u_boja, [0.00, 0.85, 0.75]);
        new Draw3DObject(gl, GPUprogram1, drawShape(shapes.HOLLOW_CYLINDER)).draw(tempMatrix);
        tempMatrix.rotirajX(90);
        setRadiusAndHeight(0.3 * 0.85, 4 * 0.85);
        gl.uniform3fv(GPUprogram1.u_boja, [0.25, 0.75, 0.25]);
        new Draw3DObject(gl, GPUprogram1, drawShape(shapes.CYLINDER)).draw(tempMatrix);
        tempMatrix.rotirajY(90);
        new Draw3DObject(gl, GPUprogram1, drawShape(shapes.CYLINDER)).draw(tempMatrix);
        tempMatrix.rotirajY(90);
        new Draw3DObject(gl, GPUprogram1, drawShape(shapes.CYLINDER)).draw(tempMatrix);
        tempMatrix.rotirajY(90);
        new Draw3DObject(gl, GPUprogram1, drawShape(shapes.CYLINDER)).draw(tempMatrix);
        tempMatrix.identitet();
        r = 0.3 * 3;
        gl.uniform3fv(GPUprogram1.u_boja, [0.75, 0.55, 0.0]);
        new Draw3DObject(gl, GPUprogram1, drawShape(shapes.CUBE)).draw(tempMatrix);

        gl.uniform3fv(GPUprogram1.u_izvorXYZ, [-10, 5, -10]);
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
