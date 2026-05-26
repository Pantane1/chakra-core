/**
 * chakra-core :: tracking/landmarks.js
 * MediaPipe landmark indices and helper accessors.
 *
 * MediaPipe Hands returns 21 landmarks per hand.
 * Reference: https://google.github.io/mediapipe/solutions/hands.html
 */

export const LANDMARK = {
  WRIST: 0,
  THUMB_CMC: 1, THUMB_MCP: 2, THUMB_IP: 3, THUMB_TIP: 4,
  INDEX_MCP: 5, INDEX_PIP: 6, INDEX_DIP: 7, INDEX_TIP: 8,
  MIDDLE_MCP: 9, MIDDLE_PIP: 10, MIDDLE_DIP: 11, MIDDLE_TIP: 12,
  RING_MCP: 13, RING_PIP: 14, RING_DIP: 15, RING_TIP: 16,
  PINKY_MCP: 17, PINKY_PIP: 18, PINKY_DIP: 19, PINKY_TIP: 20,
};

export const FINGERTIPS = [
  LANDMARK.THUMB_TIP,
  LANDMARK.INDEX_TIP,
  LANDMARK.MIDDLE_TIP,
  LANDMARK.RING_TIP,
  LANDMARK.PINKY_TIP,
];

/**
 * Returns the average of the 5 fingertip positions (normalised).
 * Useful as a "hand centre of energy" above the palm.
 */
export const fingertipCentroid = (landmarks) => {
  const tips = FINGERTIPS.map((i) => landmarks[i]);
  return {
    x: tips.reduce((s, p) => s + p.x, 0) / tips.length,
    y: tips.reduce((s, p) => s + p.y, 0) / tips.length,
    z: tips.reduce((s, p) => s + p.z, 0) / tips.length,
  };
};

/**
 * Returns normalised "openness" of the hand (0 = fist, 1 = open).
 * Computed as average distance from wrist to fingertips.
 */
export const handOpenness = (landmarks) => {
  const wrist = landmarks[LANDMARK.WRIST];
  const tipDists = FINGERTIPS.map((i) => {
    const t = landmarks[i];
    return Math.sqrt(
      (t.x - wrist.x) ** 2 +
      (t.y - wrist.y) ** 2 +
      (t.z - wrist.z) ** 2
    );
  });
  const avg = tipDists.reduce((a, b) => a + b, 0) / tipDists.length;
  // Typical range is ~0.1 (fist) – 0.45 (open palm)
  return Math.min(avg / 0.45, 1);
};
