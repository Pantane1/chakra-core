/**
 * chakra-core :: effects/shaders.js
 * GLSL shader sources for future Three.js / WebGL effects.
 *
 * TODO(THREE): Hook these into threeRenderer.js ShaderMaterial when
 *              upgrading the aura to a full GPU particle system.
 */

export const VERT_PASSTHROUGH = /* glsl */`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const FRAG_AURA = /* glsl */`
  uniform float uTime;
  uniform vec3  uColor;
  uniform float uIntensity;
  varying vec2 vUv;

  void main() {
    float d = distance(vUv, vec2(0.5));
    float glow = smoothstep(0.5, 0.0, d) * uIntensity;
    float pulse = sin(uTime * 3.0) * 0.15 + 0.85;
    gl_FragColor = vec4(uColor * glow * pulse, glow);
  }
`;

export const FRAG_CHARGE = /* glsl */`
  uniform float uTime;
  uniform vec3  uColor;
  varying vec2 vUv;

  void main() {
    float d    = distance(vUv, vec2(0.5));
    float ring = abs(d - 0.45) < 0.04 ? 1.0 : 0.0;
    float pulse = (sin(uTime * 6.0) * 0.5 + 0.5);
    gl_FragColor = vec4(uColor, ring * pulse * 0.8);
  }
`;
