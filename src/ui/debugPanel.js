/**
 * chakra-core :: ui/debugPanel.js
 * Toggleable debug overlay — shows raw landmark data and config values.
 */

import { $, debounce } from '../utils/helpers.js';
import { CONFIG } from '../config.js';

export class DebugPanel {
  constructor() {
    this._panel  = $('#debug-panel');
    this._toggle = $('#debug-toggle');
    this._visible = false;

    this._toggle?.addEventListener('click', () => this.toggle());
  }

  toggle() {
    this._visible = !this._visible;
    this._panel?.classList.toggle('visible', this._visible);
    if (this._toggle) this._toggle.textContent = this._visible ? 'DEBUG ●' : 'DEBUG ○';
  }

  update = debounce((data) => {
    if (!this._visible || !this._panel) return;
    const pre = this._panel.querySelector('pre');
    if (pre) pre.textContent = JSON.stringify(data, null, 2);
  }, 100);
}
