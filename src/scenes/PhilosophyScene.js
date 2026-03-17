import * as THREE from 'three';

export class PhilosophyScene {
  constructor() {
    this.canvas = document.getElementById('philosophy-canvas');
    if (!this.canvas) return;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 200);
    this.camera.position.set(0, 3, 14);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true, antialias: false });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.clock = new THREE.Clock();
    this._createSriYantra();
    this._createOrbitingText();

    this._onResize = this._onResize.bind(this);
    window.addEventListener('resize', this._onResize);
  }

  _createSriYantra() {
    this.yantraGroup = new THREE.Group();

    // 9 interlocking triangles in Sri Yantra pattern
    const triangleData = [
      // Upward triangles (Shiva - masculine)
      { points: [[0, 3, 0], [-2.6, -1.5, 0], [2.6, -1.5, 0]], color: 0x00e5cc, scale: 1.0 },
      { points: [[0, 2.2, 0], [-1.9, -1.1, 0], [1.9, -1.1, 0]], color: 0x00ccaa, scale: 0.9 },
      { points: [[0, 1.6, 0], [-1.4, -0.8, 0], [1.4, -0.8, 0]], color: 0x00aa88, scale: 0.8 },
      { points: [[0, 1.0, 0], [-0.9, -0.5, 0], [0.9, -0.5, 0]], color: 0x008866, scale: 0.7 },
      // Downward triangles (Shakti - feminine)
      { points: [[0, -3, 0], [-2.6, 1.5, 0], [2.6, 1.5, 0]], color: 0xff9933, scale: 1.0 },
      { points: [[0, -2.2, 0], [-1.9, 1.1, 0], [1.9, 1.1, 0]], color: 0xcc7722, scale: 0.9 },
      { points: [[0, -1.6, 0], [-1.4, 0.8, 0], [1.4, 0.8, 0]], color: 0xaa5511, scale: 0.8 },
      { points: [[0, -1.0, 0], [-0.9, 0.5, 0], [0.9, 0.5, 0]], color: 0x884400, scale: 0.7 },
      // Central small triangle
      { points: [[0, 0.5, 0], [-0.4, -0.25, 0], [0.4, -0.25, 0]], color: 0xffd700, scale: 0.6 }
    ];

    this.yantraTriangles = [];
    triangleData.forEach((data) => {
      const shape = new THREE.Shape();
      shape.moveTo(data.points[0][0], data.points[0][1]);
      shape.lineTo(data.points[1][0], data.points[1][1]);
      shape.lineTo(data.points[2][0], data.points[2][1]);
      shape.lineTo(data.points[0][0], data.points[0][1]);

      const extrudeSettings = { depth: 0.08, bevelEnabled: false };
      const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      const mat = new THREE.MeshBasicMaterial({
        color: data.color,
        wireframe: true,
        transparent: true,
        opacity: 0.35
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.scale.setScalar(data.scale);
      this.yantraGroup.add(mesh);
      this.yantraTriangles.push({ mesh, geo, mat });
    });

    this.scene.add(this.yantraGroup);
  }

  _createOrbitingText() {
    // Create orbiting ring of small spheres representing sacred concepts
    this.orbitingRing = new THREE.Group();
    const concepts = 12;
    for (let i = 0; i < concepts; i++) {
      const geo = new THREE.SphereGeometry(0.08, 8, 8);
      const mat = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(i / concepts * 0.3 + 0.08, 0.8, 0.6),
        transparent: true,
        opacity: 0.7
      });
      const sphere = new THREE.Mesh(geo, mat);
      const angle = (i / concepts) * Math.PI * 2;
      sphere.position.set(Math.cos(angle) * 5, 0, Math.sin(angle) * 5);
      this.orbitingRing.add(sphere);

      // Add connecting line to next point
      if (i > 0) {
        const prevAngle = ((i - 1) / concepts) * Math.PI * 2;
        const lineGeo = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(Math.cos(prevAngle) * 5, 0, Math.sin(prevAngle) * 5),
          new THREE.Vector3(Math.cos(angle) * 5, 0, Math.sin(angle) * 5)
        ]);
        const lineMat = new THREE.LineBasicMaterial({
          color: 0xff9933,
          transparent: true,
          opacity: 0.15
        });
        const line = new THREE.Line(lineGeo, lineMat);
        this.orbitingRing.add(line);
      }
    }
    this.scene.add(this.orbitingRing);
  }

  update() {
    if (!this.canvas) return;
    const elapsed = this.clock.getElapsedTime();

    // Slowly rotate yantra
    this.yantraGroup.rotation.y = elapsed * 0.15;
    this.yantraGroup.rotation.x = Math.sin(elapsed * 0.1) * 0.1;

    // Rotate orbiting ring in opposite direction
    this.orbitingRing.rotation.y = -elapsed * 0.3;
    this.orbitingRing.rotation.x = Math.PI * 0.1;

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
    this.yantraTriangles.forEach(t => { t.geo.dispose(); t.mat.dispose(); });
    this.orbitingRing.traverse(child => {
      if (child.geometry) child.geometry.dispose();
      if (child.material) child.material.dispose();
    });
    this.renderer.dispose();
  }
}
