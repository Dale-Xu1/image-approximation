import type { Color4 } from "./Math"
import { Ellipse, Rectangle, Triangle, type Shape } from "./Shape"

export default class Image
{

    public readonly shapes: Shape[] = []

    public constructor(private readonly c: CanvasRenderingContext2D,
        private readonly width: number, private readonly height: number,
        public readonly background: Color4)
    {
        this.renderAll()
        this.nextShape()
    }


    public get data() { return this.c.getImageData(0, 0, this.width, this.height) }

    private image!: ImageData

    private previous!: Shape
    private shape: Shape = null!

    public nextShape()
    {
        if (this.shape) this.shapes.push(this.shape)
        this.shape = Rectangle.random(this.width, this.height)

        this.image = this.data
        this.previous = this.shape
    }

    public resetShape()
    {
        this.previous = this.shape
        this.shape = Rectangle.random(this.width, this.height)
    }

    public undo() { this.shape = this.previous }
    public mutate()
    {
        this.previous = this.shape
        this.shape = this.shape.mutate()
    }


    public render()
    {
        this.c.putImageData(this.image, 0, 0)
        this.shape.render(this.c)
    }

    public renderAll(c: CanvasRenderingContext2D = this.c)
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
        this.renderAll(c)

        return canvas.toDataURL()
    }

}
