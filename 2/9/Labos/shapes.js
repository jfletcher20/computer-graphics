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
            a, a, -a, 0, 1, 0,
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

    static pyramid(a, h, n = 3, heightIsPyramidEdge = false) {
        if (heightIsPyramidEdge) {
            const nbasehalf = a / 2;
            h = Math.sqrt(a * a - nbasehalf * nbasehalf);
        }

        const cross = (ax, ay, az, bx, by, bz) => [
            ay * bz - az * by,
            az * bx - ax * bz,
            ax * by - ay * bx
        ];
        const normalize = (vx, vy, vz) => {
            const len = Math.sqrt(vx * vx + vy * vy + vz * vz);
            return len > 1e-9 ? [vx / len, vy / len, vz / len] : [0, 0, 0];
        };

        const r = a / 2;
        const baseCorners = [];
        const dt = (2 * Math.PI) / n;
        for (let i = 0; i < n; i++) {
            const angle = i * dt;
            const x = r * Math.cos(angle);
            const y = r * Math.sin(angle);
            baseCorners.push([x, y, 0,
                cross(0, 0, -1, x, y, 0)[0], cross(0, 0, -1, x, y, 0)[1], cross(0, 0, -1, x, y, 0)[2]]);
        }
        const apex = [0, 0, h];
        const verts = [];
        if (n >= 3) {
            for (let i = 0; i < n - 2; i++) {
                const p0 = baseCorners[0];
                const p1 = baseCorners[i + 1];
                const p2 = baseCorners[i + 2];
                const ux = p1[0] - p0[0], uy = p1[1] - p0[1], uz = p1[2] - p0[2];
                const vx = p2[0] - p0[0], vy = p2[1] - p0[1], vz = p2[2] - p0[2];
                let [nx, ny, nz] = cross(ux, uy, uz, vx, vy, vz);
                [nx, ny, nz] = normalize(nx, ny, nz);

                verts.push(p0[0], p0[1], p0[2], nx, ny, nz);
                verts.push(p1[0], p1[1], p1[2], nx, ny, nz);
                verts.push(p2[0], p2[1], p2[2], nx, ny, nz);
            }
        }

        for (let i = 0; i < n; i++) {
            const p0 = apex;
            const p1 = baseCorners[i];
            const p2 = baseCorners[(i + 1) % n];
            const ux = p1[0] - p0[0], uy = p1[1] - p0[1], uz = p1[2] - p0[2];
            const vx = p2[0] - p0[0], vy = p2[1] - p0[1], vz = p2[2] - p0[2];
            let [nx, ny, nz] = cross(ux, uy, uz, vx, vy, vz);
            [nx, ny, nz] = normalize(nx, ny, nz);

            verts.push(p0[0], p0[1], p0[2], nx, ny, nz);
            verts.push(p1[0], p1[1], p1[2], nx, ny, nz);
            verts.push(p2[0], p2[1], p2[2], nx, ny, nz);
        }

        return {
            vertices: verts,
            indices: undefined,
            drawFunction: this.drawPyramid
        };
    }

    static drawPyramid(gl, n) {
        const triangleCount = (n >= 3) ? (2 * n - 2) : 0;
        const vertexCount = triangleCount * 3;
        gl.drawArrays(gl.TRIANGLES, 0, vertexCount);
    }

}