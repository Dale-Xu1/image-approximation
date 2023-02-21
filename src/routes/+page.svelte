{#if target}
    <Main />
{:else}
    <div class="main">
        <input type="file" accept="image/*" bind:files={files} on:change={select} />
    </div>
{/if}

<script lang="ts">
import Constants from "../lib/Constants"
import Image from "../lib/Image"
import Main from "../lib/Main.svelte"

let files: FileList
let target: ImageData | null = null

async function select()
{
    let data = await readFile(files[0])
    let image = await toImage(data)

    // Calculate canvas dimensions based on original aspect ratio
    let ratio = image.width / image.height
    let [width, height] = Image.dimensions(Constants.MAX_DIMENSION, ratio)

    target = resizeImageData(image, width, height)
    console.log(target)
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
        const reader = new FileReader()

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
        const image = new window.Image()

        image.src = data
        image.onload = () => res(image)
    })
}

</script>

<style>
.main {
    padding: 12px;
}

input::file-selector-button {
    padding: 4px;
}
</style>
