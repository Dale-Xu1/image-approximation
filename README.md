# Image Approximation

## Overview

This program attempts to approximate an image using geometry. Currently triangles, rectangles, and ellipses have been supported. If you don't want to clone the repository and run it yourself, the project is hosted at: https://image-approximation.vercel.app/

How the algorithm works is by first generating a random shape as an initial guess. It then repeatedly applies mutations to that shape while keeping track of whichever best minimize the error function. After a certain amount of iterations, the program moves onto the next shape and repeats the process.

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

![](https://user-images.githubusercontent.com/69087617/220656360-34ab2ce5-ea9d-47fb-be76-fca7879700ab.png)

![](https://user-images.githubusercontent.com/69087617/219876123-d66c71b6-c96c-427f-b62b-620dffc203fa.png)

![](https://user-images.githubusercontent.com/69087617/219879590-c6501947-ccab-49c5-9a2e-bdb398b86f93.png)

![](https://user-images.githubusercontent.com/69087617/220981427-284d4193-c12f-47e9-82ef-b409d5fa37a1.png)

![](https://user-images.githubusercontent.com/69087617/219907978-87a44f99-a2c0-4c76-9ddd-d48ddc78fb4e.png)

![](https://user-images.githubusercontent.com/69087617/220712413-d9198b91-2c1f-48d3-b376-23c58b2bfca8.png)
