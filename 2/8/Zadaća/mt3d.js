/*

    7.2. U klasu MT3D koju ste implementirali na Vježbama 3 dodajte metodu lista koja elemente matrice ispisuje kao listu, stupac po stupac, u jednodimenzionalno JavaScript polje prikladno da posluži kao parametar metode uniformMatrix4fv. U primjer 7.2. dodajte uniform varijablu u_mTrans koja će služiti za transformaciju koordinata vrhova i animirajte rotaciju postojeća dva trokuta koji leže u xy ravnini oko sve tri osi istovremeno. Polako rotirajte oko osi y, dvostruko brže oko osi x i tri puta brže oko osi z.

    8.1. U klasu MT3D dodajte metodu orto(xmin, xmax, ymin, ymax, zpr, zst) koja preslikava koordinate iz zadanog raspona u normirane koordinate između -1 i 1, pri čemu je zpr udaljenost do prednje, a zst udaljenost do stražnje odrezujuće plohe.  Savjet: Dopunite metodu projekcija2D(xmin, xmax, ymin, ymax) iz Zadaće 6.

    8.3. U klasu MT3D dodajte metodu persp(xmin, xmax, ymin, ymax, zpr, zst) koja preslikava koordinate iz zadanog raspona u normirane koordinate uz primjenu perspektivne projekcije, pri čemu je zpr udaljenost do prednje, a zst udaljenost do stražnje odrezujuće plohe. Primijenite metodu postaviKameru iz klase MT3D i riješite zadatak 8.2. primjenom perspektivne projekcije.

*/

class MT3D {

    orto(xmin, xmax, ymin, ymax, zpr, zst) {
        const A = 2 / (xmax - xmin);
        const B = 2 / (ymax - ymin);
        const C = -2 / (zst - zpr);

        const TX = - (xmax + xmin) / (xmax - xmin);
        const TY = - (ymax + ymin) / (ymax - ymin);
        const TZ = - (zst + zpr) / (zst - zpr);

        this._projekcija = [
            [A, 0, 0, TX],
            [0, B, 0, TY],
            [0, 0, C, TZ],
            [0, 0, 0, 1]
        ];
    }

    persp(xmin, xmax, ymin, ymax, zpr, zst) {
        const A = (2 * zpr) / (xmax - xmin);
        const B = (2 * zpr) / (ymax - ymin);
        const C = (xmax + xmin) / (xmax - xmin);
        const D = (ymax + ymin) / (ymax - ymin);
        const E = -(zst + zpr) / (zst - zpr);
        const F = -(2 * zst * zpr) / (zst - zpr);

        this._projekcija = [
            [A, 0, 0, 0],
            [0, B, 0, 0],
            [C, D, E, F],
            [0, 0, -1, 0]
        ];
    }

    constructor() {
        this._matrica = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
        this._kamera = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
        this._projekcija = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
        this._transformacije = [];
        this._pamtiSkaliranje = [];
    }

    poljeModel() {
        var rez = this.mnoziMatrice(this._kamera, this._matrica);
        var v = [];
        for (var i = 0; i < 4; i++)
            for (var j = 0; j < 4; j++)
                v.push(rez[j][i]);
        return v;
    }

    poljeKamera() {
        var v = [];
        for (var i = 0; i < 4; i++)
            for (var j = 0; j < 4; j++)
                v.push(this._kamera[j][i]);
        return v;
    }

    poljeMatrica() {
        var rez = this.mnoziMatrice(this._projekcija, this.mnoziMatrice(this._kamera, this._matrica));
        var v = [];
        for (var i = 0; i < 4; i++)
            for (var j = 0; j < 4; j++)
                v.push(rez[j][i]);
        return v;
    }

