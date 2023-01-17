import type { Color4 } from "./Math"
import { Ellipse, Rectangle, Triangle, type Shape } from "./Shape"

export default class Image
{

    private readonly shapes: Shape[] = []

    public constructor(private readonly c: CanvasRenderingContext2D,
        private readonly width: number, private readonly height: number,
        public readonly background: Color4)
    { 
        for (let i = 0; i < 100; i++)
        {
            let shape!: Shape
            switch (Math.floor(Math.random() * 3))
            {
                case 0: shape = Triangle.random(this.width, this.height); break
                case 1: shape = Rectangle.random(this.width, this.height); break
                case 2: shape = Ellipse.random(this.width, this.height); break
            }

            this.shapes.push(shape)
        }
    }


    public get data() { return this.c.getImageData(0, 0, this.width, this.height) }

    public render()
    {
        this.c.fillStyle = this.background.style
        this.c.fillRect(0, 0, this.width, this.height)

        for (let shape of this.shapes) shape.mutate()
        for (let shape of this.shapes) shape.render(this.c)
    }

}
