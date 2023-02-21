<div class="main">
    <canvas bind:this={canvas} />
    <img src="trees.jpg" alt="" bind:this={image}>

    <form>
        <input type="text">
        <input type="button" value={running ? "Stop" : "Start"} on:click={toggle}>
        <input type="button" value="Export" on:click={exportResult}>
    </form>
</div>

<script lang="ts">
import { onMount } from "svelte"
import ImageApproximator from "../lib/ImageApproximator" // TODO: Parameter editing

let canvas: HTMLCanvasElement
let image: HTMLImageElement

let approximator: ImageApproximator
onMount(() =>
{
    approximator = new ImageApproximator(canvas, image)
    return stop
})

let handler!: number
function run()
{
    handler = window.requestAnimationFrame(run)

    for (let n = 0; n < 800; n++) approximator.run()
    console.log(approximator.image.shapes.length, approximator.i, approximator.error)
}

function stop()
{
    window.cancelAnimationFrame(handler)
}

let running = false
function toggle() // TODO: Automatic stop
{
    if (running) stop()
    else run()

    running = !running
}

function exportResult()
{
    let a = document.createElement("a")
    a.download = "result.png"
    a.href = approximator.export()

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

input {
    padding: 4px;
}

</style>
