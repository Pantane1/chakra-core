/**
 * chakra-core :: effects/aura.js
 * High-level aura effect controller.
 * Combines glow rings, particle cloud, and charge pulse.
 */

import { CONFIG } from '../config.js';
import { lerp } from '../utils/math.js';
import { hexAlpha } from '../utils/helpers.js';
import { ParticleSystem } from './particles.js';
import { GESTURE } from '../tracking/gestures.js';

export class AuraEffect {
  constructor() {
    this.particles = new ParticleSystem();
    this._chargePhase = 0;     // oscillates when TWO_HAND_CHARGE
    this._chargeActive = false;
  }

  /**
   * Main update — call once per frame with processed hand data.
   * @param {Array<{x, y, openness}>} hands
   * @param {Object} gestures  - result of classifyGestures()
   */
  update(hands, gestures) {
    this._chargeActive = gestures.combined === GESTURE.TWO_HAND_CHARGE;
    if (this._chargeActive) this._chargePhase += 0.08;
    this.particles.update(hands);
  }

  /**
   * Render the full aura onto ctx.
   * @param {CanvasRenderingContext2D} ctx
   * @param {Array<{x, y, openness}>} hands
   */
  draw(ctx, hands) {
    hands.forEach(({ x, y, openness }) => {
      this._drawGlowRing(ctx, x, y, openness);
      if (this._chargeActive) this._drawChargePulse(ctx, x, y);
    });

    this.particles.draw(ctx);
  }

  _drawGlowRing(ctx, cx, cy, openness) {
    const radius = 30 + openness * 55;
    const gradient = ctx.createRadialGradient(cx, cy, radius * 0.3, cx, cy, radius * 1.6);
    gradient.addColorStop(0,   hexAlpha(CONFIG.aura.colorPrimary, 0.55));
    gradient.addColorStop(0.5, hexAlpha(CONFIG.aura.colorSecondary, 0.2));
    gradient.addColorStop(1,   hexAlpha(CONFIG.aura.colorPrimary, 0));

    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  _drawChargePulse(ctx, cx, cy) {
    const pulse  = Math.sin(this._chargePhase) * 0.5 + 0.5; // 0–1
    const radius = 60 + pulse * 50;
    const alpha  = 0.15 + pulse * 0.35;

    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.strokeStyle = hexAlpha(CONFIG.aura.colorAccent, alpha);
    ctx.lineWidth   = 3 + pulse * 5;
    ctx.shadowBlur  = 30;
    ctx.shadowColor = CONFIG.aura.colorAccent;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
}
