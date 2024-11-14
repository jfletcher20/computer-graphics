/*

    Klasi MT3D dodajte metodu:

        postaviKameru(x0, y0, z0, x1, y1, z1, Vx, Vy, Vz)
    
    Ta funkcija omogućuje transformaciju u koordinatni sustav kamere
    postavljene u točki (x0, y0, z0) globalnog koordinatnog sustava.
    
    Kamera je usmjerena prema točki (x1, y1, z1), a vektor (Vx, Vy, Vz)
    odreduje smjer prema gore (view-up vector), tj. položaj y-osi koordinatnog sustava kamere.
    
    Matrica transformacije koja se generira kod poziva metode postaviKameru ostaje zapamćena i
    primijenjuje se kod svakog sljedećeg crtanja (mijenja se tek novim pozivom metode postaviKameru).
    
*/

/*

    Treba dodati (privatni) atribut kamera u kojemu se čuva transformacija
    pogleda. U konstruktoru se taj atribut postavi na jediničnu matricu reda 4.
    To znači da je po defaultu kamera već u ishodištu i da gleda u negativnom smjeru z-osi.

    Treba implementirati metodu #product za računanje vektorskog produkta.

    Treba implementirati metodu mnoziMatrice za računanje produkta dvije matrice.

    Kod je sličan kao za mult metodu, samo na ulazu trebaju biti dva
    parametra (matrice koje zelimo pomnožiti u danom poretku).

    Treba implementirati metodu postaviKameru koja će generirati transformaciju pogleda.

    Treba modificirati metodu trans tako da uz matricu transformacije bude uključena
    i matrica pogleda, tj. da se uvijek nakon geometrijskih transformacija primijeni
    i transformacija pogleda.

*/

class MT3D {

