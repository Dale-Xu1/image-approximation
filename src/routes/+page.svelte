<canvas bind:this={canvas} />
<img src="trees.jpg" alt="" bind:this={image}>
<a href={data} download="result.png" on:click={onClick}>Export</a>

<script lang="ts">
import { onMount } from "svelte"

import ImageApproximator from "$lib/ImageApproximator"

let canvas: HTMLCanvasElement
let image: HTMLImageElement

let data = "#"

let approximator: ImageApproximator
onMount(() =>
{
    approximator = new ImageApproximator(canvas, image)
    approximator.run()
    
    return approximator.stop
})

function onClick()
{
    data = approximator.export()
}

</script>
