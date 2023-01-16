import type Color4 from "./math/Color4"

export default class Image
{

    public constructor(private readonly c: CanvasRenderingContext2D,
        private readonly width: number, private readonly height: number,
        public readonly background: Color4) { }


    public get data() { return this.c.getImageData(0, 0, this.width, this.height) }

    public render()
    {
        this.c.fillStyle = this.background.style
        this.c.fillRect(0, 0, this.width, this.height)
    }

}
