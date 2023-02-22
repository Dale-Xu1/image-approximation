import Constants from "../Constants"
import { Raster, Scanline } from "../Image"
import { Color4, Random, Vector2 } from "./Math"
import Shape from "./Shape"

export default class Ellipse extends Shape
{

    public constructor(public readonly position: Vector2, public readonly a: number,
        public readonly w: number, public readonly h: number, color: Color4) { super(color) }

    public static random(width: number, height: number): Ellipse
    {
        let position = Vector2.random(width, height)
        let a = Random.next(2 * Math.PI)

        let w = Random.next(Constants.RANGE) + Constants.MIN_WIDTH
        let h = Random.next(Constants.RANGE) + Constants.MIN_WIDTH

        let color = Color4.random()
        return new Ellipse(position, a, w, h, color)
    }


    public mutate(): Ellipse
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

        return new Ellipse(position, a, w, h, color)
    }


    public rasterize(): Raster
    {
        let lines: Scanline[] = []
        let [w, h, m] = this.sheared(this.w / 2, this.h / 2, this.a)

        let px = this.position.x
        let py = Math.trunc(this.position.y)

        function addLine(x1: number, x2: number, y: number)
        {
            let t1 = Math.trunc(px + x1 + m * y)
            let t2 = Math.trunc(px + x2 + m * y)

            let line = new Scanline(py + y, t1, t2)

            if (y > 0) lines.push(line)
            else lines.unshift(line)
        }

        let x = w
        let y = 0

        let dx = 2 * h * h * x
        let dy = 2 * w * w * y

        let d1 = w * w - h * h * w + h * h / 4

        addLine(-x, x, y)
        while (dx > dy)
        {
            y++
            dy += 2 * w * w

            if (d1 < 0) d1 += dy + (w * w)
            else
            {
                x--
                dx -= 2 * h * h
                d1 += dy - dx + w * w
            }

            addLine(-x, x, y)
            addLine(-x, x, -y)
        }

        let d2 = w * w * (y + 0.5) * (y + 0.5) + h * h * (x - 1) * (x - 1) - w * w * h * h
        while (x >= 0)
        {
            x--
            dx -= 2 * h * h

            if (d2 > 0) d2 += h * h - dx
            else
            {
                y++
                dy += 2 * w * w
                d2 += dy - dx + h * h

                addLine(-x, x, y)
                addLine(-x, x, -y)
            }
        }

        return new Raster(lines)
    }

    private sheared(a: number, b: number, p: number): [number, number, number]
    {
        // Compute sheared axis-aligned ellipse that transforms into this ellipse
        let t = Math.atan2(b / Math.tan(p), a)

        let x0 = a * Math.cos(t) * Math.cos(p) - b * Math.sin(t) * Math.sin(p)
        let y0 = a * Math.cos(t) * Math.sin(p) + b * Math.sin(t) * Math.cos(p)

        let h = Math.abs(y0)
        let w = a * b / h
        let m = x0 / y0

        return [w, h, m]
    }

    public render(c: CanvasRenderingContext2D): void
    {
        c.beginPath()
        c.ellipse(this.position.x, this.position.y, this.w / 2, this.h / 2, this.a, 0, Math.PI * 2)
        c.closePath()

        c.fillStyle = this.color.style
        c.fill()
    }

}
