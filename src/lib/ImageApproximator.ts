import Image, { Raster } from "./Image"
import { Color4, Random } from "./Math"
import type Shape from "./Shape/Shape"

import Rectangle from "./Shape/Rectangle"
import Triangle from "./Shape/Triangle"
import { MIN_PIXELS } from "./Shape/Shape"

const MAX_DIMENSION = 256
const EXPORT_DIMENSION = 3840

export default class ImageApproximator
{

    private readonly ratio: number

    private readonly width: number
    private readonly height: number


    public constructor(canvas: HTMLCanvasElement, image: HTMLImageElement)
    {
        // Calculate canvas dimensions based on original aspect ratio
        this.ratio = image.width / image.height
        let [width, height] = this.dimensions(MAX_DIMENSION, this.ratio)

        this.width = canvas.width = image.width = width
        this.height = canvas.height = image.height = height

        let c = canvas.getContext("2d")!

        // Create image with background as the average color
        this.target = this.resizeImageData(image, width, height)
        this.image = new Image(c, width, height, this.averageColor(this.target))

        this.start()
    }

    private dimensions(max: number, ratio: number): [number, number]
    {
        if (ratio > 1) return [max, Math.floor(max / ratio)]
        else return [Math.floor(max * ratio), max]
    }

    private resizeImageData(image: HTMLImageElement, width: number, height: number): ImageData
    {
        // Create intermediate canvas and draw image onto it
        let canvas = document.createElement("canvas")
        let c = canvas.getContext("2d")!

        canvas.width = width
        canvas.height = height

        // Resize image to width and height
        c.drawImage(image, 0, 0, width, height)
        return c.getImageData(0, 0, width, height)
    }

    private averageColor(image: ImageData): Color4
    {
        let data = image.data
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

    private reset(): Shape { return Rectangle.random(this.width, this.height) }
    private start()
    {
        if (this.best) this.image.shapes.push(this.best)

        this.image.render()
        this.previous = this.image.error(this.target)

        this.best = this.shape = this.reset()

        let raster = this.shape.rasterize().clamp(this.width, this.height)
        this.error = this.image.partial(this.target, raster, this.shape.color, this.previous)
    }

    private shape!: Shape
    private best!: Shape

    private previous!: number
    public error!: number

    public i: number = 0
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
            if (this.i > 8000)
            {
                this.start()
                this.i = 0
            }
        }
    }

    private mutate(): [Shape, Raster]
    {
        let shape!: Shape
        switch (Random.int(3))
        {
            case 0: shape = this.reset(); break
            case 1: shape = this.shape.mutate(); break
            case 2: shape = this.best.mutate(); break
        }

        let raster = shape.rasterize().clamp(this.width, this.height)
        if (raster.area < MIN_PIXELS) return this.mutate()

        return [shape, raster]
    }

    public export(): string
    {
        let [width, height] = this.dimensions(EXPORT_DIMENSION, this.ratio)
        return this.image.export(width, height)
    }

}
