/*

    Zadaća 8.
    
    Mrežom ravnih linija vizualizirajte xy-ravninu i na nju postavite stilizirano slovo F sačinjeno od osam kocaka s raznobojnim stranicama. Uz pomoć već ranije implementirane metode postaviKameru() iz klase MT3D kamerom kružite oko slova F mijenjajući više puta visinu na kojoj se nalazi kamera. Primijenite perspektivnu projekciju

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

    const frontFace = [[a, a, 0, 1, 0], [-a, a, 0, 1, 0], [a, -a, 0, 1, 0], [-a, -a, 0, 1, 0]];

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
    matrix.rotirajX(30);

    function render(φ) {
        gl.clearColor(0.5, 0.5, 0.5, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);

        const xmin = -2, xmax = 2, ymin = -2, ymax = 2, zpr = 1, zst = 10;
        matrix.PerspektivnaProjekcija(xmin, xmax, ymin, ymax, zpr, zst);
        matrix.postaviKameru(
            1000 * Math.cos(Math.sqrt(φ) * Math.PI / 180), 1000 * Math.sin(Math.sqrt(φ) * Math.PI / 180), 100,
            0, 16, 16,
            0, 16, 16
        );

        function drawGridXY(xmin, xmax, ymin, ymax, step = 1) {

            const lines = [];
            for (let x = xmin; x <= xmax; x += step) lines.push(x, ymin, 0, x, ymax, 0);
            for (let y = ymin; y <= ymax; y += step) lines.push(xmin, y, 0, xmax, y, 0);

            const gridBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, gridBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(lines), gl.STATIC_DRAW);

            const a_vrhXY = gl.getAttribLocation(GPUprogram1, "a_vrhXY");
            gl.enableVertexAttribArray(a_vrhXY);
            gl.vertexAttribPointer(a_vrhXY, 3, gl.FLOAT, false, 0, 0);

            const u_boja = gl.getUniformLocation(GPUprogram1, "u_boja");
            gl.uniform4fv(u_boja, [0.7, 0.7, 0.7, 1.0]);

            gl.drawArrays(gl.LINES, 0, lines.length / 3);
        }

        drawGridXY(-10, 10, -10, 10);
        matrix.postaviKameru(φ, 5, 2, 0, 0, 0, 0, 1, 0);

        buffers.forEach((buffer, i) => {
            bindBuffer(buffer);

            const tempMatrix = new MT3D();
            tempMatrix._matrica = matrix._matrica.slice();

            // matrix.PerspektivnaProjekcija(-a * 2, a * 2, -a * 2, a * 2, -1, 1);
            // matrix.postaviKameru(10, 0, φ, 0, 0, -φ / 4, 0, 0, 1);

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

        gl.uniformMatrix4fv(GPUprogram1.u_mTrans, false, matrix.lista());
        gl.drawArrays(gl.TRIANGLES, 0, 6 * 4);
    }

    loadBuffers();

    function animiraj(vrijeme) {
        render(vrijeme / 20);
        requestAnimationFrame(animiraj);
    }

    requestAnimationFrame(animiraj);
}
