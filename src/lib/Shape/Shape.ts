import type { Scanline } from "$lib/Image"
import { Color4, Random } from "../Math"

export const RANGE = 120
export const MIN_WIDTH = 1.5

export const POSITION_SD = 4
export const ANGLE_SD = 0.1

export const DIMENSION_SD = 4
export const COLOR_SD = 0.05

export default abstract class Shape
{

    public constructor(protected readonly color: Color4) { }


    public abstract mutate(): Shape
    public abstract rasterize(): Scanline[]
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

// export class Bezier extends Shape
// {

//     // TODO: Bezier curves
//     public constructor(color: Color4) { super(color) }

//     public static random(): Bezier
//     {
//         let color = Color4.random()
//         return new Bezier(color)
//     }


//     public mutate(): Bezier
//     {
//         let color = this.color
//         color = this.mutateColor()

//         return new Bezier(color)
//     }

//     public render(c: CanvasRenderingContext2D): void
//     {
        
//     }

// }
