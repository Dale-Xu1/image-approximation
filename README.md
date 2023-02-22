# Image Approximation

## Overview

This program attempts to approximate an image using geometry. This is still slightly work in progress, and only rectangles and triangles have been supported as of now. I still need to figure out how to rasterize an ellipse. Possible additions could also include lines and bezier curves.

If you don't want to clone the repository and run it yourself, the project is hosted at: https://image-approximation.vercel.app/

How the algorithm works is by first generating a random shape as an initial guess. It then repeatedly applies mutations to that shape while keeping track of which best minimize the error function. The error function used to compare shapes is an RMSE, which computes how close the result is to the original image. After a certain amount of iterations, the program moves onto the next shape and repeats the process.

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

![i](https://user-images.githubusercontent.com/69087617/220656360-34ab2ce5-ea9d-47fb-be76-fca7879700ab.png)

![t3](https://user-images.githubusercontent.com/69087617/219907978-87a44f99-a2c0-4c76-9ddd-d48ddc78fb4e.png)

![m1](https://user-images.githubusercontent.com/69087617/220208072-2fe5a431-853c-47fc-86cd-32adede65a37.png)
