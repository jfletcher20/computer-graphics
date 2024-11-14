/*

    Primjer 3. – Persp klasa
    
    Implementirajte klasu Persp koja omogućuje perspektivno projiciranje i ima sljedeće metode.

        postaviNa(x, y, z) – postavlja početak linije na poziciju (x, y, z) u 3D globalnim koordinatama
    
        linijaDo(x, y, z) – povlači liniju od posljednje zapamćene pozicije do zadane pozicije (x, y, z) u 3D globalnim koordinatama
    
        trans(m) – zadaje se matrica transformacije iz klase MT3D koja se primjenjuje prije crtanja u globalnim koordinatama
    
        koristiBoju(c) – linija se crta bojom c
    
        povuciLiniju() – povlači liniju pozivom HTML5-rutine stroke()

    Treba malo modificirati već implementiranu Ortho klasu tako da dodamo još
    jedan (privatni) atribut distance u kojemu se čuva udaljenost kamere od
    ravnine na koju se projicira.

    Postojećim konstruktorima iz Ortho klase treba dodati još jednu varijablu za
    udaljenost kamere od ravnine na koju se projicira.
    trans metoda ostaje ista kao i u Ortho klasi.

    Metode postaviNa i linijaDo treba takoder malo modificirati. Kao u Ortho
    klasi, prije pretvaranja prirodnih koordinata u piksel koordinate, treba
    primijeniti matricu transformacije da se dobiju transformirane točke.
    
    Nakon toga se transformirane točke perspektivno projiciraju na dvodimenzionalnu
    ravninu (u ovom slučaju se z-koordinata ne zaboravlja, već se koristi za
    odredivanje koordinata projiciranih točaka).
    
    Nakon toga projicirane točke prevodimo u piksel koordinate.



    Treba dodati (privatni) atribut kamera u kojemu se čuva transformacija
    pogleda. U konstruktoru se taj atribut postavi na jediničnu matricu reda 4.
    To znači da je po defaultu kamera već u ishodištu i da gleda u negativnom smjeru z-osi.

    Treba implementirati metodu VP za računanje vektorskog produkta.

    Treba implementirati metodu mnoziMatrice za računanje produkta dvije matrice.

    Kod je sličan kao za mult metodu, samo na ulazu trebaju biti dva
    parametra (matrice koje zelimo pomnožiti u danom poretku).

    Treba implementirati metodu postaviKameru koja će generirati transformaciju pogleda.

    Treba modificirati metodu trans tako da uz matricu transformacije bude uključena
    i matrica pogleda, tj. da se uvijek nakon geometrijskih transformacija primijeni
    i transformacija pogleda.

*/

class Persp {

