/// Class to draw a 3D object from Shapes.js using WebGL and mt3d.js
/// The parameter will take in the gl context and the object {vertices, indices, drawFunction(gl, n)} and, if indices is not null, initialize buffers using it and draw with indices, otherwise draw with vertices only

class Draw3DObject {
    n = 128;
    constructor(gl, GPUprogram1, object = { vertices: [], indices: undefined, drawFunction: null }) {
        this.gl = gl;
        this.GPUprogram1 = GPUprogram1;
        this.vertices = object.vertices;
        this.indices = object.indices;
        this.drawFunction = object.drawFunction;
        this.vertexBuffer = gl.createBuffer();
        this.vertexArray = gl.createVertexArray();
        if (this.indices !== null && this.indices !== undefined) this.indexBuffer = gl.createBuffer();
        // setTimeout(() => this.initBuffers());
        this.initBuffers();
    }

    initBuffers() {
        this.initIndicesArray();
        this.initVerticesArray();
    }

    initVerticesArray() {
        const gl = this.gl;
        gl.bindVertexArray(this.vertexArray);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.enableVertexAttribArray(this.GPUprogram1.a_vrhXYZ);
        gl.enableVertexAttribArray(this.GPUprogram1.a_normala);
        gl.vertexAttribPointer(this.GPUprogram1.a_vrhXYZ, 3, gl.FLOAT, false, 24, 0);
        gl.vertexAttribPointer(this.GPUprogram1.a_normala, 3, gl.FLOAT, false, 24, 12);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }

    initIndicesArray() {
        if (this.indices !== null && this.indices !== undefined && this.indices.length > 0) {
            const gl = this.gl;
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        }
    }

    additionalBufferLoad() {
        // this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertices), this.gl.STATIC_DRAW);
        // this
    }

    draw(matrix = new MT3D()) {
        this.initVerticesArray();
        gl.uniformMatrix4fv(GPUprogram1.u_mTrans, false, matrix.lista())
        this.drawFunction(this.gl, this.n);
    }
}