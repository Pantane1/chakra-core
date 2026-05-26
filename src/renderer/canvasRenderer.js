/**
 * chakra-core :: renderer/canvasRenderer.js
 * Renders webcam feed, hand landmarks, connectors, and aura onto two layered canvases.
 */

import { CONFIG } from '../config.js';
import { landmarkToCanvas } from '../utils/math.js';
import { drawGlowCircle } from '../effects/glow.js';
import { hexAlpha } from '../utils/helpers.js';

// MediaPipe hand connector pairs (indices into the 21-landmark array)
const CONNECTIONS = [
  [0,1],[1,2],[2,3],[3,4],
  [0,5],[5,6],[6,7],[7,8],
  [5,9],[9,10],[10,11],[11,12],
  [9,13],[13,14],[14,15],[15,16],
  [13,17],[17,18],[18,19],[19,20],
  [0,17],
];

export class CanvasRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx    = canvas.getContext('2d');
  }

  resize(w, h) {
    this.canvas.width  = w;
    this.canvas.height = h;
  }

  /** Clear the canvas each frame */
  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Draw the mirrored webcam frame as background.
   * @param {HTMLVideoElement} video
   */
  drawVideo(video) {
    const { width: W, height: H } = this.canvas;
    this.ctx.save();
    this.ctx.translate(W, 0);
    this.ctx.scale(-1, 1);
    this.ctx.drawImage(video, 0, 0, W, H);
    this.ctx.restore();
  }

  /**
   * Draw landmarks and connectors for one hand.
   * @param {Array} landmarks - 21 normalised points
   * @param {string} label    - 'Left' | 'Right'
   */
  drawHand(landmarks, label) {
    if (!CONFIG.debug.showLandmarks && !CONFIG.debug.showConnectors) return;
    const { width: W, height: H } = this.canvas;
    const color = label === 'Left' ? CONFIG.aura.colorPrimary : CONFIG.aura.colorSecondary;

    // Connectors
    if (CONFIG.debug.showConnectors) {
      this.ctx.save();
      this.ctx.strokeStyle = hexAlpha(color, 0.6);
      this.ctx.lineWidth   = 1.5;
      this.ctx.shadowBlur  = 8;
      this.ctx.shadowColor = color;

      CONNECTIONS.forEach(([a, b]) => {
        const pa = landmarkToCanvas(landmarks[a], W, H);
        const pb = landmarkToCanvas(landmarks[b], W, H);
        // Mirror X
        pa.x = W - pa.x;
        pb.x = W - pb.x;
        this.ctx.beginPath();
        this.ctx.moveTo(pa.x, pa.y);
        this.ctx.lineTo(pb.x, pb.y);
        this.ctx.stroke();
      });
      this.ctx.restore();
    }

    // Landmark dots
    if (CONFIG.debug.showLandmarks) {
      landmarks.forEach((lm, i) => {
        const { x, y } = landmarkToCanvas(lm, W, H);
        const mx = W - x; // mirror
        const isJoint = i % 4 === 0;
        drawGlowCircle(this.ctx, mx, y, isJoint ? 5 : 3, color, 10);
      });
    }
  }

  get width()  { return this.canvas.width; }
  get height() { return this.canvas.height; }
  get context(){ return this.ctx; }
}
