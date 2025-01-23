/// Class to draw a 3D object from Shapes.js using WebGL and mt3d.js
/// The parameter will take in the gl context and the object {vertices, indices, drawFunction(gl, n)} and, if indices is not null, initialize buffers using it and draw with indices, otherwise draw with vertices only

class Draw3DObject {
    n = 128;
    constructor(gl, object = { vertices: [], indices: null, drawFunction: null }) {
        this.gl = gl;
        this.vertices = object.vertices;
        this.indices = object.indices;
        this.drawFunction = object.drawFunction;
        this.initBuffers();
    }

    initBuffers() {
        const gl = this.gl;
        this.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
        if (this.indices) {
            this.indexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);
        }
    }

    draw() {
        const gl = this.gl;
        this.drawFunction(gl, n);
    }
}