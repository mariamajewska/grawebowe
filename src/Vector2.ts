/**punkt */
export class Vector2
{
    public readonly x: number;
    public readonly y: number;

    constructor(x: number, y: number)
    {
        this.x = x;
        this.y = y;
    }

    //**dodaje 2 współrzędne i daje wynik */
    static Add(a: Vector2, b: Vector2): Vector2
    {
        return new Vector2(a.x + b.x, a.y + b.y);
    }


    static Multiply(vector: Vector2, multipiler: number)
    {
        return new Vector2(vector.x * multipiler, vector.y * multipiler);
    }
}