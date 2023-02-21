import Constants from "../Constants"
import { Raster } from "../Image"
import { Color4, Random, Vector2 } from "./Math"
import Shape from "./Shape"

export default class Ellipse extends Shape
{

    public constructor(public readonly position: Vector2, public readonly a: number,
        public readonly w: number, public readonly h: number, color: Color4) { super(color) }

    public static random(width: number, height: number): Ellipse
    {
        let position = Vector2.random(width, height)
        let a = Random.next(2 * Math.PI)

        let w = Random.next(Constants.RANGE) + Constants.MIN_WIDTH
        let h = Random.next(Constants.RANGE) + Constants.MIN_WIDTH

        let color = Color4.random()
        return new Ellipse(position, a, w, h, color)
    }


    public mutate(): Ellipse
    {
        let position = this.position, a = this.a, w = this.w, h = this.h, color = this.color
        switch (Random.int(4))
        {
            case 0: position = position.add(Vector2.normal(Constants.POSITION_SD)); break
            case 1:
            {
                w += Random.normal(Constants.DIMENSION_SD)
                h += Random.normal(Constants.DIMENSION_SD)

                if (w < Constants.MIN_WIDTH) w = Constants.MIN_WIDTH
                if (h < Constants.MIN_WIDTH) h = Constants.MIN_WIDTH
                break
            }
            case 2: a += Random.normal(Constants.ANGLE_SD); break
            case 3: color = this.mutateColor(); break
        }

        return new Ellipse(position, a, w, h, color)
    }


    public rasterize(): Raster
    {
        return new Raster([]) // TODO: Ellipse raster
    }

    public render(c: CanvasRenderingContext2D): void
    {
        c.beginPath()
        c.ellipse(this.position.x, this.position.y, this.w / 2, this.h / 2, this.a, 0, Math.PI * 2)
        c.closePath()

        c.fillStyle = this.color.style
        c.fill()
    }

}
