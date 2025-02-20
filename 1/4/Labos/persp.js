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
