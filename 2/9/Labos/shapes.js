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
            vertices.push(r * Math.cos(phi), r * Math.sin(phi), h / 2, Math.cos(phi), Math.sin(phi), 0);
            phi += 2 * Math.PI / n;
        }
        for (let i = 0; i <= n; i++) {
            let c = Math.cos(phi);
            let s = Math.sin(phi);
            let x = r * c;
            let y = r * s;
            vertices.push(y, x, h / 2, c, s, 0);
            phi += 2 * Math.PI / n;
        }
        vertices.push(0, 0, h / 2, Math.cos(0), Math.sin(0), 0);
        return { vertices: vertices, indices: undefined, drawFunction: this.drawCone };
    }

    static drawCone(gl, n) {
        gl.drawArrays(gl.TRIANGLE_FAN, 0, n + 2);
        gl.drawArrays(gl.TRIANGLE_FAN, n + 2, n + 2);
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

    static hollow_hemisphere(r, n, startAngle = 0, endAngle = Math.PI * 1.5) {
        // You can tweak endAngle to get more or less than a "quarter" cutout.
        // For a full hemisphere, you might typically use 0..π for θ and 0..2π for φ
        
        let vertices = [];
        let indices = [];
    
        // Generate vertices (skipping the pole vertex)
        for (let i = 0; i <= n; i++) {
            const theta = i * Math.PI / n;  // polar angle (0..π)
            const sinTheta = Math.sin(theta);
            const cosTheta = Math.cos(theta);
    
            for (let j = 0; j <= n; j++) {
                const phi = startAngle + j * (endAngle - startAngle) / n; // partial azimuth
                const sinPhi = Math.sin(phi);
                const cosPhi = Math.cos(phi);
    
                const x = r * cosPhi * sinTheta;
                const y = r * sinPhi * sinTheta;
                const z = r * cosTheta;
                const nx = cosPhi * sinTheta;
                const ny = sinPhi * sinTheta;
                const nz = cosTheta;
    
                vertices.push(x, y, z, nx, ny, nz);
            }
        }
    
        // Generate indices (simple “strip” style)
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                const idx = i * (n + 1) + j;
                const nextRow = idx + (n + 1);
                indices.push(idx, nextRow, idx + 1);
                indices.push(idx + 1, nextRow, nextRow + 1);
            }
        }
    
        return { vertices: vertices, indices: indices, drawFunction: this.drawHollowHemisphere };
    }
    
    static drawHollowHemisphere(gl, n) {
        // calculate indexCount based on n
        const indexCount = n * n * 6;
        gl.drawElements(gl.TRIANGLES, indexCount, gl.UNSIGNED_SHORT, 0);
    }

}