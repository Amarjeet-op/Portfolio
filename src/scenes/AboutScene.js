import * as THREE from 'three';

export class AboutScene {
  constructor() {
    this.canvas = document.getElementById('about-canvas');
    if (!this.canvas) return;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
    this.camera.position.z = 50;

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true, antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.clock = new THREE.Clock();
    
    // Create floating mathematical shapes (Polyhedra)
    this.group = new THREE.Group();
    this.scene.add(this.group);
    
    this.shapes = [];
    const geometries = [
      new THREE.IcosahedronGeometry(8, 0),
      new THREE.DodecahedronGeometry(6, 0),
      new THREE.OctahedronGeometry(7, 0),
      new THREE.TetrahedronGeometry(5, 0)
    ];
    
    const colors = [0x00e5cc, 0xff9933, 0xff4488, 0x1a1a6e];

    for (let i = 0; i < 5; i++) {
      const geo = geometries[Math.floor(Math.random() * geometries.length)];
      const isWireframe = Math.random() > 0.5;
      
      const mat = new THREE.MeshBasicMaterial({
        color: colors[Math.floor(Math.random() * colors.length)],
        wireframe: isWireframe,
        transparent: true,
        opacity: isWireframe ? 0.3 : 0.05
      });
      
      const mesh = new THREE.Mesh(geo, mat);
      
      // Position them spread out across the background
      mesh.position.set(
        (Math.random() - 0.5) * 80,
        (Math.random() - 0.5) * 60,
        (Math.random() - 0.5) * 40 - 20
      );
      
      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      
      this.group.add(mesh);
      this.shapes.push({
        mesh,
        rotX: (Math.random() - 0.5) * 0.01,
        rotY: (Math.random() - 0.5) * 0.01,
        floatSpeed: 0.005 + Math.random() * 0.01,
        initialY: mesh.position.y,
        timeOffset: Math.random() * Math.PI * 2
      });
    }
    
    this._onResize = this._onResize.bind(this);
    window.addEventListener('resize', this._onResize);
  }

  update() {
    if (!this.canvas) return;
    const elapsed = this.clock.getElapsedTime();
    // Animate each shape
    this.shapes.forEach(shape => {
      shape.mesh.rotation.x += shape.rotX;
      shape.mesh.rotation.y += shape.rotY;
      // Float up and down smoothly
      shape.mesh.position.y = shape.initialY + Math.sin(elapsed + shape.timeOffset) * 5;
    });

    // Slowly rotate the entire group
    this.group.rotation.y = elapsed * 0.05;

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
    this.shapes.forEach(shape => {
      shape.mesh.geometry.dispose();
      shape.mesh.material.dispose();
    });
    if (this.renderer) this.renderer.dispose();
  }
}
