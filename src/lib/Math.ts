export class Random
{

    public static next(range: number = 1): number { return Math.random() * range }
    public static int(range: number): number { return Math.floor(Random.next(range)) }

    public static normal(sd: number): number
    {
        let u = 1 - Math.random()
        let v = 1 - Math.random()

        return Math.sqrt(-2 * Math.log(u)) * Math.sin(2 * Math.PI * v) * sd
    }

}

export class Vector2
{

    public constructor(public x: number, public y: number) { }

    public static random(width: number, height: number): Vector2
    {
        return new Vector2(Random.next(width), Random.next(height))
    }

    public static normal(sd: number): Vector2
    {
        return new Vector2(Random.normal(sd), Random.normal(sd))
    }

    public static dist(a: Vector2, b: Vector2): number
    {
        let c = a.sub(b)
        return Math.sqrt(c.x ** 2 + c.y ** 2)
    }


    public add(vector: Vector2): Vector2 { return new Vector2(this.x + vector.x, this.y + vector.y) }
    public sub(vector: Vector2): Vector2 { return new Vector2(this.x - vector.x, this.y - vector.y) }

    public mul(value: number): Vector2 { return new Vector2(this.x * value, this.y * value) }
    public div(value: number): Vector2 { return new Vector2(this.x / value, this.y / value) }

    public rotate(a: number): Vector2
    {
        return new Vector2(
            this.x * Math.cos(a) - this.y * Math.sin(a),
            this.x * Math.sin(a) + this.y * Math.cos(a)
        )
    }

}

export class Color4
{

    public constructor(public r: number, public g: number, public b: number, public a: number = 1) { }

    public static random(): Color4
    {
        return new Color4(Math.random(), Math.random(), Math.random(), 0.8)
    }


    public get style(): string { return `rgba(${this.r * 255}, ${this.g * 255}, ${this.b * 255}, ${this.a})` }

}
