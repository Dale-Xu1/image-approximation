import { Scanline } from "$lib/Image"
import { Color4, Random, Vector2 } from "../Math"
import Shape, { ANGLE_SD, DIMENSION_SD, MIN_WIDTH, POSITION_SD, RANGE } from "./Shape"

export default class Triangle extends Shape
{

    public constructor(private readonly a: Vector2, private readonly b: Vector2, private readonly c: Vector2,
        color: Color4) { super(color) }

    public static random(width: number, height: number): Triangle
    {
        let position = Vector2.random(width, height)
        let offset = new Vector2(RANGE / 2, RANGE / 2)

        let a = position.add(Vector2.random(RANGE, RANGE)).sub(offset)
        let b = position.add(Vector2.random(RANGE, RANGE)).sub(offset)
        let c = position.add(Vector2.random(RANGE, RANGE)).sub(offset)

        // Reject if triangle is too thin
        if (this.thin(a, b, c)) return Triangle.random(width, height)

        let color = Color4.random()
        return new Triangle(a, b, c, color)
    }

    private static thin(a: Vector2, b: Vector2, c: Vector2): boolean
    {
        // Find length of longest side
        const max = Math.max(Vector2.dist(a, b), Vector2.dist(b, c), Vector2.dist(c, a))
        const area = a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y)

        const s = area / (2 * MIN_WIDTH)
        return s < max
    }


    private shift(): Triangle
    {
        let a = this.a.add(Vector2.normal(DIMENSION_SD))
        let b = this.b.add(Vector2.normal(DIMENSION_SD))
        let c = this.c.add(Vector2.normal(DIMENSION_SD))

        // Reject if triangle is too thin
        if (Triangle.thin(a, b, c)) return this.shift()
        return new Triangle(a, b, c, this.color)
    }

    public mutate(): Triangle
    {
        let a = this.a, b = this.b, c = this.c, color = this.color
        switch (Random.int(4))
        {
            case 0:
            {
                let d = Vector2.normal(POSITION_SD)

                a = a.add(d)
                b = b.add(d)
                c = c.add(d)
                break   
            }
            case 1: return this.shift()
            case 2:
            {
                let center = a.add(b).add(c).div(3)
                let d = Random.normal(ANGLE_SD)

                a = a.sub(center).rotate(d).add(center)
                b = b.sub(center).rotate(d).add(center)
                c = c.sub(center).rotate(d).add(center)
                break
            }
            case 3: color = this.mutateColor(); break
        }

        return new Triangle(a, b, c, color)
    }


    public rasterize(): Scanline[]
    {
        // Order vertices in order of height with a being the highest
        let a = this.a.trunc(), b = this.b.trunc(), c = this.c.trunc()
        if (a.y > b.y) [a, b] = [b, a]
        if (a.y > c.y) [a, c] = [c, a]
        if (b.y > c.y) [b, c] = [c, b]

        if (b.y === c.y) return this.fillFlatBottom(a, b, c)
        else if (a.y === b.y) return this.fillFlatTop(a, b, c)
        else
        {
            let d = new Vector2(Math.trunc(a.x + (b.y - a.y) / (c.y - a.y) * (c.x - a.x)), b.y)
            return this.fillFlatBottom(a, b, d).concat(this.fillFlatTop(b, d, c))
        }
    }

    private fillFlatBottom(a: Vector2, b: Vector2, c: Vector2): Scanline[]
    {
        let s1 = (b.x - a.x) / (b.y - a.y)
        let s2 = (c.x - a.x) / (c.y - a.y)
        if (s1 > s2) [s1, s2] = [s2, s1]

        let x1 = a.x
        let x2 = a.x

        let lines: Scanline[] = []
        for (let y = a.y; y <= b.y; y++)
        {
            lines.push(new Scanline(y, Math.trunc(x1), Math.trunc(x2)))

            x1 += s1
            x2 += s2
        }

        return lines
    }

    private fillFlatTop(a: Vector2, b: Vector2, c: Vector2): Scanline[]
    {
        if (a.x > b.x) [a, b] = [b, a]
        let s1 = (c.x - a.x) / (c.y - a.y)
        let s2 = (c.x - b.x) / (c.y - b.y)

        let x1 = a.x
        let x2 = b.x

        let lines: Scanline[] = []
        for (let y = a.y; y <= c.y; y++)
        {
            lines.push(new Scanline(y, Math.trunc(x1), Math.trunc(x2)))

            x1 += s1
            x2 += s2
        }

        return lines
    }

    public render(c: CanvasRenderingContext2D): void
    {
        c.beginPath()
        c.moveTo(this.a.x, this.a.y)
        c.lineTo(this.b.x, this.b.y)
        c.lineTo(this.c.x, this.c.y)

        c.fillStyle = this.color.style
        c.fill()
    }

}
