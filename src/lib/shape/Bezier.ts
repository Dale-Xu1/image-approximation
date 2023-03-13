import Constants from "../approximator/Constants"
import { Raster, Scanline } from "../approximator/Image"
import Shape, { Color4, Random, Vector2 } from "./Shape"

export default class Bezier extends Shape
{

    public constructor(color: Color4) { super(color) } // TODO: Bezier curves

    public static random(width: number, height: number): Bezier
    {
        let position = Vector2.random(width, height)

        let color = Color4.random()
        return new Bezier(color)
    }


    public mutate(): Bezier
    {
        return this
    }

    public rasterize(): Raster
    {
        let lines: Scanline[] = []
        return new Raster(lines)
    }

    public render(c: CanvasRenderingContext2D): void
    {
    }

}
