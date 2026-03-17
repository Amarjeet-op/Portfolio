export class Hero {
  constructor() {
    this.taglines = [
      'Azure DevOps Engineer',      // ← what recruiters search for
      'Cloud & Infrastructure',     // ← ATS-friendly
      'Seeker of the Absolute',     // ← your brand differentiator
      'Systems Thinker'             // ← bridges both worlds
    ];
    this.currentIndex = 0;
    this.currentChar = 0;
    this.isDeleting = false;
    this.typewriterEl = document.getElementById('typewriter');

    if (this.typewriterEl) {
      this._type();
    }
  }

  _type() {
    const current = this.taglines[this.currentIndex];

    if (!this.isDeleting) {
      this.typewriterEl.textContent = current.substring(0, this.currentChar + 1);
      this.currentChar++;

      if (this.currentChar === current.length) {
        this.isDeleting = true;
        setTimeout(() => this._type(), 2000);
        return;
      }
    } else {
      this.typewriterEl.textContent = current.substring(0, this.currentChar - 1);
      this.currentChar--;

      if (this.currentChar === 0) {
        this.isDeleting = false;
        this.currentIndex = (this.currentIndex + 1) % this.taglines.length;
        setTimeout(() => this._type(), 400); // brief pause before next word
        return; // ← add this return
      }
    }

    const speed = this.isDeleting ? 40 : 80;
    setTimeout(() => this._type(), speed);
  }
}
