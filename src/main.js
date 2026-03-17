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
// MASTER NAVBAR HIDE/SHOW CONTROLLER (WITH SCROLL LOCK)
// ══════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  const topNav = document.getElementById('top-nav');
  const navLinks = document.querySelectorAll('#top-nav .nav-link');
  
  // The magic lock variable
  let isNavigating = false; 

  if (!topNav) return;

  // 1. Force hide on link click
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      
      isNavigating = true; // Lock the scroll listener
      topNav.classList.add('hidden'); // Hide the navbar
      
      // Unlock the scroll listener after 1 second 
      // (giving the browser enough time to scroll past the top 50px)
      setTimeout(() => {
        isNavigating = false;
      }, 1000); 
      
    });
  });

  // 2. Bring it back when returning to the absolute top
  window.addEventListener('scroll', () => {
    // ONLY un-hide if we are at the top AND we didn't just click a button
    if (!isNavigating && window.scrollY < 50) { 
      topNav.classList.remove('hidden');
    }
  });
});

// ═══════════════════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════════════════

let bgScene, heroScene, aboutScene, techScene, skillsScene, projectsScene, experienceScene, philosophyScene, achievementsScene, contactScene;
let rafId;

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