    #distance;
    lastPos = { x: 0, y: 0, z: 0 };

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
        this.lastPos = { x: 0, y: 0, z: 0 };
    }

    units(val, useXScalar = false, useYScalar = false) {
        return val * (useXScalar ? this.sx : useYScalar ? this.sy : this.sx) +
            useXScalar ? this.px : useYScalar ? this.py : this.px;
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
        this.renderer.beginPath();
        this.lastPos.x = this.#calcX(x, y, z);
        this.lastPos.y = this.#calcY(x, y, z);
        this.lastPos.z = this.#calcZ(x, y, z);
        this.renderer.moveTo(
            this.unitsX(-this.#distance / this.lastPos.z * this.lastPos.x),
            this.unitsY(-this.#distance / this.lastPos.z * this.lastPos.y)
        );
    }

    linijaDo(x, y, z) {

        var x1, y1, x2, y2;
        var xc = this.#calcX(x, y, z);
        var yc = this.#calcY(x, y, z);
        var zc = this.#calcZ(x, y, z);

        if ((this.lastPos.z <= -0.01) && (zc <= -0.01)) {
            this.lastPos.x = xc;
            this.lastPos.y = yc;
            this.lastPos.z = zc;

            x2 = this.unitsX(-this.#distance / this.lastPos.z * this.lastPos.x);
            y2 = this.unitsY(-this.#distance / this.lastPos.z * this.lastPos.y);

            this.renderer.lineTo(x2, y2);

        } else if ((this.lastPos.z > -0.01) && (zc > -0.01)) {
            this.lastPos.x = xc;
            this.lastPos.y = yc;
            this.lastPos.z = zc;

            x2 = this.unitsX(-this.#distance / this.lastPos.z * this.lastPos.x);
            y2 = this.unitsY(-this.#distance / this.lastPos.z * this.lastPos.y);

            this.renderer.moveTo(x2, y2);

        } else if (this.lastPos.z > -0.01) {
            var t = (this.lastPos.z + 0.01) / (this.lastPos.z - zc);
            this.lastPos.x = this.lastPos.x + (xc - this.lastPos.x) * t;
            this.lastPos.y = this.lastPos.y + (yc - this.lastPos.y) * t;
            this.lastPos.z = -0.01;

            x1 = this.unitsX(-this.#distance / this.lastPos.z * this.lastPos.x);
            y1 = this.unitsY(-this.#distance / this.lastPos.z * this.lastPos.y);

            this.lastPos.x = xc;
            this.lastPos.y = yc;
            this.lastPos.z = zc;

            x2 = this.unitsX(-this.#distance / this.lastPos.z * this.lastPos.x);
            y2 = this.unitsY(-this.#distance / this.lastPos.z * this.lastPos.y);

            this.renderer.moveTo(x1, y1);
            this.renderer.lineTo(x2, y2);

        } else if (zc > -0.01) {
            x1 = this.unitsX(-this.#distance / this.lastPos.z * this.lastPos.x);
            y1 = this.unitsY(-this.#distance / this.lastPos.z * this.lastPos.y);

            var t = (this.lastPos.z + 0.01) / (this.lastPos.z - zc);
            this.lastPos.x = this.lastPos.x + (xc - this.lastPos.x) * t;
            this.lastPos.y = this.lastPos.y + (yc - this.lastPos.y) * t;
            this.lastPos.z = -0.01;

            x2 = this.unitsX(-this.#distance / this.lastPos.z * this.lastPos.x);
            y2 = this.unitsY(-this.#distance / this.lastPos.z * this.lastPos.y);

            this.lastPos.x = xc;
            this.lastPos.y = yc;
            this.lastPos.z = zc;

            this.renderer.moveTo(x1, y1);
            this.renderer.lineTo(x2, y2);
        }
        this.povuciLiniju();
    }

    //nacrtaj krivulju
    povuciLiniju() {
        this.renderer.stroke();
    }

}

/*
class Ortho {

    zoom = 1;
    m = new MT3D();
    constructor(platno, xmin, xmax, ymin, ymax) {
        this.platno = platno;
        this.xmin = xmin;
        this.xmax = xmax;
        this.ymin = ymin;
        this.ymax = ymax;
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
    }

    units(x, useXScalar = false, useYScalar = false) {
        return x * this.sx * this.zoom;
    }

    #calcMatrixX(x, y, z) {
        const valx = this.m.matrica[0][0] * x + this.m.matrica[0][1] * y + this.m.matrica[0][2] * z + this.m.matrica[0][3];
        return this.xDefault + this.units(valx, true);
    }

    #calcMatrixY(x, y, z) {
        const valy = this.m.matrica[1][0] * x + this.m.matrica[1][1] * y + this.m.matrica[1][2] * z + this.m.matrica[1][3];
        return this.yDefault + this.units(valy, false, true);
    }

    postaviNa(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.renderer.beginPath();
        this.renderer.moveTo(this.#calcMatrixX(x, y, z), this.#calcMatrixY(x, y, z));
    }

    linijaDo(x, y, z) {
        this.renderer.lineTo(this.#calcMatrixX(x, y, z), this.#calcMatrixY(x, y, z));
    }

    povuciLiniju() {
        this.renderer.stroke();
    }

    postaviBoju(c) {
        this.renderer.strokeStyle = c;
    }

    #product(u, v) {
        var vek = [0, 0, 0];
        vek[0] = u[1] * v[2] - u[2] * v[1];
        vek[1] = u[2] * v[0] - u[0] * v[2];
        vek[2] = u[0] * v[1] - u[1] * v[0];
        return vek;
    }

    postaviKameru(x0, y0, z0, x1, y1, z1, Vx, Vy, Vz) {
        let V = [Vx, Vy, Vz];
        let normaN = Math.sqrt((x0 - x1) * (x0 - x1) + (y0 - y1) * (y0 - y1) + (z0 - z1) * (z0 - z1));
        let n = [(x0 - x1) / normaN, (y0 - y1) / normaN, (z0 - z1) / normaN];
        let U = this.#product(V, n);
        let normaU = Math.sqrt(U[0] * U[0] + U[1] * U[1] + U[2] * U[2]);
        let u = [U[0] / normaU, U[1] / normaU, U[2] / normaU];
        let v = this.#product(n, u);
        let mtr = [[u[0], u[1], u[2], -u[0] * x0 - u[1] * y0 - u[2] * z0],
        [v[0], v[1], v[2], -v[0] * x0 - v[1] * y0 - v[2] * z0],
        [n[0], n[1], n[2], -n[0] * x0 - n[1] * y0 - n[2] * z0],
        [0, 0, 0, 1]];
        this._kamera = mtr;
    }

    trans(m) {
        this.m.matrica = m.mnoziMatrice(m.kamera, m.matrica);
    }

}

Ortho.prototype.nacrtajOsi = function () {
    this.postaviBoju("red");
    this.postaviNa(0, 0, 0);
    this.linijaDo(1, 0, 0);
    this.povuciLiniju();
    this.postaviBoju("green");
    this.postaviNa(0, 0, 0);
    this.linijaDo(0, -1, 0);
    this.povuciLiniju();
    this.postaviBoju("blue");
    this.postaviNa(0, 0, 0);
    this.linijaDo(0, 0, 1);
    this.povuciLiniju();
}*/