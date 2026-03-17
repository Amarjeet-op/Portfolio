export class Skills {
  constructor() {
    this.tabs = document.querySelectorAll('.skill-tab');
    this.panels = document.querySelectorAll('.skill-panel');

    this.tabs.forEach(tab => {
      tab.addEventListener('click', () => this._switchTab(tab.dataset.planet));
    });

    // Animate skill bars on initial load
    this._animateBars(0);
  }

  _switchTab(index) {
    this.tabs.forEach(t => t.classList.remove('active'));
    this.panels.forEach(p => p.classList.remove('active'));

    document.querySelector(`.skill-tab[data-planet="${index}"]`)?.classList.add('active');
    document.querySelector(`.skill-panel[data-panel="${index}"]`)?.classList.add('active');

    this._animateBars(index);
  }

  _animateBars(panelIndex) {
    const panel = document.querySelector(`.skill-panel[data-panel="${panelIndex}"]`);
    if (!panel) return;

    const fills = panel.querySelectorAll('.skill-fill');
    fills.forEach(fill => {
      fill.style.width = '0';
      setTimeout(() => {
        fill.style.width = fill.dataset.level + '%';
      }, 100);
    });
  }
}
