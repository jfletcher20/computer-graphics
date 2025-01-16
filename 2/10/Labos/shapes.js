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

    /// Draw hollow cylinder, such that the cylinder is given 2 radii, the outer radius and the inner raidus
    // where the inner radius is the radius of the hole in the cylinder
    // and the outer radius is the radius of the cylinder itself
    // both radii should be surrounded by the same number of vertices (mantle)
    static hollow_cylinder(outerR, innerR, h, n) {
        var vertices = [];
        let phi = 2 * Math.PI / n;
        // construcct the base of the cylinder as a circle with radius outerR and inner radius innerR
        for (let i = 0; i <= n; i++) {
            vertices.push(outerR * Math.cos(phi), outerR * Math.sin(phi), -h / 2, 0, 0, -1);
            vertices.push(innerR * Math.cos(phi), innerR * Math.sin(phi), -h / 2, 0, 0, -1);
            phi += 2 * Math.PI / n;
        }
        // construct the top of the cylinder
        phi = 2 * Math.PI;
        for (let i = 0; i <= n; i++) {
            vertices.push(outerR * Math.cos(phi), outerR * Math.sin(phi), h / 2, 0, 0, 1);
            vertices.push(innerR * Math.cos(phi), innerR * Math.sin(phi), h / 2, 0, 0, 1);
            phi -= 2 * Math.PI / n;
        }

        // construct the outer mantle of the cylinder
        phi = 0;
        for (let i = 0; i <= n; i++) {
            let c = Math.cos(phi);
            let s = Math.sin(phi);
            let x = outerR * c;
            let y = outerR * s;
            vertices.push(x, y, -h / 2, c, s, 0);
            vertices.push(x, y, h / 2, c, s, 0);
            phi += 2 * Math.PI / n;
        }

        // construct the inner mantle of the cylinder

        phi = 0;
        for (let i = 0; i <= n; i++) {
            let c = Math.cos(phi);
            let s = Math.sin(phi);
            let x = innerR * c;
            let y = innerR * s;
            vertices.push(x, y, -h / 2, -c, -s, 0);
            vertices.push(x, y, h / 2, -c, -s, 0);
            phi += 2 * Math.PI / n;
        }

        return { vertices: vertices, indices: undefined, drawFunction: this.drawHollowCylinder };
    }

    static drawHollowCylinder(gl, n) {
        // draw the bottom of the cylinder
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 2 * (n + 1));
        // draw the top of the cylinder
        gl.drawArrays(gl.TRIANGLE_STRIP, 2 * (n + 1), 2 * (n + 1));
        // draw the outer mantle of the cylinder
        gl.drawArrays(gl.TRIANGLE_STRIP, 4 * (n + 1), 2 * n + 2);
        // draw the inner mantle of the cylinder
        gl.drawArrays(gl.TRIANGLE_STRIP, 4 * (n + 1) + 2 * (n + 1), 2 * n + 2);
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
            vertices.push(y, x, h / 2, s, c, 0);
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

    static hollow_hemisphere(r, n, startAngle = 0, endAngle = Math.PI * 1.5) {
        let vertices = [];
        let indices = [];
        for (let i = 0; i <= n; i++) {
            const theta = i * Math.PI / n;
            const sinTheta = Math.sin(theta);
            const cosTheta = Math.cos(theta);

            for (let j = 0; j <= n; j++) {
                const phi = startAngle + j * (endAngle - startAngle) / n;
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
        const indexCount = n * n * 6;
        gl.drawElements(gl.TRIANGLES, indexCount, gl.UNSIGNED_SHORT, 0);
    }

    static cube(a) {
        a /= 2;
        const vertices = [
            // front
            -a, -a, a, 0, 0, 1,
            a, -a, a, 0, 0, 1,
            a, a, a, 0, 0, 1,
            a, a, a, 0, 0, 1,
            -a, a, a, 0, 0, 1,
            -a, -a, a, 0, 0, 1,
            // right
            a, -a, a, 1, 0, 0,
            a, -a, -a, 1, 0, 0,
            a, a, -a, 1, 0, 0,
            a, a, -a, 1, 0, 0,
            a, a, a, 1, 0, 0,
            a, -a, a, 1, 0, 0,
            // back
            -a, -a, -a, 0, 0, -1,
            -a, a, -a, 0, 0, -1,
            a, a, -a, 0, 0, -1,
            a, a, -a, 0, 0, -1,
            a, -a, -a, 0, 0, -1,
            -a, -a, -a, 0, 0, -1,
            // left
            -a, -a, a, -1, 0, 0,
            -a, a, a, -1, 0, 0,
            -a, a, -a, -1, 0, 0,
            -a, a, -a, -1, 0, 0,
            -a, -a, -a, -1, 0, 0,
            -a, -a, a, -1, 0, 0,
            // top
            -a, a, a, 0, 1, 0,
            a, a, a, 0, 1, 0,
            a, a, -a, 0, 1, 0,
            a, a, -a,   0, 1, 0,
            -a, a, -a, 0, 1, 0,
            -a, a, a, 0, 1, 0,
            // bottom
            -a, -a, a, 0, -1, 0,
            -a, -a, -a, 0, -1, 0,
            a, -a, -a, 0, -1, 0,
            a, -a, -a, 0, -1, 0,
            a, -a, a, 0, -1, 0,
            -a, -a, a, 0, -1, 0
        ];
        const indices = [
            0, 1, 2, 3, 4, 5,
            6, 7, 8, 9, 10, 11,
            12, 13, 14, 15, 16, 17,
            18, 19, 20, 21, 22, 23,
            24, 25, 26, 27, 28, 29,
            30, 31, 32, 33, 34, 35
        ];
        return { vertices: vertices.flat(), indices: indices, drawFunction: this.drawCube };
    }

    static drawCube(gl, n) {
        const indexCount = 36;
        gl.drawElements(gl.TRIANGLES, indexCount, gl.UNSIGNED_SHORT, 0);
    }

    /// torus
    static torus(R, r, n, m) {
        var vertices = [];
        for (let i = 0; i <= n; i++) {
            let phi = i * 2 * Math.PI / n;
            let cosPhi = Math.cos(phi), sinPhi = Math.sin(phi);
            for (let j = 0; j <= m; j++) {
                let theta = j * 2 * Math.PI / m;
                let cosTheta = Math.cos(theta), sinTheta = Math.sin(theta);
                let x = (R + r * cosTheta) * cosPhi;
                let y = (R + r * cosTheta) * sinPhi;
                let z = r * sinTheta;
                let nx = cosTheta * cosPhi;
                let ny = cosTheta * sinPhi;
                let nz = sinTheta;
                vertices.push(x, y, z, nx, ny, nz);
            }
        }
        var indices = [];
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < m; j++) {
                let idx = i * (m + 1) + j;
                let nextRow = idx + (m + 1);
                indices.push(idx, nextRow, idx + 1);
                indices.push(idx + 1, nextRow, nextRow + 1);
            }
        }
        return { vertices: vertices, indices: indices, drawFunction: this.drawTorus };
    }

    static drawTorus(gl, n) {
        let m = n;
        gl.drawElements(gl.TRIANGLES, n * m * 6, gl.UNSIGNED_SHORT, 0);
    }


    /// rect-cube (cube with different dimensions: a, b, c)
    static cuboid(a, b, c) {
        a /= 2;
        b /= 2;
        c /= 2;
        const vertices = [
            // front
            -a, -b, c, 0, 0, 1,
            a, -b, c, 0, 0, 1,
            a, b, c, 0, 0, 1,
            a, b, c, 0, 0, 1,
            -a, b, c, 0, 0, 1,
            -a, -b, c, 0, 0, 1,
            // right
            a, -b, c, 1, 0, 0,
            a, -b, -c, 1, 0, 0,
            a, b, -c, 1, 0, 0,
            a, b, -c, 1, 0, 0,
            a, b, c, 1, 0, 0,
            a, -b, c, 1, 0, 0,
            // back
            -a, -b, -c, 0, 0, -1,
            -a, b, -c, 0, 0, -1,
            a, b, -c, 0, 0, -1,
            a, b, -c, 0, 0, -1,
            a, -b, -c, 0, 0, -1,
            -a, -b, -c, 0, 0, -1,
            // left
            -a, -b, c, -1, 0, 0,
            -a, b, c, -1, 0, 0,
            -a, b, -c, -1, 0, 0,
            -a, b, -c, -1, 0, 0,
            -a, -b, -c, -1, 0, 0,
            -a, -b, c, -1, 0, 0,
            // top
            -a, b, c, 0, 1, 0,
            a, b, c, 0, 1, 0,
            a, b, -c, 0, 1, 0,
            a, b, -c, 0, 1, 0,
            -a, b, -c, 0, 1, 0,
            -a, b, c, 0, 1, 0,
            // bottom
            -a, -b, c, 0, -1, 0,
            -a, -b, -c, 0, -1, 0,
            a, -b, -c, 0, -1, 0,
            a, -b, -c, 0, -1, 0,
            a, -b, c, 0, -1, 0,
            -a, -b, c, 0, -1, 0
        ];
        const indices = [
            0, 1, 2, 3, 4, 5,
            6, 7, 8, 9, 10, 11,
            12, 13, 14, 15, 16, 17,
            18, 19, 20, 21, 22, 23,
            24, 25, 26, 27, 28, 29,
            30, 31, 32, 33, 34, 35
        ];
        return { vertices: vertices.flat(), indices: indices, drawFunction: this.drawCube };
    }

}