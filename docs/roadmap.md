# chakra-core · Roadmap

## v1.0 — Foundation ✅
- [x] Webcam feed
- [x] MediaPipe hand tracking
- [x] Canvas rendering
- [x] Landmark + connector visualisation
- [x] Aura particle system
- [x] Smooth animation loop
- [x] Rule-based gesture detection
- [x] HUD (FPS, hands, gesture)
- [x] Loading screen
- [x] Debug panel

## v1.1 — Effects Polish
- [ ] Per-finger energy tendrils
- [ ] Sound reactivity (Web Audio API)
- [ ] Charge effect beam between two hands
- [ ] Hand velocity trails (motion blur)

## v2.0 — ML Upgrade
- [ ] TensorFlow.js gesture classifier (21×3 → gesture logit)
- [ ] Custom training pipeline (MediaPipe → label → tfjs)
- [ ] Real-time confidence display

## v2.1 — Three.js GPU Particles
- [ ] Replace canvas particles with THREE.Points BufferGeometry
- [ ] Custom GLSL aura shader (see effects/shaders.js)
- [ ] Post-processing: bloom + chromatic aberration

## v3.0 — AR Combat Engine
- [ ] Gesture combo system
- [ ] Pose detection (MediaPipe Pose) for full-body moves
- [ ] Multi-user WebRTC session
- [ ] Exported effects as compositable video layer
