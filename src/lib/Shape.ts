import { Color4, Vector2 } from "./Math"

const RANGE = 64

const SD = 8
const ANGLE_SD = 0.5

export abstract class Shape
{

    public constructor(protected color: Color4) { }

    
    public abstract mutate(): void
    public abstract render(c: CanvasRenderingContext2D): void

}

export class Triangle extends Shape
{

    public constructor(private a: Vector2, private b: Vector2, private c: Vector2, color: Color4) { super(color) }

    public static random(width: number, height: number): Triangle
    {
        let position = Vector2.random(width, height)
        let offset = new Vector2(RANGE / 2, RANGE / 2)

        let a = position.add(Vector2.random(RANGE, RANGE)).sub(offset)
        let b = position.add(Vector2.random(RANGE, RANGE)).sub(offset)
        let c = position.add(Vector2.random(RANGE, RANGE)).sub(offset)

        let color = Color4.random()
        return new Triangle(a, b, c, color)
    }


    public mutate()
    {
        switch (Math.floor(Math.random() * 3))
        {
            case 0: this.a = this.a.add(Vector2.normal(SD)); break
            case 1: this.b = this.b.add(Vector2.normal(SD)); break
            case 2: this.c = this.c.add(Vector2.normal(SD)); break
        }
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

    public constructor(private position: Vector2, private a: number,
        private w: number, private h: number, color: Color4) { super(color) }

    public static random(width: number, height: number): Rectangle
    {
        let position = Vector2.random(width, height)
        let a = Math.random() * 2 * Math.PI

        let w = Math.random() * RANGE
        let h = Math.random() * RANGE

        let color = Color4.random()
        return new Rectangle(position, a, w, h, color)
    }


    public mutate()
    {
        switch (Math.floor(Math.random() * 3))
        {
            case 0: this.position = this.position.add(Vector2.normal(SD)); break
            case 1:
            {
                this.w += Vector2.normalValue(SD)
                this.h += Vector2.normalValue(SD)
                break
            }
            case 2: this.a += Vector2.normalValue(ANGLE_SD); break
        }

        if (this.w < 1) this.w = 1
        if (this.h < 1) this.h = 1
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

    public constructor(private position: Vector2, private a: number,
        private w: number, private h: number, color: Color4) { super(color) }

    public static random(width: number, height: number): Ellipse
    {
        let position = Vector2.random(width, height)
        let a = Math.random() * 2 * Math.PI

        let w = Math.random() * RANGE
        let h = Math.random() * RANGE

        let color = Color4.random()
        return new Ellipse(position, a, w, h, color)
    }


    public mutate()
    {
        switch (Math.floor(Math.random() * 3))
        {
            case 0: this.position = this.position.add(Vector2.normal(SD)); break
            case 1:
            {
                this.w += Vector2.normalValue(SD)
                this.h += Vector2.normalValue(SD)
                break
            }
            case 2: this.a += Vector2.normalValue(ANGLE_SD); break
        }

        if (this.w < 1) this.w = 1
        if (this.h < 1) this.h = 1
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

// TODO: Bezier curves
