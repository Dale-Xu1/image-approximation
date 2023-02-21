<script lang="ts">
import Main from "../lib/Main.svelte"

import Constants from "../lib/Constants"
import Image from "../lib/Image"
import type { Generator } from "$lib/ImageApproximator"

import Rectangle from "../lib/Shape/Rectangle"
import Triangle from "$lib/Shape/Triangle"

enum Shape
{
    TRIANGLE,
    RECTANGLE
}

let files: FileList

let target: ImageData | null = null
let reference: HTMLImageElement

let shape: Shape = Shape.RECTANGLE

async function select()
{
    let data = await readFile(files[0])
    reference = await toImage(data)

    // Calculate canvas dimensions based on original aspect ratio
    let ratio = reference.width / reference.height
    let [width, height] = Image.dimensions(Constants.MAX_DIMENSION, ratio)

    reference.width = width
    reference.height = height

    target = resizeImageData(reference, width, height)
}

function decodeGenerator(shape: Shape): Generator
{
    switch (shape)
    {
        case Shape.TRIANGLE: return Triangle.random
        case Shape.RECTANGLE: return Rectangle.random
    }
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
    <Main {target} {reference} generator={decodeGenerator(shape)} />
{:else}
    <div class="main">
        <div>
            <label>
                <input type="radio" bind:group={shape} value={Shape.TRIANGLE}>
                Triangle
            </label>
            <label>
                <input type="radio"  bind:group={shape} value={Shape.RECTANGLE}>
                Rectangle
            </label>
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

.main {
    padding: 20px;
}

.main > div {
    margin-bottom: 8px;
}

input::file-selector-button {
    padding: 4px;
}

</style>
