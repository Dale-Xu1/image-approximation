# Image Approximation

## Overview

This program attempts to approximate an image using geometry. This is still slightly work in progress, and only rectangles and triangles have been supported as of now. I still need to figure out how to rasterize an ellipse. Possible additions could also include lines and bezier curves.

If you don't want to clone the repository and run it yourself, the project is hosted at: https://image-approximation.vercel.app/

The way the algorithm works is by generating a random shape and repeatedly applying mutations to it. While it does this, it keeps track of the shape that best minimizes the error function (which computes how close the result is to the original image). After a certain amount of iterations, it moves onto the next shape.

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

![h250](https://user-images.githubusercontent.com/69087617/219876123-d66c71b6-c96c-427f-b62b-620dffc203fa.png)

![w300](https://user-images.githubusercontent.com/69087617/219879590-c6501947-ccab-49c5-9a2e-bdb398b86f93.png)

![t3](https://user-images.githubusercontent.com/69087617/219907978-87a44f99-a2c0-4c76-9ddd-d48ddc78fb4e.png)

![m1](https://user-images.githubusercontent.com/69087617/220208072-2fe5a431-853c-47fc-86cd-32adede65a37.png)
