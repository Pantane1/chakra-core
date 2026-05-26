/**
 * chakra-core :: renderer/threeRenderer.js
 * Three.js scene scaffold for future GPU particle systems and 3-D effects.
 *
 * TODO(THREE): Replace the canvas-based ParticleSystem with a BufferGeometry
 *              GPU particle cloud using ShaderMaterial (see effects/shaders.js).
 */

export class ThreeRenderer {
  constructor(container) {
    this.container = container;
    this.renderer  = null;
    this.scene     = null;
    this.camera    = null;
    this._active   = false;
  }

  async init() {
    const THREE = await import('three');

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 5;

    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x000000, 0);

    this.container.appendChild(this.renderer.domElement);
    this._active = true;

    window.addEventListener('resize', () => this._onResize());
    console.log('[ThreeRenderer] Three.js scene ready (passthrough mode)');
  }

  _onResize() {
    if (!this.camera || !this.renderer) return;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  /** Called each frame — currently a passthrough; add 3-D objects here */
  render() {
    if (!this._active) return;
    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    this.renderer?.dispose();
    this._active = false;
  }
}
