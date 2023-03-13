<script lang="ts">
import Main from "../lib/Main.svelte"

import Constants from "../lib/approximator/Constants"
import Image from "../lib/approximator/Image"

let files: FileList

let target: ImageData | null = null
let image: HTMLImageElement

let dimension = Constants.MAX_DIMENSION
$: Constants.MAX_DIMENSION = dimension

async function select()
{
    let data = await readFile(files[0])
    image = await toImage(data)

    // Calculate canvas dimensions based on original aspect ratio
    let ratio = image.width / image.height
    let [width, height] = Image.dimensions(Constants.MAX_DIMENSION, ratio)

    image.width = width
    image.height = height

    target = resizeImageData(image, width, height)
}

function resizeImageData(image: HTMLImageElement, width: number, height: number): ImageData
{
    // Create intermediate canvas and draw image onto it
    let canvas = document.createElement("canvas")
    let c = canvas.getContext("2d")!

    canvas.width = width
    canvas.height = height

    // Resize image to width and height
    c.drawImage(image, 0, 0, width, height)
    return c.getImageData(0, 0, width, height)
}


async function readFile(file: File): Promise<string>
{
    return new Promise((res, rej) =>
    {
        let reader = new FileReader()

        // Resolve promise with file data
        reader.onload = () => res(reader.result as string)
        reader.onerror = rej

        reader.readAsDataURL(file)
    })
}

async function toImage(data: string): Promise<HTMLImageElement>
{
    return new Promise((res, _) =>
    {
        let image = document.createElement("img")

        image.src = data
        image.onload = () => res(image)
    })
}

</script>

{#if target}
    <Main {target} {image} />
{:else}
    <div class="main">
        <div>
            <h1>Image Approximation</h1>
            <p>This program attempts to approximate an image using geometry.</p>
        </div>
        <div>
            <span>Render dimension:</span><br>
            <input class="value" type="number" bind:value={dimension} >
        </div>
        <input type="file" accept="image/*" bind:files={files} on:change={select} />
    </div>
{/if}

<style>
:global(*) {
    margin: 0;
    padding: 0;
    box-sizing: border-box;

    font-family: Arial, Helvetica, sans-serif;
    font-size: 14px;
}

h1 {
    font-size: 20px;
}

.main {
    padding: 20px;
}

.main > div {
    margin-bottom: 8px;
}

.value {
    margin-top: 4px;
    padding: 4px;
}

input::file-selector-button {
    padding: 4px;
}

</style>
