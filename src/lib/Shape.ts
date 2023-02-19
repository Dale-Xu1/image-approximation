import { Color4, Random, Vector2 } from "./Math"

const RANGE = 100
const MIN_WIDTH = 1.5

const POSITION_SD = 4
const ANGLE_SD = 0.1

const COLOR_SD = 0.05

export abstract class Shape
{

    public constructor(protected readonly color: Color4) { }

    
    public abstract mutate(): Shape
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

export class Triangle extends Shape
{

    public constructor(private readonly a: Vector2, private readonly b: Vector2, private readonly c: Vector2,
        color: Color4) { super(color) }

    public static random(width: number, height: number): Triangle
    {
        let position = Vector2.random(width, height)
        let offset = new Vector2(RANGE / 2, RANGE / 2)

        let a = position.add(Vector2.random(RANGE, RANGE)).sub(offset)
        let b = position.add(Vector2.random(RANGE, RANGE)).sub(offset)
        let c = position.add(Vector2.random(RANGE, RANGE)).sub(offset)

        // Reject if triangle is too thin
        if (Triangle.thin(a, b, c)) return Triangle.random(width, height)

        let color = Color4.random()
        return new Triangle(a, b, c, color)
    }

    private static thin(a: Vector2, b: Vector2, c: Vector2): boolean
    {
        // Find length of longest side
        const max = Math.max(Vector2.dist(a, b), Vector2.dist(b, c), Vector2.dist(c, a))
        const area = a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y)

        const s = area / (2 * MIN_WIDTH)
        return s < max
    }


    private shift(): Triangle
    {
        let a = this.a.add(Vector2.normal(POSITION_SD))
        let b = this.b.add(Vector2.normal(POSITION_SD))
        let c = this.c.add(Vector2.normal(POSITION_SD))

        // Reject if triangle is too thin
        if (Triangle.thin(a, b, c)) return this.shift()
        return new Triangle(a, b, c, this.color)
    }

    public mutate(): Triangle
    {
        let a = this.a, b = this.b, c = this.c, color = this.color
        switch (Random.int(4))
        {
            case 0:
            {
                let d = Vector2.normal(POSITION_SD)

                a = a.add(d)
                b = b.add(d)
                c = c.add(d)
                break   
            }
            case 1: return this.shift()
            case 2:
            {
                let center = a.add(b).add(c).div(3)
                let d = Random.normal(ANGLE_SD)

                a = a.sub(center).rotate(d).add(center)
                b = b.sub(center).rotate(d).add(center)
                c = c.sub(center).rotate(d).add(center)
                break
            }
            case 3: color = this.mutateColor(); break
        }

        return new Triangle(a, b, c, color)
    }

    public render(c: CanvasRenderingContext2D): void
    {
        c.beginPath()
        c.moveTo(this.a.x, this.a.y)
        c.lineTo(this.b.x, this.b.y)
        c.lineTo(this.c.x, this.c.y)

        c.fillStyle = this.color.style
        c.fill()
    }

}

export class Rectangle extends Shape
{

    public constructor(private readonly position: Vector2, private readonly a: number,
        private readonly w: number, private readonly h: number, color: Color4) { super(color) }

    public static random(width: number, height: number): Rectangle
    {
        let position = Vector2.random(width, height)
        let a = Random.next(2 * Math.PI)

        let w = Random.next(RANGE) + MIN_WIDTH
        let h = Random.next(RANGE) + MIN_WIDTH

        let color = Color4.random()
        return new Rectangle(position, a, w, h, color)
    }


    public mutate(): Rectangle
    {
        let position = this.position, a = this.a, w = this.w, h = this.h, color = this.color
        switch (Random.int(4))
        {
            case 0: position = position.add(Vector2.normal(POSITION_SD)); break
            case 1:
            {
                w += Random.normal(POSITION_SD)
                h += Random.normal(POSITION_SD)

                if (w < MIN_WIDTH) w = MIN_WIDTH
                if (h < MIN_WIDTH) h = MIN_WIDTH
                break
            }
            case 2: a += Random.normal(ANGLE_SD); break
            case 3: color = this.mutateColor(); break
        }

        return new Rectangle(position, a, w, h, color)
    }

    public render(c: CanvasRenderingContext2D): void
    {
        c.save()
        c.translate(this.position.x, this.position.y)
        c.rotate(this.a)

        c.fillStyle = this.color.style
        c.fillRect(-this.w / 2, -this.h / 2, this.w, this.h)
        
        c.restore()
    }

}

export class Ellipse extends Shape
{

    public constructor(private readonly position: Vector2, private readonly a: number,
        private readonly w: number, private readonly h: number, color: Color4) { super(color) }

    public static random(width: number, height: number): Ellipse
    {
        let position = Vector2.random(width, height)
        let a = Random.next(2 * Math.PI)

        let w = Random.next(RANGE) + MIN_WIDTH
        let h = Random.next(RANGE) + MIN_WIDTH

        let color = Color4.random()
        return new Ellipse(position, a, w, h, color)
    }


    public mutate(): Ellipse
    {
        let position = this.position, a = this.a, w = this.w, h = this.h, color = this.color
        switch (Random.int(4))
        {
            case 0: position = position.add(Vector2.normal(POSITION_SD)); break
            case 1:
            {
                w += Random.normal(POSITION_SD)
                h += Random.normal(POSITION_SD)

                if (w < MIN_WIDTH) w = MIN_WIDTH
                if (h < MIN_WIDTH) h = MIN_WIDTH
                break
            }
            case 2: a += Random.normal(ANGLE_SD); break
            case 3: color = this.mutateColor(); break
        }

        return new Ellipse(position, a, w, h, color)
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

export class Bezier extends Shape
{

    // TODO: Bezier curves
    public constructor(color: Color4) { super(color) }

    public static random(): Bezier
    {
        let color = Color4.random()
        return new Bezier(color)
    }


    public mutate(): Bezier
    {
        let color = this.color
        color = this.mutateColor()

        return new Bezier(color)
    }

    public render(c: CanvasRenderingContext2D): void
    {
        
    }

}
