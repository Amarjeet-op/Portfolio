import * as THREE from 'three';

export class HeroScene {
  constructor() {
    this.canvas = document.getElementById('hero-canvas');
    if (!this.canvas) return;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 8, 20);
    this.camera.lookAt(0, 0, 0);

    // Solid clear to avoid transparent-canvas washout on older Android
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: false, antialias: false });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x030308, 1);

    this.clock = new THREE.Clock();
    
    // Create a group to hold everything and center it
    this.heroGroup = new THREE.Group();
    this.heroGroup.position.y = 1; // Centered with a slight vertical offset for balance
    this.scene.add(this.heroGroup);

    this._createAccretionHalo();
    this._createBlackHole();
    this._createAccretionDisk();
    this._createJets();
    this._createSacredGeometry();
    this._createAsteroids();

    this._onResize = this._onResize.bind(this);
    window.addEventListener('resize', this._onResize);
  }

  _createAccretionHalo() {
    // Intense purple radial glow behind the black hole
    const geo = new THREE.PlaneGeometry(20, 20);
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        color: { value: new THREE.Color(0x9d00ff) }, // Bright purple
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        varying vec2 vUv;
        void main() {
          float dist = distance(vUv, vec2(0.5));
          float alpha = smoothstep(0.5, 0.0, dist) * 0.4;
          // Add a bright core to the halo
          alpha += smoothstep(0.2, 0.0, dist) * 0.4;
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    this.halo = new THREE.Mesh(geo, mat);
    this.halo.position.z = -0.5; // Just behind the event horizon
    this.heroGroup.add(this.halo);
  }

  _createBlackHole() {
    // Event horizon — absolute black sphere
    const geo = new THREE.SphereGeometry(3.2, 64, 64);
    const mat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    this.eventHorizon = new THREE.Mesh(geo, mat);
    this.heroGroup.add(this.eventHorizon);
  }

  _createAccretionDisk() {
    const count = 15000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count); // Per-particle sizes

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Disk starts much wider and more spread out to cover the background
      const radius = 3.3 + Math.pow(Math.random(), 1.2) * 20; 
      const angle = Math.random() * Math.PI * 2;
      const spread = (Math.random() - 0.5) * 1.5 * (1 + radius * 0.1);

      positions[i3] = Math.cos(angle) * radius;
      positions[i3 + 1] = spread;
      positions[i3 + 2] = Math.sin(angle) * radius;

      // Sizes: Mostly tiny, a few bigger ones
      const sizeRandom = Math.random();
      if (sizeRandom > 0.98) {
        sizes[i] = 0.08 + Math.random() * 0.06; // Some larger ones
      } else {
        sizes[i] = 0.02 + Math.random() * 0.02; // Very tiny by default
      }

      // Purple/Violet/White colors
      const t = (radius - 3.3) / 20;
      if (t < 0.05) {
        // Super bright innermost edge (White/violet)
        colors[i3] = 1.0;
        colors[i3 + 1] = 0.9;
        colors[i3 + 2] = 1.0;
      } else {
        // Deep purple to faint blue
        const p = 1.0 - t;
        colors[i3] = 0.6 * p;     // R
        colors[i3 + 1] = 0.2 * p; // G
        colors[i3 + 2] = 1.0 * p; // B
      }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Store original angles and radii for Keplerian orbit
    this.diskData = [];
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const x = positions[i3], z = positions[i3 + 2];
      const radius = Math.sqrt(x * x + z * z);
      const angle = Math.atan2(z, x);
      this.diskData.push({ radius, angle, y: positions[i3 + 1] });
    }

    // Since we added custom 'size' attribute, we need a custom shader or use size/sizeAttenuation
    // We will just use the standard PointsMaterial with size parameter if it doesn't support per-vertex sizing out of the box
    // Wait, PointsMaterial DOES support per-vertex size only if we use ShaderMaterial. Let's write a quick shader for the particles.
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 }
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          vec2 xy = gl_PointCoord.xy - vec2(0.5);
          float ll = length(xy);
          if (ll > 0.5) discard;
          gl_FragColor = vec4(vColor, 1.0 - (ll * 2.0));
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.accretionDisk = new THREE.Points(geometry, material);
    // Tilt to face camera almost head-on, slightly tilted to see the depth
    this.accretionDisk.rotation.x = 0;
    this.heroGroup.add(this.accretionDisk);

  }

  _createJets() {
    const createJet = (direction) => {
      const count = 1500;
      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array(count * 3);
      const cols = new Float32Array(count * 3);

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const t = Math.random();
        const spread = (1 - t) * 0.3;
        pos[i3]     = direction * (t * 15 + 2);
        pos[i3 + 1] = (Math.random() - 0.5) * spread;
        pos[i3 + 2] = (Math.random() - 0.5) * spread;

        const brightness = 1 - t * 0.6;
        cols[i3] = 0.5 * brightness;
        cols[i3 + 1] = 0.8 * brightness;
        cols[i3 + 2] = 1.0 * brightness;
      }

      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      geo.setAttribute('color', new THREE.BufferAttribute(cols, 3));

      const mat = new THREE.PointsMaterial({
        size: 0.06,
        vertexColors: true,
        transparent: true,
        opacity: 0.3, // Jets are mostly invisible and blend in
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true
      });

      const points = new THREE.Points(geo, mat);
      this.heroGroup.add(points);
      return { points, geo, mat };
    };

    this.jetTop = createJet(1);
    this.jetBottom = createJet(-1);
  }

  _createSacredGeometry() {
    this.sacredShapes = [];
    const geometries = [
      new THREE.IcosahedronGeometry(1.5, 0),
      new THREE.OctahedronGeometry(1.2, 0),
      new THREE.TetrahedronGeometry(1, 0),
      new THREE.DodecahedronGeometry(1.3, 0)
    ];

    geometries.forEach((geo, i) => {
      const mat = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(0.5 + i * 0.08, 0.4, 0.3),
        wireframe: true,
        transparent: true,
        opacity: 0.12
      });
      const mesh = new THREE.Mesh(geo, mat);
      const angle = (i / 4) * Math.PI * 2;
      const dist = 14 + i * 2;
      mesh.position.set(
        Math.cos(angle) * dist,
        (Math.random() - 0.5) * 8, // Kept local Y relative to group
        Math.sin(angle) * dist - 5
      );
      this.heroGroup.add(mesh);
      this.sacredShapes.push({ mesh, geo, mat, rotSpeed: 0.002 + Math.random() * 0.003 });
    });
  }

  _createAsteroids() {
    const count = 1200;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Spread asteroids outside the main accretion disk
      const radius = 16 + Math.random() * 12; 
      const angle = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 6;
      
      pos[i3] = Math.cos(angle) * radius;
      pos[i3 + 1] = y;
      pos[i3 + 2] = Math.sin(angle) * radius;

      const brightness = 0.4 + Math.random() * 0.6;
      // Mix of purple and deep space rock colors
      cols[i3] = 0.5 * brightness;
      cols[i3 + 1] = 0.3 * brightness;
      cols[i3 + 2] = 0.8 * brightness;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(cols, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.asteroids = new THREE.Points(geo, mat);
    
    // Tilt the asteroid belt slightly differently from the disk
    this.asteroids.rotation.x = 0;
    this.asteroids.rotation.y = 0;
    
    this.heroGroup.add(this.asteroids);

    // Store data for orbit
    this.asteroidData = [];
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const x = pos[i3], z = pos[i3 + 2];
      this.asteroidData.push({
        radius: Math.sqrt(x * x + z * z),
        angle: Math.atan2(z, x),
        y: pos[i3 + 1]
      });
    }
  }

  update() {
    if (!this.canvas) return;
    const elapsed = this.clock.getElapsedTime();

    // Keplerian orbit — inner particles faster
    const positions = this.accretionDisk.geometry.attributes.position.array;
    for (let i = 0; i < this.diskData.length; i++) {
      const d = this.diskData[i];
      const speed = 0.8 / Math.pow(d.radius, 1.5);
      d.angle += speed * 0.016;
      const i3 = i * 3;
      positions[i3] = Math.cos(d.angle) * d.radius;
      positions[i3 + 2] = Math.sin(d.angle) * d.radius;
    }
    this.accretionDisk.geometry.attributes.position.needsUpdate = true;

    // Rotate the entire accretion disk and event horizon slightly
    this.accretionDisk.rotation.z += 0.002;
    this.eventHorizon.rotation.y += 0.005;
    this.halo.rotation.z -= 0.001;
    
    // Rotate sacred geometry
    this.sacredShapes.forEach(s => {
      s.mesh.rotation.x += s.rotSpeed;
      s.mesh.rotation.y += s.rotSpeed * 0.7;
    });

    // Subtle jet pulse
    this.jetTop.mat.opacity = 0.4 + Math.sin(elapsed * 2) * 0.15;
    this.jetBottom.mat.opacity = 0.4 + Math.sin(elapsed * 2 + 1) * 0.15;

    // Orbit asteroids
    if (this.asteroids) {
      const aPos = this.asteroids.geometry.attributes.position.array;
      for (let i = 0; i < this.asteroidData.length; i++) {
        const a = this.asteroidData[i];
        a.angle += 0.4 / Math.pow(a.radius, 1.2) * 0.016; // Keplerian orbit
        const i3 = i * 3;
        aPos[i3] = Math.cos(a.angle) * a.radius;
        aPos[i3 + 2] = Math.sin(a.angle) * a.radius;
      }
      this.asteroids.geometry.attributes.position.needsUpdate = true;
    }

    // 3D revolving effect for the entire hero group
    this.heroGroup.rotation.y = elapsed * 0.05;
    this.heroGroup.rotation.x = Math.sin(elapsed * 0.1) * 0.1;
    this.heroGroup.position.y = -2 + Math.sin(elapsed * 0.5) * 0.1;  // Slow hover

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
    this.eventHorizon.geometry.dispose();
    this.eventHorizon.material.dispose();
    if (this.halo) {
      this.halo.geometry.dispose();
      this.halo.material.dispose();
    }
    this.accretionDisk.geometry.dispose();
    this.accretionDisk.material.dispose();
    this.jetTop.geo.dispose(); this.jetTop.mat.dispose();
    this.jetBottom.geo.dispose(); this.jetBottom.mat.dispose();
    this.sacredShapes.forEach(s => { s.geo.dispose(); s.mat.dispose(); });
    if (this.asteroids) {
      this.asteroids.geometry.dispose();
      this.asteroids.material.dispose();
    }
    this.renderer.dispose();
  }
}
