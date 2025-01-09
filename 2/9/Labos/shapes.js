class Shapes {
    static valjak(r, h, n) {
        var vrhovi = [];
        vrhovi.push(0, 0, -h / 2, 0, 0, -1);
        let phi = 2 * Math.PI / n;
        for (let i = 0; i <= n; i++) {
            vrhovi.push(r * Math.cos(phi), r * Math.sin(phi), -h / 2, 0, 0, -1);
            phi += 2 * Math.PI / n;
        }
        vrhovi.push(0, 0, h / 2, 0, 0, 1);
        phi = 2 * Math.PI;
        for (let i = 0; i <= n; i++) {
            vrhovi.push(r * Math.cos(phi), r * Math.sin(phi), h / 2, 0, 0, 1);
            phi -= 2 * Math.PI / n;
        }
        phi = 0;
        for (let i = 0; i <= n; i++) {
            let c = Math.cos(phi);
            let s = Math.sin(phi);
            let x = r * c;
            let y = r * s;
            vrhovi.push(x, y, -h / 2, c, s, 0);
            vrhovi.push(x, y, h / 2, c, s, 0);
            phi += 2 * Math.PI / n;
        }
        return vrhovi;
    }

    static kugla(r, n) {
        var vrhovi = [];
        for (let i = 0; i <= n; i++) {
            let theta = i * Math.PI / n;
            let sinTheta = Math.sin(theta);
            let cosTheta = Math.cos(theta);

            for (let j = 0; j <= n; j++) {
                let phi = j * 2 * Math.PI / n;
                let sinPhi = Math.sin(phi);
                let cosPhi = Math.cos(phi);

                let x = r * cosPhi * sinTheta;
                let y = r * sinPhi * sinTheta;
                let z = r * cosTheta;
                let nx = cosPhi * sinTheta;
                let ny = sinPhi * sinTheta;
                let nz = cosTheta;

                vrhovi.push(x, y, z, nx, ny, nz);
            }
        }

        var indices = [];
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                let first = (i * (n + 1)) + j;
                let second = first + n + 1;
                indices.push(first, second, first + 1);
                indices.push(second, second + 1, first + 1);
            }
        }

        return { vrhovi: vrhovi, indices: indices };
    }

    /// halphsphere
    static polukugla(r, n) {
        var vrhovi = [];
        for (let i = 0; i <= n; i++) {
            let theta = i * Math.PI / n;
            let sinTheta = Math.sin(theta);
            let cosTheta = Math.cos(theta);

            for (let j = 0; j <= n; j++) {
                let phi = j * 2 * Math.PI / n;
                let sinPhi = Math.sin(phi);
                let cosPhi = Math.cos(phi);

                let x = r * cosPhi * sinTheta;
                let y = r * sinPhi * sinTheta;
                let z = r * cosTheta;
                let nx = cosPhi * sinTheta;
                let ny = sinPhi * sinTheta;
                let nz = cosTheta;

                vrhovi.push(x, y, z, nx, ny, nz);
            }
        }

        var indices = [];
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                let first = (i * (n + 1)) + j;
                let second = first + n + 1;
                indices.push(first, second, first + 1);
                indices.push(second, second + 1, first + 1);
            }
        }

        return { vrhovi: vrhovi, indices: indices };
    }

}