    poljeNormala = function () {
        var m = [];
        var matNormala;
        var v = [];
        var rez = this.mnoziMatrice(this._kamera, this._matrica);
        for (var i = 0; i < 3; i++) {
            m[i] = [];
            for (var j = 0; j < 3; j++)
                m[i][j] = rez[i][j];
        }
        if (!this._skaliranje) matNormala = m;
        else {
            var det = 1 / (m[0][0] * m[1][1] * m[2][2] + m[0][1] * m[1][2] * m[2][0] + m[0][2] * m[1][0] * m[2][1] -
                m[2][0] * m[1][1] * m[0][2] - m[2][1] * m[1][2] * m[0][0] - m[2][2] * m[1][0] * m[0][1]);
            var M00 = det * (m[1][1] * m[2][2] - m[2][1] * m[1][2]);
            var M01 = det * (m[2][0] * m[1][2] - m[1][0] * m[2][2]);
            var M02 = det * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
            var M10 = det * (m[0][2] * m[2][1] - m[0][1] * m[2][2]);
            var M11 = det * (m[0][0] * m[2][2] - m[0][2] * m[2][0]);
            var M12 = det * (m[0][1] * m[2][0] - m[0][0] * m[2][1]);
            var M20 = det * (m[0][1] * m[1][2] - m[1][1] * m[0][2]);
            var M21 = det * (m[0][2] * m[1][0] - m[0][0] * m[1][2]);
            var M22 = det * (m[0][0] * m[1][1] - m[0][1] * m[1][0]);
            matNormala = [[M00, M01, M02], [M10, M11, M12], [M20, M21, M22]];
        }
        for (var i = 0; i < 3; i++)
            for (var j = 0; j < 3; j++)
                v.push(matNormala[j][i]);
        return v;
    }

    poljeNormalaBuffer() {
        var v = this.poljeNormala();
        v.splice(3, 0, 0);
        v.splice(7, 0, 0);
        v.push(0);
        return v;
    }

    spremiMatricu() {
        if (this._transformacije.length > 32) {
            console.log("Error: stack is full.");
        } else {
            this._transformacije.push(this._matrica);
            this._pamtiSkaliranje.push(this._skaliranje);
        }
    }

    vratiMatricu() {
        if (this._transformacije.length == 0) {
            console.log("Error: stack is empty.");
        } else {
            this._matrica = this._transformacije.pop();
            this._skaliranje = this._pamtiSkaliranje.pop();
        }
    }

    mnoziMatrice(m1, m2) {
        var rez = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
        for (let i = 0; i < 4; i++)
            for (let j = 0; j < 4; j++)
                for (let k = 0; k < 4; k++)
                    rez[i][j] += m1[i][k] * m2[k][j];
        return rez;
    }

    mult(m) {
        var m1 = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
        for (let i = 0; i < 4; i++)
            for (let j = 0; j < 4; j++)
                for (let k = 0; k < 4; k++)
                    m1[i][j] += this._matrica[i][k] * m[k][j];
        this._matrica = m1;
    }

    slika_tocke(tocka) {
        var ImTocka = [0, 0, 0, 0];
        for (let i = 0; i < 4; i++)
            for (let k = 0; k < 4; k++)
                ImTocka[i] += this._matrica[i][k] * tocka[k];
        return ImTocka;
    }

    kamera_slika_tocke(tocka) {
        var ImTocka = [0, 0, 0, 0];
        for (let i = 0; i < 4; i++)
            for (let k = 0; k < 4; k++)
                ImTocka[i] += this._kamera[i][k] * tocka[k];
        return ImTocka;
    }

    VP(u, v) {
        var vek = [0, 0, 0];
        vek[0] = u[1] * v[2] - u[2] * v[1];
        vek[1] = u[2] * v[0] - u[0] * v[2];
        vek[2] = u[0] * v[1] - u[1] * v[0];
        return vek;
    }

    pomakni(px, py, pz) {
        let m = [[1, 0, 0, px], [0, 1, 0, py], [0, 0, 1, pz], [0, 0, 0, 1]];
        this.mult(m);
    }

