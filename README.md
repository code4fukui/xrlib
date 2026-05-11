# xrlib

> 日本語のREADMEはこちらです: [README.ja.md](README.ja.md)

A collection of JavaScript modules for building WebXR applications with Three.js, with a focus on hand tracking.

## Demo

- [Hand Measure](https://code4fukui.github.io/hand-xr/)

This demo measures and displays the distance between the user's index fingers in real-time.

## Features

-   **Hand Tracking Visualization**: Render hands as realistic meshes, simple spheres, or boxes.
-   **Real-time Measurement**: A class to calculate and display the distance between any two hand joints (defaults to index fingertips).
-   **Desktop Navigation**: A drop-in controller for first-person (WASD) and orbit controls for non-XR environments.
-   **Device Detection**: Helper functions to identify spatial computing devices like Apple Vision Pro.
-   **Quick Setup**: A boilerplate module (`egxr.js`) to initialize a Three.js scene, camera, renderer, and XR session.

## Usage

This library uses an `importmap` to handle the Three.js dependency and ES modules for its components.

**1. Set up your HTML file:**

```html
<!DOCTYPE html>
<html>
<head>
  <title>xrlib Demo</title>
  <script type="importmap">
  {
    "imports": {
      "three": "https://code4fukui.github.io/three.js/build/three.module.js",
      "three/addons/": "https://code4fukui.github.io/three.js/examples/jsm/"
    }
  }
  </script>
</head>
<body>
  <script type="module" src="./main.js"></script>
</body>
</html>
```

**2. Create your main JavaScript file:**

```javascript
// main.js
import { THREE, scene, camera, renderer } from "https://code4fukui.github.io/egxr.js/egxr.js";
import { HandMeasure } from "./HandMeasure.js";
import { showHand } from "./showHand.js";

// Display tracked hand models in the scene.
// Set the third argument to `false` to hide the models.
showHand(renderer, scene, true);

// Initialize the measurement tool between index fingers.
new HandMeasure(THREE, renderer, scene, camera);

// Start the render loop.
const clock = new THREE.Clock();
renderer.setAnimationLoop(() => {
  const delta = clock.getDelta();
  
  // Modules that need per-frame updates add themselves to renderer.updates
  if (renderer.updates) {
    renderer.updates.forEach(item => item.update(delta));
  }
  
  renderer.render(scene, camera);
});
```

## Modules

-   **`egxr.js`**: Initializes a standard Three.js scene, camera, renderer, lights, and an "Enter XR" button. Exports `THREE`, `scene`, `camera`, and `renderer`.
-   **`showHand.js`**: Provides `showHand(renderer, scene, showModel?)`. Attaches 3D models to the user's hands for visualization.
-   **`HandMeasure.js`**: A class that draws a line between the user's index fingers and displays the distance. It automatically adds itself to the render loop for updates.
-   **`MoveByKeyboard.js`**: A class for non-XR navigation. Combines mouse-based orbit controls with keyboard (WASD) movement.
-   **`vision.js`**: Contains helper functions like `isVisionPro()` and `getVisionProOffset()` to detect device capabilities.

## License

[MIT](LICENSE)