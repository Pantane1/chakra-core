/**
 * chakra-core :: ui/hud.js
 * Updates the HUD elements: FPS, hand count, gesture labels.
 */

import { $ } from '../utils/helpers.js';
import { GESTURE } from '../tracking/gestures.js';

const GESTURE_LABELS = {
  [GESTURE.UNKNOWN]:         '—',
  [GESTURE.OPEN_PALM]:       '✋ OPEN PALM',
  [GESTURE.CLOSED_FIST]:     '✊ CLOSED FIST',
  [GESTURE.TWO_HAND_CHARGE]: '⚡ CHARGING',
};

export class HUD {
  constructor() {
    this._fps     = $('#fps-value');
    this._hands   = $('#hands-value');
    this._gesture = $('#gesture-value');
    this._status  = $('#status-dot');
  }

  update({ fps, handCount, gestures }) {
    if (this._fps)     this._fps.textContent     = fps;
    if (this._hands)   this._hands.textContent   = handCount;
    if (this._gesture && gestures) {
      const label =
        gestures.combined !== GESTURE.UNKNOWN
          ? GESTURE_LABELS[gestures.combined]
          : [gestures.left, gestures.right]
              .filter((g) => g !== GESTURE.UNKNOWN)
              .map((g) => GESTURE_LABELS[g])
              .join(' | ') || '—';
      this._gesture.textContent = label;
    }
  }

  setStatus(active) {
    if (!this._status) return;
    this._status.classList.toggle('active', active);
  }
}
