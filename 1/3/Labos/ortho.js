/*

    3.3. Implementirajte klasu Ortho koja omogućava ortogonalnu projekciju linija definiranih u 3D globalnom koordinatnom sustavu na xy-ravninu sa sljedećim metodama (modificirajte klasu GKS!):

        postaviNa(x, y, z) – postavlja početak linije na poziciju (x, y, z) u 3D globalnim koordinatama;
        
        linijaDo(x, y, z) – povlači liniju od posljednje zapamćene pozicije do (x, y, z) u 3D globalnim koordinatama;
        
        trans(m) – zadaje se matrica transformacije m (objekt klase MT3D) koja se primjenjuje prije crtanja u globalnim koordinatama (to je zapravo transformacija iz lokalnih u globalne koordinate - po defaultu postaviti identitet, tj. jediničnu matricu);
        
        postaviBoju(c) – postavlja boju linije;

    Konstruktorom Ortho(platno, xmin, xmax, ymin, ymax) zadaje se raspon projiciranih koordinata koje će biti prikazane u canvasu.

    Radi testiranja klasa MT3D i Ortho nacrtajte ortogonalne projekcije kocke zarotirane oko različitih osi u različitim bojama:
        
        Rotacija oko osi x za 30° - crveno
        Rotacija oko osi y za 30° - zeleno
        Rotacija oko osi z za 30° - plavo
        Rotacija najprije oko osi x, pa y, pa z, svaki put za 30° - crno

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
        // Incorporate z in the x-calculation for 3D projection.
        const valx = this.m.matrica[0][0] * x + this.m.matrica[0][1] * y + this.m.matrica[0][2] * z + this.m.matrica[0][3];
        return this.xDefault + this.units(valx, true);
    }
    
    #calcMatrixY(x, y, z) {
        // Incorporate z in the y-calculation for 3D projection.
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

    trans(m) {
        this.m = m;
    }

}

Ortho.prototype.nacrtajOsi = function() {
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