window.onload = WebGLaplikacija;

function WebGLaplikacija() {
    var platno1 = document.getElementById("slika1");
    gl = platno1.getContext("webgl2");
    if (!gl) {
        alert("WebGL2 nije dostupan!");
        return;
    }

    GPUprogram1 = pripremiGPUprogram(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(GPUprogram1);

    let a = 0.5;

    const vrhovi1 = [
        [a, -a, 1.0, 0.0, 0.0],
        [-a, -a, 1.0, 0.0, 0.0],
        [0, 0, 1.0, 0.0, 0.0],
    ];

    const vrhovi2 = [
        [a, -a, 0.0, 1.0, 0.0],
        [-a, -a, 0.0, 1.0, 0.0],
        [0, 0, 0.0, 1.0, 0.0],
    ];

    const vrhovi3 = [
        [a, a, 0.0, 0.0, 1.0],
        [-a, a, 0.0, 0.0, 1.0],
        [0, 0, 0.0, 0.0, 1.0],
    ];

    const vrhovi4 = [
        [a, a, 1.0, 1.0, 0.0],
        [-a, a, 1.0, 1.0, 0.0],
        [0, 0, 1.0, 1.0, 0.0],
    ];

    let buffers = [];

    function createBuffer(data) {
        const flatData = new Float32Array(data.flat());
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatData, gl.STATIC_DRAW);
        return buffer;
    }

    function loadBuffers() {
        buffers = [vrhovi1, vrhovi2, vrhovi3, vrhovi4].map(createBuffer);

        GPUprogram1.a_vrhXY = gl.getAttribLocation(GPUprogram1, "a_vrhXY");
        GPUprogram1.a_boja = gl.getAttribLocation(GPUprogram1, "a_boja");
        GPUprogram1.u_mTrans = gl.getUniformLocation(GPUprogram1, "u_mTrans");

        gl.enableVertexAttribArray(GPUprogram1.a_vrhXY);
        gl.enableVertexAttribArray(GPUprogram1.a_boja);
    }

    function bindBuffer(buffer) {
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.vertexAttribPointer(GPUprogram1.a_vrhXY, 2, gl.FLOAT, false, 20, 0);
        gl.vertexAttribPointer(GPUprogram1.a_boja, 3, gl.FLOAT, false, 20, 8);
    }

    const matrix = new MT3D();

    function render(φ) {
        gl.clearColor(0.5, 0.5, 0.5, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.viewport(0, 0, platno1.width, platno1.height);

        matrix.identitet();
        matrix.rotirajX(φ);
        matrix.rotirajY(φ * 2);
        matrix.rotirajZ(φ * 3);

        gl.uniformMatrix4fv(GPUprogram1.u_mTrans, false, matrix.lista());

        buffers.forEach((buffer, i) => {
            bindBuffer(buffer);
            gl.drawArrays(gl.TRIANGLES, 0, 3);
            if (i % 2 === 0) matrix.rotirajX(90);
            gl.uniformMatrix4fv(GPUprogram1.u_mTrans, false, matrix.lista());
            if (i % 2 === 0) matrix.rotirajX(-90);
        });
    }

    loadBuffers();

    function animiraj(vrijeme) {
        render(vrijeme / 20);
        requestAnimationFrame(animiraj);
    }

    requestAnimationFrame(animiraj);
}
