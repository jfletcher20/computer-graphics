class Shapes {
    static cylinder(r, h, n, withIndices = false) {
        var vertices = [];
        vertices.push(0, 0, -h / 2, 0, 0, -1);
        let phi = 2 * Math.PI / n;
        for (let i = 0; i <= n; i++) {
            vertices.push(r * Math.cos(phi), r * Math.sin(phi), -h / 2, 0, 0, -1);
            phi += 2 * Math.PI / n;
        }
        vertices.push(0, 0, h / 2, 0, 0, 1);
        phi = 2 * Math.PI;
        for (let i = 0; i <= n; i++) {
            vertices.push(r * Math.cos(phi), r * Math.sin(phi), h / 2, 0, 0, 1);
            phi -= 2 * Math.PI / n;
        }
        phi = 0;
        for (let i = 0; i <= n; i++) {
            let c = Math.cos(phi);
            let s = Math.sin(phi);
            let x = r * c;
            let y = r * s;
            vertices.push(x, y, -h / 2, c, s, 0);
            vertices.push(x, y, h / 2, c, s, 0);
            phi += 2 * Math.PI / n;
        }
        if (withIndices) {
            var indices = [];
            // for (var i = 0; i <= n; i++) indices.push(i);
            // indices.push(0);
            // indices.push(n + 1);
            // for (var i = 1; i <= n; i++) indices.push(n + 1 - i);
            // indices.push(n);
            // for (var i = 0; i < n; i++) {
            //     indices.push(i, i + n + 2);
            // }
            // indices.push(0, n + 2);
            return { vertices: vertices, indices: indices, drawFunction: this.drawCylinder };
        }
        return vertices;
    }

    static drawCylinder(gl, n) {
        gl.drawArrays(gl.TRIANGLE_FAN, 0, n + 2);
        gl.drawArrays(gl.TRIANGLE_FAN, n + 2, n + 2);
        gl.drawArrays(gl.TRIANGLE_STRIP, 2 * (n + 2), 2 * n + 2);
    }

    /// Draw cone
    static cone(r, h, n, withIndices = true) {
        var vertices = [];
        vertices.push(0, 0, -h / 2, 0, 0, -1);
        let phi = 2 * Math.PI / n;
        for (let i = 0; i <= n; i++) {
            vertices.push(r * Math.cos(phi), r * Math.sin(phi), -h / 2, 0, 0, -1);
            phi += 2 * Math.PI / n;
        }
        vertices.push(0, 0, h / 2, 0, 0, 1);
        return vertices;
    }

    static drawCone(gl, n) {
        gl.drawArrays(gl.TRIANGLE_FAN, 0, n + 2);
        gl.drawArrays(gl.TRIANGLE_FAN, n + 2, 2);
        gl.drawArrays(gl.TRIANGLE_STRIP, n + 4, 2 * n);
    }

    static sphere(r, n) {

        var vertices = [], indices = [n * n];
        for (let i = 0; i <= n; i++) {
            let theta = i * Math.PI / n;
            let sinTheta = Math.sin(theta), cosTheta = Math.cos(theta);
            for (let j = 0; j <= n; j++) {
                let phi = j * 2 * Math.PI / n, sinPhi = Math.sin(phi), cosPhi = Math.cos(phi);
                let x = r * cosPhi * sinTheta;
                let y = r * sinPhi * sinTheta;
                let z = r * cosTheta;
                let nx = cosPhi * sinTheta, ny = sinPhi * sinTheta, nz = cosTheta;
                vertices.push(x, y, z, nx, ny, nz);
            }
        }
        vertices.push(0, 0, r, 0, 0, 1);

        for (var i = 0; i < n; i++) indices.push(i);
        indices.push(0);
        indices.push(n * n + 1);
        for (var i = 1; i <= n; i++) indices.push(n * n - i);
        indices.push(n * n - 1);
        for (var i = 1; i < n; i++) {
            for (var j = 0; j < n; j++) indices.push((i - 1) * n + j, i * n + j);
            indices.push((i - 1) * n, i * n);
        }

        return { vertices: vertices, indices: indices, drawFunction: this.drawSphere };
    }

    static drawSphere(gl, n) {
        gl.drawElements(gl.TRIANGLE_FAN, n + 2, gl.UNSIGNED_SHORT, 0);
        gl.drawElements(gl.TRIANGLE_FAN, n + 2, gl.UNSIGNED_SHORT, (n + 2) * 2);
        gl.drawElements(gl.TRIANGLE_STRIP, (2 * n + 2) * (n - 1), gl.UNSIGNED_SHORT, 4 * n + 8);
    }

    static solid_hemisphere(r, n) {
        var vertices = [], indices = [n * n];
        for (let i = 0; i <= n; i++) {
            let theta = i * Math.PI / n;
            let sinTheta = Math.sin(theta);
            let cosTheta = Math.cos(theta);

            for (let j = 0; j <= n; j++) {
                let phi = j * 1 * Math.PI / n;
                let sinPhi = Math.sin(phi);
                let cosPhi = Math.cos(phi);

                let x = r * cosPhi * sinTheta;
                let y = r * sinPhi * sinTheta;
                let z = r * cosTheta;
                let nx = cosPhi * sinTheta;
                let ny = sinPhi * sinTheta;
                let nz = cosTheta;

                vertices.push(x, y, z, nx, ny, nz);
            }
        }
        vertices.push(0, 0, r, 0, 0, 1);

        let m = n, p = n;
        for (var i = 0; i < m; i++) indices.push(i);
        indices.push(0);

        indices.push(p * m + 1);
        for (var i = 1; i <= m; i++) indices.push(p * m - i);
        indices.push(p * m - 1);

        for (var i = 1; i < p; i++) {
            for (var j = 0; j < m; j++) {
                indices.push((i - 1) * m + j, i * m + j);
            }
            indices.push((i - 1) * m, i * m);
        }

        return { vertices: vertices, indices: indices, drawFunction: this.drawSphere };

    }

}