import Image, { Raster } from "./Image"
import { Color4, Random } from "./Shape/Math"
import type Shape from "./Shape/Shape"
import Constants from "./Constants"

export interface Generator
{
    (width: number, height: number): Shape
}

export default class ImageApproximator
{

    private readonly ratio: number

    private readonly width: number
    private readonly height: number


    public constructor(canvas: HTMLCanvasElement, target: ImageData, generator: Generator)
    {
        this.target = target
        this.generator = generator

        this.width = canvas.width = target.width
        this.height = canvas.height = target.height
        this.ratio = this.width / this.height

        let c = canvas.getContext("2d")!
        this.image = new Image(c, this.width, this.height, this.averageColor(this.target))

        this.start()
    }

    private averageColor(target: ImageData): Color4
    {
        let data = target.data
        let r = 0, g = 0, b = 0

        for (let i = 0; i < data.length; i += 4)
        {
            r += data[i]
            g += data[i + 1]
            b += data[i + 2]
        }

        let scale = data.length / 4 * 255
        return new Color4(r / scale, g / scale, b / scale)
    }


    public readonly image: Image
    private readonly target: ImageData

    private readonly generator: Generator

    private start()
    {
        this.image.render()
        this.previous = this.image.error(this.target)

        let [shape, raster] = this.reset()
        this.best = this.shape = shape

        this.error = this.image.partial(this.target, raster, this.shape.color, this.previous)

        this.n = 0
        this.i = 0
    }

    private shape!: Shape
    private best!: Shape

    private previous!: number
    private error!: number

    public get current() { return Math.min(this.previous, this.error) }

    private n: number = 0
    private i: number = 0

    public run()
    {
        let [shape, raster] = this.mutate()
        let error = this.image.partial(this.target, raster, shape.color, this.previous)

        this.shape = shape
        if (error < this.error)
        {
            this.best = shape
            this.error = error
        }

        if (this.error < this.previous)
        {
            this.i++
            if (this.i > Constants.ITERATIONS)
            {
                this.image.shapes.push(this.best)
                this.start()
            }
        }
        else
        {
            this.n++
            if (this.n > Constants.RESET) this.start()
        }
    }

    private reset(): [Shape, Raster]
    {
        let shape = this.generator(this.width, this.height)

        let raster = shape.rasterize().clamp(this.width, this.height)
        if (raster.area < Constants.MIN_PIXELS) return this.reset()

        return [shape, raster]
    }

    private mutate(): [Shape, Raster]
    {
        let shape!: Shape
        let r = Random.next()

        if (r < 0.3) return this.reset()
        else if (r < 0.6) shape = this.best.mutate()
        else shape = this.shape.mutate()

        let raster = shape.rasterize().clamp(this.width, this.height)
        if (raster.area < Constants.MIN_PIXELS) return this.mutate()

        return [shape, raster]
    }


    public export(dimension: number): string
    {
        let [width, height] = Image.dimensions(dimension, this.ratio)
        return this.image.export(width, height)
    }

    public exportJSON(): string { return JSON.stringify(this.image.shapes) }

}
