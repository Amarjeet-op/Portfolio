import * as THREE from 'three';

export class SkillsScene {
  constructor() {
    this.canvas = document.getElementById('skills-canvas');
    if (!this.canvas) return;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
    this.camera.position.z = 100;

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: false, antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x030308, 1);

    this.particleCount = window.innerWidth > 768 ? 300 : 150;
    this.particlesData = [];
    this.r = 80;
    this.maxDistance = 15;

    this.group = new THREE.Group();
    this.scene.add(this.group);

    this._createPlexus();

    this.clock = new THREE.Clock();
    this._onResize = this._onResize.bind(this);
    window.addEventListener('resize', this._onResize);

    this.mouseX = 0;
    this.mouseY = 0;
    this.targetX = 0;
    this.targetY = 0;
    this._onMouseMove = this._onMouseMove.bind(this);
    window.addEventListener('mousemove', this._onMouseMove);
  }

  _createPlexus() {
    const pMaterial = new THREE.PointsMaterial({
      color: 0x00e5cc,
      size: 1.5,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true
    });

    this.particles = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(this.particleCount * 3);

    for (let i = 0; i < this.particleCount; i++) {
      const x = Math.random() * this.r - this.r / 2;
      const y = Math.random() * this.r - this.r / 2;
      const z = Math.random() * this.r - this.r / 2;

      particlePositions[i * 3]     = x;
      particlePositions[i * 3 + 1] = y;
      particlePositions[i * 3 + 2] = z;

      this.particlesData.push({
        velocity: new THREE.Vector3(-0.2 + Math.random() * 0.4, -0.2 + Math.random() * 0.4, -0.2 + Math.random() * 0.4),
        numConnections: 0
      });
    }

    this.particles.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    this.pointCloud = new THREE.Points(this.particles, pMaterial);
    this.group.add(this.pointCloud);

    const geometry = new THREE.BufferGeometry();
    this.positions = new Float32Array(this.particleCount * this.particleCount * 3);
    this.colors = new Float32Array(this.particleCount * this.particleCount * 3);

    geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3).setUsage(THREE.DynamicDrawUsage));
    geometry.setAttribute('color', new THREE.BufferAttribute(this.colors, 3).setUsage(THREE.DynamicDrawUsage));
    geometry.computeBoundingSphere();

    const material = new THREE.LineBasicMaterial({
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.15 // extremely subtle so it doesn't block text
    });

    this.linesMesh = new THREE.LineSegments(geometry, material);
    this.group.add(this.linesMesh);

    // Subtle dark abstract core
    const coreGeo = new THREE.IcosahedronGeometry(12, 1);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x050510,
      wireframe: true,
      transparent: true,
      opacity: 0.2
    });
    this.core = new THREE.Mesh(coreGeo, coreMat);
    this.group.add(this.core);
  }

  _onMouseMove(event) {
    this.targetX = (event.clientX - window.innerWidth / 2) * 0.05;
    this.targetY = (event.clientY - window.innerHeight / 2) * 0.05;
  }

  update() {
    if (!this.canvas) return;
    const dt = Math.min(this.clock.getDelta(), 0.1);

    this.mouseX += (this.targetX - this.mouseX) * 0.02;
    this.mouseY += (this.targetY - this.mouseY) * 0.02;

    this.group.rotation.x += 0.001;
    this.group.rotation.y += 0.002;

    this.camera.position.x += (this.mouseX - this.camera.position.x) * 0.05;
    this.camera.position.y += (-this.mouseY - this.camera.position.y) * 0.05;
    this.camera.lookAt(this.scene.position);

    const positions = this.pointCloud.geometry.attributes.position.array;
    this.particlesData.forEach(p => { p.numConnections = 0; });

    let vertexpos = 0;
    let colorpos = 0;
    let numConnected = 0;

    for (let i = 0; i < this.particleCount; i++) {
      const particleData = this.particlesData[i];
      const i3 = i * 3;

      positions[i3] += particleData.velocity.x * dt * 20;
      positions[i3 + 1] += particleData.velocity.y * dt * 20;
      positions[i3 + 2] += particleData.velocity.z * dt * 20;

      if (positions[i3] < -this.r/2 || positions[i3] > this.r/2) particleData.velocity.x = -particleData.velocity.x;
      if (positions[i3 + 1] < -this.r/2 || positions[i3 + 1] > this.r/2) particleData.velocity.y = -particleData.velocity.y;
      if (positions[i3 + 2] < -this.r/2 || positions[i3 + 2] > this.r/2) particleData.velocity.z = -particleData.velocity.z;

      for (let j = i + 1; j < this.particleCount; j++) {
        const particleDataB = this.particlesData[j];
        const j3 = j * 3;
        
        const dx = positions[i3] - positions[j3];
        const dy = positions[i3 + 1] - positions[j3 + 1];
        const dz = positions[i3 + 2] - positions[j3 + 2];
        const distSq = dx*dx + dy*dy + dz*dz;

        if (distSq < this.maxDistance * this.maxDistance) {
          particleData.numConnections++;
          particleDataB.numConnections++;

          const alpha = 1.0 - Math.sqrt(distSq) / this.maxDistance;

          this.positions[vertexpos++] = positions[i3];
          this.positions[vertexpos++] = positions[i3 + 1];
          this.positions[vertexpos++] = positions[i3 + 2];

          this.positions[vertexpos++] = positions[j3];
          this.positions[vertexpos++] = positions[j3 + 1];
          this.positions[vertexpos++] = positions[j3 + 2];

          const c = 0.5 + alpha * 0.5;
          this.colors[colorpos++] = 0.0;
          this.colors[colorpos++] = c * 0.8;
          this.colors[colorpos++] = c;

          this.colors[colorpos++] = 0.0;
          this.colors[colorpos++] = c * 0.8;
          this.colors[colorpos++] = c;

          numConnected++;
        }
      }
    }

    this.linesMesh.geometry.setDrawRange(0, numConnected * 2);
    this.linesMesh.geometry.attributes.position.needsUpdate = true;
    this.linesMesh.geometry.attributes.color.needsUpdate = true;
    this.pointCloud.geometry.attributes.position.needsUpdate = true;

    if (this.core) {
      this.core.rotation.y -= 0.005;
      this.core.rotation.x -= 0.002;
    }

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
    window.removeEventListener('mousemove', this._onMouseMove);
    if (this.renderer) this.renderer.dispose();
    if (this.particles) this.particles.dispose();
    if (this.pointCloud) this.pointCloud.material.dispose();
    if (this.linesMesh) {
      this.linesMesh.geometry.dispose();
      this.linesMesh.material.dispose();
    }
    if (this.core) {
      this.core.geometry.dispose();
      this.core.material.dispose();
    }
  }
}
