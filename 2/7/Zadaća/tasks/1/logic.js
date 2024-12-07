window.onload = WebGLaplikacija;

/*

    Kombiniranjem odgovarajućih geometrijskih transformacija nacrtajte sljedeće elipse:
    
     - Poluosi a = 6, b = 3, velika os elipse je pod kutem od -30° prema osi x, a središte je u točki (4, 0) (nacrtajte crvenom bojom);
    
     - Isto kao i gore, ali promijenite poredak transformacija: prvo pomaknite, pa rotirajte (nacrtajte plavom bojom);
    
     - Poluosi a = 4, b = 1, elipsa je najprije zarotirana za 75°, potom pomaknuta za 3 u desno, te zrcaljena na osi y (zelena boja)

*/

const a1 = 6, b1 = 3;
const a2 = 4, b2 = 1;

const size = 10;

function WebGLaplikacija() {

    var platno1 = document.getElementById("slika1");
    gl = platno1.getContext("webgl2");
    if (!gl) alert("WebGL2 nije dostupan!");

    GPUprogram1 = pripremiGPUprogram(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(GPUprogram1);

    GPUprogram1.u_mTrans = gl.getUniformLocation(GPUprogram1, "u_mTrans");
    GPUprogram1.u_boja = gl.getUniformLocation(GPUprogram1, "u_boja");

    var matrix = new MT2D();
    matrix.projekcija2D(-size, size, -size, size);

    function ellipse(a, b) {
        var vrhovi = [];
        for (let i = 0; i < Math.PI * 2; i += Math.PI / 100) {
            vrhovi.push(Math.cos(i) * a, Math.sin(i) * b);
            vrhovi.push(Math.cos(i + Math.PI / 100) * a, Math.sin(i + Math.PI / 100) * b);
        }
        return vrhovi;
    }


    function initBuffers() {
        spremnikVrhova = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, spremnikVrhova);
        GPUprogram1.a_vrhXY = gl.getAttribLocation(GPUprogram1, "a_vrhXY");
        gl.enableVertexAttribArray(GPUprogram1.a_vrhXY);
        gl.vertexAttribPointer(GPUprogram1.a_vrhXY, 2, gl.FLOAT, false, 0, 0);
    }

    function fillBuffer(a, b) {
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ellipse(a, b)), gl.STATIC_DRAW);
    }

    function color(r, g, b) { return [r, g, b, 1.0]; }
    function col(r, g, b) { return gl.uniform4fv(GPUprogram1.u_boja, color(r, g, b)); }

    function render() {

        gl.clearColor(0.4, 0.4, 0.4, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.viewport(0, 0, platno1.width, platno1.height);

        fillBuffer(a1, b1);

        resetMatrix();
        matrix.pomakni(4, 0);
        matrix.rotiraj(-30);
        col(1.0, 0.0, 0.0);
        gl.uniformMatrix3fv(GPUprogram1.u_mTrans, false, matrix.lista());
        gl.drawArrays(gl.TRIANGLE_FAN, 0, ellipse(a1, b1).length / 2);

        fillBuffer(a1, b1);

        resetMatrix();
        matrix.rotiraj(-30);
        matrix.pomakni(4, 0);
        col(0.0, 0.0, 1.0);
        gl.uniformMatrix3fv(GPUprogram1.u_mTrans, false, matrix.lista());
        gl.drawArrays(gl.TRIANGLE_FAN, 0, ellipse(a1, b1).length / 2);

        fillBuffer(a2, b2);

        resetMatrix();
        matrix.zrcaliNaY();
        matrix.pomakni(3, 0);
        matrix.rotiraj(75);
        col(0.0, 1.0, 0.0);
        gl.uniformMatrix3fv(GPUprogram1.u_mTrans, false, matrix.lista());
        gl.drawArrays(gl.TRIANGLE_FAN, 0, ellipse(a2, b2).length / 2);

    }

    function resetMatrix() {
        matrix.identitet();
        matrix.projekcija2D(-size, size, -size, size);
    }

    initBuffers();
    render();
}