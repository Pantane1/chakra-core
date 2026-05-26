/**
 * chakra-core :: camera/webcam.js
 * Handles webcam stream initialisation and teardown.
 */

import { CONFIG } from '../config.js';

export class WebcamManager {
  constructor(videoElement) {
    this.video = videoElement;
    this.stream = null;
    this.active = false;
  }

  /** Request camera access and start the stream */
  async start() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: CONFIG.camera.width },
          height: { ideal: CONFIG.camera.height },
          facingMode: CONFIG.camera.facingMode,
        },
        audio: false,
      });

      this.video.srcObject = this.stream;

      await new Promise((resolve, reject) => {
        this.video.onloadedmetadata = resolve;
        this.video.onerror = reject;
      });

      await this.video.play();
      this.active = true;
      console.log('[Webcam] Stream started:', this.video.videoWidth, 'x', this.video.videoHeight);
    } catch (err) {
      console.error('[Webcam] Failed to start:', err);
      throw err;
    }
  }

  /** Stop all tracks and clean up */
  stop() {
    if (this.stream) {
      this.stream.getTracks().forEach((t) => t.stop());
      this.stream = null;
    }
    this.active = false;
  }

  get width() { return this.video.videoWidth; }
  get height() { return this.video.videoHeight; }
}
