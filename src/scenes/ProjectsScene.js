import * as THREE from 'three';

export class ProjectsScene {
  constructor() {
    this.canvas = document.getElementById('projects-canvas');
    if (!this.canvas) return;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
    this.camera.position.z = 50;

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: false, antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x030308, 1);

    this.clock = new THREE.Clock();
    
    this.group = new THREE.Group();
    this.scene.add(this.group);
    
    this.cubes = [];
    const cubeGeo = new THREE.BoxGeometry(2, 2, 2);
    const cubeMat = new THREE.MeshBasicMaterial({
      color: 0xff9933, // Saffron
      wireframe: true,
      transparent: true,
      opacity: 0.15
    });
    
    const count = window.innerWidth > 768 ? 40 : 20;

    for (let i = 0; i < count; i++) {
      const cube = new THREE.Mesh(cubeGeo, cubeMat);
      
      cube.position.set(
        (Math.random() - 0.5) * 80,
        (Math.random() - 0.5) * 80,
        (Math.random() - 0.5) * 40 - 10
      );
      
      cube.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      
      this.group.add(cube);
      this.cubes.push({
        mesh: cube,
        speedX: (Math.random() - 0.5) * 0.01,
        speedY: (Math.random() - 0.5) * 0.01 + 0.005, // generally floats up
        speedZ: (Math.random() - 0.5) * 0.01
      });
    }

    this._onResize = this._onResize.bind(this);
    window.addEventListener('resize', this._onResize);
  }

  update() {
    if (!this.canvas) return;
    
    this.cubes.forEach(cube => {
      cube.mesh.rotation.x += 0.005;
      cube.mesh.rotation.y += 0.005;
      
      cube.mesh.position.y += cube.speedY;
      if (cube.mesh.position.y > 40) {
        cube.mesh.position.y = -40;
      }
    });

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
    this.cubes.forEach(cube => {
      cube.mesh.geometry.dispose();
      cube.mesh.material.dispose();
    });
    if (this.renderer) this.renderer.dispose();
  }
}