    skaliraj(sx, sy, sz) {
        let m = [[sx, 0, 0, 0], [0, sy, 0, 0], [0, 0, sz, 0], [0, 0, 0, 1]];
        if (!this._skaliranje) this._skaliranje = true;
        this.mult(m);
    }

    zrcaliNaX() {
        let m = [[1, 0, 0, 0], [0, -1, 0, 0], [0, 0, -1, 0], [0, 0, 0, 1]];
        this.mult(m);
    }
    zrcaliNaY() {
        let m = [[-1, 0, 0, 0], [0, 1, 0, 0], [0, 0, -1, 0], [0, 0, 0, 1]];
        this.mult(m);
    }
    zrcaliNaZ() {
        let m = [[-1, 0, 0, 0], [0, -1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
        this.mult(m);
    }

    zrcaliNaXY() {
        let m = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, -1, 0], [0, 0, 0, 1]];
        this.mult(m);
    }
    zrcaliNaXZ() {
        let m = [[1, 0, 0, 0], [0, -1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
        this.mult(m);
    }
    zrcaliNaYZ() {
        let m = [[-1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
        this.mult(m);
    }

    rotirajX(kut) {
        let fi = kut * Math.PI / 180;
        let cosfi = Math.cos(fi);
        let sinfi = Math.sin(fi);
        let m = [[1, 0, 0, 0], [0, cosfi, -sinfi, 0], [0, sinfi, cosfi, 0], [0, 0, 0, 1]];
        this.mult(m);
    }
    rotirajY(kut) {
        let fi = kut * Math.PI / 180;
        let cosfi = Math.cos(fi);
        let sinfi = Math.sin(fi);
        let m = [[cosfi, 0, sinfi, 0], [0, 1, 0, 0], [-sinfi, 0, cosfi, 0], [0, 0, 0, 1]];
        this.mult(m);
    }
    rotirajZ(kut) {
        let fi = kut * Math.PI / 180;
        let cosfi = Math.cos(fi);
        let sinfi = Math.sin(fi);
        let m = [[cosfi, -sinfi, 0, 0], [sinfi, cosfi, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
        this.mult(m);
    }

    identitet() {
        this._matrica = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
        this._skaliranje = false;
    }

    smicanje(alpha, beta, gamma) {
        let tanA = Math.tan(alpha * Math.PI / 180);
        let tanB = Math.tan(beta * Math.PI / 180);
        let tanC = Math.tan(gamma * Math.PI / 180);
        let m = [[1, tanB, tanC, 0], [tanA, 1, tanC, 0], [tanA, tanB, 1, 0], [0, 0, 0, 1]];
        if (!this._skaliranje) this._skaliranje = true;
        this.mult(m);
    }

    rotiraj_oko_osi(x0, y0, z0, u1, u2, u3, kut) {
        let korijen = Math.sqrt(u1 * u1 + u2 * u2 + u3 * u3);
        let a = u1 / korijen;
        let b = u2 / korijen;
        let c = u3 / korijen;
        let d = Math.sqrt(b * b + c * c);
        let Rx1 = [[1, 0, 0, 0], [0, c / d, -b / d, 0], [0, b / d, c / d, 0], [0, 0, 0, 1]];
        let Ry1 = [[d, 0, -a, 0], [0, 1, 0, 0], [a, 0, d, 0], [0, 0, 0, 1]];
        let Rx2 = [[1, 0, 0, 0], [0, c / d, b / d, 0], [0, -b / d, c / d, 0], [0, 0, 0, 1]];
        let Ry2 = [[d, 0, a, 0], [0, 1, 0, 0], [-a, 0, d, 0], [0, 0, 0, 1]];
        this.pomakni(x0, y0, z0);
        this.mult(Rx2);
        this.mult(Ry2);
        this.rotirajZ(kut);
        this.mult(Ry1);
        this.mult(Rx1);
        this.pomakni(-x0, -y0, -z0);
    }
    zrcali_os(x0, y0, z0, u1, u2, u3) {
        let korijen = Math.sqrt(u1 * u1 + u2 * u2 + u3 * u3);
        let a = u1 / korijen;
        let b = u2 / korijen;
        let c = u3 / korijen;
        let d = Math.sqrt(b * b + c * c);
        let Rx1 = [[1, 0, 0, 0], [0, c / d, -b / d, 0], [0, b / d, c / d, 0], [0, 0, 0, 1]];
        let Ry1 = [[d, 0, -a, 0], [0, 1, 0, 0], [a, 0, d, 0], [0, 0, 0, 1]];
        let Rx2 = [[1, 0, 0, 0], [0, c / d, b / d, 0], [0, -b / d, c / d, 0], [0, 0, 0, 1]];
        let Ry2 = [[d, 0, a, 0], [0, 1, 0, 0], [-a, 0, d, 0], [0, 0, 0, 1]];
        this.pomakni(x0, y0, z0);
        this.mult(Rx2);
        this.mult(Ry2);
        this.zrcaliNaZ();
        this.mult(Ry1);
        this.mult(Rx1);
        this.pomakni(-x0, -y0, -z0);
    }
    zrcali_ravnina(x0, y0, z0, u1, u2, u3) {
        let korijen = Math.sqrt(u1 * u1 + u2 * u2 + u3 * u3);
        let a = u1 / korijen;
        let b = u2 / korijen;
        let c = u3 / korijen;
        let d = Math.sqrt(b * b + c * c);
        let Rx1 = [[1, 0, 0, 0], [0, c / d, -b / d, 0], [0, b / d, c / d, 0], [0, 0, 0, 1]];
        let Ry1 = [[d, 0, -a, 0], [0, 1, 0, 0], [a, 0, d, 0], [0, 0, 0, 1]];
        let Rx2 = [[1, 0, 0, 0], [0, c / d, b / d, 0], [0, -b / d, c / d, 0], [0, 0, 0, 1]];
        let Ry2 = [[d, 0, a, 0], [0, 1, 0, 0], [-a, 0, d, 0], [0, 0, 0, 1]];
        this.pomakni(x0, y0, z0);
        this.mult(Rx2);
        this.mult(Ry2);
        this.zrcaliNaXY();
        this.mult(Ry1);
        this.mult(Rx1);
        this.pomakni(-x0, -y0, -z0);
    }
    zrcali_ravnina2(A, B, C, D) {
        let x0, y0, z0;
        if (A != 0) {
            x0 = -D / A;
            y0 = 0;
            z0 = 0;
        } else if (B != 0) {
            x0 = 0;
            y0 = -D / B;
            z0 = 0;
        } else {
            x0 = 0;
            y0 = 0;
            z0 = -D / C;
        }
        let korijen = Math.sqrt(A * A + B * B + C * C);
        let a = A / korijen;
        let b = B / korijen;
        let c = C / korijen;
        let d = Math.sqrt(b * b + c * c);
        let Rx1 = [[1, 0, 0, 0], [0, c / d, -b / d, 0], [0, b / d, c / d, 0], [0, 0, 0, 1]];
        let Ry1 = [[d, 0, -a, 0], [0, 1, 0, 0], [a, 0, d, 0], [0, 0, 0, 1]];
        let Rx2 = [[1, 0, 0, 0], [0, c / d, b / d, 0], [0, -b / d, c / d, 0], [0, 0, 0, 1]];
        let Ry2 = [[d, 0, a, 0], [0, 1, 0, 0], [-a, 0, d, 0], [0, 0, 0, 1]];
        this.pomakni(x0, y0, z0);
        this.mult(Rx2);
        this.mult(Ry2);
        this.zrcaliNaXY();
        this.mult(Ry1);
        this.mult(Rx1);
        this.pomakni(-x0, -y0, -z0);
    }

    OrtogonalnaProjekcija(xmin, xmax, ymin, ymax, zmin, zmax) {
        this.mult([[2 / (xmax - xmin), 0, 0, (xmin + xmax) / (xmin - xmax)],
        [0, 2 / (ymax - ymin), 0, (ymin + ymax) / (ymin - ymax)],
        [0, 0, 2 / (zmin - zmax), (zmin + zmax) / (zmin - zmax)],
        [0, 0, 0, 1]]);
    }

    OrtogonalnaProjekcijaX(xmin, xmax, ymin, ymax, zmin, zmax, w, h) {
        let k = (h / w * (xmax - xmin) - (ymax - ymin)) / 2;
        let y1 = ymin - k;
        let y2 = ymax + k;
        this.OrtogonalnaProjekcija(xmin, xmax, y1, y2, zmin, zmax);
    }

    OrtogonalnaProjekcijaY(xmin, xmax, ymin, ymax, zmin, zmax, w, h) {
        let k = (w / h * (ymax - ymin) - (xmax - xmin)) / 2;
        let x1 = xmin - k;
        let x2 = xmax + k;
        this.OrtogonalnaProjekcija(x1, x2, ymin, ymax, zmin, zmax);
    }

    postaviKameru(x0, y0, z0, x1, y1, z1, Vx, Vy, Vz) {
        let V = [Vx, Vy, Vz];
        let normaN = Math.sqrt((x0 - x1) * (x0 - x1) + (y0 - y1) * (y0 - y1) + (z0 - z1) * (z0 - z1));
        let n = [(x0 - x1) / normaN, (y0 - y1) / normaN, (z0 - z1) / normaN];
        let U = this.VP(V, n);
        let normaU = Math.sqrt(U[0] * U[0] + U[1] * U[1] + U[2] * U[2]);
        let u = [U[0] / normaU, U[1] / normaU, U[2] / normaU];
        let v = this.VP(n, u);
        let mtr = [
            [u[0], u[1], u[2], -u[0] * x0 - u[1] * y0 - u[2] * z0],
            [v[0], v[1], v[2], -v[0] * x0 - v[1] * y0 - v[2] * z0],
            [n[0], n[1], n[2], -n[0] * x0 - n[1] * y0 - n[2] * z0],
            [0, 0, 0, 1]
        ];
        this._kamera = mtr;
    }

    PerspektivnaProjekcija(xmin, xmax, ymin, ymax, zmin, zmax) {
        this._projekcija = [[2 * zmin / (xmax - xmin), 0, (xmax + xmin) / (xmax - xmin), 0],
        [0, 2 * zmin / (ymax - ymin), (ymax + ymin) / (ymax - ymin), 0],
        [0, 0, (zmin + zmax) / (zmin - zmax), 2 * zmin * zmax / (zmin - zmax)],
        [0, 0, -1, 0]];
    }

    PerspektivnaProjekcijaX(xmin, xmax, ymin, ymax, zmin, zmax, w, h) {
        let k = (h / w * (xmax - xmin) - (ymax - ymin)) / 2;
        let y1 = ymin - k;
        let y2 = ymax + k;
        this.PerspektivnaProjekcija(xmin, xmax, y1, y2, zmin, zmax);
    }

    PerspektivnaProjekcijaY(xmin, xmax, ymin, ymax, zmin, zmax, w, h) {
        let k = (w / h * (ymax - ymin) - (xmax - xmin)) / 2;
        let x1 = xmin - k;
        let x2 = xmax + k;
        this.PerspektivnaProjekcija(x1, x2, ymin, ymax, zmin, zmax);
    }

    Perspektiva(theta, omjer, near, far) {
        let top = near * Math.tan(theta * Math.PI / 360);
        let right = omjer * top;
        this.PerspektivnaProjekcija(-right, right, -top, top, near, far);
    }

    lista() {
        var v = [];
        for (var i = 0; i < 4; i++)
            for (var j = 0; j < 4; j++)
                v.push(this._matrica[j][i]);
        return v;
    }
}