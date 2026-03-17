import * as THREE from 'three';

export class AchievementsScene {
  constructor() {
    this.canvas = document.getElementById('achievements-canvas');
    if (!this.canvas) return;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
    this.camera.position.z = 40;

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true, antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.clock = new THREE.Clock();
    
    this.group = new THREE.Group();
    this.scene.add(this.group);
    
    // Octahedron (diamond/pyramid shape)
    const geometry = new THREE.OctahedronGeometry(8, 0);
    
    // Wireframe for the edges
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xffd700, // Gold
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });
    this.diamondWire = new THREE.Mesh(geometry, wireMat);
    this.group.add(this.diamondWire);
    
    // Solid (very subtle)
    const solidMat = new THREE.MeshBasicMaterial({
      color: 0xffd700,
      transparent: true,
      opacity: 0.05
    });
    this.diamondSolid = new THREE.Mesh(geometry, solidMat);
    this.group.add(this.diamondSolid);

    this._onResize = this._onResize.bind(this);
    window.addEventListener('resize', this._onResize);
  }

  update() {
    if (!this.canvas) return;
    const elapsed = this.clock.getElapsedTime();
    
    this.group.rotation.y = elapsed * 0.2;
    this.group.position.y = Math.sin(elapsed) * 2; // Hover effect

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
    if (this.diamondWire) {
      this.diamondWire.geometry.dispose();
      this.diamondWire.material.dispose();
      this.diamondSolid.material.dispose();
    }
    if (this.renderer) this.renderer.dispose();
  }
}
