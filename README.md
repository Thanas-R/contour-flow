# Contour Flow

Contour Flow is a canvas animation used as the background for a website. It renders a real time procedural topographic map with no images and no SVGs.

![Preview](assets/preview.png)

## Quick info

* Purpose: animated contour background for a website
* Note: this is not 60fps

## Tech stack

* Framework: React 18 + TypeScript
* Build: Vite
* Styling: Tailwind CSS and shadcn/ui components
* Routing: React Router v6

## How it works

* A Simplex Noise algorithm generates a 2D height field sampled on a grid
* Marching Squares extracts iso contour segments at multiple threshold levels
* Segments are stitched into continuous paths and rendered as Catmull Rom splines for smooth organic lines
* Time based offsets flowX flowY and breathe animate the noise to create a slow drift
* On mobile DeviceOrientation adds a subtle parallax shift to sampling coordinates
* Rendering runs on a canvas via requestAnimationFrame
* Dark and light themes adjust background color and stroke opacity

## Architecture

<img src="assets/architecture.svg" alt="Architecture diagram" width="640">

## Usage

```bash
git clone <repo url>
cd contour_flow
npm install
npm run dev
