/**
 * chakra-core :: app.js
 * Application root — wires together all modules.
 */

import { WebcamManager }   from './camera/webcam.js';
import { HandTracker }     from './tracking/hands.js';
import { classifyGestures } from './tracking/gestures.js';
import { handOpenness }    from './tracking/landmarks.js';
import { AuraEffect }      from './effects/aura.js';
import { CanvasRenderer }  from './renderer/canvasRenderer.js';
import { AnimationLoop }   from './renderer/animationLoop.js';
import { PerformanceMonitor } from './utils/performance.js';
import { landmarkToCanvas, centroid } from './utils/math.js';
import { HUD }             from './ui/hud.js';
import { LoadingScreen }   from './ui/loadingScreen.js';
import { DebugPanel }      from './ui/debugPanel.js';
import { $, resizeCanvasToDisplay } from './utils/helpers.js';

export class ChakraApp {
  constructor() {
    this._video    = /** @type {HTMLVideoElement} */ ($('#webcam'));
    this._canvas   = /** @type {HTMLCanvasElement} */ ($('#overlay-canvas'));

    this._webcam   = new WebcamManager(this._video);
    this._renderer = new CanvasRenderer(this._canvas);
    this._aura     = new AuraEffect();
    this._perf     = new PerformanceMonitor();
    this._hud      = new HUD();
    this._loading  = new LoadingScreen();
    this._debug    = new DebugPanel();
    this._loop     = new AnimationLoop(this._frame.bind(this));

    // Latest tracking state (updated by MediaPipe callbacks)
    this._handData  = [];
    this._gestures  = { left: 'UNKNOWN', right: 'UNKNOWN', combined: 'UNKNOWN' };
    this._handedness = [];
  }

  async start() {
    try {
      this._loading.setMessage('Requesting camera access…');
      await this._webcam.start();

      this._loading.setMessage('Loading hand tracking model…');
      this._tracker = new HandTracker(this._onResults.bind(this));
      await this._tracker.init(this._video);

      this._loading.hide();
      this._hud.setStatus(true);
      this._loop.start();

      window.addEventListener('resize', () => this._onResize());
      this._onResize();

    } catch (err) {
      this._loading.setMessage(`Error: ${err.message}`);
      console.error('[ChakraApp] Startup failed:', err);
    }
  }

  /** Called by HandTracker whenever MediaPipe produces results */
  _onResults(results) {
    const landmarks  = results.multiHandLandmarks  ?? [];
    const handedness = results.multiHandedness     ?? [];

    this._gestures  = classifyGestures(landmarks, handedness);
    this._handedness = handedness;

    // Build per-hand data (canvas-pixel position + openness)
    const W = this._canvas.width;
    const H = this._canvas.height;

    this._handData = landmarks.map((lm) => {
      const pts = lm.map((p) => ({
        x: W - p.x * W, // mirror
        y: p.y * H,
      }));
      const { x, y } = centroid(pts);
      return { x, y, openness: handOpenness(lm), landmarks: lm };
    });
  }

  /** Main render frame */
  _frame() {
    const fps = this._perf.tick();

    // Clear overlay each frame (video is behind, so no need to draw it here)
    this._renderer.clear();

    // Draw aura effects
    this._aura.update(this._handData, this._gestures);
    this._aura.draw(this._renderer.context, this._handData);

    // Draw hand skeleton on top of aura
    if (this._handData.length > 0) {
      this._handData.forEach(({ landmarks }, i) => {
        const label = this._handedness[i]?.classification?.[0]?.label ?? 'Right';
        this._renderer.drawHand(landmarks, label);
      });
    }

    // HUD update
    this._hud.update({
      fps,
      handCount: this._handData.length,
      gestures: this._gestures,
    });

    // Debug panel (throttled)
    this._debug.update({
      fps,
      hands: this._handData.length,
      gestures: this._gestures,
    });
  }

  _onResize() {
    const rect = this._canvas.parentElement.getBoundingClientRect();
    this._canvas.width  = rect.width;
    this._canvas.height = rect.height;
  }

  destroy() {
    this._loop.stop();
    this._tracker?.destroy();
    this._webcam.stop();
  }
}
