const unit = 40;
const xmin = -20, xmax = 20, ymin = -20, ymax = 20;

window.onload = function() {

    var canvas = document.getElementById("renderer");
    if (!canvas) alert("Greška - nema platna!");
    var gks = new GKS(canvas, xmin, xmax, ymin, ymax);
    gks.unit = 70;

    /*

        Zadatak 2

        Nacrtajte elipsu s poluosima a = 4 i b = 2.
        Koordinatni sustav zajedno s oznakama na koordinatnim osima postavite kako je prikazano na slici.
        Parametarske jednadˇzbe elipse s poluosima a i b su x = a cost, y = b sin t pri ˇcemu je t ∈ [0, 2π]. 
    
        Koristite GKS klasu.

    */

    gks.nacrtajKoordinatniSustav(false, false, true);

    gks.koristiBoju("blue");
    const a = 4, b = 2;

    for (var t = 0; t <= 2 * Math.PI; t += 0.01) {
        var x = a * Math.cos(t);
        var y = b * Math.sin(t);
        var xNext = a * Math.cos(t + 0.01 <= 2 * Math.PI ? t + 0.01 : 2 * Math.PI);
        var yNext = b * Math.sin(t + 0.01 <= 2 * Math.PI ? t + 0.01 : 2 * Math.PI);
        gks.postaviNa(x, y);
        gks.linijaDo(xNext, yNext);
        gks.povuciLiniju();
    }

}