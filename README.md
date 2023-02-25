# Image Approximation

## Overview

This program attempts to approximate an image using geometry. Currently triangles, rectangles, and ellipses have been supported. If you don't want to clone the repository and run it yourself, the project is hosted at: https://image-approximation.vercel.app/

How the algorithm works is by first generating a random shape as an initial guess. It then repeatedly applies mutations to that shape while keeping track of whichever best minimize the error function. After a certain amount of iterations, the program moves onto the next shape and repeats the process.

## Instructions

The program initially prompts the user for an image file and the type of shape. After an image is selected, clicking the start button will begin the approximation algorithm. The export button will download the generated result as a .png file.

`Maximum shapes` is the amount of shapes until which the program halts. You may set it to a higher value and resume execution if you wish.

`Iterations per frame` allows you to increase the amount of computation performed per frame, so there is some level of control over how much of the CPU is used at a given moment.

`Minimum width` is the minimum width a shape can have in pixels. This value is not representative of the minimum width in the exported upscaled image This is to prevent incredibly thin shapes from being generated, which usually don't look good.

`Export dimension` is the longer side of the exported image. The shorter side is computed based on the aspect ratio of the original target image.

## Setup

Node.js is required to run the program. Upon cloning, install the dependencies by running the command:

```bash
npm install
```

Next, create and run a development build:

```bash
npm run dev
```

## Examples

![](https://user-images.githubusercontent.com/69087617/219876123-d66c71b6-c96c-427f-b62b-620dffc203fa.png)

![](https://user-images.githubusercontent.com/69087617/220656360-34ab2ce5-ea9d-47fb-be76-fca7879700ab.png)

![](https://user-images.githubusercontent.com/69087617/219879590-c6501947-ccab-49c5-9a2e-bdb398b86f93.png)

![](https://user-images.githubusercontent.com/69087617/220981427-284d4193-c12f-47e9-82ef-b409d5fa37a1.png)

<p float="left">
    <img src="https://user-images.githubusercontent.com/69087617/220984137-572a066b-5875-4c22-97ef-000c48b5b60c.png" width="46%">
    <img src="https://user-images.githubusercontent.com/69087617/220983153-6355c24d-adec-4778-951e-4290ac6c01ea.png" width="53%">
</p>

![](https://user-images.githubusercontent.com/69087617/219907978-87a44f99-a2c0-4c76-9ddd-d48ddc78fb4e.png)
