/*

    3.2. Implementirajte klasu MT3D matričnih reprezentacija geometrijskih transformacija u 3D: rota­cija oko osi x, y i z, translacije i skaliranja, te njihovu kompoziciju putem matričnog produkta (proširenje zadataka 2.2. i 2.4. na 3D).

        pomakni(px, py, pz) – translacija za pomak (px, py, pz);
        skaliraj(sx, sy, sz) – skaliranje s faktorima sx, sy i sz;
        rotirajX(kut) – rotacija oko osi x za kut u stupnjevima;
        rotirajY(kut) – rotacija oko osi y za kut u stupnjevima;
        rotirajZ(kut) – rotacija oko osi z za kut u stupnjevima;
        identitet() – postavlja matricu transformacije na jediničnu;
        mult(MT3D m) - matrica m množi matricu već sadržanu u klasi MT3D s desna.
        
    Napomena: nešto složenija, ali elegantnija implementacija gornjih metoda je da one u sebi već sadrže implicitno množenje, tj. kompoziciju transformacija. Dakle, umjesto da se kod poziva metode prebriše sadržaj matrice, postojeća matrice se množi s desna s matricom željene transformacije, što znači kompoziciju već sadržane transformacije u objektu klase MT3D s transformacijom koja odgovara pozvanoj metodi (u tom slučaju treba paziti da se matrica transformacije na početku inicijalizira kao jedinična).

*/

class MT3D {

    #matrica = [
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

    pomakni(px, py, pz) {
        var m = [
            [1, 0, 0, px],
            [0, 1, 0, py],
            [0, 0, 1, pz],
            [0, 0, 0, 1]
        ];
        this.mult(m);
    }

    skaliraj(sx, sy, sz) {
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

    #cos(φ) {
        return Math.cos(φ * Math.PI / 180);
    }

    #sin(φ) {
        return Math.sin(φ * Math.PI / 180);
    }

    get matrica() { return this.#matrica; }

    mult(m = new MT3D()) {
        let m1 = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                for (let k = 0; k < 4; k++) {
                    try {
                        m1[i][j] += this.#matrica[i][k] * m.matrica[k][j];
                    } catch (e) {
                        m1[i][j] += this.#matrica[i][k] * m[k][j];
                    }
                }
            }
        }
        this.#matrica = m1;
    }

    rotiraj_oko_tocke(x0, y0, φ) {
        this.pomakni(-x0, -y0);
        this.rotiraj(φ);
        this.pomakni(x0, y0);
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

}