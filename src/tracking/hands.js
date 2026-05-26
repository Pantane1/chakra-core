/**
 * chakra-core :: tracking/hands.js
 * Wraps the MediaPipe Hands solution and emits normalised results.
 * MediaPipe CDN scripts expose globals (window.Hands, window.Camera)
 * rather than ES module exports, so we load them as <script> tags.
 */

import { CONFIG } from '../config.js';

const CDN = 'https://cdn.jsdelivr.net/npm';

/** Inject a <script> tag and wait for it to load */
const loadScript = (src) =>
  new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const s = document.createElement('script');
    s.src = src;
    s.crossOrigin = 'anonymous';
    s.onload  = resolve;
    s.onerror = () => reject(new Error(`Failed to load: ${src}`));
    document.head.appendChild(s);
  });

export class HandTracker {
  constructor(onResults) {
    this._onResults = onResults;
    this.hands  = null;
    this.camera = null;
    this._ready = false;
  }

  async init(videoElement) {
    // Load MediaPipe scripts — they attach to window globals
    await loadScript(`${CDN}/@mediapipe/hands/hands.js`);
    await loadScript(`${CDN}/@mediapipe/camera_utils/camera_utils.js`);

    const Hands  = window.Hands;
    const Camera = window.Camera;

    if (!Hands)  throw new Error('Hands global not found after script load');
    if (!Camera) throw new Error('Camera global not found after script load');

    this.hands = new Hands({
      locateFile: (file) => `${CDN}/@mediapipe/hands/${file}`,
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
      width:  CONFIG.camera.width,
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