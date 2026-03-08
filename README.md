# Contour Flow

Contour Flow is a canvas animation used as the background for the website. It is a procedural topographic map generator rendered in real time with no images and no SVGs.

## Tech Stack

* React 18 and TypeScript  
* Vite  
* Tailwind CSS and shadcn/ui components  
* React Router v6

## How it works

* A Simplex Noise algorithm produces a 2D height field sampled on a grid  
* Marching Squares extracts iso contour line segments at multiple threshold levels  
* Segments are stitched into continuous paths and rendered as Catmull Rom splines for smooth organic lines  
* Noise is animated with slow time based offsets called flowX flowY and breathe to create a flowing drift  
* On mobile DeviceOrientation adds a subtle parallax shift to the noise sampling coordinates  
* Rendering runs on a canvas via requestAnimationFrame at about 60 frames per second  
* Dark and light themes change background color and stroke opacity
