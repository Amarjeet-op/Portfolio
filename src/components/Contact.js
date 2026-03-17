export class Contact {
  constructor() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('.submit-btn');
      btn.textContent = 'Transmission Sent ✦';
      btn.style.background = 'linear-gradient(135deg, rgba(0, 229, 204, 0.3), rgba(255, 153, 51, 0.2))';
      setTimeout(() => {
        btn.textContent = 'Initiate Dialogue';
        btn.style.background = '';
        form.reset();
      }, 3000);
    });
  }
}
