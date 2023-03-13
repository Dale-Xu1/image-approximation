import Constants from "../approximator/Constants"
import { Raster, Scanline } from "../approximator/Image"
import Shape, { Color4, Random, Vector2 } from "./Shape"

export default class Rectangle extends Shape
{

    public constructor(public readonly position: Vector2, public readonly a: number,
        public readonly w: number, public readonly h: number, color: Color4) { super(color) }

    public static random(width: number, height: number): Rectangle
    {
        let position = Vector2.random(width, height)
        let a = Random.next(2 * Math.PI)

        let w = Random.next(Constants.RANGE) + Constants.MIN_WIDTH
        let h = Random.next(Constants.RANGE) + Constants.MIN_WIDTH

        let color = Color4.random()
        return new Rectangle(position, a, w, h, color)
    }


    public mutate(): Rectangle
    {
        let position = this.position, a = this.a, w = this.w, h = this.h, color = this.color
        switch (Random.int(4))
        {
            case 0: position = position.add(Vector2.normal(Constants.POSITION_SD)); break
            case 1:
            {
                w += Random.normal(Constants.DIMENSION_SD)
                h += Random.normal(Constants.DIMENSION_SD)

                if (w < Constants.MIN_WIDTH) w = Constants.MIN_WIDTH
                if (h < Constants.MIN_WIDTH) h = Constants.MIN_WIDTH
                break
            }
            case 2: a += Random.normal(Constants.ANGLE_SD); break
            case 3: color = this.mutateColor(); break
        }

        return new Rectangle(position, a, w, h, color)
    }

    public rasterize(): Raster
    {
        let a = this.position.add(new Vector2(-this.w / 2, -this.h / 2).rotate(this.a)).trunc()
        let b = this.position.add(new Vector2(-this.w / 2, this.h / 2).rotate(this.a)).trunc()
        let c = this.position.add(new Vector2(this.w / 2, this.h / 2).rotate(this.a)).trunc()
        let d = this.position.add(new Vector2(this.w / 2, -this.h / 2).rotate(this.a)).trunc()

        let start = Math.min(Math.min(Math.min(a.y, b.y), c.y), d.y)
        let end = Math.max(Math.max(Math.max(a.y, b.y), c.y), d.y)
        let n = end - start + 1

        let min: number[] = []
        let max: number[] = []
        for (let i = 0; i < n; i++)
        {
            min[i] = Infinity
            max[i] = -Infinity
        }

        scanEdge(a, b)
        scanEdge(b, c)
        scanEdge(c, d)
        scanEdge(d, a)
        function scanEdge(a: Vector2, b: Vector2)
        {
            if (a.y > b.y) [a, b] = [b, a]
            let s = (b.x - a.x) / (b.y - a.y)
    
            let x = a.x
            for (let y = a.y; y <= b.y; y++)
            {
                let i = y - start
                let v = Math.trunc(x)

                if (v < min[i]) min[i] = v
                if (v > max[i]) max[i] = v

                x += s
            }
        }

        // Convert min and max data to scanlines
        let lines: Scanline[] = []
        for (let i = 0; i < n; i++) lines.push(new Scanline(start + i, min[i], max[i]))

        return new Raster(lines)
    }

    public render(c: CanvasRenderingContext2D): void
    {
        c.save()
        c.translate(this.position.x, this.position.y)
        c.rotate(this.a)

        c.fillStyle = this.color.style
        c.fillRect(-this.w / 2, -this.h / 2, this.w, this.h)
        
        c.restore()
    }

}
