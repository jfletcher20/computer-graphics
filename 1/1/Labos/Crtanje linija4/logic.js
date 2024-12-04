const unit = 40;
const xmin = -3, xmax = 5, ymin = -2, ymax = 5;
window.onload = function() {

    var canvas = document.getElementById("renderer");
    if (!canvas) alert("Greška - nema platna!");
    var gks = new GKS(canvas, xmin, xmax, ymin, ymax);

    gks.koristiBoju("red");
    gks.koristiDebljinu(1);

    gks.nacrtajKoordinatniSustav();

    gks.postaviNa(0, 0);
    gks.linijaDo(4, 4);
    gks.povuciLiniju();
    
}