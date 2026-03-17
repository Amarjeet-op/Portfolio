export class Cursor {
  constructor() {
    // Disable on touch devices for performance/usability
    if (window.matchMedia('(pointer: coarse)').matches) return;

    this.cursor = document.getElementById('cursor-vedanta');
    this.aura = document.getElementById('cursor-vedanta-aura');
    if (!this.cursor || !this.aura) return;

    this.mouse = { x: 0, y: 0 };
    this.cursorPos = { x: 0, y: 0 };
    this.auraPos = { x: 0, y: 0 };
    this.isHovering = false;

    this._onMouseMove = this._onMouseMove.bind(this);
    this._onMouseEnterLink = this._onMouseEnterLink.bind(this);
    this._onMouseLeaveLink = this._onMouseLeaveLink.bind(this);
    this._onMouseLeaveWindow = this._onMouseLeaveWindow.bind(this);
    this._onMouseEnterWindow = this._onMouseEnterWindow.bind(this);

    document.addEventListener('mousemove', this._onMouseMove);
    window.addEventListener('mouseleave', this._onMouseLeaveWindow);
    window.addEventListener('mouseenter', this._onMouseEnterWindow);

    // Track hover on interactive elements
    const interactives = document.querySelectorAll('a, button, input, textarea, .skill-tab, .project-card');
    interactives.forEach(el => {
      el.addEventListener('mouseenter', this._onMouseEnterLink);
      el.addEventListener('mouseleave', this._onMouseLeaveLink);
    });

    this._setVisible(false);
    this._animate();
  }

  _onMouseMove(e) {
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
    this._setVisible(true);
  }

  _onMouseEnterLink() {
    this.isHovering = true;
    this.cursor.classList.add('is-hovering');
    this.aura.classList.add('is-hovering');
  }

  _onMouseLeaveLink() {
    this.isHovering = false;
    this.cursor.classList.remove('is-hovering');
    this.aura.classList.remove('is-hovering');
  }

  _onMouseLeaveWindow() {
    this._setVisible(false);
  }

  _onMouseEnterWindow() {
    // Will become visible on next mousemove
  }

  _setVisible(visible) {
    const v = visible ? '1' : '0';
    this.cursor.style.opacity = v;
    this.aura.style.opacity = v;
  }

  _animate() {
    requestAnimationFrame(() => this._animate());

    // Smooth cursor follow (transform-only for performance)
    this.cursorPos.x += (this.mouse.x - this.cursorPos.x) * 0.35;
    this.cursorPos.y += (this.mouse.y - this.cursorPos.y) * 0.35;

    this.auraPos.x += (this.mouse.x - this.auraPos.x) * 0.16;
    this.auraPos.y += (this.mouse.y - this.auraPos.y) * 0.16;

    this.cursor.style.transform = `translate3d(${this.cursorPos.x - 9}px, ${this.cursorPos.y - 9}px, 0)`;
    this.aura.style.transform = `translate3d(${this.auraPos.x - 23}px, ${this.auraPos.y - 23}px, 0)`;
  }
}
