export class Vector2
{

    public constructor(public x: number, public y: number) { }

    public static random(width: number, height: number): Vector2
    {
        return new Vector2(Math.random() * width, Math.random() * height)
    }

    public static normalValue(sd: number): number
    {
        let u = 1 - Math.random()
        let v = 1 - Math.random()

        return Math.sqrt(-2 * Math.log(u)) * Math.sin(2 * Math.PI * v) * sd
    }

    public static normal(sd: number): Vector2
    {
        return new Vector2(Vector2.normalValue(sd), Vector2.normalValue(sd))
    }


    public add(vector: Vector2): Vector2
    {
        return new Vector2(this.x + vector.x, this.y + vector.y)
    }
    
    public sub(vector: Vector2): Vector2
    {
        return new Vector2(this.x - vector.x, this.y - vector.y)
    }

}

export class Color4
{

    public constructor(public r: number, public g: number, public b: number, public a: number = 1) { }

    public static random(): Color4
    {
        return new Color4(Math.random(), Math.random(), Math.random(), Math.random())
    }


    public get style(): string { return `rgba(${this.r * 255}, ${this.g * 255}, ${this.b * 255}, ${this.a})` }

}
