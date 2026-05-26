# chakra-core · Architecture

## Overview

```
index.html
└── src/main.js               ← entry point
    └── ChakraApp (app.js)    ← orchestrator
        ├── WebcamManager     ← camera/webcam.js
        ├── HandTracker       ← tracking/hands.js (MediaPipe)
        │   ├── landmarks.js  ← landmark helpers
        │   └── gestures.js   ← rule-based gesture classifier
        ├── AuraEffect        ← effects/aura.js
        │   └── ParticleSystem← effects/particles.js
        ├── CanvasRenderer    ← renderer/canvasRenderer.js
        ├── AnimationLoop     ← renderer/animationLoop.js
        ├── PerformanceMonitor← utils/performance.js
        └── HUD / LoadingScreen / DebugPanel  ← ui/
```

## Data Flow

1. **MediaPipe** processes each webcam frame and emits 21 normalised landmarks per hand.
2. `HandTracker._onResults` is the callback — it forwards results to `ChakraApp`.
3. `ChakraApp._onResults` maps landmarks to canvas-pixel coordinates and computes `openness`.
4. On each `requestAnimationFrame`, the loop calls:
   - `AuraEffect.update()` → particle physics step
   - `AuraEffect.draw()` → canvas render (glow rings + particle cloud + trails)
   - `CanvasRenderer.drawHand()` → skeleton overlay
   - `HUD.update()` → DOM updates

## Future: ML Gesture Classification

Replace `classifySingleHand()` in `tracking/gestures.js` with a TensorFlow.js model:

```js
// TODO(ML):
import * as tf from '@tensorflow/tfjs';
const model = await tf.loadLayersModel('/models/gesture_classifier/model.json');

const input = tf.tensor2d(landmarks.flatMap(p => [p.x, p.y, p.z]), [1, 63]);
const logits = model.predict(input);
const gestureIndex = logits.argMax(-1).dataSync()[0];
```

## Future: GPU Particle System (Three.js)

See `renderer/threeRenderer.js` and `effects/shaders.js`.
Replace the 2-D canvas `ParticleSystem` with a `THREE.Points` object using a custom
`ShaderMaterial` (VERT_PASSTHROUGH + FRAG_AURA) for thousands of GPU-driven particles.
