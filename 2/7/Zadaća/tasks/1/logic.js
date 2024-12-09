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

    const a = 0.5;

    const frontFace = [
        [  a,   a,    1.0, 0.0, 0.0],
        [ -a,   a,    1.0, 0.0, 0.0],
        [  a,  -a,    1.0, 0.0, 0.0],
        [ -a,  -a,    1.0, 0.0, 0.0],
    ];

    const backFace = [
        [  a,   a,    0.0, 0.0, 1.0],
        [ -a,   a,    0.0, 0.0, 1.0],
        [  a,  -a,    0.0, 0.0, 1.0],
        [ -a,  -a,    0.0, 0.0, 1.0],
    ];

    const leftFace = [
        [ -a,   a,    a,    0.0, 1.0],
        [ -a,   a,   -a,    0.0, 1.0],
        [ -a,  -a,    a,    0.0, 1.0],
        [ -a,  -a,   -a,    0.0, 1.0],
    ];

    const rightFace = [
        [  a,   a,    a,    1.0, 1.0],
        [  a,   a,   -a,    1.0, 1.0],
        [  a,  -a,    a,    1.0, 1.0],
        [  a,  -a,   -a,    1.0, 1.0],
    ];

    const topFace = [
        [  a,   a,   -a,    0.0, 1.0],
        [ -a,   a,   -a,    0.0, 1.0],
        [  a,   a,    a,    0.0, 1.0],
        [ -a,   a,    a,    0.0, 1.0],
    ];

    const bottomFace = [
        [  a,  -a,   -a,    1.0, 0.0],
        [ -a,  -a,   -a,    1.0, 0.0],
        [  a,  -a,    a,    1.0, 0.0],
        [ -a,  -a,    a,    1.0, 0.0],
    ];

    var buffers = [];

    function createBuffer(data) {
        const flatData = new Float32Array(data.flat());
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatData, gl.STATIC_DRAW);
        return buffer;
    }

    function loadBuffers() {
        buffers = [frontFace, backFace, leftFace, rightFace, topFace, bottomFace].map(createBuffer);

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

    gl.enable(gl.DEPTH_TEST);
    // gl.enable(gl.CULL_FACE);

    const matrix = new MT3D();
    matrix.rotirajZ(30);

    function render(φ) {
        gl.clearColor(0.5, 0.5, 0.5, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        matrix.identitet();
        matrix.rotirajX(φ);
        matrix.rotirajZ(φ);

        gl.uniformMatrix4fv(GPUprogram1.u_mTrans, false, matrix.lista());

        buffers.forEach((buffer, i) => {
            bindBuffer(buffer);
            
            const tempMatrix = new MT3D();
            tempMatrix._matrica = matrix._matrica.slice();
        
            switch (i) {
                case 0:
                    matrix.pomakni(0, 0, a);
                    break;
                case 1:
                    matrix.rotirajY(180);
                    matrix.pomakni(0, 0, a);
                    break;
                case 2:
                    matrix.rotirajX(-90);
                    matrix.pomakni(0, 0, a);
                    break;
                case 3:
                    matrix.rotirajX(90);
                    matrix.pomakni(0, 0, a);
                    break;
                case 4:
                    matrix.rotirajY(90);
                    matrix.pomakni(0, 0, a);
                    break;
                case 5:
                    matrix.rotirajY(-90);
                    matrix.pomakni(0, 0, a);
                    break;
            }
        
            gl.uniformMatrix4fv(GPUprogram1.u_mTrans, false, matrix.lista());
        
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        
            matrix._matrica = tempMatrix._matrica.slice();
        });
    }

    loadBuffers();

    function animiraj(vrijeme) {
        render(vrijeme / 20);
        requestAnimationFrame(animiraj);
    }

    requestAnimationFrame(animiraj);
}
