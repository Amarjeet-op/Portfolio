import * as THREE from 'three';

export class ContactScene {
  constructor() {
    this.canvas = document.getElementById('contact-canvas');
    if (!this.canvas) return;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 500);
    this.camera.position.set(0, 0, 8);
    this.camera.lookAt(0, 0, -50);

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: false, antialias: false });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x030308, 1);

    this.clock = new THREE.Clock();
    this._createWormhole();
    this._createStreamingParticles();

    this._onResize = this._onResize.bind(this);
    window.addEventListener('resize', this._onResize);
  }

  _createWormhole() {
    this.rings = [];
    const ringCount = 40;

    for (let i = 0; i < ringCount; i++) {
      const radius = 3 + Math.sin(i / ringCount * Math.PI) * 2;
      const geo = new THREE.RingGeometry(radius - 0.03, radius + 0.03, 64);
      const hue = (i / ringCount) * 0.15 + 0.45;
      const mat = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(hue, 0.7, 0.4),
        transparent: true,
        opacity: 0.15 + (1 - i / ringCount) * 0.15,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.z = -i * 2.5;
      mesh.rotation.z = (i * 0.15);
      this.scene.add(mesh);
      this.rings.push({ mesh, geo, mat, baseZ: -i * 2.5, index: i });
    }
  }

  _createStreamingParticles() {
    const count = 2000;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);

    this.streamData = [];

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const angle = Math.random() * Math.PI * 2;
      const radius = 1 + Math.random() * 4;
      const z = -Math.random() * 100;

      pos[i3] = Math.cos(angle) * radius;
      pos[i3 + 1] = Math.sin(angle) * radius;
      pos[i3 + 2] = z;

      cols[i3] = 0.0;
      cols[i3 + 1] = 0.7 + Math.random() * 0.3;
      cols[i3 + 2] = 0.8;

      this.streamData.push({ angle, radius, speed: 0.3 + Math.random() * 0.5 });
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(cols, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.06,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true
    });

    this.streamParticles = new THREE.Points(geo, mat);
    this.scene.add(this.streamParticles);
  }

  update() {
    if (!this.canvas) return;
    const elapsed = this.clock.getElapsedTime();

    // Rotate receding rings
    this.rings.forEach((r) => {
      r.mesh.rotation.z += 0.003;
      // Pulse opacity
      r.mat.opacity = (0.1 + Math.sin(elapsed + r.index * 0.3) * 0.05) *
        (1 - r.index / this.rings.length * 0.6);
    });

    // Stream particles forward
    const sPos = this.streamParticles.geometry.attributes.position.array;
    for (let i = 0; i < this.streamData.length; i++) {
      const d = this.streamData[i];
      const i3 = i * 3;
      sPos[i3 + 2] += d.speed;
      if (sPos[i3 + 2] > 10) {
        sPos[i3 + 2] = -100;
      }
      // Spiral
      d.angle += 0.005;
      sPos[i3] = Math.cos(d.angle) * d.radius;
      sPos[i3 + 1] = Math.sin(d.angle) * d.radius;
    }
    this.streamParticles.geometry.attributes.position.needsUpdate = true;

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
    this.rings.forEach(r => { r.geo.dispose(); r.mat.dispose(); });
    this.streamParticles.geometry.dispose();
    this.streamParticles.material.dispose();
    this.renderer.dispose();
  }
}
