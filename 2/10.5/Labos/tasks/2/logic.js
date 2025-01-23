window.onload = WebGLaplikacija;

const shapes = {
    CUBE: "cube",
    CUBOID: "cuboid", // actual name for this shape in math is cuboid
    SPHERE: "sphere",
    CYLINDER: "cylinder",
    HOLLOW_CYLINDER: "hollow_cylinder",
    CONE: "cone",
    HEMISPHERE: "hemisphere",
    SOLID_HEMISPHERE: "solid_hemisphere",
    TORUS: "torus",
    PYRAMID: "pyramid",
    GRID: "grid"
};

function WebGLaplikacija() {
    var platno1 = document.getElementById("slika1");
    gl = platno1.getContext("webgl2");
    if (!gl) {
        alert("WebGL2 nije dostupan!");
        return;
    }

    const n = 128, r = 1, h = 2;
    const grid = { gridsizeX: 10, gridsizeY: 10, divisions: 10 };

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
                return Shapes.hollow_cylinder(r*1.5, r, h, n);
            case shapes.CONE:
                return Shapes.pyramid(r, h, n);
            case shapes.SPHERE:
                return Shapes.sphere(r, n);
            case shapes.TORUS:
                return Shapes.torus(h, r, n, n);
            case shapes.PYRAMID:
                return Shapes.pyramid(r * 2, h, 4);
            case shapes.GRID:
                return Shapes.grid(grid.gridsizeX, grid.gridsizeY, grid.divisions);
        }
    }

    GPUprogram1 = pripremiGPUprogram(gl, "vertex-shader", "fragment-shader");
    GPUprogram1.u_mTrans = gl.getUniformLocation(GPUprogram1, "u_mTrans");
    GPUprogram1.u_izvorXYZ = gl.getUniformLocation(GPUprogram1, "u_izvorXYZ");
    GPUprogram1.u_kameraXYZ = gl.getUniformLocation(GPUprogram1, "u_kameraXYZ");
    GPUprogram1.u_boja = gl.getUniformLocation(GPUprogram1, "u_boja");
    gl.useProgram(GPUprogram1);
    
    const obj = new Draw3DObject(gl, drawShape(shapes.CONE));
    const obj2 = new Draw3DObject(gl, drawShape(shapes.HEMISPHERE));
    function loadBuffers() {
        GPUprogram1.a_vrhXYZ = gl.getAttribLocation(GPUprogram1, "a_vrhXYZ");
        GPUprogram1.a_normala = gl.getAttribLocation(GPUprogram1, "a_normala");
        gl.enableVertexAttribArray(GPUprogram1.a_vrhXYZ);
        gl.enableVertexAttribArray(GPUprogram1.a_normala);
        gl.vertexAttribPointer(GPUprogram1.a_vrhXYZ, 3, gl.FLOAT, false, 24, 0);
        gl.vertexAttribPointer(GPUprogram1.a_normala, 3, gl.FLOAT, false, 24, 12);
    }

    loadBuffers();

    const matrix = new MT3D();
    gl.enable(gl.DEPTH_TEST);

    const cameraLimits = { limitDownward: -120, limitUpward: 60 };
    let φ = 0, θ = 0, θDirection = 1;
    function orbit() {
        matrix.PerspektivnaProjekcija(-1, 1, -1, 1, 1, 100);
        θ += θDirection * cameraLimits.limitUpward / 180;
        if (θ >= cameraLimits.limitUpward) θDirection = -1;
        if (θ <= cameraLimits.limitDownward) θDirection = 1;
        
        let x = 4 * Math.sin(φ * Math.PI / 180);
        let y = 4 * Math.cos(φ * Math.PI / 180);
        let z = 6 + Math.sin(θ * Math.PI / 180);

        // const vert = document.getElementById("animate-vertical").checked;
        matrix.postaviKameru(x, y, z, 0, 0, 1, 0, 0, 1);
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
       
        matrix.identitet()
        matrix.skaliraj(2, 0.5, 0.5)
        obj.draw(matrix);
        matrix.identitet();
        obj.draw(matrix);
        matrix.pomakni(0, 0, 2).zrcaliNaZ().skaliraj(0.5, 0.5, 0.5);
        obj.draw(matrix);
        matrix.zrcaliNaX();
        obj.draw(matrix);
        obj2.draw(matrix);

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
