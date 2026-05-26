/**
 * chakra-core :: renderer/animationLoop.js
 * Centralised requestAnimationFrame loop with pause/resume support.
 */

export class AnimationLoop {
  constructor(callback) {
    this._callback = callback;
    this._rafId    = null;
    this._running  = false;
    this._boundTick = this._tick.bind(this);
  }

  start() {
    if (this._running) return;
    this._running = true;
    this._rafId = requestAnimationFrame(this._boundTick);
  }

  stop() {
    this._running = false;
    if (this._rafId) {
      cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }
  }

  _tick(timestamp) {
    if (!this._running) return;
    this._callback(timestamp);
    this._rafId = requestAnimationFrame(this._boundTick);
  }

  get running() { return this._running; }
}
