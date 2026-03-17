import * as THREE from 'three';

export class Preloader {
  constructor(onComplete) {
    this.onComplete = onComplete;
    this.canvas = document.getElementById('preloader-canvas');
    this.container = document.getElementById('preloader');
    this.text = document.getElementById('preloader-text');
    if (!this.canvas) return;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 500);
    this.camera.position.z = 30;

    // Solid background to avoid transparent-canvas glitches on older Android
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: false, antialias: false });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x030308, 1);

    this.count = 8000;
    this.phase = 'chaos'; // chaos → converge → hold → explode → done
    this.timer = 0;

    this._createParticles();
    this._animate();
  }

  _createParticles() {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(this.count * 3);
    const cols = new Float32Array(this.count * 3);

    // Store original chaos positions and target bindu positions
    this.chaosPositions = new Float32Array(this.count * 3);
    this.binduPositions = new Float32Array(this.count * 3);
    this.explodeVelocities = new Float32Array(this.count * 3);

    for (let i = 0; i < this.count; i++) {
      const i3 = i * 3;
      // Chaos positions — spread out
      this.chaosPositions[i3] = (Math.random() - 0.5) * 80;
      this.chaosPositions[i3 + 1] = (Math.random() - 0.5) * 60;
      this.chaosPositions[i3 + 2] = (Math.random() - 0.5) * 40;

      pos[i3] = this.chaosPositions[i3];
      pos[i3 + 1] = this.chaosPositions[i3 + 1];
      pos[i3 + 2] = this.chaosPositions[i3 + 2];

      // Bindu (point) target — converge to a central luminous point with slight spread
      const r = Math.random() * 0.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      this.binduPositions[i3] = r * Math.sin(phi) * Math.cos(theta);
      this.binduPositions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      this.binduPositions[i3 + 2] = r * Math.cos(phi);

      // Explosion velocities
      const dir = new THREE.Vector3(
        (Math.random() - 0.5),
        (Math.random() - 0.5),
        (Math.random() - 0.5)
      ).normalize().multiplyScalar(1 + Math.random() * 3);
      this.explodeVelocities[i3] = dir.x;
      this.explodeVelocities[i3 + 1] = dir.y;
      this.explodeVelocities[i3 + 2] = dir.z;

      // Warm golden → teal colors
      const t = Math.random();
      cols[i3] = 1.0 * (1 - t) + 0.0 * t;
      cols[i3 + 1] = 0.8 * (1 - t) + 0.9 * t;
      cols[i3 + 2] = 0.3 * (1 - t) + 0.8 * t;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(cols, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true
    });

    this.particles = new THREE.Points(geo, mat);
    this.scene.add(this.particles);
  }

  _animate() {
    if (this.disposed) return;
    requestAnimationFrame(() => this._animate());

    this.timer += 0.016;
    const positions = this.particles.geometry.attributes.position.array;

    switch (this.phase) {
      case 'chaos':
        // Converge to Bindu over 1.8s
        if (this.timer < 1.8) {
          const t = this.timer / 1.8;
          const ease = t * t * (3 - 2 * t); // smoothstep
          for (let i = 0; i < this.count * 3; i++) {
            positions[i] = this.chaosPositions[i] * (1 - ease) + this.binduPositions[i] * ease;
          }
        } else {
          this.phase = 'hold';
          this.timer = 0;
          this.text.classList.add('visible');
        }
        break;

      case 'hold':
        // Hold as Bindu for 0.9s — gentle pulsation
        if (this.timer > 0.9) {
          this.phase = 'explode';
          this.timer = 0;
        } else {
          const pulse = 1 + Math.sin(this.timer * 12) * 0.05;
          for (let i = 0; i < this.count * 3; i++) {
            positions[i] = this.binduPositions[i] * pulse;
          }
        }
        break;

      case 'explode':
        // Mahapralaya explosion over 1.2s
        if (this.timer < 1.2) {
          const t = this.timer / 1.2;
          const ease = t * t * t; // accelerate
          for (let i = 0; i < this.count; i++) {
            const i3 = i * 3;
            positions[i3] = this.binduPositions[i3] + this.explodeVelocities[i3] * ease * 60;
            positions[i3 + 1] = this.binduPositions[i3 + 1] + this.explodeVelocities[i3 + 1] * ease * 60;
            positions[i3 + 2] = this.binduPositions[i3 + 2] + this.explodeVelocities[i3 + 2] * ease * 60;
          }
          this.particles.material.opacity = 1 - t;
        } else {
          this.phase = 'done';
          this._finish();
        }
        break;
    }

    this.particles.geometry.attributes.position.needsUpdate = true;
    this.renderer.render(this.scene, this.camera);
  }

  _finish() {
    this.container.classList.add('fade-out');
    setTimeout(() => {
      this.container.style.display = 'none';
      this.dispose();
      if (this.onComplete) this.onComplete();
    }, 800);
  }

  dispose() {
    this.disposed = true;
    this.particles.geometry.dispose();
    this.particles.material.dispose();
    this.renderer.dispose();
  }
}
