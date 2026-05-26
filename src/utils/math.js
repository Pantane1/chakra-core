/**
 * chakra-core :: utils/math.js
 * Common math helpers used across the engine.
 */

/** Linear interpolation */
export const lerp = (a, b, t) => a + (b - a) * t;

/** 2D Euclidean distance */
export const dist2D = (x1, y1, x2, y2) =>
  Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

/** Clamp a value between min and max */
export const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

/** Map a value from one range to another */
export const mapRange = (val, inMin, inMax, outMin, outMax) =>
  outMin + ((val - inMin) / (inMax - inMin)) * (outMax - outMin);

/** Convert degrees to radians */
export const degToRad = (deg) => (deg * Math.PI) / 180;

/** Random float between min and max */
export const randFloat = (min, max) => Math.random() * (max - min) + min;

/** Random integer between min and max (inclusive) */
export const randInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

/** Normalised landmark position → canvas pixel */
export const landmarkToCanvas = (landmark, canvasWidth, canvasHeight) => ({
  x: landmark.x * canvasWidth,
  y: landmark.y * canvasHeight,
});

/** Centre of a set of {x,y} points */
export const centroid = (points) => {
  const sum = points.reduce((acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }), { x: 0, y: 0 });
  return { x: sum.x / points.length, y: sum.y / points.length };
};
