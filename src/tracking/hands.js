/**
 * chakra-core :: tracking/hands.js
 * Wraps the MediaPipe Hands solution and emits normalised results.
 */

import { CONFIG } from '../config.js';

export class HandTracker {
  constructor(onResults) {
    this._onResults = onResults;
    this.hands = null;
    this.camera = null;
    this._ready = false;
  }

  async init(videoElement) {
    // Dynamic import keeps the bundle split clean
    const { Hands } = await import(
      'https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js'
    );
    const { Camera } = await import(
      'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js'
    );

    this.hands = new Hands({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    this.hands.setOptions({
      maxNumHands:            CONFIG.hands.maxNumHands,
      modelComplexity:        CONFIG.hands.modelComplexity,
      minDetectionConfidence: CONFIG.hands.minDetectionConfidence,
      minTrackingConfidence:  CONFIG.hands.minTrackingConfidence,
    });

    this.hands.onResults((results) => this._onResults(results));

    this.camera = new Camera(videoElement, {
      onFrame: async () => {
        if (this.hands) await this.hands.send({ image: videoElement });
      },
      width: CONFIG.camera.width,
      height: CONFIG.camera.height,
    });

    await this.camera.start();
    this._ready = true;
    console.log('[HandTracker] MediaPipe ready');
  }

  get ready() { return this._ready; }

  destroy() {
    this.camera?.stop();
    this.hands?.close();
    this._ready = false;
  }
}
