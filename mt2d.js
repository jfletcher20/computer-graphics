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

    #matrica;

}