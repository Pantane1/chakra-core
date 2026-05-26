/**
 * chakra-core :: utils/helpers.js
 * Miscellaneous DOM and utility helpers.
 */

/** Shorthand querySelector */
export const $ = (sel, ctx = document) => ctx.querySelector(sel);

/** Set canvas size matching its CSS display size (handles HiDPI) */
export const resizeCanvasToDisplay = (canvas) => {
  const dpr = window.devicePixelRatio || 1;
  const { width, height } = canvas.getBoundingClientRect();
  const w = Math.round(width * dpr);
  const h = Math.round(height * dpr);
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w;
    canvas.height = h;
    return true; // was resized
  }
  return false;
};

/** Parse hex colour → { r, g, b } (0-255) */
export const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 212, b: 255 };
};

/** Build rgba() string from hex + alpha */
export const hexAlpha = (hex, alpha) => {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r},${g},${b},${alpha})`;
};

/** Debounce a function */
export const debounce = (fn, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};
