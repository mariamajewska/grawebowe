import { Gracz } from './Gracz';
import { Vector2 } from './Vector2';
import { Line } from './Line';
enum MozliweZamknieciaKwadratow {
    kwadratgora,
    kwadratdol,
    kwadratprawy,
    kwadratlewy,
    /**kwadraty poziom zamykają kwadraty przy środkowej lini pionowej  */
    kwadratypoziom,
    /**kwadraty pion zamykają kwadraty przy środkowej lini poziomej  */
    kwadratypion,
    pustakreskapoziompion
}

//**Cała Plansza */
export class Game {
    //**Płótno */
    private readonly canvas: HTMLCanvasElement;
    private readonly context: CanvasRenderingContext2D;
    //**Liczba kolumn */
    private readonly iloscKolumn: number;
    //**Liczba rzędów */
    private readonly iloscRzedow: number;
    //**Grubość linii */
    private readonly gruboscLini: number;
    //**długość liniii */
    private readonly dlugoscLini: number;
    //*Tablica wszystkich linii */
    private readonly poziomeLinie: Line[];
    private readonly pionoweLinie: Line[];


    private turaGracza1: boolean = true //deklaracja zmiennej/
    
    //Gracze 
    private gracz1: Gracz = new Gracz("#ff3333")
    private gracz2: Gracz = new Gracz("#4d79ff")


    /** Constructor. Nowa gra, ustalam liczbe 'kwadratów', rysuje na canvasie */
    constructor(canvas: HTMLCanvasElement, iloscKolumn: number, iloscRzedow: number, gruboscLini: number, dlugoscLini: number) {
        this.iloscKolumn = iloscKolumn = 11;
        this.iloscRzedow = iloscRzedow = 11;
        this.gruboscLini = gruboscLini = 10;
        this.dlugoscLini = dlugoscLini = 80;
        this.canvas = canvas;
        this.context = canvas.getContext("2d");

        // array to przechowywania linii
        this.poziomeLinie = new Array<Line>(iloscRzedow);
        this.pionoweLinie = new Array<Line>(iloscKolumn);
        this.CreateBoxes();

        // tutaj podpina się lisiener do eventu, tem event się wywołuje za każdym razem gdy ktoś naciśnie
        this.canvas.addEventListener("click", this.OnClick.bind(this));
    }

      //**Funkcja która się wywołuje gdy gracz nacisnie gdzieś na planszy */
      OnClick(event: MouseEvent): void {
        let pozycjaKlikniecia = new Vector2(event.x, event.y); //bierzemy pozycję i robimy zniej vector

        console.log("Ktoś kliknął na pozycję x: " + pozycjaKlikniecia.x + " y: " + pozycjaKlikniecia.y); //wypisujemy do kosnolii infomacje o pozycji kliknięcia

        //przechodzimy przez wszystkie pionowe linie i sprawdzamy czy któraś jest kliknięta
        for (let y = 0; y < this.pionoweLinie.length; y++) {

            if (this.pionoweLinie[y].CheckForCollision(pozycjaKlikniecia)) {
                console.log("kliknięcie linii pionowej: " + y);
                if (this.pionoweLinie[y].owner === null) {

                    if (this.turaGracza1 === true) {

                        this.context.strokeStyle = this.gracz1.kolorgracza
                        this.pionoweLinie[y].Rysuj(this.context)
                        this.pionoweLinie[y].owner = this.gracz1
                    }
                    else {

                        this.context.strokeStyle = this.gracz2.kolorgracza
                        this.pionoweLinie[y].Rysuj(this.context)
                        this.pionoweLinie[y].owner = this.gracz2
                    }
            
                    this.ObslozZamkniecieKwadratu(this.JakSieKwadratyZamykaja(y, false), y) // sprawdzamy czy są punkty do rozdania 
                    this.turaGracza1 = !this.turaGracza1

                    return //jeżeli grzacz kliknie i zostanie znaleziona kolizja dla pierwszej fukcji to nie będzie już tego wykonywał
                }
            }
        }

        for (let x = 0; x < this.poziomeLinie.length; x++) {

            if (this.poziomeLinie[x].CheckForCollision(pozycjaKlikniecia)) {
                console.log("kliknięcie linii pionowej: " + x);
                if (this.poziomeLinie[x].owner === null) {

                    if (this.turaGracza1 === true) {

                        this.context.strokeStyle = this.gracz1.kolorgracza
                        this.poziomeLinie[x].Rysuj(this.context)
                        this.poziomeLinie[x].owner = this.gracz1
                    }
                    else {

                        this.context.strokeStyle = this.gracz2.kolorgracza
                        this.poziomeLinie[x].Rysuj(this.context)
                        this.poziomeLinie[x].owner = this.gracz2
                    }

                    this.ObslozZamkniecieKwadratu(this.JakSieKwadratyZamykaja(x, true), x)
                    this.turaGracza1 = !this.turaGracza1

                    break
                }
            }
        }
    }


