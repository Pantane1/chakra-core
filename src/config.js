/**
 * chakra-core :: config.js
 * Central configuration for all modules.
 * Modify here to tune effects, performance, and thresholds.
 */

export const CONFIG = {
  // ─── Camera ──────────────────────────────────────────────────────────────
  camera: {
    width: 1280,
    height: 720,
    facingMode: 'user',
  },

  // ─── MediaPipe Hands ─────────────────────────────────────────────────────
  hands: {
    maxNumHands: 2,
    modelComplexity: 1,         // 0 = lite, 1 = full
    minDetectionConfidence: 0.7,
    minTrackingConfidence: 0.6,
  },

  // ─── Aura Particles ──────────────────────────────────────────────────────
  aura: {
    particleCount: 80,          // per hand
    orbitRadius: 60,            // base orbit radius (px)
    orbitSpeed: 0.04,           // radians per frame
    particleSize: 3,
    trailLength: 12,            // number of trail positions stored
    trailFade: 0.85,
    lerpFactor: 0.15,           // smoothing for hand position
    colorPrimary: '#00d4ff',
    colorSecondary: '#7b2fff',
    colorAccent: '#ff00cc',
  },

  // ─── Glow ────────────────────────────────────────────────────────────────
  glow: {
    blur: 18,
    intensity: 1.4,
    color: '#00aaff',
  },

  // ─── Performance ─────────────────────────────────────────────────────────
  performance: {
    fpsUpdateInterval: 500,     // ms between FPS display updates
    targetFPS: 60,
  },

  // ─── Gesture Detection ───────────────────────────────────────────────────
  gestures: {
    // TODO(ML): Replace threshold rules with a trained gesture classifier
    fistThreshold: 0.06,        // normalised distance — palm→fingertips
    openPalmThreshold: 0.22,
    twoHandChargeDistance: 0.3, // normalised distance between wrists
  },

  // ─── Debug ───────────────────────────────────────────────────────────────
  debug: {
    showLandmarks: true,
    showConnectors: true,
    showBoundingBox: false,
    showGestureLabel: true,
  },
};
