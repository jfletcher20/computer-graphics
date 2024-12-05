window.onload = WebGLaplikacija;

const r = 1, a = 3, b = r;
const petalCount = 8;
const size = (r + a * 2) * 1.1;

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
        var vertices = [];
        for (let i = 0; i < Math.PI * 2; i += Math.PI / 100) {
            vertices.push(Math.cos(i) * a, Math.sin(i) * b);
            vertices.push(Math.cos(i + Math.PI / 100) * a, Math.sin(i + Math.PI / 100) * b);
        }
        return vertices;
    }

    function circle(r) { return ellipse(r, r); }

    function initBuffers() {
        spremnikVrhova = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, spremnikVrhova);
        GPUprogram1.a_vrhXY = gl.getAttribLocation(GPUprogram1, "a_vrhXY");
        gl.enableVertexAttribArray(GPUprogram1.a_vrhXY);
        gl.vertexAttribPointer(GPUprogram1.a_vrhXY, 2, gl.FLOAT, false, 0, 0);
    }

    function fillBuffer(vertices) {
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    }

    function color(r, g, b) { return [r, g, b, 1.0]; }
    function col(r, g, b) { return gl.uniform4fv(GPUprogram1.u_boja, color(r, g, b)); }

    function setPetalColor() { col(1, 1, 0); }
    function setDiscColor() { col(255 / 255, 102 / 255, 178 / 255); }

    function render() {

        gl.clearColor(102 / 255, 178 / 255, 255 / 255, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.viewport(0, 0, platno1.width, platno1.height);

        fillBuffer(ellipse(a, b));
        setPetalColor();

        for (let i = 0; i < petalCount; i++) {
            matrix.identitet();
            matrix.projekcija2D(-size, size, -size, size);
            matrix.rotiraj(360 / petalCount * i);
            matrix.pomakni(a + r, 0);
            gl.uniformMatrix3fv(GPUprogram1.u_mTrans, false, matrix.lista());
            gl.drawArrays(gl.TRIANGLE_FAN, 0, ellipse(a, b).length / 2);
        }

        fillBuffer(circle(r));
        setDiscColor();

        matrix.identitet();
        matrix.projekcija2D(-size, size, -size, size);
        gl.uniformMatrix3fv(GPUprogram1.u_mTrans, false, matrix.lista());
        gl.drawArrays(gl.TRIANGLE_FAN, 0, circle(r).length / 2);

    }

    initBuffers();
    render();

}