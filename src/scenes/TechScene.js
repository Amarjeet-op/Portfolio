import * as THREE from 'three';

export class TechScene {
  constructor() {
    this.canvas = document.getElementById('tech-canvas');
    if (!this.canvas) return;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
    this.camera.position.z = 40;

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: false, antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x030308, 1);

    this.clock = new THREE.Clock();
    
    this.group = new THREE.Group();
    this.scene.add(this.group);
    
    // Torus Knot Wireframe
    const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
    const material = new THREE.MeshBasicMaterial({
      color: 0x00e5cc,
      wireframe: true,
      transparent: true,
      opacity: 0.1 // very subtle
    });
    
    this.torusKnot = new THREE.Mesh(geometry, material);
    this.group.add(this.torusKnot);
    
    this._onResize = this._onResize.bind(this);
    window.addEventListener('resize', this._onResize);
  }

  update() {
    if (!this.canvas) return;
    const elapsed = this.clock.getElapsedTime();
    
    this.group.rotation.x = elapsed * 0.1;
    this.group.rotation.y = elapsed * 0.15;
    
    this.renderer.render(this.scene, this.camera);
  }

  _onResize() {
    if (!this.canvas) return;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  dispose() {
    window.removeEventListener('resize', this._onResize);
    if (this.torusKnot) {
      this.torusKnot.geometry.dispose();
      this.torusKnot.material.dispose();
    }
    if (this.renderer) this.renderer.dispose();
  }
}
