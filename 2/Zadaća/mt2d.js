/*

    2.2. Implementirajte klasu MT2D matričnih reprezentacija geometrijskih transformacija u 2D: rota­cije, translacije, skaliranja i zrcaljenja. Sljedeće metode trebaju kreirati odgovarajuće 3 x 3 matrice transformacije (radimo sa homogenim koordinatama):

        pomakni(px, py) – translacija za pomak px, py;
        skaliraj(sx, sy) – skaliranje s faktorima sx, sy;
        zrcaliNaX() – zrcaljenje na osi x (dakle mijenja se predznak y koordinate);
        zrcaliNaY() – zrcaljenje na osi y (dakle mijenja se predznak x koordinate);
        rotiraj(kut) – rotacija za kut u stupnjevima (ne zaboraviti preračunavanje u radijane!);
        identitet() – postavlja matricu transformacije na jediničnu.

    Implementirajte klasu MT2D matričnih reprezentacija geometrijskih transformacija u 2D.

    Pripadne metode moraju generirati matrice transformacija u homogenim koordinatama, dakle 3 × 3 matrice.

    Implementirajte metode za translaciju, skaliranje, rotaciju oko ishodišta, zrcaljenja s obzirom na koordinatne osi, identitetu, smicanje duž koordinatnih osi.

    Klasa neka ima jedan (privatni) atribut matrica u koji će se svaki put iznova spremati novogenerirana matrica odredene transformacije.

    Omogućite da se iz drugih klasa može preuzeti vrijednost atributa matrica.
    Konstruktor MT2D klase neka atribut matrica postavi na jediničnu matricu.

    Svaki put kada se pozove metoda koja generira matricu neke geometrijske transformacije, ta metoda mijenja vrijednost atributa matrica u vrijednost koju je ona izgenerirala

*/

/*

    Zadatak 3

        a) Dodajte u MT2D klasu metodu rotiraj_oko_tocke (x0 ,y0 , kut) za rotaciju oko točke (x0, y0) za odredeni kut.

        b) Dodajte u MT2D klasu metodu zrcaliNa (k,l) za zrcaljenje na proizvoljnom pravcu s jednadžbom y = kx + l.

    Napomene za treći zadatak

        • Navedene metode neka budu uskladene s kompozicijom transformacija kao i preostale metode u klasi MT2D kako je to već ranije opisano.

        • Uočite da navedene metode možete implementirati pozivanjem već postojećih metoda u klasi MT2D u odgovarajućem redoslijedu kako je to objašnjeno na predavanjima.

*/

class MT2D {

    #matrica = [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1]
    ];
    constructor() {
        this.#matrica = this.identitet();
    }

    identitet() {
        this.#matrica = [
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1]
        ];
        return this.#matrica;
    }

    pomakni(px, py) {
        var m = [
            [1, 0, px],
            [0, 1, py],
            [0, 0, 1]
        ];
        this.mult(m);
    }

    skaliraj(sx, sy) {
        let m = [
            [sx, 0, 0],
            [0, sy, 0],
            [0, 0, 1]
        ];
        this.mult(m);
    }

    zrcaliNaX() {
        let m = [
            [1, 0, 0],
            [0, -1, 0],
            [0, 0, 1]
        ];
        this.mult(m);
    }

    zrcaliNaY() {
        let m = [
            [-1, 0, 0],
            [0, 1, 0],
            [0, 0, 1]
        ];
        this.mult(m);
    }

    rotiraj(φ, invertSine = false) {
        let m = [
            [this.#cos(φ), (invertSine ? -1 : 1) * this.#sin(φ), 0],
            [this.#sin(φ), this.#cos(φ), 0],
            [0, 0, 1]
        ];
        this.mult(m);
    }

    #cos(φ) {
        return Math.cos(φ * Math.PI / 180);
    }

    #sin(φ) {
        return Math.sin(φ * Math.PI / 180);
    }

    smicanje(α, β) {
        let m = [
            [1, Math.tan(β), 0],
            [Math.tan(α), 1, 0],
            [0, 0, 1]
        ];
        this.mult(m);
    }

    get matrica() { return this.#matrica; }

    mult(m) {
        let m1 = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
        for (let i = 0; i < 3; i++)
            for (let j = 0; j < 3; j++)
                for (let k = 0; k < 3; k++) {
                    try {
                        m1[i][j] += this.#matrica[i][k] * m[k][j];
                    } catch (e) {
                        m = m.matrica;
                        m1[i][j] += this.#matrica[i][k] * m[k][j];
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