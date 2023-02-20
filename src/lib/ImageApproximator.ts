import Image, { Scanline } from "./Image"
import { Color4, Random, Vector2 } from "./Math"
import type Shape from "./Shape/Shape"

import Rectangle from "./Shape/Rectangle"
import Triangle from "./Shape/Triangle"

const MAX_DIMENSION = 256
const EXPORT_DIMENSION = 3840

export default class ImageApproximator
{

    private readonly ratio: number

    private readonly width: number
    private readonly height: number

    private c: CanvasRenderingContext2D


    public constructor(canvas: HTMLCanvasElement, image: HTMLImageElement)
    {
        // Calculate canvas dimensions based on original aspect ratio
        this.ratio = image.width / image.height
        let [width, height] = this.dimensions(MAX_DIMENSION, this.ratio)

        this.width = canvas.width = image.width = width
        this.height = canvas.height = image.height = height

        let c = canvas.getContext("2d")!
        this.c = c // TODO: REMOVE THIS

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


    private readonly image: Image
    private readonly target: ImageData

    private reset()
    {
        this.shape = Rectangle.random(this.width, this.height)
    }

    private start()
    {
        this.reset()
        this.best = this.shape

        this.image.renderIteration(this.shape)
        this.error = this.image.error(this.target)
    }

    private shape: Shape = null!
    private best: Shape = null! // TODO: Bug where best shape becomes shape not within image

    private previous: number = Infinity
    private error: number = Infinity

    private i: number = 0

    private handler!: number
    public run()
    {
        this.handler = window.requestAnimationFrame(this.run.bind(this))
        for (let n = 0; n < 500; n++)
        {
            switch (Random.int(3))
            {
                case 0: this.reset(); break
                case 1: this.shape = this.shape.mutate(); break
                case 2: this.shape = this.best.mutate(); break
            }

            this.image.renderIteration(this.shape)
            let error = this.image.error(this.target)

            if (error < this.error)
            {
                this.best = this.shape
                this.error = error
            }

            if (this.error < this.previous)
            {
                this.i++
                if (this.i > 5000)
                {
                    this.image.addShape(this.best)
                    this.previous = this.error

                    this.start()
                    this.i = 0
                }
            }
        }
        
        console.log(this.image.shapes.length, this.i, this.error)
    }

    public stop() { window.cancelAnimationFrame(this.handler) }


    public export(): string
    {
        let [width, height] = this.dimensions(EXPORT_DIMENSION, this.ratio)
        return this.image.export(width, height)
    }

}
