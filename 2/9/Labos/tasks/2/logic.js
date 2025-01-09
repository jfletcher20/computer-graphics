window.onload = WebGLaplikacija;

function WebGLaplikacija() {
    var platno1 = document.getElementById("slika1");
    gl = platno1.getContext("webgl2");
    if (!gl) {
        alert("WebGL2 nije dostupan!");
        return;
    }

    GPUprogram1 = pripremiGPUprogram(gl, "vertex-shader", "fragment-shader");
    GPUprogram1.u_mTrans = gl.getUniformLocation(GPUprogram1, "u_mTrans");
    GPUprogram1.u_mProj = gl.getUniformLocation(GPUprogram1, "u_mProj");
    GPUprogram1.u_mView = gl.getUniformLocation(GPUprogram1, "u_mView");
    GPUprogram1.u_izvorXYZ = gl.getUniformLocation(GPUprogram1, "u_izvorXYZ");
    GPUprogram1.u_izvorBoja = gl.getUniformLocation(GPUprogram1, "u_izvorBoja");

    gl.useProgram(GPUprogram1);

    const n = 32;
    const { vertices, indices } = Shapes.kugla(1, n);

    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    // GPUprogram1.a_vrhXYZ = gl.getAttribLocation(GPUprogram1, "a_vrhXYZ");
    // GPUprogram1.a_normala = gl.getAttribLocation(GPUprogram1, "a_normala");

    // gl.enableVertexAttribArray(GPUprogram1.a_vrhXYZ);
    // gl.vertexAttribPointer(GPUprogram1.a_vrhXYZ, 3, gl.FLOAT, false, 24, 0);
    // gl.enableVertexAttribArray(GPUprogram1.a_normala);
    // gl.vertexAttribPointer(GPUprogram1.a_normala, 3, gl.FLOAT, false, 24, 12);

    function loadBuffers() {
        GPUprogram1.a_vrhXYZ = gl.getAttribLocation(GPUprogram1, "a_vrhXYZ");
        GPUprogram1.a_normala = gl.getAttribLocation(GPUprogram1, "a_normala");
        gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
        gl.enableVertexAttribArray(GPUprogram1.a_vrhXYZ);
        gl.enableVertexAttribArray(GPUprogram1.a_normala);
        gl.vertexAttribPointer(GPUprogram1.a_vrhXYZ, 3, gl.FLOAT, false, 24, 0);
        gl.vertexAttribPointer(GPUprogram1.a_normala, 3, gl.FLOAT, false, 24, 12);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(Shapes.kugla(0.5, n).vertices), gl.STATIC_DRAW);
    }


    const matrix = new MT3D();
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);

    let φ = 0, θ = 30, θDirection = 1;
    function orbit() {
        matrix.PerspektivnaProjekcija(-1, 1, -1, 1, 1, 100);
        θ += θDirection / (360 - 60 - 5) * 4;
        if (θ >= 60) θDirection = -1;
        if (θ <= 5) θDirection = 1;
        const x = Math.cos(φ * Math.PI / 180) * 24;
        const y = Math.sin(φ * Math.PI / 180) * 24;
        const z = 30 * Math.sin(θ * Math.PI / 180);

        if (z < 0) z = 0;

        matrix.postaviKameru(x, y, z, 0, 0, 8, 0, 0, 1);
    }

    gl.enable(gl.DEPTH_TEST);

    function render(timestamp) {
        φ += 1;
        if (φ >= 360) φ = 0;
        orbit();

        gl.clearColor(0.5, 0.5, 0.5, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.viewport(0, 0, platno1.width, platno1.height);

        gl.uniformMatrix4fv(GPUprogram1.u_mTrans, false, [
            1, 0, 0, 0,
            0, Math.cos(φ * Math.PI / 180), Math.sin(φ * Math.PI / 180), 0,
            0, -Math.sin(φ * Math.PI / 180), Math.cos(φ * Math.PI / 180), 0,
            0, 0, 0, 1
        ]);

        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

        gl.uniform3fv(GPUprogram1.u_izvorXYZ, [-10, 0, -10]);
        gl.uniform3fv(GPUprogram1.u_kameraXYZ, [0, 0, -10]);

        gl.uniform3fv(GPUprogram1.u_boja, [1.0, 1.0, 0.0]);

    }

    loadBuffers();

    function animiraj(vrijeme) {
        render(vrijeme / 20);
        requestAnimationFrame(animiraj);
    }

    requestAnimationFrame(animiraj);
}
