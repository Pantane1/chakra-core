/**
 * chakra-core :: tracking/gestures.js
 * Rule-based gesture detection with architecture ready for ML upgrades.
 *
 * TODO(ML): Replace classify() with a TensorFlow.js / ONNX model
 *           that accepts the 21×3 landmark tensor and outputs gesture logits.
 */

import { CONFIG } from '../config.js';
import { handOpenness, LANDMARK } from './landmarks.js';

export const GESTURE = {
  UNKNOWN: 'UNKNOWN',
  OPEN_PALM: 'OPEN_PALM',
  CLOSED_FIST: 'CLOSED_FIST',
  TWO_HAND_CHARGE: 'TWO_HAND_CHARGE',
  // TODO(ML): KAMEHAMEHA, SPIRIT_BOMB, RASENGAN …
};

/**
 * Classify a single hand's gesture from its landmarks.
 * @param {Array} landmarks - 21 normalised landmarks
 * @returns {string} GESTURE constant
 */
export const classifySingleHand = (landmarks) => {
  const openness = handOpenness(landmarks);

  if (openness >= CONFIG.gestures.openPalmThreshold) return GESTURE.OPEN_PALM;
  if (openness <= CONFIG.gestures.fistThreshold)     return GESTURE.CLOSED_FIST;
  return GESTURE.UNKNOWN;
};

/**
 * Multi-hand gesture detection.
 * @param {Array} allLandmarks  - array of 21-landmark arrays (1-2 hands)
 * @param {Array} handedness    - array of handedness labels
 * @returns {{ left: string, right: string, combined: string }}
 */
export const classifyGestures = (allLandmarks, handedness) => {
  const result = { left: GESTURE.UNKNOWN, right: GESTURE.UNKNOWN, combined: GESTURE.UNKNOWN };

  allLandmarks.forEach((lm, i) => {
    const label = handedness[i]?.classification?.[0]?.label ?? 'Right';
    const gesture = classifySingleHand(lm);
    if (label === 'Left')  result.left  = gesture;
    if (label === 'Right') result.right = gesture;
  });

  // Two-hand charge: both fists close together
  if (
    allLandmarks.length === 2 &&
    result.left  === GESTURE.CLOSED_FIST &&
    result.right === GESTURE.CLOSED_FIST
  ) {
    const w0 = allLandmarks[0][LANDMARK.WRIST];
    const w1 = allLandmarks[1][LANDMARK.WRIST];
    const wristDist = Math.sqrt((w1.x - w0.x) ** 2 + (w1.y - w0.y) ** 2);
    if (wristDist < CONFIG.gestures.twoHandChargeDistance) {
      result.combined = GESTURE.TWO_HAND_CHARGE;
    }
  }

  return result;
};
