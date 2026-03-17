export class Projects {
  constructor() {
    this.cards = document.querySelectorAll('.project-card');

    this.cards.forEach(card => {
      const inner = card.querySelector('.project-inner');
      if (!inner) return;

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        inner.style.transform = `
          rotateY(${x * 20}deg)
          rotateX(${-y * 20}deg)
          translateZ(15px)
        `;
      });

      card.addEventListener('mouseleave', () => {
        inner.style.transform = 'rotateY(0) rotateX(0) translateZ(0)';
      });
    });
  }
}
