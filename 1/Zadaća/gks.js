/*

    1.4. Implementirajte klasu GKS (Globalni Koordinatni Sustav) koja omogućava crtanje u globalnim koordinatama sa sljedećim metodama:
        
        postaviNa(x, y) – postavlja "olovku" na poziciju (x, y) u globalnim koordinatama (ne zaboraviti beginPath());
        
        linijaDo(x, y) – povlači liniju od posljednje zapamćene pozicije do (x, y) u globalnim koordinatama (dakle mora se izvršiti transformacija iz globalnih koordinata u koordinate canvasa i potegnuti linija uz pomoć HTML5-rutine lineTo());
        
        koristiBoju(c) - linija se povlači bojom c (npr. "red", "green", "blue", "black")
        
        povuciLiniju() – povlači liniju pozivom HTML5-rutine stroke().

    Konstruktorom GKS(platno, xmin, xmax, ymin, ymax) zadaje se raspon koordinata globalnog koordinatnog sustava koji će biti prikazan u canvasu platno.

*/

class GKS {
    unit = 60;
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
        this.xDefault = this.platno.width / 2;
        this.yDefault = this.platno.height / 2;
        this.scalarX = 1;
        this.scalarY = 1;
    }

    units(x, useXScalar = false, useYScalar = false) {
        var defaultUnitsAt640wh = this.unit;
        var un = defaultUnitsAt640wh * ((this.platno.width > this.platno.height ? this.platno.height : this.platno.width) / 640);
        return x * un * (useXScalar ? this.scalarX : 1) * (useYScalar ? this.scalarY : 1);
    }

    postaviNa(x, y) {
        this.x = x;
        this.y = y;
        this.renderer.beginPath();
        this.renderer.moveTo(this.xDefault + this.units(x, true), this.yDefault + -this.units(y, false, true));
    }

    linijaDo(x, y) {
        y = -y;
        var xCoord = this.xDefault + this.units(x, true);
        var yCoord = this.yDefault + this.units(y, false, true);

        if (xCoord < this.xmin || xCoord > this.xmax || yCoord < this.ymin || yCoord > this.ymax) {
            // console.log("Koordinati (" + x + ", " + y + ") su izvan granica x ε (" + this.xmin + ", " + this.xmax + ") & y ε (" + this.ymin + ", " + this.ymax + ")");
            xCoord = Math.min(Math.max(xCoord, this.xmin), this.xmax);
            yCoord = Math.min(Math.max(yCoord, this.ymin), this.ymax);
        }

        this.renderer.lineTo(this.xDefault + this.units(x, true), this.yDefault + this.units(y, false, true));
    }

    koristiBoju(c) {
        this.renderer.strokeStyle = c;
    }

    povuciLiniju() {
        this.renderer.stroke();
    }
}

GKS.prototype.koristiDebljinu = function(debljina) {
    this.renderer.lineWidth = debljina;
}

GKS.prototype.nacrtajKoordinatniSustav = function(withArrows = true, withGrid = false, withMarkers = false, maxX = 10000, maxY = 10000) {

    var inicijalnaBoja = this.renderer.strokeStyle;
    this.koristiBoju("black");
    var inicijalnaDebljina = this.renderer.lineWidth;
    this.koristiDebljinu(1.5);

    this.nacrtajKoordinatneOsi();
    if (withArrows)this.nacrtajStrijeliceKoordinatnogSustava();
    if (withGrid) this.nacrtajKoordinatnuMrezu(10);
    if (withMarkers) this.nacrtajOznake(true, maxX, maxY);

    this.koristiBoju(inicijalnaBoja);
    this.koristiDebljinu(inicijalnaDebljina);

}

GKS.prototype.nacrtajKoordinatneOsi = function() {

    this.postaviNa(this.xmin, 0);
    this.linijaDo(this.xmax, 0);

    this.povuciLiniju();

    this.postaviNa(0, this.ymin);
    this.linijaDo(0, this.ymax);

    this.povuciLiniju();
}

GKS.prototype.nacrtajStrijeliceKoordinatnogSustava = function() {

    this.postaviNa(this.xmax, 0);
    this.linijaDo(this.xmax - 0.3, 0.15);
    this.povuciLiniju();

    this.postaviNa(this.xmax - 0.3, -0.15);
    this.linijaDo(this.xmax, 0);
    this.povuciLiniju();

    this.postaviNa(0, this.ymax);
    this.linijaDo(0.15, this.ymax - 0.3);
    this.povuciLiniju();

    this.postaviNa(-0.15, this.ymax - 0.3);
    this.linijaDo(0, this.ymax);
    this.povuciLiniju();

}

GKS.prototype.nacrtajKoordinatnuMrezu = function(expand = 0) {

    var inicijalnaBoja = this.renderer.strokeStyle;
    this.koristiBoju("lightgray");

    var inicijalnaDebljina = this.renderer.lineWidth;
    this.koristiDebljinu(1);

    for (var i = this.xmin - expand; i <= this.xmax + expand; i++) {
        this.postaviNa(i, this.ymin - expand);
        this.linijaDo(i, this.ymax + expand);
        this.povuciLiniju();
    }

    for (var i = this.ymin - expand; i <= this.ymax + expand; i++) {
        this.postaviNa(this.xmin - expand, i);
        this.linijaDo(this.xmax + expand, i);
        this.povuciLiniju();
    }

    this.koristiDebljinu(inicijalnaDebljina);
    this.koristiBoju(inicijalnaBoja);

}

GKS.prototype.nacrtajOznake = function(enumerate = true, maxX = 10000, maxY = 10000) {
    var inicijalnaBoja = this.renderer.strokeStyle;
    this.koristiBoju("black");

    var inicijalnaDebljina = this.renderer.lineWidth;
    this.koristiDebljinu(1);

    for (var i = this.xmin; i < this.xmax; i++) {
        if (i == 0 || i == this.xmin) continue;
        this.postaviNa(i, -0.1);
        this.linijaDo(i, 0.1);
        if (i <= maxX && i >= -maxX && enumerate) this.nacrtajSlova(i, i, -0.2);
        this.povuciLiniju();
    }

    for (var i = this.ymin; i < this.ymax; i++) {
        if (i == 0 || i == this.ymin) continue;
        this.postaviNa(-0.1, i);
        this.linijaDo(0.1, i);
        if (i <= maxY && i >= -maxY && enumerate) this.nacrtajSlova(i, 0.2, i);
        this.povuciLiniju();
    }

    this.koristiDebljinu(inicijalnaDebljina);
    this.koristiBoju(inicijalnaBoja);
};

GKS.prototype.nacrtajSlova = function(text, x, y) {
    this.renderer.font = this.units(1) / 5 + "px Arial";
    this.renderer.textAlign = "center";
    this.renderer.fillText(text, this.xDefault + this.units(x, true), this.yDefault + -this.units(y - 0.0855, false, true));
    this.renderer.textAlign = "start";
};

GKS.prototype.displace = function(x, y) {
    this.xDefault = this.platno.width / 2 + this.units(x);
    this.yDefault = this.platno.height / 2 - this.units(y);
}

GKS.prototype.placeCenterAt = function(x, y) {
    this.xDefault = this.platno.width * x;
    this.yDefault = this.platno.height * y;
}