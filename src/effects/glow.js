/**
 * chakra-core :: effects/glow.js
 * Canvas glow helpers — used by landmark renderer and aura effect.
 */

import { CONFIG } from '../config.js';

/**
 * Apply a glow shadow to the current ctx state.
 * Call before drawing the glowing shape.
 */
export const applyGlow = (ctx, color = CONFIG.glow.color, blur = CONFIG.glow.blur) => {
  ctx.shadowBlur  = blur;
  ctx.shadowColor = color;
};

/**
 * Remove glow (reset shadow) after drawing.
 */
export const clearGlow = (ctx) => {
  ctx.shadowBlur  = 0;
  ctx.shadowColor = 'transparent';
};

/**
 * Draw a glowing circle.
 */
export const drawGlowCircle = (ctx, x, y, radius, color, blur = 16) => {
  ctx.save();
  applyGlow(ctx, color, blur);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
};
