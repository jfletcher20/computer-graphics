window.onload = function () {
    WebGLaplikacija();
};

const shapes = {
    CUBE: "cube",
    CUBOID: "cuboid",
    SPHERE: "sphere",
    CYLINDER: "cylinder",
    HOLLOW_CYLINDER: "hollow_cylinder",
    CONE: "cone",
    HEMISPHERE: "hemisphere",
    SOLID_HEMISPHERE: "solid_hemisphere",
    TORUS: "torus",
    PYRAMID: "pyramid",
    CAPSULE: "capsule",
    AMBIGUOUS: "ambiguous",
};

function WebGLaplikacija() {

    var platno1 = document.getElementById("slika1");
    gl = platno1.getContext("webgl2");
    if (!gl) {
        alert("WebGL2 nije dostupan!");
        return;
    }

    GPUprogram1 = pripremiGPUprogram(gl, "vertex-shader", "fragment-shader");
    GPUprogram1.u_mTrans = gl.getUniformLocation(GPUprogram1, "u_mTrans");
    GPUprogram1.u_izvorXYZ = gl.getUniformLocation(GPUprogram1, "u_izvorXYZ");
    GPUprogram1.u_kameraXYZ = gl.getUniformLocation(GPUprogram1, "u_kameraXYZ");
    GPUprogram1.u_boja = gl.getUniformLocation(GPUprogram1, "u_boja");
    gl.useProgram(GPUprogram1);

    const n = 128, r = 1, h = 2;
    let φ = 0, θ = 30, θDirection = 1;

    function drawShape(shape) {
        switch (shape) {
            case shapes.CUBE:
                return Shapes.cube(h);
            case shapes.CUBOID:
                return Shapes.cuboid(h, h, h);
            case shapes.HEMISPHERE:
                return Shapes.hollow_hemisphere(r, n, 0, Math.PI);
            case shapes.SOLID_HEMISPHERE:
                return Shapes.solid_hemisphere(r, n);
            case shapes.CYLINDER:
                return Shapes.cylinder(r, h, n, true);
            case shapes.HOLLOW_CYLINDER:
                return Shapes.hollow_cylinder(r * 1.5, r, h, n);
            case shapes.CONE:
                return Shapes.cone(r, h, n, true);
            case shapes.SPHERE:
                return Shapes.sphere(r, n);
            case shapes.TORUS:
                return Shapes.torus(h, r, n, n);
            case shapes.PYRAMID:
                return Shapes.pyramid(r, h);
            case shapes.CAPSULE:
                return Shapes.capsule(r, h, n);
            case shapes.AMBIGUOUS:
                return Shapes.ambiguous([
                    [0, 0, 1, 0, 0, 0, 0, 0, 1],
                    [0, 1, 0, 0, 0, 0, 0, 0, 0],
                    [1, 1, 1, 0, 0, 1, 0, 0, 1],
                    [0, 1, 0, 0, 1, 0, 1, 0, 1],
                    [0, 1, 0, 0, 0, 1, 0, 0, 1],
                ], 0.1, depth = 1, center = true);

        }
    }

    function loadBuffers() {

        const vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(drawShape(shapes.AMBIGUOUS).vertices), gl.STATIC_DRAW);

        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(drawShape(shapes.AMBIGUOUS).indices), gl.STATIC_DRAW);
        GPUprogram1.a_vrhXYZ = gl.getAttribLocation(GPUprogram1, "a_vrhXYZ");
        GPUprogram1.a_normala = gl.getAttribLocation(GPUprogram1, "a_normala");
        gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
        gl.enableVertexAttribArray(GPUprogram1.a_vrhXYZ);
        gl.enableVertexAttribArray(GPUprogram1.a_normala);
        gl.vertexAttribPointer(GPUprogram1.a_vrhXYZ, 3, gl.FLOAT, false, 24, 0);
        gl.vertexAttribPointer(GPUprogram1.a_normala, 3, gl.FLOAT, false, 24, 12);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(drawShape(shapes.AMBIGUOUS).vertices), gl.STATIC_DRAW);
    }

    const matrix = new MT3D();
    gl.enable(gl.DEPTH_TEST);

    function orbit() {
        matrix.PerspektivnaProjekcija(-1, 1, -1, 1, 1, 100);
        θ += θDirection / (360 - 60 - 5) * 4;
        if (θ >= 60) θDirection = -1;
        if (θ <= 5) θDirection = 1;
        const x = Math.cos(φ * Math.PI / 180) * 3;
        const y = Math.sin(φ * Math.PI / 180) * 3;
        const z = 1 * Math.sin(θ * Math.PI / 180);
        if (z < 0) z = 0;
        const vert = document.getElementById("animate-vertical").checked;
        matrix.postaviKameru(x, vert ? z : y, vert ? y : z, 0, 0, 0, 0, 0, 1);
    }

    function render(timestamp) {
        if (document.getElementById("animate-view").checked) {
            φ += 1;
            if (φ >= 360) φ = 0;
            orbit();
        }

        gl.clearColor(0.5, 0.5, 0.5, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.viewport(0, 0, platno1.width, platno1.height);
        gl.uniformMatrix4fv(GPUprogram1.u_mTrans, false, matrix.lista());

        drawShape(shapes.AMBIGUOUS).drawFunction(gl, n);

        gl.uniform3fv(GPUprogram1.u_izvorXYZ, [-10, 0, -10]);
        gl.uniform3fv(GPUprogram1.u_kameraXYZ, [0, 0, -10]);

        gl.uniform3fv(GPUprogram1.u_boja, [1.0, 0.2, 0.0]);

    }

    loadBuffers();

    function animiraj(vrijeme) {
        render(vrijeme / 20);
        requestAnimationFrame(animiraj);
    }

    orbit();
    requestAnimationFrame(animiraj);

}
