export class Cursor {
  constructor() {
    this.dot = document.getElementById('cursor-dot');
    this.ring = document.getElementById('cursor-ring');
    if (!this.dot || !this.ring) return;

    this.mouse = { x: 0, y: 0 };
    this.ringPos = { x: 0, y: 0 };
    this.isHovering = false;
    this.heroRect = null;

    this._onMouseMove = this._onMouseMove.bind(this);
    this._onMouseEnterLink = this._onMouseEnterLink.bind(this);
    this._onMouseLeaveLink = this._onMouseLeaveLink.bind(this);

    document.addEventListener('mousemove', this._onMouseMove);

    // Track hover on interactive elements
    const interactives = document.querySelectorAll('a, button, input, textarea, .skill-tab, .project-card');
    interactives.forEach(el => {
      el.addEventListener('mouseenter', this._onMouseEnterLink);
      el.addEventListener('mouseleave', this._onMouseLeaveLink);
    });

    this._animate();
  }

  _onMouseMove(e) {
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
  }

  _onMouseEnterLink() {
    this.isHovering = true;
    this.dot.classList.add('hover-link');
    this.ring.classList.add('hover-link');
  }

  _onMouseLeaveLink() {
    this.isHovering = false;
    this.dot.classList.remove('hover-link');
    this.ring.classList.remove('hover-link');
  }

  _animate() {
    requestAnimationFrame(() => this._animate());

    // Instant dot follow
    this.dot.style.left = this.mouse.x + 'px';
    this.dot.style.top = this.mouse.y + 'px';

    // Lagging ring follow
    this.ringPos.x += (this.mouse.x - this.ringPos.x) * 0.15;
    this.ringPos.y += (this.mouse.y - this.ringPos.y) * 0.15;
    this.ring.style.left = this.ringPos.x + 'px';
    this.ring.style.top = this.ringPos.y + 'px';

    // Gravitational lensing near hero singularity
    const heroSection = document.getElementById('hero');
    if (heroSection) {
      const rect = heroSection.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = this.mouse.x - centerX;
      const dy = this.mouse.y - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 300 && rect.top < window.innerHeight && rect.bottom > 0) {
        this.ring.classList.add('warped');
      } else {
        this.ring.classList.remove('warped');
      }
    }
  }
}