 //**Pętle które tworzą linie poziome i pionowe przez co tworzą plansze do gry */
 private CreateBoxes(): void {
    this.context.strokeStyle = "#b3b3b3";
    for (let x = 0; x < this.iloscKolumn; x++) {
        for (let y = 0; y < this.iloscRzedow; y++) {
            const lineStart = new Vector2(x * this.dlugoscLini, y * this.dlugoscLini);
            const lineEnd = new Vector2((x + 1) * this.dlugoscLini, y * this.dlugoscLini);
            const newLine = new Line(this.gruboscLini, lineStart, lineEnd);
            newLine.Rysuj(this.context);
            this.poziomeLinie[(x * this.iloscKolumn) + y] = newLine;
        }
    }
    for (let x = 0; x < this.iloscKolumn; x++) {
        for (let y = 0; y < this.iloscRzedow; y++) {
            const lineStart = new Vector2(x * this.dlugoscLini, y * this.dlugoscLini);
            const lineEnd = new Vector2(x * this.dlugoscLini, (y + 1) * this.dlugoscLini);
            const newLine = new Line(this.gruboscLini, lineStart, lineEnd);
            newLine.Rysuj(this.context);
            this.pionoweLinie[(x * this.iloscKolumn) + y] = newLine;
        }
    }
}

    /** ...I czy wgl */
    JakSieKwadratyZamykaja(linia: number, jestPozioma: boolean): MozliweZamknieciaKwadratow {
        if (jestPozioma) {
            const clickedLine = this.poziomeLinie[linia];
            let jakKwadratNad = false;
            let jakKwadratPod = false;

            const LiniaPod = this.poziomeLinie.length < linia + 1 ? null : this.poziomeLinie[linia + 1]; //sprawdzamy czy długość tablicy poiome linie jest mniejsza niż id klikietej linii +1, żeby sprawdzić czy jest wgl jakaś linia pod/
            const LiniaNad = 0 > linia - 1 ? null : this.poziomeLinie[linia - 1]; 

            if (LiniaNad != null && LiniaNad.owner != null) { //jeżeli lina nad nie jest nullem i owner nie jest nullem to szukamy lini po prawej i polewej stronie 
                const liniaLewa = 0 > linia - 1 ? null : this.pionoweLinie[linia - 1];
                const liniaPrawa = this.pionoweLinie.length < linia + this.iloscRzedow - 1 ? null : this.pionoweLinie[linia + this.iloscRzedow - 1];
                if (liniaLewa != null && liniaLewa.owner != null && liniaPrawa != null && liniaPrawa.owner != null) jakKwadratNad = true; //jeżeli linia nad kliknieta i z lewej prawej są klinięte to wtedy zamkniecie kwadratu
            }

            if (LiniaPod != null && LiniaPod.owner != null) { 
                const liniaLewa = this.pionoweLinie.length < linia ? null : this.pionoweLinie[linia];
                const liniaPrawa = this.pionoweLinie.length < linia + this.iloscRzedow ? null : this.pionoweLinie[linia + this.iloscRzedow];
                if (liniaLewa != null && liniaLewa.owner != null && liniaPrawa != null && liniaPrawa.owner != null) jakKwadratPod = true; // tu to samo tylko pod
            }

            if(jakKwadratNad){
                if(jakKwadratPod) return MozliweZamknieciaKwadratow.kwadratypion;
                else return MozliweZamknieciaKwadratow.kwadratgora;
            }else if(jakKwadratPod){
                return MozliweZamknieciaKwadratow.kwadratdol;
            }else{
                return MozliweZamknieciaKwadratow.pustakreskapoziompion
            }
        }
        // rozważamy dla linii pionowej
        else {
            const clickedLine = this.pionoweLinie[linia];
            let jakKwadratPrawy = false;
            let jakKradratLewy = false;

            const liniaLewa = 0 > linia - this.iloscRzedow ? null : this.pionoweLinie[linia - this.iloscRzedow];
            const liniaPrawa = 0 > linia + this.iloscRzedow ? null : this.pionoweLinie[linia + this.iloscRzedow];

            if (liniaPrawa != null && liniaPrawa.owner != null) {
                const liniaPod = this.poziomeLinie.length < linia + 1 ? null : this.poziomeLinie[linia + 1];
                const liniaNad = this.poziomeLinie.length < linia ? null : this.poziomeLinie[linia];
                if (liniaPod != null && liniaPod.owner != null && liniaNad != null && liniaNad.owner != null) jakKwadratPrawy = true;
            }

            if (liniaLewa != null && liniaLewa.owner != null) {
                const liniaPod = 0 > (linia - this.iloscRzedow) + 1 ? null : this.poziomeLinie[(linia - this.iloscRzedow) + 1];
                const liniaNad = 0 > linia - this.iloscRzedow ? null : this.poziomeLinie[linia - this.iloscRzedow];
                if (liniaPod != null && liniaPod.owner != null && liniaNad != null && liniaNad.owner != null) jakKradratLewy = true;
            } 

            if(jakKwadratPrawy){
                if(jakKradratLewy) return MozliweZamknieciaKwadratow.kwadratypoziom;
                else return MozliweZamknieciaKwadratow.kwadratprawy;
            }else if(jakKradratLewy){
                return MozliweZamknieciaKwadratow.kwadratlewy;
            }else{
                return MozliweZamknieciaKwadratow.pustakreskapoziompion
            }
        }
    }


