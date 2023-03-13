import Constants from "../approximator/Constants"
import type { Raster } from "../approximator/Image"

export default abstract class Shape
{

    public constructor(public readonly color: Color4) { }


    public abstract mutate(): Shape
    public abstract rasterize(): Raster
    public abstract render(c: CanvasRenderingContext2D): void

    private clamp(x: number): number { return Math.min(Math.max(x, 0), 1) }
    protected mutateColor(): Color4
    {
        let r = this.clamp(this.color.r + Random.normal(Constants.COLOR_SD))
        let g = this.clamp(this.color.g + Random.normal(Constants.COLOR_SD))
        let b = this.clamp(this.color.b + Random.normal(Constants.COLOR_SD))
        let a = this.color.a

        return new Color4(r, g, b, a)
    }

}

export class Random
{

    public static next(range: number = 1): number { return Math.random() * range }
    public static range(min: number, max: number): number { return Random.next(max - min) + min }

    public static int(range: number): number { return Math.trunc(Random.next(range)) }

    public static normal(sd: number): number
    {
        let u = 1 - Math.random()
        let v = 1 - Math.random()

        return Math.sqrt(-2 * Math.log(u)) * Math.sin(2 * Math.PI * v) * sd
    }

}

export class Vector2
{

    public constructor(public readonly x: number, public readonly y: number) { }

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

    public trunc(): Vector2 { return new Vector2(Math.trunc(this.x), Math.trunc(this.y)) }

}

export class Color4
{

    public constructor(public readonly r: number, public readonly g: number, public readonly b: number,
        public readonly a: number = 1) { }

    public static random(): Color4
    {
        return new Color4(Random.next(), Random.next(), Random.next(), Random.range(Constants.MIN_ALPHA, 1))
    }


    public get style(): string { return `rgba(${this.r * 255}, ${this.g * 255}, ${this.b * 255}, ${this.a})` }

}
