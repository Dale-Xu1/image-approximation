<canvas bind:this={canvas} />
<img src="trees.jpg" alt="" bind:this={image}>

<script lang="ts">
import { onMount } from "svelte"

import ImageApproximator from "$lib/ImageApproximator"

let canvas: HTMLCanvasElement
let image: HTMLImageElement

onMount(() =>
{
    let approximator = new ImageApproximator(canvas, image)
    approximator.run()
    
    return approximator.stop
})

</script>
