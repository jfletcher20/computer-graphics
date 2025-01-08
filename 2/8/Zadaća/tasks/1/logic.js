/*

    Zadaća 8
    Napravite animaciju kocke kojoj je središte u ishodištu, a svaka stranica je različite boje. Duljinu brida odaberite tako da kod rotacije vrhovi kocke budu automatski odrezani kad izlaze izvan normiranih koordinata te se na taj način dobije uvid u unutrašnjost kocke. Realizirajte realističan prikaz samo preko selektivnog odbacivanja, tj. bez spremnika dubine.

*/

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

    const a = 0.75;

    const frontFace = [ [a, a, 0, 1, 0], [-a, a, 0, 1, 0], [a, -a, 0, 1, 0], [-a, -a, 0, 1, 0] ];

    const backFace = frontFace.map(([x, y, r, g, b]) => [x, y, 1, 1, 0]);

    const leftFace = frontFace.map(([x, y, r, g, b]) => [x, y, 1, 0, 0]);

    const rightFace = frontFace.map(([x, y, r, g, b]) => [x, y, 1, 1, 1]);

    const topFace = frontFace.map(([x, y, r, g, b]) => [x, y, 0, 0, 1]);

    const bottomFace = frontFace.map(([x, y, r, g, b]) => [x, y, 1, 0.5, 0]);


    var buffers = [];

    function createBuffer(data) {
        const flatData = new Float32Array(data.flat());
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatData, gl.STATIC_DRAW);
        return buffer;
    }

    function loadBuffers() {
        buffers = [
            frontFace, backFace,
            leftFace, rightFace,
            topFace, bottomFace
        ].map(createBuffer);

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

    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.FRONT);

    const matrix = new MT3D();

    function render(φ) {
        gl.clearColor(0.5, 0.5, 0.5, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.uniformMatrix4fv(GPUprogram1.u_mTrans, false, matrix.lista());

        buffers.forEach((buffer, i) => {
            bindBuffer(buffer);

            const tempMatrix = new MT3D();
            tempMatrix._matrica = matrix._matrica.slice();
            
            matrix.OrtogonalnaProjekcija(-a*2, a*2, -a*2, a*2, -1, 1);
            matrix.rotirajZ(3 + φ);
            matrix.rotirajY(2 + φ);
            matrix.rotirajX(φ);

            switch (i) {
                case 1:
                    matrix.rotirajY(90);
                    break;
                case 2:
                    matrix.rotirajY(-90);
                    break;
                case 3:
                    matrix.rotirajY(180);
                    break;
                case 4:
                    matrix.rotirajX(90);
                    break;
                case 5:
                    matrix.rotirajX(-90);
            }

            matrix.pomakni(0, 0, a);
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
