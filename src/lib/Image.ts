import type { Color4 } from "./Math"
import type Shape from "./Shape/Shape"

export default class Image
{

    public readonly shapes: Shape[] = []

    public constructor(private readonly c: CanvasRenderingContext2D,
        private readonly width: number, private readonly height: number,
        public readonly background: Color4)
    {
        this.render()
        this.image = this.data
    }


    public get data() { return this.c.getImageData(0, 0, this.width, this.height) }
    private image!: ImageData

    public renderIteration(shape: Shape)
    {
        this.c.putImageData(this.image, 0, 0)
        shape.render(this.c)
    }

    public addShape(shape: Shape)
    {
        this.renderIteration(shape)
        this.shapes.push(shape)

        this.image = this.data
    }


    public render(c: CanvasRenderingContext2D = this.c)
    {
        c.fillStyle = this.background.style
        c.fillRect(0, 0, this.width, this.height)

        for (let shape of this.shapes) shape.render(c)
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
        let t = target.data, c = this.data.data
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

}

export class Raster
{

    public constructor(public readonly lines: Scanline[]) { }


    private static limit(x: number, min: number, max: number): number { return Math.min(Math.max(x, min), max) }
    public clamp(width: number, height: number): Raster
    {
        let lines: Scanline[] = []
        for (let line of this.lines)
        {
            if (line.y < 0 || line.y >= height) continue
            if (line.start >= width || line.end < 0) continue

            lines.push(new Scanline(line.y,
                Raster.limit(line.start, 0, width - 1),
                Raster.limit(line.end, 0, width - 1)))
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
