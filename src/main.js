// ═══════════════════════════════════════════════════════
// MAIN ENTRY — Amarjeet Anand Portfolio
// "Where Code Meets Consciousness"
// ═══════════════════════════════════════════════════════

// Styles
import './styles/index.css';
import './styles/cursor.css';
import './styles/preloader.css';
import './styles/hero.css';
import './styles/about.css';
import './styles/techstack.css';
import './styles/skills.css';
import './styles/projects.css';
import './styles/experience.css';
import './styles/philosophy.css';
import './styles/achievements.css';
import './styles/contact.css';

// Scenes
import { BackgroundScene } from './scenes/BackgroundScene.js';
import { HeroScene } from './scenes/HeroScene.js';
import { AboutScene } from './scenes/AboutScene.js';
import { TechScene } from './scenes/TechScene.js';
import { SkillsScene } from './scenes/SkillsScene.js';
import { ProjectsScene } from './scenes/ProjectsScene.js';
import { ExperienceScene } from './scenes/ExperienceScene.js';
import { PhilosophyScene } from './scenes/PhilosophyScene.js';
import { AchievementsScene } from './scenes/AchievementsScene.js';
import { ContactScene } from './scenes/ContactScene.js';

// Components
import { Preloader } from './components/Preloader.js';
import { Cursor } from './components/Cursor.js';
import { Hero } from './components/Hero.js';
import { About } from './components/About.js';
import { Skills } from './components/Skills.js';
import { Projects } from './components/Projects.js';
import { Experience } from './components/Experience.js';
import { Philosophy } from './components/Philosophy.js';
import { Achievements } from './components/Achievements.js';
import { Contact } from './components/Contact.js';

// Scroll Animations
import { initScrollAnimations } from './utils/ScrollAnimations.js';




// ══════════════════════════════════════════════
// NAVBAR — Responsive hamburger on mobile
// ══════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  const topNav = document.getElementById('top-nav');
  if (!topNav) return;

  const toggleBtn = topNav.querySelector('.nav-toggle');
  const menu = topNav.querySelector('#nav-menu');
  const links = topNav.querySelectorAll('.nav-link');

  if (!toggleBtn || !menu) return;

  const isMobile = () => window.matchMedia('(max-width: 768px)').matches;

  const setOpen = (open) => {
    topNav.dataset.open = open ? 'true' : 'false';
    toggleBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggleBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };

  setOpen(false);

  toggleBtn.addEventListener('click', () => {
    const open = topNav.dataset.open === 'true';
    setOpen(!open);
  });

  links.forEach((link) => {
    link.addEventListener('click', (e) => {
      // Always use normal anchor scrolling; just close hamburger on mobile.
      if (isMobile()) setOpen(false);
    });
  });

  document.addEventListener('click', (e) => {
    if (!isMobile()) return;
    const open = topNav.dataset.open === 'true';
    if (!open) return;
    if (topNav.contains(e.target)) return;
    setOpen(false);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    setOpen(false);
  });

  window.addEventListener('resize', () => {
    if (!isMobile()) setOpen(false);
  });
});

// ═══════════════════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════════════════

let bgScene, heroScene, aboutScene, techScene, skillsScene, projectsScene, experienceScene, philosophyScene, achievementsScene, contactScene;
let rafId;

function getAndroidMajorVersion() {
  const ua = navigator.userAgent || '';
  const m = ua.match(/Android\s+(\d+)/i);
  return m ? Number(m[1]) : null;
}

function supportsWebGL() {
  try {
    const c = document.createElement('canvas');
    const gl =
      c.getContext('webgl2', { powerPreference: 'low-power' }) ||
      c.getContext('webgl', { powerPreference: 'low-power' }) ||
      c.getContext('experimental-webgl');
    return !!gl;
  } catch {
    return false;
  }
}

