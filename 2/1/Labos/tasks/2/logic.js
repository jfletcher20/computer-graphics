window.onload = WebGLaplikacija;

function WebGLaplikacija() {

    var platno1 = document.getElementById("slika1");
    gl = platno1.getContext("webgl2");
    if (!gl) alert("WebGL2 nije dostupan!");

    GPUprogram1 = pripremiGPUprogram(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(GPUprogram1);

    GPUprogram1.u_mTrans = gl.getUniformLocation(GPUprogram1, "u_mTrans");
    GPUprogram1.u_boja = gl.getUniformLocation(GPUprogram1, "u_boja");

    var vrhovi = [0.0, 0.0, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.0, 0.0];

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
    function cos(φ) { return Math.cos(φ) }
    function sin(φ) { return Math.sin(φ) }
    function rot(φ) { return Math.PI * φ / 180; }

    function rotMatrix(φ) { return [cos(rot(φ)), sin(rot(φ)), -sin(rot(φ)), cos(rot(φ))]; }

    function render() {

        gl.clearColor(0.4, 0.4, 0.4, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.viewport(0, 0, platno1.width, platno1.height);

        
        col(1.0, 0.0, 0.0);
        gl.uniformMatrix2fv(GPUprogram1.u_mTrans, false, [1.0, 0.0, 0.0, 1.0]);
        gl.drawArrays(gl.TRIANGLES, 0, vrhovi.length / 2);
        
        φ = 30;
        col(1.0, 1.0, 0.0);
        gl.uniformMatrix2fv(GPUprogram1.u_mTrans, false, rotMatrix(φ));
        gl.drawArrays(gl.TRIANGLES, 0, vrhovi.length / 2);

        φ *= 2;
        col(0.0, 1.0, 0.0);
        gl.uniformMatrix2fv(GPUprogram1.u_mTrans, false, rotMatrix(φ));
        gl.drawArrays(gl.TRIANGLES, 0, vrhovi.length / 2);

    }

    initBuffers();
    render();
}