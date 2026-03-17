import * as THREE from 'three';

export class ExperienceScene {
  constructor() {
    this.canvas = document.getElementById('experience-canvas');
    if (!this.canvas) return;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
    this.camera.position.z = 60;

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true, antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.clock = new THREE.Clock();
    
    // Create a 3D Time Tunnel effect using a particle cylinder
    this.group = new THREE.Group();
    this.scene.add(this.group);
    
    this.particleCount = window.innerWidth > 768 ? 800 : 400;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.particleCount * 3);
    const colors = new Float32Array(this.particleCount * 3);
    
    this.tunnelRadius = 15;
    this.tunnelLength = 200;

    for (let i = 0; i < this.particleCount; i++) {
      const i3 = i * 3;
      
      // Distribute particles along the cylinder
      const angle = Math.random() * Math.PI * 2;
      const z = (Math.random() - 0.5) * this.tunnelLength;
      
      // Very slight variation in radius to give depth
      const r = this.tunnelRadius + (Math.random() - 0.5) * 2;

      positions[i3] = Math.cos(angle) * r;
      positions[i3 + 1] = Math.sin(angle) * r;
      positions[i3 + 2] = z;

      // Color mix
      const brightness = 0.5 + Math.random() * 0.5;
      if (Math.random() > 0.5) {
        colors[i3] = 0.0 * brightness;      // R: 0 (Teal)
        colors[i3 + 1] = 0.9 * brightness;  // G: 229
        colors[i3 + 2] = 0.8 * brightness;  // B: 204
      } else {
        colors[i3] = 1.0 * brightness;      // R: 255 (Saffron)
        colors[i3 + 1] = 0.6 * brightness;  // G: 153
        colors[i3 + 2] = 0.2 * brightness;  // B: 51
      }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.4,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });

    this.tunnelParticles = new THREE.Points(geometry, material);
    
    // Tilt the tunnel so it goes back and up slightly
    this.tunnelParticles.rotation.x = Math.PI * 0.1;
    this.tunnelParticles.rotation.y = Math.PI * 0.05;
    
    this.group.add(this.tunnelParticles);

    this._onResize = this._onResize.bind(this);
    window.addEventListener('resize', this._onResize);
  }

  update() {
    const elapsed = this.clock.getElapsedTime();
    const dt = 0.016; // Approx delta time for smooth motion
    
    // Rotate the entire tunnel slowly
    this.tunnelParticles.rotation.z = elapsed * 0.05;

    // Move particles towards the camera to create "flying through" effect
    const positions = this.tunnelParticles.geometry.attributes.position.array;
    for (let i = 0; i < this.particleCount; i++) {
      const i3 = i * 3;
      positions[i3 + 2] += 20 * dt; // speed
      
      // If particle passes the camera, reset it to the back
      if (positions[i3 + 2] > this.tunnelLength / 2) {
        positions[i3 + 2] -= this.tunnelLength;
      }
    }
    this.tunnelParticles.geometry.attributes.position.needsUpdate = true;

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
    if (this.tunnelParticles) {
      this.tunnelParticles.geometry.dispose();
      this.tunnelParticles.material.dispose();
    }
    if (this.renderer) this.renderer.dispose();
  }
}
