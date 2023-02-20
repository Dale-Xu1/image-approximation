import type { Raster } from "$lib/Image"
import { Color4, Random } from "../Math"

export const RANGE = 120
export const MIN_WIDTH = 1.5
export const MIN_PIXELS = 4

export const POSITION_SD = 4
export const ANGLE_SD = 0.1

export const DIMENSION_SD = 4
export const COLOR_SD = 0.05

export default abstract class Shape
{

    public constructor(public readonly color: Color4) { }


    public abstract mutate(): Shape
    public abstract rasterize(): Raster
    public abstract render(c: CanvasRenderingContext2D): void

    private clamp(x: number): number { return Math.min(Math.max(x, 0), 1) }

    protected mutateColor(): Color4
    {
        let r = this.clamp(this.color.r + Random.normal(COLOR_SD))
        let g = this.clamp(this.color.g + Random.normal(COLOR_SD))
        let b = this.clamp(this.color.b + Random.normal(COLOR_SD))
        let a = this.color.a

        return new Color4(r, g, b, a)
    }

}
