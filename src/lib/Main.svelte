<script lang="ts">
import { onMount } from "svelte"
import ImageApproximator, { type Generator } from "./approximator/ImageApproximator"

import Rectangle from "./shape/Rectangle"
import Triangle from "./shape/Triangle"
import Ellipse from "./shape/Ellipse"

enum Shape
{
    TRIANGLE,
    RECTANGLE,
    ELLIPSE
}

export let target: ImageData
export let image: HTMLImageElement

let main: HTMLDivElement
let canvas: HTMLCanvasElement

let approximator: ImageApproximator

onMount(() =>
{
    approximator = new ImageApproximator(canvas, target, Rectangle.random)
    error = approximator.current

    main.prepend(image)
    return stop
})

let shape = Shape.RECTANGLE
$: updateShape(shape)

let n = 0
let error = 0

let max = 500
let iterations = 800

let handler: number
function run()
{
    handler = window.requestAnimationFrame(run)

    for (let n = 0; n < iterations; n++) approximator.run()

    n = approximator.image.shapes.length
    error = approximator.current

    if (n >= max) stop()
}

let running = false
function toggle()
{
    if (running) stop()
    else
    {
        running = true
        run()
    }
}

function stop()
{
    window.cancelAnimationFrame(handler)
    running = false
}


function updateShape(shape: Shape)
{
    if (!approximator) return

    let generator: Generator
    switch (shape)
    {
        case Shape.TRIANGLE: generator = Triangle.random; break
        case Shape.RECTANGLE: generator = Rectangle.random; break
        case Shape.ELLIPSE: generator = Ellipse.random; break
    }

    approximator.generator = generator
    approximator.reset()
}

let dimension = 3840
function exportImage()
{
    let a = document.createElement("a")
    a.download = "result.png"
    a.href = approximator.export(dimension)

    a.click()
}

function exportJSON()
{
    let a = document.createElement("a")
    a.download = "result.json"
    a.href = "data:text/json;charset=utf-8," + window.encodeURIComponent(approximator.exportJSON())

    a.click()
}

</script>

<div class="main" bind:this={main}>
    <canvas bind:this={canvas} />
    <form>
        <div>
            <input type="button"
                disabled={n >= max}
                value={running ? "Pause" : "Start"}
                on:click={toggle}>
            <input type="button" value="Export" on:click={exportImage}>
            <input type="button" value="Export JSON" on:click={exportJSON}>
        </div>
        <div>
            <label><input type="radio" bind:group={shape} value={Shape.TRIANGLE}>Triangle</label>
            <label><input type="radio" bind:group={shape} value={Shape.RECTANGLE}>Rectangle</label>
            <label><input type="radio" bind:group={shape} value={Shape.ELLIPSE}>Ellipse</label>
        </div>
        <div>
            <span>Shapes: {n}</span><br>
            <span>Error: {error.toFixed(4)}</span>
        </div>
        <div>
            <span>Run until shapes:</span><br>
            <input type="number" bind:value={max}>
        </div>
        <div>
            <span>Iterations per frame:</span><br>
            <input type="number" bind:value={iterations}>
        </div>
        <div>
            <span>Export dimension:</span><br>
            <input type="number" bind:value={dimension}>
        </div>
    </form>
</div>

<style>
.main {
    padding: 20px;
}

:global(img) {
    margin-right: 8px;
}

form > div {
    margin-top: 10px;
}

input {
    margin-top: 4px;
    padding: 4px;
}

label input {
    margin: 0;
    margin-right: 4px;
}

</style>
