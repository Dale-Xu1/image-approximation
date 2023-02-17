import Image from "./Image"
import { Color4 } from "./Math"

const MAX_DIMENSION = 256
const EXPORT_DIMENSION = 3840

export default class ImageApproximator
{

    private readonly ratio: number
    private readonly target: ImageData


    public constructor(canvas: HTMLCanvasElement, image: HTMLImageElement)
    {
        this.ratio = image.width / image.height
        let [width, height] = this.dimensions(MAX_DIMENSION, this.ratio)

        canvas.width = image.width = width
        canvas.height = image.height = height

        let c = canvas.getContext("2d")!

        this.target = this.resizeImageData(image, width, height)

        this.image = new Image(c, width, height, this.averageColor(this.target))
        this.pe = this.error(this.target, this.image.data)
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

    private pe: number
    private e: number = Infinity

    private i: number = 0
    private j: number = 0
    private k: number = 0

    private handler!: number
    public run()
    {
        this.handler = window.requestAnimationFrame(this.run.bind(this))

        for (let n = 0; n < 500; n++)
        {
            if (Math.random() < 0.01) this.image.resetShape()
            else this.image.mutate()
            this.image.render()

            let error = this.error(this.target, this.image.data)
            // let rand = Math.random() < 0.005
            let rand = false
            if (error < this.e || rand)
            {
                if (error < this.pe) this.i++
                this.e = error
            }
            else this.image.undo()

            if (!rand) this.k++
            if (this.e < this.pe)
            {
                this.j++
                if (this.i > 500 || this.j > 2500)
                {
                    this.pe = this.e
                    this.e = Infinity

                    this.i = 0
                    this.j = 0
                    this.k = 0

                    this.image.nextShape()
                }
            }
            else if (this.k > 10000)
            {
                this.e = Infinity
                
                this.i = 0
                this.j = 0
                this.k = 0

                this.image.nextShape()
                // this.image.resetShape()
            }
        }

        console.log(this.image.shapes.length, this.i, this.j, this.k, this.e)
    }

    public stop() { window.cancelAnimationFrame(this.handler) }

    public export(): string
    {
        let [width, height] = this.dimensions(EXPORT_DIMENSION, this.ratio)
        return this.image.export(width, height)
    }


    private error(target: ImageData, current: ImageData): number
    {
        let t = target.data, c = current.data
        let sum = 0

        for (let i = 0; i < t.length; i += 4)
        {
            let r = t[i] - c[i]
            let g = t[i + 1] - c[i + 1]
            let b = t[i + 2] - c[i + 2]
            let a = t[i + 3] - c[i + 3]

            sum += r * r + g * g + b * b + a * a
        }

        return Math.sqrt(sum / t.length)
    }

}
