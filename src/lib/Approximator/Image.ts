import type { Color4 } from "../Shape/Math"
import type Shape from "../Shape/Shape"

export default class Image
{

    public readonly shapes: Shape[] = []

    public constructor(private readonly c: CanvasRenderingContext2D,
        private readonly width: number, private readonly height: number,
        public readonly background: Color4) { }

    public static dimensions(max: number, ratio: number): [number, number]
    {
        if (ratio > 1) return [max, Math.floor(max / ratio)]
        else return [Math.floor(max * ratio), max]
    }


    public get data() { return this.c.getImageData(0, 0, this.width, this.height) }
    private image!: ImageData

    public render(c: CanvasRenderingContext2D = this.c)
    {
        c.fillStyle = this.background.style
        c.fillRect(0, 0, this.width, this.height)

        for (let shape of this.shapes) shape.render(c)
        this.image = this.data
    }

    public export(width: number, height: number): string
    {
        let canvas = document.createElement("canvas")
        let c = canvas.getContext("2d")!

        canvas.width = width
        canvas.height = height

        c.scale(width / this.width, height / this.height)
        this.render(c)

        return canvas.toDataURL()
    }


    public error(target: ImageData): number
    {
        let t = target.data, c = this.image.data
        let sum = 0

        for (let i = 0; i < t.length; i += 4)
        {
            let r = t[i] - c[i]
            let g = t[i + 1] - c[i + 1]
            let b = t[i + 2] - c[i + 2]

            sum += r * r + g * g + b * b
        }

        let n = this.width * this.height * 3
        return Math.sqrt(sum / n)
    }

    private lerp(a: number, b: number, alpha: number): number { return a * (1 - alpha) + b * alpha }
    public partial(target: ImageData, raster: Raster, color: Color4, previous: number): number
    {
        let t = target.data, c = this.image.data
        let a = color.a

        // Undo root of previous error
        let n = this.width * this.height * 3
        let sum = previous * previous * n

        for (let line of raster.lines)
        {
            let i = line.y * (this.width * 4) + line.start * 4
            for (let x = line.start; x <= line.end; x++)
            {
                let er = t[i] - c[i]
                let eg = t[i + 1] - c[i + 1]
                let eb = t[i + 2] - c[i + 2]

                let r = t[i] - this.lerp(c[i], color.r * 255, a)
                let g = t[i + 1] - this.lerp(c[i + 1], color.g * 255, a)
                let b = t[i + 2] - this.lerp(c[i + 2], color.b * 255, a)

                sum -= er * er + eg * eg + eb * eb
                sum += r * r + g * g + b * b
                i += 4
            }
        }

        return Math.sqrt(sum / n)
    }

}

export class Raster
{

    public constructor(public readonly lines: Scanline[]) { }


    private limit(x: number, min: number, max: number): number { return Math.min(Math.max(x, min), max) }
    public clamp(width: number, height: number): Raster
    {
        let lines: Scanline[] = []
        for (let line of this.lines)
        {
            if (line.y < 0 || line.y >= height) continue
            if (line.start >= width || line.end < 0) continue

            lines.push(new Scanline(line.y,
                this.limit(line.start, 0, width - 1),
                this.limit(line.end, 0, width - 1)))
        }

        return new Raster(lines)
    }

    public get area(): number
    {
        let area = 0
        for (let line of this.lines) area += line.end - line.start + 1

        return area
    }

}

export class Scanline
{

    public constructor(public readonly y: number, public readonly start: number, public readonly end: number) { }

}
