import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initScrollAnimations() {
  // Mobile/legacy browsers often need more robust ScrollTrigger settings
  ScrollTrigger.config({ ignoreMobileResize: true });
  ScrollTrigger.defaults({
    // Helps prevent “jumpiness” from layout shifts on mobile
    invalidateOnRefresh: true,
    fastScrollEnd: true
  });

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isSmallScreen = window.matchMedia('(max-width: 768px)').matches;
  const isTouch = window.matchMedia('(pointer: coarse)').matches;

  // Keep animations on Android/mobile, just slightly lighter.
  const mode = prefersReducedMotion ? 'reduced' : (isSmallScreen && isTouch ? 'mobile' : 'full');
  const simplify = mode !== 'full';
  const isReduced = mode === 'reduced';

  // Sections fly in with rotateX and translateY — space travel feel
  const sections = document.querySelectorAll('.section');

  sections.forEach((section, i) => {
    if (i === 0) return; // Skip hero

    // Section entrance
    gsap.fromTo(section, {
      opacity: 0,
      y: isReduced ? 0 : (mode === 'mobile' ? 48 : 80),
      rotateX: isReduced ? 0 : (mode === 'mobile' ? 0 : 6),
    }, {
      opacity: 1,
      y: 0,
      rotateX: 0,
      duration: isReduced ? 0.01 : (mode === 'mobile' ? 0.9 : 1.2),
      ease: mode === 'mobile' ? 'power2.out' : (simplify ? 'power2.out' : 'power3.out'),
      scrollTrigger: {
        trigger: section,
        start: 'top 85%',
        end: 'top 40%',
        scrub: isReduced ? false : (mode === 'mobile' ? 0.5 : (simplify ? 0.35 : 0.8)),
      }
    });

    // Section header stagger
    const header = section.querySelector('.section-header');
    if (header) {
      gsap.fromTo(header.querySelector('.title-sanskrit'), {
        opacity: 0,
        y: isReduced ? 0 : (mode === 'mobile' ? 18 : (simplify ? 16 : 30)),
        scale: isReduced ? 1 : (mode === 'mobile' ? 1 : (simplify ? 1 : 0.9)),
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: isReduced ? 0.01 : (mode === 'mobile' ? 0.6 : (simplify ? 0.55 : 0.8)),
        ease: mode === 'mobile' ? 'power2.out' : (simplify ? 'power2.out' : 'back.out(1.4)'),
        scrollTrigger: {
          trigger: header,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        }
      });

      gsap.fromTo(header.querySelector('.translation'), {
        opacity: 0,
        y: isReduced ? 0 : (mode === 'mobile' ? 12 : (simplify ? 12 : 20)),
      }, {
        opacity: 1,
        y: 0,
        duration: isReduced ? 0.01 : (mode === 'mobile' ? 0.5 : (simplify ? 0.45 : 0.6)),
        delay: isReduced ? 0 : (mode === 'mobile' ? 0.08 : (simplify ? 0.05 : 0.2)),
        ease: 'power2.out',
        scrollTrigger: {
          trigger: header,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        }
      });
    }
  });

  // Tech stack icons stagger
  gsap.fromTo('.tech-icon-wrap', {
    opacity: 0,
    scale: isReduced ? 1 : (mode === 'mobile' ? 0.92 : (simplify ? 0.9 : 0.5)),
    y: isReduced ? 0 : (mode === 'mobile' ? 26 : (simplify ? 18 : 40)),
  }, {
    opacity: 1,
    scale: 1,
    y: 0,
    duration: isReduced ? 0.01 : (mode === 'mobile' ? 0.65 : (simplify ? 0.55 : 0.8)),
    stagger: isReduced ? 0 : (mode === 'mobile' ? 0.03 : (simplify ? 0.03 : 0.05)),
    ease: mode === 'mobile' ? 'power2.out' : (simplify ? 'power2.out' : 'back.out(1.5)'),
    scrollTrigger: {
      trigger: '.tech-funnel',
      start: 'top 85%',
      toggleActions: 'play none none reverse',
    }
  });

  // Project cards stagger
  gsap.utils.toArray('.project-card').forEach((card, i) => {
    gsap.fromTo(card, {
      opacity: 0,
      y: isReduced ? 0 : (mode === 'mobile' ? 34 : (simplify ? 22 : 50)),
      rotateY: isReduced ? 0 : (mode === 'mobile' ? 0 : (simplify ? 0 : -10)),
    }, {
      opacity: 1,
      y: 0,
      rotateY: 0,
      duration: isReduced ? 0.01 : (mode === 'mobile' ? 0.65 : (simplify ? 0.6 : 0.8)),
      delay: isReduced ? 0 : i * (mode === 'mobile' ? 0.08 : (simplify ? 0.08 : 0.15)),
      ease: 'power3.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      }
    });
  });

  // Philosophy cards stagger
  gsap.utils.toArray('.philosophy-card').forEach((card, i) => {
    gsap.fromTo(card, {
      opacity: 0,
      y: isReduced ? 0 : (mode === 'mobile' ? 26 : (simplify ? 18 : 40)),
      scale: isReduced ? 1 : (mode === 'mobile' ? 1 : (simplify ? 1 : 0.95)),
    }, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: isReduced ? 0.01 : (mode === 'mobile' ? 0.6 : (simplify ? 0.55 : 0.7)),
      delay: isReduced ? 0 : i * (mode === 'mobile' ? 0.06 : (simplify ? 0.06 : 0.1)),
      ease: 'power2.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      }
    });
  });

  // Achievement cards stagger
  gsap.utils.toArray('.achievement-card').forEach((card, i) => {
    gsap.fromTo(card, {
      opacity: 0,
      y: isReduced ? 0 : (mode === 'mobile' ? 22 : (simplify ? 16 : 30)),
      scale: isReduced ? 1 : (mode === 'mobile' ? 1 : (simplify ? 1 : 0.9)),
    }, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: isReduced ? 0.01 : (mode === 'mobile' ? 0.55 : (simplify ? 0.5 : 0.6)),
      delay: isReduced ? 0 : i * (mode === 'mobile' ? 0.06 : (simplify ? 0.06 : 0.1)),
      ease: mode === 'mobile' ? 'power2.out' : (simplify ? 'power2.out' : 'back.out(1.2)'),
      scrollTrigger: {
        trigger: card,
        start: 'top 88%',
        toggleActions: 'play none none reverse',
      }
    });
  });

  // About card entrance
  const aboutCard = document.getElementById('about-tilt-card');
  if (aboutCard) {
    gsap.fromTo(aboutCard, {
      opacity: 0,
      y: isReduced ? 0 : (mode === 'mobile' ? 34 : (simplify ? 22 : 60)),
      rotateX: isReduced ? 0 : (mode === 'mobile' ? 0 : (simplify ? 0 : 8)),
    }, {
      opacity: 1,
      y: 0,
      rotateX: 0,
      duration: isReduced ? 0.01 : (mode === 'mobile' ? 0.8 : (simplify ? 0.7 : 1)),
      ease: 'power3.out',
      scrollTrigger: {
        trigger: aboutCard,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      }
    });
  }

  // Contact form entrance
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    gsap.fromTo(contactForm, {
      opacity: 0,
      y: isReduced ? 0 : (mode === 'mobile' ? 24 : (simplify ? 18 : 40)),
    }, {
      opacity: 1,
      y: 0,
      duration: isReduced ? 0.01 : (mode === 'mobile' ? 0.7 : (simplify ? 0.6 : 0.8)),
      ease: 'power2.out',
      scrollTrigger: {
        trigger: contactForm,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      }
    });
  }

  // Footer
  gsap.fromTo('footer', {
    opacity: 0,
  }, {
    opacity: 1,
    duration: isReduced ? 0.01 : (mode === 'mobile' ? 0.8 : 1),
    scrollTrigger: {
      trigger: 'footer',
      start: 'top 90%',
      toggleActions: 'play none none reverse',
    }
  });

  // Older Android: layout + font settling can throw off triggers; refresh a couple times.
  const doRefresh = () => {
    try { ScrollTrigger.refresh(); } catch {}
  };
  window.addEventListener('load', () => setTimeout(doRefresh, 50), { once: true });
  setTimeout(doRefresh, 250);
  setTimeout(doRefresh, 900);
}
