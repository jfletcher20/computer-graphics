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
    GPUprogram1.u_izvorXYZ = gl.getUniformLocation(GPUprogram1, "u_izvorXYZ");
    GPUprogram1.u_kameraXYZ = gl.getUniformLocation(GPUprogram1, "u_kameraXYZ");
    GPUprogram1.u_boja = gl.getUniformLocation(GPUprogram1, "u_boja");
    gl.useProgram(GPUprogram1);

    function loadBuffers() {
        GPUprogram1.a_vrhXYZ = gl.getAttribLocation(GPUprogram1, "a_vrhXYZ");
        GPUprogram1.a_normala = gl.getAttribLocation(GPUprogram1, "a_normala");
        gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
        gl.enableVertexAttribArray(GPUprogram1.a_vrhXYZ);
        gl.enableVertexAttribArray(GPUprogram1.a_normala);
        gl.vertexAttribPointer(GPUprogram1.a_vrhXYZ, 3, gl.FLOAT, false, 24, 0);
        gl.vertexAttribPointer(GPUprogram1.a_normala, 3, gl.FLOAT, false, 24, 12);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(Shapes.valjak(0.5, 1, n)), gl.STATIC_DRAW);
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

        function iscrtaj() {
            gl.clearColor(0.5, 0.5, 0.5, 1);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.viewport(0, 0, platno1.width, platno1.height);

            // matrica transformacije - rotacija oko x osi za kut alpha
            gl.uniformMatrix4fv(GPUprogram1.u_mTrans, false, [
                1, 0, 0, 0,
                0, Math.cos(alpha), Math.sin(alpha), 0,
                0, -Math.sin(alpha), Math.cos(alpha), 0,
                0, 0, 0, 1
            ]);

            // donja baza valjka
            gl.drawArrays(gl.TRIANGLE_FAN, 0, n + 2);

            // gornja baza valjka
            gl.drawArrays(gl.TRIANGLE_FAN, n + 2, n + 2);

            // plašt valjka
            gl.drawArrays(gl.TRIANGLE_STRIP, 2 * (n + 2), 2 * n + 2);

            alpha = φ * Math.PI / 180;
        } // iscrtaj

        // vektori položaja izvora svjetlosti i kamere
        gl.uniform3fv(GPUprogram1.u_izvorXYZ, [-10, 0, -10]);
        gl.uniform3fv(GPUprogram1.u_kameraXYZ, [0, 0, -10]);

        // boja izvora u RGB formatu
        gl.uniform3fv(GPUprogram1.u_boja, [1.0, 1.0, 0.0]);

        // omogući selektivno odbacivanje
        gl.enable(gl.CULL_FACE);

        iscrtaj();
    }
    var alpha = 0; // kut rotacije koji se koristi kod animacije
    var n = 32; // broj stranica koje čine plašt valjka

    loadBuffers();

    function animiraj(vrijeme) {
        render(vrijeme / 20);
        requestAnimationFrame(animiraj);
    }

    requestAnimationFrame(animiraj);
}
