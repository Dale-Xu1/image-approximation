<div class="main">
    <canvas bind:this={canvas} />
    <img src="trees.jpg" alt="" bind:this={target}>

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

<script lang="ts">
import { onMount } from "svelte"
import ImageApproximator from "../lib/ImageApproximator"

// TODO: File selection

let canvas: HTMLCanvasElement
let target: HTMLImageElement

let approximator: ImageApproximator
$: image = approximator?.image

onMount(() =>
{
    approximator = new ImageApproximator(canvas, target)
    return stop
})

let n = 0
let max = 300

let handler: number
function run()
{
    handler = window.requestAnimationFrame(run)

    for (let n = 0; n < 800; n++) approximator.run()

    n = image.shapes.length
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
    a.href = approximator.exportJSON()

    a.click()
}

</script>

<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: Arial, Helvetica, sans-serif;
}

.main {
    padding: 12px;
}

form, input {
    font-size: 14px;
}

form > div {
    margin-top: 10px;
}

input {
    display: inline-block;
    margin-top: 4px;
    padding: 4px;
}

</style>
