# अहं ब्रह्मास्मि · Amarjeet Anand — Portfolio

> *"Where infrastructure scales to infinity, and the Self remains unchanged."*

<div align="center">

![Portfolio Preview](https://img.shields.io/badge/Status-Live-00e5cc?style=for-the-badge&labelColor=0a0a1a)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-black?style=for-the-badge&logo=three.js&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=black)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

</div>

---

## नेति नेति · Overview
A hyper-premium personal portfolio for **Amarjeet Anand** — Azure DevOps Engineer, Cloud Vedantin, and Eternal Student. Built at the intersection of modern cloud engineering and ancient Vedantic philosophy. 

Every section is named in Sanskrit. Every animation is intentional. Every line of code is an offering.

---

## ✦ Live Demo
🌐 **[amarjeetanand.dev](https://amarjeetanand.dev)** *(replace with your deployed URL)*

---

## दर्शन · Design Philosophy
This portfolio is built on a single idea: **technology and consciousness are the same intelligence wearing different forms.** The design system reflects this:

| Principle | Vedantic Term | Implementation |
|---|---|---|
| Dark void background | शून्य · Śūnya | `#030308` obsidian black |
| Golden accents | स्वर्ण · Svarṇa | `#FFD700` molten gold |
| Teal highlights | आकाश · Ākāśa | `#00E5CC` cosmic teal |
| Saffron warmth | भगवा · Bhagavā | `#FF9933` saffron |

---

## सृष्टि · Tech Stack

### Core
- **[Vite](https://vitejs.dev/)** — Lightning-fast build tool
- **[Three.js](https://threejs.org/)** — 3D WebGL rendering engine
- **[GSAP](https://greensock.com/gsap/) + ScrollTrigger** — Scroll-driven animations

### 3D Scenes (One per section)
| Section | Three.js Scene |
|---|---|
| Hero | Black hole with accretion disk + relativistic jets |
| About | Floating sacred polyhedra |
| Tech Stack | Torus knot wireframe |
| Skills | Plexus network (particle graph) |
| Projects | Wireframe cubes floating upward |
| Experience | Time tunnel particle cylinder |
| Philosophy | Sri Yantra with orbiting ring |
| Achievements | Gold octahedron diamond |
| Contact | Wormhole rings + streaming particles |
| Background | Persistent nebula field (fixed) |

### Typography
| Font | Usage |
|---|---|
| Noto Serif Devanagari | Sanskrit text |
| Cinzel Decorative | Section headings |
| Cormorant Garamond | Body italic |
| DM Sans | Body regular |

---

## विद्या · Features
- **🌀 Preloader** — Particles converge from chaos to Bindu (point), then explode (Mahapralaya)
- **✦ Custom Cursor** — Gravitational lensing effect near hero section
- **📜 Sanskrit Section Names** — Every section has Devanagari name + transliteration + English
- **🎯 Scroll Animations** — GSAP ScrollTrigger on every section, card, and element
- **⚡ Performance** — Only visible sections render their Three.js scenes
- **📱 Responsive** — Mobile-first, all animations preserved at every breakpoint
- **🔵 Availability Badge** — Animated pulsing dot showing open-to-work status

---

## शिल्पविद्या · Project Structure

```text
src/
├── main.js                    ← Entry point + boot sequence
│
├── styles/
│   ├── index.css              ← Design system + CSS variables
│   ├── hero.css
│   ├── about.css
│   ├── techstack.css
│   ├── skills.css
│   ├── projects.css
│   ├── experience.css
│   ├── philosophy.css
│   ├── achievements.css
│   ├── contact.css
│   ├── cursor.css
│   └── preloader.css
│
├── scenes/                    ← Three.js WebGL scenes
│   ├── BackgroundScene.js     ← Fixed nebula (always on)
│   ├── HeroScene.js           ← Black hole
│   ├── AboutScene.js          ← Polyhedra
│   ├── TechScene.js           ← Torus knot
│   ├── SkillsScene.js         ← Plexus network
│   ├── ProjectsScene.js       ← Floating cubes
│   ├── ExperienceScene.js     ← Time tunnel
│   ├── PhilosophyScene.js     ← Sri Yantra
│   ├── AchievementsScene.js   ← Gold octahedron
│   └── ContactScene.js        ← Wormhole
│
├── components/                ← UI interaction classes
│   ├── Preloader.js           ← Bindu convergence animation
│   ├── Cursor.js              ← Custom cursor + lensing
│   ├── Hero.js                ← Typewriter effect
│   ├── About.js               ← Tilt card
│   ├── Skills.js              ← Tab switcher + bars
│   ├── Projects.js            ← 3D card tilt
│   ├── Experience.js          ← Timeline IntersectionObserver
│   ├── Philosophy.js          ← Card hover
│   ├── Achievements.js        ← Count-up animation
│   └── Contact.js             ← Form handler
│
└── utils/
    └── ScrollAnimations.js    ← All GSAP ScrollTrigger setup

index.html                     ← Root HTML with all sections