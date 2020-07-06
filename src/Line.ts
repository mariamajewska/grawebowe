import { Gracz } from "./Gracz";
import { Vector2 } from "./Vector2";

/**Clasa odpowiadająca za wszystkie linie*/
export class Line
{
    /**grubość lini */
    public readonly thickness: number;
    /**jeden koniec lini */
    public readonly endA: Vector2;
    /**drugi koniec lini */
    public readonly endB: Vector2;
    /**Zanim nikt nie kliknie na linie, player jest ustawiony na null */
    public owner: Gracz = null;
    
    /** constructor tworzy nowe linie, linie muszą być albo pionowe albo poziome*/
    constructor(thickness: number, endA: Vector2, endB: Vector2)
    {
        // rzucamy wyjątek jeśli linia nie jest pozioma albo pionowa
        if (!(endA.x == endB.x || endA.y == endB.y)) throw new Error("This line isn't vertical nor horizontal");

        this.thickness = thickness;
        this.endA = endA;
        this.endB = endB;
    }

    /**sprawdzam czy linia została kliknięta*/
    CheckForCollision(point: Vector2): boolean
    {
        if (this.jestHoryzontalna())
        {
            return (Math.abs(point.y - this.endA.y) <= this.thickness) && ((point.x < this.endA.x && point.x > this.endB.x) || (point.x > this.endA.x && point.x < this.endB.x));
        }
        else
        {
            return (Math.abs(point.x - this.endA.x) <= this.thickness) && ((point.y < this.endA.y && point.y > this.endB.y) || (point.y > this.endA.y && point.y < this.endB.y));
        }
    }

    /**sprawdzam czy linia jest pozioma */
    jestHoryzontalna(): boolean
    {
        return this.endA.y == this.endB.y;
    }
    
    Rysuj(context: CanvasRenderingContext2D)
    {
        let originalWidth = context.lineWidth;
        context.lineWidth = this.thickness;
        context.beginPath();
        context.moveTo(this.endA.x, this.endA.y);
        context.lineTo(this.endB.x, this.endB.y);
        context.stroke();
        context.lineWidth = originalWidth;
    }
}