    #matrica = [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
    ];
    kamera = [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
    ];

    constructor() {
        this.identitet();
    }

    identitet() {
        let m = [
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ];
        this.#matrica = m;
    }

    resetirajKameru() {
        this.kamera = [
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ];
    }

    pomakni(px, py, pz = 0) {
        var m = [
            [1, 0, 0, px],
            [0, 1, 0, py],
            [0, 0, 1, pz],
            [0, 0, 0, 1]
        ];
        this.mult(m);
    }

    skaliraj(sx, sy, sz = 0) {
        let m = [
            [sx, 0, 0, 0],
            [0, sy, 0, 0],
            [0, 0, sz, 0],
            [0, 0, 0, 1]
        ];
        this.mult(m);
    }

    zrcaliNaX() {
        let m = [
            [1, 0, 0, 0],
            [0, -1, 0, 0],
            [0, 0, -1, 0],
            [0, 0, 0, 1]
        ];
        this.mult(m);
    }

    zrcaliNaY() {
        let m = [
            [-1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, -1, 0],
            [0, 0, 0, 1]
        ];
        this.mult(m);
    }

    zrcaliNaZ() {
        let m = [
            [-1, 0, 0, 0],
            [0, -1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ];
        this.mult(m);
    }

    zrcaliNaXY() {
        let m = [
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, -1, 0],
            [0, 0, 0, 1]
        ];
        this.mult(m);
    }

    zrcaliNaXZ() {
        let m = [
            [1, 0, 0, 0],
            [0, -1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ];
        this.mult(m);
    }

    zrcaliNaYZ() {
        let m = [
            [-1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ];
        this.mult(m);
    }

    rotirajX(φ) {
        let m = [
            [1, 0, 0, 0],
            [0, this.#cos(φ), -this.#sin(φ), 0],
            [0, this.#sin(φ), this.#cos(φ), 0],
            [0, 0, 0, 1]
        ];
        this.mult(m);
    }

    rotirajY(φ) {
        let m = [
            [this.#cos(φ), 0, this.#sin(φ), 0],
            [0, 1, 0, 0],
            [-this.#sin(φ), 0, this.#cos(φ), 0],
            [0, 0, 0, 1]
        ];
        this.mult(m);
    }

    rotirajZ(φ) {
        let m = [
            [this.#cos(φ), -this.#sin(φ), 0, 0],
            [this.#sin(φ), this.#cos(φ), 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ];
        this.mult(m);
    }

    rotiraj_oko_osi(x0, y0, z0, u1, u2, u3, kut) {
        this.pomakni(x0, y0, z0);
        this.rotiraj(x0, y0, z0, u1, u2, u3, kut, true);
        this.pomakni(-x0, -y0, -z0);
    }

    rotiraj(x1, y1, z1, x2, y2, z2, kut, secondSetIsVector = false) {
        let u1 = secondSetIsVector ? x2 : x2 - x1;
        let u2 = secondSetIsVector ? y2 : y2 - y1;
        let u3 = secondSetIsVector ? z2 : z2 - z1;
        u1 /= Math.sqrt(u1 ** 2 + u2 ** 2 + u3 ** 2);
        u2 /= Math.sqrt(u1 ** 2 + u2 ** 2 + u3 ** 2);
        u3 /= Math.sqrt(u1 ** 2 + u2 ** 2 + u3 ** 2);
        const d = Math.sqrt(u2 ** 2 + u3 ** 2);
        this.mult([[1, 0, 0, 0], [0, u3 / d, u2 / d, 0], [0, -u2 / d, u3 / d, 0], [0, 0, 0, 1]]);
        this.mult([[d, 0, u1, 0], [0, 1, 0, 0], [-u1, 0, d, 0], [0, 0, 0, 1]]);
        this.rotirajZ(kut);
        this.mult([[d, 0, -u1, 0], [0, 1, 0, 0], [u1, 0, d, 0], [0, 0, 0, 1]]);
        this.mult([[1, 0, 0, 0], [0, u3 / d, -u2 / d, 0], [0, u2 / d, u3 / d, 0], [0, 0, 0, 1]]);
    }


    #cos(φ) {
        return Math.cos(φ * Math.PI / 180);
    }

    #sin(φ) {
        return Math.sin(φ * Math.PI / 180);
    }

    get matrica() { return this.#matrica; }
    set matrica(m) { this.#matrica = m; }

    mult(m) {
        let m1 = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ];
        for (let i = 0; i < 4; i++)
            for (let j = 0; j < 4; j++)
                for (let k = 0; k < 4; k++)
                    try {
                        m1[i][j] += this.#matrica[i][k] * m.matrica[k][j];
                    } catch (e) {
                        m1[i][j] += this.#matrica[i][k] * m[k][j];
                    }
        this.#matrica = m1;
    }

    mnoziMatrice(m1, m2) {
        let m = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ];
        for (let i = 0; i < 4; i++)
            for (let j = 0; j < 4; j++)
                for (let k = 0; k < 4; k++)
                    m[i][j] += m1[i][k] * m2[k][j];
        return m;
    }

    #normalize(x, y, z) {
        return Math.sqrt(x ** 2 + y ** 2 + z ** 2);
    }

    postaviKameru(x0, y0, z0, x1, y1, z1, vecX, vecY, vecZ) {
        
        let vector = [vecX, vecY, vecZ];
        
        const distances = {
            distX: x0 - x1,
            distY: y0 - y1,
            distZ: z0 - z1
        }
        let distance = this.#normalize(distances.distX, distances.distY, distances.distZ);

        let n = [
            distances.distX / distance,
            distances.distY / distance,
            distances.distZ / distance
        ];

        let vectU = this.#product(vector, n);
        let distanceU = this.#normalize(vectU[0], vectU[1], vectU[2]);

        let u = [
            vectU[0] / distanceU,
            vectU[1] / distanceU,
            vectU[2] / distanceU
        ];

        let v = this.#product(n, u);
        let mtr = [
            [u[0], u[1], u[2], -u[0] * x0 - u[1] * y0 - u[2] * z0],
            [v[0], v[1], v[2], -v[0] * x0 - v[1] * y0 - v[2] * z0],
            [n[0], n[1], n[2], -n[0] * x0 - n[1] * y0 - n[2] * z0],
            [0, 0, 0, 1]
        ];

        this.kamera = mtr;
        return this.kamera;
        
    }

    zrcaliNa(k, l) {

        function perpendicularSlope(slope) {
            return -1 / slope;
        }

        function findIntersection(slope1, intercept1, slope2, intercept2) {
            const x = (intercept2 - intercept1) / (slope1 - slope2);
            const y = slope1 * x + intercept1;
            return { x: x, y: y };
        }

        let φ = 2 * (90 - Math.atan(k) * 180 / Math.PI);

        const slope1 = k;
        const intercept1 = l;

        const slope2 = perpendicularSlope(slope1);
        const intercept2 = 0;

        const intersection = findIntersection(slope1, intercept1, slope2, intercept2);

        this.pomakni(2 * intersection.x, 2 * -intersection.y);
        this.rotiraj(φ);
        this.zrcaliNaY();

    }

    #product(u, v) {
        var vector = [0, 0, 0];
        vector[0] = u[1] * v[2] - u[2] * v[1];
        vector[1] = u[2] * v[0] - u[0] * v[2];
        vector[2] = u[0] * v[1] - u[1] * v[0];
        return vector;
    }

}