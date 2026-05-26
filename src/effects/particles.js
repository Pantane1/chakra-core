/**
 * chakra-core :: effects/particles.js
 * Canvas-based orbital particle system for the aura effect.
 */

import { CONFIG } from '../config.js';
import { lerp, randFloat, clamp } from '../utils/math.js';
import { hexAlpha } from '../utils/helpers.js';

export class Particle {
  constructor(handIndex) {
    this.handIndex = handIndex;
    this.reset();
  }

  reset() {
    this.angle     = randFloat(0, Math.PI * 2);
    this.orbitR    = randFloat(20, CONFIG.aura.orbitRadius);
    this.speed     = randFloat(0.02, CONFIG.aura.orbitSpeed * 2);
    this.size      = randFloat(1.5, CONFIG.aura.particleSize);
    this.alpha     = randFloat(0.4, 1.0);
    this.z         = randFloat(0.5, 1.5); // depth faux-3D
    this.color     = Math.random() > 0.5 ? CONFIG.aura.colorPrimary : CONFIG.aura.colorSecondary;
    this.x         = 0;
    this.y         = 0;
  }

  update(cx, cy, openness) {
    this.angle  += this.speed;
    const radius = this.orbitR * (0.6 + openness * 0.8) * this.z;
    this.x = cx + Math.cos(this.angle) * radius;
    this.y = cy + Math.sin(this.angle) * radius * 0.55; // flatten Y → oval
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.shadowBlur  = 12;
    ctx.shadowColor = this.color;
    ctx.fillStyle   = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * this.z, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

export class ParticleSystem {
  constructor() {
    /** Map: handIndex → Particle[] */
    this._pools = new Map();
    /** Map: handIndex → trail [] of {x,y} */
    this._trails = new Map();
    /** Map: handIndex → current smoothed position {x,y} */
    this._positions = new Map();
  }

  _ensurePool(idx) {
    if (!this._pools.has(idx)) {
      this._pools.set(
        idx,
        Array.from({ length: CONFIG.aura.particleCount }, () => new Particle(idx))
      );
      this._trails.set(idx, []);
      this._positions.set(idx, null);
    }
  }

  /**
   * Update all particle pools to the given hand centres.
   * @param {Array<{x,y,openness}>} hands  - one entry per detected hand
   */
  update(hands) {
    // Mark all active pools
    const activeIndices = new Set(hands.map((_, i) => i));

    hands.forEach(({ x, y, openness }, idx) => {
      this._ensurePool(idx);

      // Smooth the position
      const prev = this._positions.get(idx);
      const pos = prev
        ? { x: lerp(prev.x, x, CONFIG.aura.lerpFactor), y: lerp(prev.y, y, CONFIG.aura.lerpFactor) }
        : { x, y };
      this._positions.set(idx, pos);

      // Trail
      const trail = this._trails.get(idx);
      trail.unshift({ x: pos.x, y: pos.y });
      if (trail.length > CONFIG.aura.trailLength) trail.pop();

      // Particles
      this._pools.get(idx).forEach((p) => p.update(pos.x, pos.y, openness));
    });

    // Remove pools for hands that disappeared
    for (const idx of this._pools.keys()) {
      if (!activeIndices.has(idx)) {
        this._pools.delete(idx);
        this._trails.delete(idx);
        this._positions.delete(idx);
      }
    }
  }

  /**
   * Draw all active particles and trails onto ctx.
   */
  draw(ctx) {
    // Draw trails first (below particles)
    for (const [idx, trail] of this._trails.entries()) {
      if (trail.length < 2) continue;
      ctx.save();
      for (let i = 0; i < trail.length - 1; i++) {
        const alpha = (1 - i / trail.length) * 0.35;
        const width = clamp(6 - i * 0.4, 1, 6);
        ctx.strokeStyle = hexAlpha(CONFIG.aura.colorPrimary, alpha);
        ctx.lineWidth   = width;
        ctx.shadowBlur  = 20;
        ctx.shadowColor = CONFIG.aura.colorPrimary;
        ctx.beginPath();
        ctx.moveTo(trail[i].x, trail[i].y);
        ctx.lineTo(trail[i + 1].x, trail[i + 1].y);
        ctx.stroke();
      }
      ctx.restore();
    }

    // Draw particles
    for (const pool of this._pools.values()) {
      pool.forEach((p) => p.draw(ctx));
    }
  }
}
