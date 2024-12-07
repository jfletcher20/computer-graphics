window.onload = WebGLaplikacija;

/*

6.2. Modificirajte Primjer 6.2. tako da se umjesto para trokuta iscrta ispunjena (obojana) elipse s velikom poluosi a = 0.9 i malom poluosi b = 0.2 i također je iscrtajte tri puta: zelenu bez zakreta, žutu zarotiranu za 60 stupnjeva i crvenu zarotiranu za 120 stupnjeva.

*/

function WebGLaplikacija() {

    var platno1 = document.getElementById("slika1");
    gl = platno1.getContext("webgl2");
    if (!gl) alert("WebGL2 nije dostupan!");

    GPUprogram1 = pripremiGPUprogram(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(GPUprogram1);

    GPUprogram1.u_mTrans = gl.getUniformLocation(GPUprogram1, "u_mTrans");
    GPUprogram1.u_boja = gl.getUniformLocation(GPUprogram1, "u_boja");

    var matrix = new MT2D();
    matrix.projekcija2D(-10, 10, -10, 10);
    var vrhovi = [];
    for (let i = 0; i < Math.PI * 2; i += Math.PI / 100) {
        vrhovi.push(Math.cos(i) * 0.9, Math.sin(i) * 0.2);
        vrhovi.push(Math.cos(i + Math.PI / 100) * 0.9, Math.sin(i + Math.PI / 100) * 0.2);
    }


    function initBuffers() {
        spremnikVrhova = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, spremnikVrhova);
        GPUprogram1.a_vrhXY = gl.getAttribLocation(GPUprogram1, "a_vrhXY");
        gl.enableVertexAttribArray(GPUprogram1.a_vrhXY);
        gl.vertexAttribPointer(GPUprogram1.a_vrhXY, 2, gl.FLOAT, false, 0, 0);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vrhovi), gl.STATIC_DRAW);
    }

    function color(r, g, b) { return [r, g, b, 1.0]; }
    function col(r, g, b) { return gl.uniform4fv(GPUprogram1.u_boja, color(r, g, b)); }

    function render() {

        gl.clearColor(0.4, 0.4, 0.4, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.viewport(0, 0, platno1.width, platno1.height);

        col(1.0, 0.0, 0.0);
        matrix.identitet();
        matrix.projekcija2D(-2, 2, -2, 2);
        matrix.pomakni(-0.9, -0.3);
        gl.uniformMatrix3fv(GPUprogram1.u_mTrans, false, matrix.lista());
        gl.drawArrays(gl.TRIANGLE_FAN, 0, vrhovi.length / 2);

        col(1.0, 1.0, 0.0);
        matrix.identitet();
        matrix.projekcija2D(-2, 2, -2, 2);
        matrix.pomakni(0.9, 0.3);
        gl.uniformMatrix3fv(GPUprogram1.u_mTrans, false, matrix.lista());
        gl.drawArrays(gl.TRIANGLE_FAN, 0, vrhovi.length / 2);

        col(0.0, 1.0, 0.0);
        matrix.identitet();
        matrix.projekcija2D(-2, 2, -2, 2);
        matrix.rotiraj(-30);
        gl.uniformMatrix3fv(GPUprogram1.u_mTrans, false, matrix.lista());
        gl.drawArrays(gl.TRIANGLE_FAN, 0, vrhovi.length / 2);

    }

    initBuffers();
    render();
}