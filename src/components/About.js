export class About {
  constructor() {
    this.card = document.getElementById('about-tilt-card');
    if (!this.card) return;

    this._onMouseMove = this._onMouseMove.bind(this);
    this._onMouseLeave = this._onMouseLeave.bind(this);

    this.card.addEventListener('mousemove', this._onMouseMove);
    this.card.addEventListener('mouseleave', this._onMouseLeave);
  }

  _onMouseMove(e) {
    const rect = this.card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    this.card.style.transform = `
      rotateY(${x * 12}deg)
      rotateX(${-y * 12}deg)
      translateZ(10px)
    `;
  }

  _onMouseLeave() {
    this.card.style.transform = 'rotateY(0) rotateX(0) translateZ(0)';
  }
}
