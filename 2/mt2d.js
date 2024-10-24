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

class MT2D {

    #matrica = [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1]
    ];
    constructor() {
        this.#matrica = this.indentitet();
    }

    indentitet() {
        return [
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1]
        ];
    }

    pomakni(px, py) {
        var m = [
            [1, 0, px],
            [0, 1, py],
            [0, 0, 1]
        ];
        this.mult(m);
    }

    sklairaj(sx, sy) {
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

}