function enableStaticFallback(reason = 'webgl') {
  if (rafId) cancelAnimationFrame(rafId);
  bgScene = heroScene = aboutScene = techScene = skillsScene = projectsScene = experienceScene = philosophyScene = achievementsScene = contactScene = null;
  document.documentElement.classList.add('no-webgl');
  document.documentElement.dataset.renderMode = reason;
}

function attachWebGLContextLossGuard(canvas) {
  if (!canvas) return;
  canvas.addEventListener(
    'webglcontextlost',
    (e) => {
      // On older Android/WebView this can happen during scroll/resize; go static instead of washing out.
      e.preventDefault?.();
      enableStaticFallback('context-lost');
    },
    { passive: false }
  );
}

function initScenes() {
  bgScene = new BackgroundScene();
  heroScene = new HeroScene();
  aboutScene = new AboutScene();
  techScene = new TechScene();
  skillsScene = new SkillsScene();
  projectsScene = new ProjectsScene();
  experienceScene = new ExperienceScene();
  philosophyScene = new PhilosophyScene();
  achievementsScene = new AchievementsScene();
  contactScene = new ContactScene();

  attachWebGLContextLossGuard(document.getElementById('bg-canvas'));
  attachWebGLContextLossGuard(document.getElementById('hero-canvas'));
  attachWebGLContextLossGuard(document.getElementById('about-canvas'));
  attachWebGLContextLossGuard(document.getElementById('tech-canvas'));
  attachWebGLContextLossGuard(document.getElementById('skills-canvas'));
  attachWebGLContextLossGuard(document.getElementById('projects-canvas'));
  attachWebGLContextLossGuard(document.getElementById('experience-canvas'));
  attachWebGLContextLossGuard(document.getElementById('philosophy-canvas'));
  attachWebGLContextLossGuard(document.getElementById('achievements-canvas'));
  attachWebGLContextLossGuard(document.getElementById('contact-canvas'));
}

function initComponents() {
  new Cursor();
  new Hero();
  new About();
  new Skills();
  new Projects();
  new Experience();
  new Philosophy();
  new Achievements();
  new Contact();
}

// ═══════════════════════════════════════════════════════
// RENDER LOOP — Single RAF for all scenes
// ═══════════════════════════════════════════════════════

function isInViewport(elementId) {
  const el = document.getElementById(elementId);
  if (!el) return false;
  const rect = el.getBoundingClientRect();
  return rect.bottom > -200 && rect.top < window.innerHeight + 200;
}

function animate() {
  rafId = requestAnimationFrame(animate);

  // Background is always visible
  if (bgScene) bgScene.update();

  // Only render visible scenes for performance
  if (heroScene && isInViewport('hero')) heroScene.update();
  if (aboutScene && isInViewport('about')) aboutScene.update();
  if (techScene && isInViewport('tech-stack')) techScene.update();
  if (skillsScene && isInViewport('skills')) skillsScene.update();
  if (projectsScene && isInViewport('projects')) projectsScene.update();
  if (experienceScene && isInViewport('experience')) experienceScene.update();
  if (philosophyScene && isInViewport('philosophy')) philosophyScene.update();
  if (achievementsScene && isInViewport('achievements')) achievementsScene.update();
  if (contactScene && isInViewport('contact')) contactScene.update();
}

// ═══════════════════════════════════════════════════════
// BOOT SEQUENCE
// ═══════════════════════════════════════════════════════

function boot() {
  const androidMajor = getAndroidMajorVersion();
  const legacyAndroid = typeof androidMajor === 'number' && androidMajor > 0 && androidMajor < 8;
  const webglOk = supportsWebGL();

  if (!webglOk || legacyAndroid) {
    enableStaticFallback(!webglOk ? 'no-webgl' : 'legacy-android');
    const preloaderEl = document.getElementById('preloader');
    if (preloaderEl) preloaderEl.style.display = 'none';
    initComponents();
    initScrollAnimations();
    return;
  }

  // Start preloader — when it finishes, init everything
  new Preloader(() => {
    initScenes();
    initComponents();
    initScrollAnimations();
    animate();
  });
}

// Start when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}