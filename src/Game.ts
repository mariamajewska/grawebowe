import { Player } from './Player';
import { Vector2 } from './Vector2';
import { Line } from './Line';


//**Cała Plansza */
export class Game {
    //**Płótno */
    private readonly canvas: HTMLCanvasElement;
    private readonly context: CanvasRenderingContext2D;
    //**Liczba kolumn */
    private readonly columnNumber: number;
    //**Liczba rzędów */
    private readonly rowNumber: number;
    //**Grubość linii */
    private readonly lineThickness: number;
    //**długość liniii */
    private readonly lineLength: number;
    //*Tablica wszystkich linii */
    private readonly poziomeLinie: Line[];
    private readonly pionoweLinie: Line[];

    //Gracze 
    private gracz1: Player = new Player("red")
    private gracz2: Player = new Player("blue")

    private turaGracza1: boolean = true

    /** Constructor. Nowa gra, ustalam liczbe planszy, rysuje na canvasie */
    constructor(canvas: HTMLCanvasElement, columnNumber: number, rowNumber: number, lineThickness: number, lineLength: number) {
        this.columnNumber = columnNumber = 100;
        this.rowNumber = rowNumber = 100;
        this.lineThickness = lineThickness = 10;
        this.lineLength = lineLength = 80;
        this.canvas = canvas;
        this.context = canvas.getContext("2d");


        // array to przechowywania linii

        this.poziomeLinie = new Array<Line>(rowNumber);
        this.pionoweLinie = new Array<Line>(columnNumber);
        this.CreateBoxes();


        // tutaj wywołuje się akcja kiedy ktoś coś naciśnie
        this.canvas.addEventListener("click", this.OnClick.bind(this));
    }

    //**Funkcja która się wywołuje gdy gracz nacisnie gdzieś na planszy */
    OnClick(event: MouseEvent): void {
        let clickPosition = new Vector2(event.x, event.y);

        console.log("Someone clicked in position x: " + clickPosition.x + " y: " + clickPosition.y);


        for (let y = 0; y < this.pionoweLinie.length; y++) {

            if (this.pionoweLinie[y].CheckForCollision(clickPosition)) {

                if (this.pionoweLinie[y].owner === null) {

                    if (this.turaGracza1 === true) {

                        this.turaGracza1 = false
                        this.context.strokeStyle = this.gracz1.kolorgracza
                        this.pionoweLinie[y].Draw(this.context)
                        this.pionoweLinie[y].owner = this.gracz1
                    }
                    else {

                        this.turaGracza1 = true
                        this.context.strokeStyle = this.gracz2.kolorgracza
                        this.pionoweLinie[y].Draw(this.context)
                        this.pionoweLinie[y].owner = this.gracz2
                    }
                    return //jeżeli grzacz kliknie i zostanie znaleziona kolizja dla pierwszej fukcji to nie będzie już tego wykobywał
                }
            }
        }

        for (let x = 0; x < this.poziomeLinie.length; x++) {

            if (this.poziomeLinie[x].CheckForCollision(clickPosition)) {

                if (this.poziomeLinie[x].owner === null) {

                    if (this.turaGracza1 === true) {

                        this.turaGracza1 = false
                        this.context.strokeStyle = this.gracz1.kolorgracza
                        this.poziomeLinie[x].Draw(this.context)
                        this.poziomeLinie[x].owner = this.gracz1
                    }
                    else {

                        this.turaGracza1 = true
                        this.context.strokeStyle = this.gracz2.kolorgracza
                        this.poziomeLinie[x].Draw(this.context)
                        this.poziomeLinie[x].owner = this.gracz2
                    }
                }
            }
        }
    }

    //**Pętle które tworzą linie poziome i pionowe przez co tworzą plansze do gry */
    private CreateBoxes(): void {
        for (let x = 0; x < this.columnNumber; x++) {
            for (let y = 0; y < this.rowNumber; y++) {
                const lineStart = new Vector2(x * this.lineLength, y * this.lineLength);
                const lineEnd = new Vector2((x + 1) * this.lineLength, y * this.lineLength);
                const newLine = new Line(this.lineThickness, lineStart, lineEnd);
                newLine.Draw(this.context);
                this.poziomeLinie[(x * this.columnNumber) + y] = newLine;

            }
        }

        for (let x = 0; x < this.columnNumber; x++) {
            for (let y = 0; y < this.rowNumber; y++) {
                const lineStart = new Vector2(x * this.lineLength, y * this.lineLength);
                const lineEnd = new Vector2(x * this.lineLength, (y + 1) * this.lineLength);
                const newLine = new Line(this.lineThickness, lineStart, lineEnd);
                newLine.Draw(this.context);
                this.pionoweLinie[(x * this.columnNumber) + y] = newLine;

            }
        }
    }
}