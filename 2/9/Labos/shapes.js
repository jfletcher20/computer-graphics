class Shapes {
    static valjak(r, h, n) {
        var vrhovi = [];
        
        // n-terokut - donja baza valjka na z = -h / 2
        // vektori normale su prema dolje, tj. [0, 0, -1]
        vrhovi.push(0, 0, -h / 2, 0, 0, -1); // središte za TRIANGLE_FAN
        let phi = 2 * Math.PI / n;
        for (let i = 0; i <= n; i++) {
            vrhovi.push(r * Math.cos(phi), r * Math.sin(phi), -h / 2, 0, 0, -1);
            phi += 2 * Math.PI / n;
        }

        // n-terokut - gornja baza valjka na z = h / 2
        // vektori normale su prema gore, tj. [0, 0, 1]
        vrhovi.push(0, 0, h / 2, 0, 0, 1); // središte za TRIANGLE_FAN
        phi = 2 * Math.PI;
        for (let i = 0; i <= n; i++) {
            vrhovi.push(r * Math.cos(phi), r * Math.sin(phi), h / 2, 0, 0, 1);
            phi -= 2 * Math.PI / n;
        }

        // plašt valjka
        phi = 0;
        for (let i = 0; i <= n; i++) {
            let c = Math.cos(phi);
            let s = Math.sin(phi);
            let x = r * c;
            let y = r * s;
            vrhovi.push(x, y, -h / 2, c, s, 0);
            vrhovi.push(x, y, h / 2, c, s, 0);
            phi += 2 * Math.PI / n;
        }

        console.log("vrhovi.length: ", vrhovi.length);
        return vrhovi;
    }
}