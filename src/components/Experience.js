export class Experience {
  constructor() {
    this.nodes = document.querySelectorAll('.timeline-node');
    this._setupObserver();
  }

  _setupObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    }, { threshold: 0.3 });

    this.nodes.forEach(node => observer.observe(node));
  }
}
