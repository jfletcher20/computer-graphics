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

/*

    5.1. U klasu Persp dodajte metodu za crtanje žičanog modela stošca stozac(r, h, n) gdje je parametar r polumjer baze, h visina stošca, a n broj segmenata (u ovom slučaju trokuta) i linija koje čine plašt.
    
    Bazu nacrajte u xy-ravnini, a vrh stošca na koordinati (0, 0, h).
    
    Napravite animaciju u kojoj kamera kruži oko stošca i svaki puta nakon što prijeđe puni kut pomakne se na veću ili manju visinu ovisno o trenutnom smjeru promjene visine (visina kamere se naizmjenično mijenja unutar zadanih granica).
    
*/

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

    /*
    5.2. U klasu Persp dodajte metodu za crtanje žičanog modela valjka valjak(r, h, n) gdje je parametar r polumjer baze, h visina valjka, a n broj segmenata (u ovom slučaju pravokutnika) i linija koje čine plašt. Donju bazu nacrajte u xy-ravnini. Kretanje kamere neka bude kao što je zadano u zadatku 5.1.*/

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

    /*
    5.3. U klasu Persp dodajte metodu za crtanje žičanog modela kugle (sfere) kugla(r, m, n) gdje je parametar r polumjer kugle, m broj meridijana, a n broj paralela. Središte kugle je u ishodištu, a ekvator u xy-ravnini. Nacrtajte kuglu sa 17 paralela i 32 meridijana. Kretanje kamere neka bude kao što je zadano u zadatku 5.1.*/

    stepG = 0.01;
    krug(r, horizontal = false) {
        this.postaviNa(
            r,
            horizontal ? 0 : r,
            horizontal ? 0 : 0,
        );
        for (let i = 0; i <= 2 * Math.PI; i += this.stepG)
            if (horizontal) {
                this.linijaDo(r * Math.cos(i), 0, r * Math.sin(i));
            } else this.linijaDo(r * Math.cos(i), r * Math.sin(i), 0);
        this.linijaDo(r, 0, 0);
        this.povuciLiniju();
    }

    polukrug(r) {
        this.postaviNa(0, r, 0);
        for (let i = 0; i <= Math.PI; i += this.stepG)
            this.linijaDo(0, r * Math.cos(i), r * Math.sin(i));
        this.linijaDo(0, -r, 0);
        this.povuciLiniju();
    }
    
    kugla(r, m, n) {

        const currentColor = this.renderer.strokeStyle;

        for (let i = 0; i <= n; i++) {
            if (i > n / 2) this.postaviBoju("blue");
            const yOffset = memoize(function (r, i, d, n) { return r - (i * d / n) })(r, i, r * 2, n);
            this.m.pomakni(0, yOffset, 0);
            const parallelRadius = memoize(function (r, y) { return Math.sqrt(r ** 2 - y ** 2); })(r, yOffset);
            this.krug(parallelRadius, true);
            this.m.pomakni(0, -yOffset, 0);
        }

        this.postaviBoju("green");

        for (let i = 0; i < m; i++) {
            this.polukrug(r);
            this.m.rotirajY(360 / m);
        }

        this.postaviBoju(currentColor);
    }


    #distance;
    m = new MT3D();
    lastPos = { x: 0, y: 0, z: 0 };
    zoom = 50;

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

        this.lastPos.x = this.#calcX(x, y, z);
        this.lastPos.y = this.#calcY(x, y, z);
        this.lastPos.z = this.#calcZ(x, y, z);

        this.renderer.lineTo(
            this.unitsX(-this.#distance / this.lastPos.z * this.lastPos.x),
            this.unitsY(-this.#distance / this.lastPos.z * this.lastPos.y)
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
memoizationCache = {};
function memoize(func) {
    return function (...args) {
        const key = JSON.stringify(args);
        if (memoizationCache[key] === undefined) {
            memoizationCache[key] = func(...args);
        }
        return memoizationCache[key];
    }
}