export default class Color4
{

    public constructor(public r: number, public g: number, public b: number, public a: number = 1) { }

    public get style(): string { return `rgba(${this.r * 255}, ${this.g * 255}, ${this.b * 255}, ${this.a})` }

}
