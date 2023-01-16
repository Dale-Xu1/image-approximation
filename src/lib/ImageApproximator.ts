import Image from "./Image"
import Color4 from "./math/Color4"

const MAX_DIMENSION = 256;

export default class ImageApproximator
{

    private readonly target: ImageData

    public constructor(canvas: HTMLCanvasElement, image: HTMLImageElement)
    {
        let [width, height] = this.dimensions(MAX_DIMENSION, image.width / image.height)

        canvas.width = image.width = width
        canvas.height = image.height = height

        let c = canvas.getContext("2d")!

        this.target = this.resizeImageData(image, width, height)
        this.image = new Image(c, width, height, this.averageColor(this.target))
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

    private handler!: number
    public run()
    {
        this.handler = window.requestAnimationFrame(this.run.bind(this))

        this.image.render()
        let error = this.error(this.target, this.image.data)

        console.log(error)
    }

    public stop() { window.cancelAnimationFrame(this.handler) }

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

        let count = t.length / 4
        return Math.sqrt(sum / count)
    }

}
