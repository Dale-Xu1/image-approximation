import Constants from "../Constants"
import type { Raster } from "../Image"
import { Color4, Random } from "../Math"

export default abstract class Shape
{

    public constructor(public readonly color: Color4) { }


    public abstract mutate(): Shape
    public abstract rasterize(): Raster
    public abstract render(c: CanvasRenderingContext2D): void

    private clamp(x: number): number { return Math.min(Math.max(x, 0), 1) }

    protected mutateColor(): Color4
    {
        let r = this.clamp(this.color.r + Random.normal(Constants.COLOR_SD))
        let g = this.clamp(this.color.g + Random.normal(Constants.COLOR_SD))
        let b = this.clamp(this.color.b + Random.normal(Constants.COLOR_SD))
        let a = this.color.a

        return new Color4(r, g, b, a)
    }

}
