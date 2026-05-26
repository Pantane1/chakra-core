/**
 * chakra-core :: ui/loadingScreen.js
 * Controls the animated loading overlay shown during model initialisation.
 */

import { $ } from '../utils/helpers.js';

export class LoadingScreen {
  constructor() {
    this._el = $('#loading-screen');
  }

  setMessage(msg) {
    const msgEl = this._el?.querySelector('.loading-message');
    if (msgEl) msgEl.textContent = msg;
  }

  hide() {
    if (!this._el) return;
    this._el.classList.add('hidden');
    setTimeout(() => { this._el.style.display = 'none'; }, 600);
  }

  show() {
    if (!this._el) return;
    this._el.style.display = 'flex';
    requestAnimationFrame(() => this._el.classList.remove('hidden'));
  }
}
