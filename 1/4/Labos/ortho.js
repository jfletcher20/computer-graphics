/*

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
}