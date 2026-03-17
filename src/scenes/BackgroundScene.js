import * as THREE from 'three';

export class BackgroundScene {
  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
    this.camera.position.set(0, 0, 50);

    this.canvas = document.getElementById('bg-canvas');
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true, antialias: false });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.clock = new THREE.Clock();
    this.initialOpacity = 0.85;
    this._createNebulas();
    
    this._onResize = this._onResize.bind(this);
    this._onScroll = this._onScroll.bind(this);
    
    window.addEventListener('resize', this._onResize);
    window.addEventListener('scroll', this._onScroll);
  }

  _createNebulas() {
    const nebulaColors = [
      new THREE.Color(0xffd700),  // Gold
      new THREE.Color(0x00e5cc),  // Teal
      new THREE.Color(0x1a1a6e),  // Cosmic blue
      new THREE.Color(0xff6633),  // Saffron
      new THREE.Color(0x4400aa),  // Deep purple
      new THREE.Color(0x00aaff),  // Bright blue
    ];

    this.nebulas = [];
    nebulaColors.forEach((color, i) => {
      const geo = new THREE.PlaneGeometry(120 + Math.random() * 80, 120 + Math.random() * 80);
      const mat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.015 + Math.random() * 0.01,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(
        (Math.random() - 0.5) * 200,
        (Math.random() - 0.5) * 200,
        -100 - Math.random() * 100
      );
      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      this.scene.add(mesh);
      this.nebulas.push({ mesh, speed: 0.0002 + Math.random() * 0.0003 });
    });
  }

  update() {
    const elapsed = this.clock.getElapsedTime();

    // Nebula rotation
    this.nebulas.forEach(n => {
      n.mesh.rotation.z += n.speed;
    });

    this.renderer.render(this.scene, this.camera);
  }

  _onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  _onScroll() {
    // Fade out background as we scroll down (fade out over first 800px)
    const fadeDistance = 800;
    const scrollY = window.scrollY;
    
    // Calculate new opacity (min 0)
    let newOpacity = this.initialOpacity * (1 - scrollY / fadeDistance);
    if (newOpacity < 0) newOpacity = 0;
    
    // Apply to nebulas
    if (this.nebulas) {
      this.nebulas.forEach(n => {
        n.mesh.material.opacity = (0.015 + Math.random() * 0.01) * (newOpacity / this.initialOpacity);
      });
    }
  }

  dispose() {
    window.removeEventListener('resize', this._onResize);
    window.removeEventListener('scroll', this._onScroll);
    this.nebulas.forEach(n => {
      n.mesh.geometry.dispose();
      n.mesh.material.dispose();
    });
    this.renderer.dispose();
  }
}
