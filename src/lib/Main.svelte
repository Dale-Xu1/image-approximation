<script lang="ts">
import { onMount } from "svelte"
import ImageApproximator, { type Generator } from "../lib/ImageApproximator"

export let target: ImageData
export let reference: HTMLImageElement

export let generator: Generator

let main: HTMLDivElement
let canvas: HTMLCanvasElement

let approximator: ImageApproximator

onMount(() =>
{
    main.prepend(reference)
    approximator = new ImageApproximator(canvas, target, generator)

    return stop
})

let n = 0
let max = 300

let handler: number
function run()
{
    handler = window.requestAnimationFrame(run)

    for (let n = 0; n < 800; n++) approximator.run()

    n = approximator.image.shapes.length
    if (n >= max) stop()

    console.log(n, approximator.i, approximator.error)
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
            <label for="max">Maximum shapes:</label><br>
            <input id="max" type="number" bind:value={max}>
        </div>
        <div>
            <label for="dimension">Export dimension:</label><br>
            <input id="dimension" type="number" bind:value={dimension}>
        </div>
    </form>
</div>

<style>
.main {
    padding: 20px;
}

canvas {
    margin-left: 8px;
}

form > div {
    margin-top: 10px;
}

input {
    margin-top: 4px;
    padding: 4px;
}

</style>
