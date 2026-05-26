/**
 * chakra-core :: utils/performance.js
 * FPS tracking and frame timing utilities.
 */

import { CONFIG } from '../config.js';

export class PerformanceMonitor {
  constructor() {
    this._frames = 0;
    this._lastTime = performance.now();
    this._fps = 0;
    this._frameDelta = 0;
    this._prevFrame = performance.now();
  }

  /** Call once per animation frame. Returns current FPS. */
  tick() {
    const now = performance.now();
    this._frameDelta = now - this._prevFrame;
    this._prevFrame = now;
    this._frames++;

    if (now - this._lastTime >= CONFIG.performance.fpsUpdateInterval) {
      this._fps = Math.round(
        (this._frames * 1000) / (now - this._lastTime)
      );
      this._frames = 0;
      this._lastTime = now;
    }

    return this._fps;
  }

  get fps() { return this._fps; }

  /** Time (ms) since last frame — useful for time-based animation */
  get delta() { return this._frameDelta; }
}