    private ObslozZamkniecieKwadratu(zamkniecie: MozliweZamknieciaKwadratow, idLini: number): void
    {
        // dodajemy punky
        switch (zamkniecie) {
            case MozliweZamknieciaKwadratow.kwadratdol:
            case MozliweZamknieciaKwadratow.kwadratgora:
            case MozliweZamknieciaKwadratow.kwadratlewy:
            case MozliweZamknieciaKwadratow.kwadratprawy: //wszystkie casy mają wykonć ten sam kod
                if (this.turaGracza1){
                    this.gracz1.punkty++;
                    console.log("gracz 1 +1 pkt");
                } else{
                    this.gracz2.punkty++;
                    console.log("gracz 2 +1 pkt");
                }
                break;
            case MozliweZamknieciaKwadratow.kwadratypion:
            case MozliweZamknieciaKwadratow.kwadratypoziom:
                if (this.turaGracza1){
                    this.gracz1.punkty += 2;
                    console.log("gracz 1 +2 pkt");
                } else{
                    this.gracz2.punkty += 2;
                    console.log("gracz 2 +2 pkt");
                }
                break;
        }

        // rysujemy kwadraty
        switch (zamkniecie)
        {
            case MozliweZamknieciaKwadratow.kwadratdol:
                this.NarysojKwadrat(this.poziomeLinie[idLini].endA, this.poziomeLinie[idLini + 1].endB, this.turaGracza1 ?  this.gracz1.kolorgracza:this.gracz2.kolorgracza);
                break;
            case MozliweZamknieciaKwadratow.kwadratgora:
                this.NarysojKwadrat(this.poziomeLinie[idLini].endA, this.poziomeLinie[idLini - 1].endB, this.turaGracza1 ?  this.gracz1.kolorgracza:this.gracz2.kolorgracza);
                break;
            case MozliweZamknieciaKwadratow.kwadratlewy:
                this.NarysojKwadrat(this.pionoweLinie[idLini].endB, this.poziomeLinie[idLini - this.iloscKolumn].endA, this.turaGracza1 ?  this.gracz1.kolorgracza:this.gracz2.kolorgracza);
                break;
            case MozliweZamknieciaKwadratow.kwadratprawy:
                this.NarysojKwadrat(this.pionoweLinie[idLini].endB, this.poziomeLinie[idLini + this.iloscKolumn].endA, this.turaGracza1 ?  this.gracz1.kolorgracza:this.gracz2.kolorgracza);
                break;
            case MozliweZamknieciaKwadratow.kwadratypion:
                this.NarysojKwadrat(this.poziomeLinie[idLini].endA, this.poziomeLinie[idLini + 1].endB, this.turaGracza1 ?  this.gracz1.kolorgracza:this.gracz2.kolorgracza);
                this.NarysojKwadrat(this.poziomeLinie[idLini].endA, this.poziomeLinie[idLini - 1].endB, this.turaGracza1 ?  this.gracz1.kolorgracza:this.gracz2.kolorgracza);
                break;
            case MozliweZamknieciaKwadratow.kwadratypoziom:
                this.NarysojKwadrat(this.pionoweLinie[idLini].endB, this.poziomeLinie[idLini - this.iloscKolumn].endA, this.turaGracza1 ?  this.gracz1.kolorgracza:this.gracz2.kolorgracza);
                this.NarysojKwadrat(this.pionoweLinie[idLini].endB, this.poziomeLinie[idLini + this.iloscKolumn].endA, this.turaGracza1 ?  this.gracz1.kolorgracza:this.gracz2.kolorgracza);
                break;
        }
    }

    private NarysojKwadrat(lewyGorny: Vector2, prawyDolny: Vector2, kolor: string): void
    {
        this.context.fillStyle = kolor;
        this.context.fillRect(lewyGorny.x, lewyGorny.y, prawyDolny.x - lewyGorny.x, prawyDolny.y - lewyGorny.y)
    }

   
}