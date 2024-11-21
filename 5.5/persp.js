class Persp {

    stozac(r, h, n, smooth = false) {
        if (smooth) {
            for (let i = 0; i <= r; i += r / n) this.krug(i);
            this.postaviNa(0, 0, h);
            for (let i = 0; i <= 2 * Math.PI; i += 2 * Math.PI / n) {
                this.linijaDo(r * Math.cos(i), r * Math.sin(i), 0);
                this.povuciLiniju();
                this.postaviNa(0, 0, h);
            }
        } else {
            const currentColor = this.renderer.strokeStyle;
            for (let i = 0; i < n; i++) {
                if (i > n / 2 && i < n) this.postaviBoju("blue");
                this.postaviNa(r * Math.cos(2 * Math.PI / n * i), r * Math.sin(2 * Math.PI / n * i), 0);
                this.linijaDo(r * Math.cos(2 * Math.PI / n * (i + 1)), r * Math.sin(2 * Math.PI / n * (i + 1)), 0);
                this.linijaDo(0, 0, h);
                this.linijaDo(r * Math.cos(2 * Math.PI / n * i), r * Math.sin(2 * Math.PI / n * i), 0);
                this.povuciLiniju();
            }
            this.postaviBoju(currentColor);
        }
    }

    valjak(r, h, n) {
        for (let i = 0; i < n; i++) {
            this.postaviNa(r * Math.cos(2 * Math.PI / n * i), r * Math.sin(2 * Math.PI / n * i), 0);
            this.linijaDo(r * Math.cos(2 * Math.PI / n * (i + 1)), r * Math.sin(2 * Math.PI / n * (i + 1)), 0);
            this.linijaDo(r * Math.cos(2 * Math.PI / n * (i + 1)), r * Math.sin(2 * Math.PI / n * (i + 1)), h);
            this.linijaDo(r * Math.cos(2 * Math.PI / n * i), r * Math.sin(2 * Math.PI / n * i), h);
            this.linijaDo(r * Math.cos(2 * Math.PI / n * i), r * Math.sin(2 * Math.PI / n * i), 0);
            this.povuciLiniju();
        }
    }

    valjak2(r, h, n, divisions) {
        for (let i = 0; i < n; i++) {
            this.postaviNa(r * Math.cos(2 * Math.PI / n * i), r * Math.sin(2 * Math.PI / n * i), 0);
            this.linijaDo(r * Math.cos(2 * Math.PI / n * (i + 1)), r * Math.sin(2 * Math.PI / n * (i + 1)), 0);
            this.linijaDo(r * Math.cos(2 * Math.PI / n * (i + 1)), r * Math.sin(2 * Math.PI / n * (i + 1)), h);
            this.linijaDo(r * Math.cos(2 * Math.PI / n * i), r * Math.sin(2 * Math.PI / n * i), h);
            this.linijaDo(r * Math.cos(2 * Math.PI / n * i), r * Math.sin(2 * Math.PI / n * i), 0);
            this.povuciLiniju();
        }
        for (let i = 1; i < divisions; i++) {
            for (let j = 0; j < n; j++) {
                this.postaviNa(r * Math.cos(2 * Math.PI / n * j), r * Math.sin(2 * Math.PI / n * j), h / divisions * i);
                this.linijaDo(r * Math.cos(2 * Math.PI / n * (j + 1)), r * Math.sin(2 * Math.PI / n * (j + 1)), h / divisions * i);
                this.povuciLiniju();
            }
        }
    }

    polukugla2(r, m, n) {

        const currentColor = this.renderer.strokeStyle;

        const meridianStep = Math.PI / m;
        const parallelStep = Math.PI / (n + 1);

        function _r(val) { return val * r; }

        function cos(φ) {
            return Math.cos(φ);
        }
        function sin(φ) {
            return Math.sin(φ);
        }

        const step = 0.01, Πo2 = Math.PI / 2;
        this.postaviBoju("green");
        for (let i = /*0*/-Πo2; i < Πo2 + meridianStep; i += meridianStep) {
            this.postaviNa(_r(cos(i) * sin(-Πo2)), _r(sin(i) * sin(-Πo2)), _r(cos(-Πo2)));
            for (let j = /*meridianStep*/-Πo2; j <= Πo2; j += step) {
                this.linijaDo(_r(cos(i) * sin(j)), _r(sin(i) * sin(j)), _r(cos(j)));
            }
            this.povuciLiniju();
        }

        this.postaviBoju("red")
        for (let i = /*parallelStep*/-Πo2; i < Πo2 + parallelStep; i += parallelStep) {
            this.postaviNa(_r(cos(-Πo2) * sin(i)), _r(sin(-Πo2) * sin(i)), _r(cos(i)));
            for (let j = /*step*/-Πo2; j <= Πo2; j += step)
                this.linijaDo(_r(cos(j) * sin(i)), _r(sin(j) * sin(i)), _r(cos(i)));
            if (i > Πo2 / 2) this.postaviBoju("blue");
            this.povuciLiniju();
        }

        this.postaviBoju(currentColor);

    }

    kapsula(r, h, n) {
        this.m.pomakni(0, 0, r);
        this.valjak(r, h - 2 * r, n);
        n /= 2;
        this.m.rotirajX(90);
        this.m.pomakni(0, h - 2 * r, 0);
        this.polukugla(r, n, n);
        this.m.rotirajX(180);
        this.m.pomakni(0, h - 2 * r, 0);
        this.polukugla(r, n, n);
        this.postaviNa(0, 0, h - r);
        this.povuciLiniju();
    }

    kapsula2(r, h, n, divisions) {
        this.m.pomakni(0, 0, r);
        this.valjak2(r, h - 2 * r, n, divisions);
        n /= 2;
        this.m.rotirajX(180);
        this.polukugla2(r, n, divisions);
        this.m.rotirajX(-180);
        this.m.pomakni(0, 0, h - 2 * r);
        this.polukugla2(r, n, divisions);
        this.m.pomakni(0, 0, -(h - r));
    }

    trokut(a) {
        this.postaviNa(0, 0, 0);
        this.linijaDo(a, 0, 0);
        this.linijaDo(a / 2, a * Math.sqrt(3) / 2, 0);
        this.linijaDo(0, 0, 0);
        this.povuciLiniju();
    }

    kocka(a) {
        // should draw towards the x axis, only expanding towards there and not towards negative x

        this.postaviNa(0, a / 2, a / 2);
        this.linijaDo(a, a / 2, a / 2);
        this.linijaDo(a, -a / 2, a / 2);
        this.linijaDo(0, -a / 2, a / 2);
        this.linijaDo(0, a / 2, a / 2);
        this.povuciLiniju();

        this.postaviNa(0, a / 2, -a / 2);
        this.linijaDo(a, a / 2, -a / 2);
        this.linijaDo(a, -a / 2, -a / 2);
        this.linijaDo(0, -a / 2, -a / 2);
        this.linijaDo(0, a / 2, -a / 2);
        this.povuciLiniju();

        this.postaviNa(0, a / 2, a / 2);
        this.linijaDo(0, a / 2, -a / 2);
        this.povuciLiniju();

        this.postaviNa(a, a / 2, a / 2);
        this.linijaDo(a, a / 2, -a / 2);
        this.povuciLiniju();

        this.postaviNa(a, -a / 2, a / 2);
        this.linijaDo(a, -a / 2, -a / 2);
        this.povuciLiniju();

        this.postaviNa(0, -a / 2, a / 2);
        this.linijaDo(0, -a / 2, -a / 2);
        this.povuciLiniju();
    }

    koordinatneOsi(a = 1) {
        const currentColor = this.renderer.strokeStyle;

        this.postaviBoju("red");
        this.postaviNa(0, 0, 0);
        this.linijaDo(a, 0, 0);
        this.povuciLiniju();

        this.postaviBoju("green");
        this.postaviNa(0, 0, 0);
        this.linijaDo(0, a, 0);
        this.povuciLiniju();

        this.postaviBoju("blue");
        this.postaviNa(0, 0, 0);
        this.linijaDo(0, 0, a);
        this.povuciLiniju();

        this.postaviBoju(currentColor);
    }

    kugla(r, m, n) {

        const currentColor = this.renderer.strokeStyle;

        const meridianStep = 2 * Math.PI / m;
        const parallelStep = Math.PI / (n + 1);

        function _r(val) { return val * r; }

        function cos(φ) {
            return Math.cos(φ);
        }
        function sin(φ) {
            return Math.sin(φ);
        }

        const step = 0.01;
        this.postaviBoju("green");
        for (let i = 0; i < 2 * Math.PI; i += meridianStep) {
            this.postaviNa(0, 0, r);
            for (let j = meridianStep; j <= Math.PI; j += step)
                this.linijaDo(_r(cos(i) * sin(j)), _r(sin(i) * sin(j)), _r(cos(j)));
            this.povuciLiniju();
        }

        this.postaviBoju("red")
        for (let i = parallelStep; i < Math.PI; i += parallelStep) {
            this.postaviNa(_r(sin(i)), 0, _r(cos(i)));
            for (let j = step; j <= 2 * Math.PI; j += step)
                this.linijaDo(_r(cos(j) * sin(i)), _r(sin(j) * sin(i)), _r(cos(i)));
            if (i > Math.PI / 2) this.postaviBoju("blue");
            this.povuciLiniju();
        }

        this.postaviBoju(currentColor);

    }

    polukugla(r, m, n) {

        const currentColor = this.renderer.strokeStyle;

        const meridianStep = Math.PI / m;
        const parallelStep = Math.PI / (n + 1);

        function _r(val) { return val * r; }

        function cos(φ) {
            return Math.cos(φ);
        }
        function sin(φ) {
            return Math.sin(φ);
        }

        const step = 0.01;
        this.postaviBoju("green");
        for (let i = 0; i < Math.PI + meridianStep; i += meridianStep) {
            this.postaviNa(0, 0, r);
            for (let j = meridianStep; j <= Math.PI; j += step)
                this.linijaDo(_r(cos(i) * sin(j)), _r(sin(i) * sin(j)), _r(cos(j)));
            this.povuciLiniju();
        }

        this.postaviBoju("red")
        for (let i = parallelStep; i < Math.PI; i += parallelStep) {
            this.postaviNa(_r(sin(i)), 0, _r(cos(i)));
            for (let j = step; j <= Math.PI; j += step)
                this.linijaDo(_r(cos(j) * sin(i)), _r(sin(j) * sin(i)), _r(cos(i)));
            if (i > Math.PI / 2) this.postaviBoju("blue");
            this.povuciLiniju();
        }

        this.postaviBoju(currentColor);

    }


    #distance;
    m = new MT3D();
    last = { x: 0, y: 0, z: 0 };
    zoom = 51;

    constructor(platno, xmin, xmax, ymin, ymax, distance) {
        this.platno = platno;
        this.xmin = xmin;
        this.xmax = xmax;
        this.ymin = ymin;
        this.ymax = ymax;
        this.#distance = distance;
        this.initRenderer();
    }

    initRenderer() {
        this.renderer = this.platno.getContext("2d");
        this.xDefault = this.px = this.platno.width / 2;
        this.yDefault = this.py = this.platno.height / 2;

        const minUnit = Math.min(this.xmin, this.ymin);
        const maxUnit = Math.max(this.xmax, this.ymax);
        const maxCanvas = Math.max(this.xDefault, this.yDefault);

        this.sx = this.sy = maxCanvas / (maxUnit - minUnit);

        this.m = new MT3D();
        this.last = { x: 0, y: 0, z: 0 };
    }

    units(val, useXScalar = false, useYScalar = false) {
        if (useXScalar) return this.sx * val * this.zoom + this.px;
        if (useYScalar) return this.sy * val * this.zoom + this.py;
        return this.units(val, true);
    }

    unitsX(x) {
        return this.units(x, true);
    }

    unitsY(y) {
        return this.units(y, false, true);
    }

    trans(m) {
        this.m.matrica = m.mnoziMatrice(m.kamera, m.matrica);
    }

    #calcRow(x, y, z, row) {
        return this.m.matrica[row][0] * x
            + this.m.matrica[row][1] * y
            + this.m.matrica[row][2] * z
            + this.m.matrica[row][3];
    }

    #calcX(x, y, z) {
        return this.#calcRow(x, y, z, 0);
    }

    #calcY(x, y, z) {
        return this.#calcRow(x, y, z, 1);
    }

    #calcZ(x, y, z) {
        return this.#calcRow(x, y, z, 2);
    }

    postaviNa(x, y, z) {

        this.last.x = this.#calcX(x, y, z);
        this.last.y = this.#calcY(x, y, z);
        this.last.z = this.#calcZ(x, y, z);

        this.renderer.beginPath();
        this.renderer.moveTo(
            this.unitsX(-this.#distance / this.last.z * this.last.x),
            this.unitsY(-this.#distance / this.last.z * this.last.y)
        );

    }
    linijaDo(x, y, z) {

        this.last.x = this.#calcX(x, y, z);
        this.last.y = this.#calcY(x, y, z);
        this.last.z = this.#calcZ(x, y, z);

        this.renderer.lineTo(
            this.unitsX(-this.#distance / this.last.z * this.last.x),
            this.unitsY(-this.#distance / this.last.z * this.last.y)
        );

    }

    povuciLiniju() {
        this.renderer.stroke();
    }
    linijaDraw() {
        this.povuciLiniju();
    }

    postaviBoju(c) {
        this.renderer.strokeStyle = c;
    }


}