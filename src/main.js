import '@fontsource-variable/nunito';
import '@fontsource-variable/nunito-sans';
import { gsap } from 'gsap';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';
import './style.css';

const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
const desktopQuery = window.matchMedia('(min-width: 981px)');
const toast = document.querySelector('[data-toast]');
let toastTimeout;
let particleCount = 0;
let lemonRainActive = false;

const showToast = (message) => {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('toast--visible');
  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => toast.classList.remove('toast--visible'), 3000);
};

const elementCenter = (element) => {
  const rect = element.getBoundingClientRect();
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
};

const createParticleBurst = ({ x, y }, symbols = ['🍋', '✦', '♥'], count = 12) => {
  if (reduceMotionQuery.matches || particleCount > 42) return;
  const fragment = document.createDocumentFragment();

  for (let index = 0; index < count; index += 1) {
    const particle = document.createElement('span');
    const angle = (Math.PI * 2 * index) / count + (Math.random() - 0.5) * 0.35;
    const distance = 65 + Math.random() * 85;
    particleCount += 1;
    particle.className = 'easter-particle';
    particle.setAttribute('aria-hidden', 'true');
    particle.textContent = symbols[index % symbols.length];
    particle.style.setProperty('--particle-x', `${x}px`);
    particle.style.setProperty('--particle-y', `${y}px`);
    particle.style.setProperty('--particle-dx', `${Math.cos(angle) * distance}px`);
    particle.style.setProperty('--particle-dy', `${Math.sin(angle) * distance}px`);
    particle.style.setProperty('--particle-rotation', `${Math.round((Math.random() - 0.5) * 520)}deg`);
    particle.style.setProperty('--particle-delay', `${index * 12}ms`);
    const removeParticle = () => {
      if (!particle.isConnected) return;
      particle.remove();
      particleCount = Math.max(0, particleCount - 1);
    };
    particle.addEventListener('animationend', removeParticle, { once: true });
    window.setTimeout(removeParticle, 1600);
    fragment.appendChild(particle);
  }

  document.body.appendChild(fragment);
};

const rainLemons = () => {
  if (reduceMotionQuery.matches || lemonRainActive) return;
  lemonRainActive = true;
  const fragment = document.createDocumentFragment();
  for (let index = 0; index < 18; index += 1) {
    const lemon = document.createElement('span');
    lemon.className = 'lemon-rain-drop';
    lemon.setAttribute('aria-hidden', 'true');
    lemon.textContent = index % 5 === 0 ? '✦' : '🍋';
    lemon.style.setProperty('--rain-x', `${3 + Math.random() * 94}vw`);
    lemon.style.setProperty('--rain-delay', `${Math.random() * 850}ms`);
    lemon.style.setProperty('--rain-duration', `${1.8 + Math.random() * 1.25}s`);
    lemon.style.setProperty('--rain-rotation', `${240 + Math.round(Math.random() * 620)}deg`);
    lemon.addEventListener('animationend', () => lemon.remove(), { once: true });
    fragment.appendChild(lemon);
  }
  document.body.appendChild(fragment);
  window.setTimeout(() => {
    document.querySelectorAll('.lemon-rain-drop').forEach((lemon) => lemon.remove());
    lemonRainActive = false;
  }, 4300);
};

const initRevealAnimations = () => {
  const elements = [...document.querySelectorAll('[data-reveal]')];
  if (!elements.length) return;

  if (reduceMotionQuery.matches || !('IntersectionObserver' in window)) {
    elements.forEach((element) => element.classList.add('reveal--visible'));
    return;
  }

  const variants = {
    left: { x: -45, y: 12, rotation: -1.5 },
    right: { x: 45, y: 12, rotation: 1.5 },
    card: { x: 0, y: 42, rotation: -1.2, scale: 0.96 },
    default: { x: 0, y: 30, rotation: 0, scale: 0.985 },
  };

  elements.forEach((element) => {
    const variant = variants[element.dataset.reveal] || variants.default;
    gsap.set(element, { autoAlpha: 0, ...variant });
  });

  const observer = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting)
      .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

    visible.forEach((entry, index) => {
      entry.target.classList.add('reveal--visible');
      gsap.to(entry.target, {
        autoAlpha: 1,
        x: 0,
        y: 0,
        rotation: 0,
        scale: 1,
        duration: entry.target.dataset.reveal === 'card' ? 0.8 : 0.72,
        delay: index * 0.09,
        ease: entry.target.dataset.reveal === 'card' ? 'back.out(1.45)' : 'power3.out',
        clearProps: 'opacity,visibility,transform',
      });
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.13 });

  elements.forEach((element) => observer.observe(element));
};

const initHeroDepth = () => {
  const hero = document.querySelector('.hero');
  const layers = [...document.querySelectorAll('[data-depth]')];
  const sticker = document.querySelector('[data-hero-sticker]');
  if (!hero || !layers.length || reduceMotionQuery.matches) return;

  if (sticker) {
    gsap.from(sticker, { scale: 0.45, rotation: -24, duration: 0.9, delay: 0.55, ease: 'elastic.out(1, 0.55)' });
  }

  if (finePointerQuery.matches) {
    const setters = layers.map((layer) => ({
      layer,
      x: gsap.quickTo(layer, 'x', { duration: 0.6, ease: 'power3.out' }),
      y: gsap.quickTo(layer, 'y', { duration: 0.6, ease: 'power3.out' }),
    }));

    hero.addEventListener('pointermove', (event) => {
      const rect = hero.getBoundingClientRect();
      const normalizedX = (event.clientX - rect.left) / rect.width - 0.5;
      const normalizedY = (event.clientY - rect.top) / rect.height - 0.5;
      setters.forEach(({ layer, x, y }) => {
        const depth = Number(layer.dataset.depth || 1);
        x(normalizedX * 18 * depth);
        y(normalizedY * 13 * depth);
      });
    });

    hero.addEventListener('pointerleave', () => setters.forEach(({ x, y }) => { x(0); y(0); }));
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      const progress = Math.max(-1, Math.min(1, -hero.getBoundingClientRect().top / hero.offsetHeight));
      layers.forEach((layer) => gsap.set(layer, { yPercent: progress * Number(layer.dataset.depth || 1) * 4 }));
      ticking = false;
    });
  }, { passive: true });
};

const initNavigation = () => {
  const toggle = document.querySelector('[data-menu-toggle]');
  const navigation = document.querySelector('[data-navigation]');
  const links = navigation ? [...navigation.querySelectorAll('a[href^="#"]')] : [];
  if (!toggle || !navigation) return;

  let lastFocused = null;
  const setMenuOpen = (open, restoreFocus = false) => {
    navigation.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    navigation.inert = !desktopQuery.matches && !open;
    if (open) {
      lastFocused = document.activeElement;
      links[0]?.focus();
    } else if (restoreFocus && lastFocused === toggle) {
      toggle.focus();
    }
  };

  navigation.inert = !desktopQuery.matches;

  toggle.addEventListener('click', () => setMenuOpen(toggle.getAttribute('aria-expanded') !== 'true', true));
  navigation.addEventListener('click', (event) => {
    if (event.target.closest('a') && !desktopQuery.matches) setMenuOpen(false);
  });
  document.addEventListener('pointerdown', (event) => {
    if (toggle.getAttribute('aria-expanded') === 'true' && !navigation.contains(event.target) && !toggle.contains(event.target)) setMenuOpen(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') setMenuOpen(false, true);
    if (event.key === 'Tab' && toggle.getAttribute('aria-expanded') === 'true') {
      const focusable = [...navigation.querySelectorAll('a[href]')];
      const first = focusable[0];
      const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }
  });
  desktopQuery.addEventListener('change', ({ matches }) => { if (matches) setMenuOpen(false); });

  const sectionLinks = new Map(links.map((link) => [link.getAttribute('href').slice(1), link]));
  const sections = [...sectionLinks.keys()].map((id) => document.getElementById(id)).filter(Boolean);
  if (!('IntersectionObserver' in window) || !sections.length) return;

  const setActive = (id) => {
    sectionLinks.forEach((link, sectionId) => {
      const active = sectionId === id;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };

  const observer = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
    if (visible[0]) setActive(visible[0].target.id);
  }, { rootMargin: '-22% 0px -56% 0px', threshold: [0, 0.15, 0.5] });
  sections.forEach((section) => observer.observe(section));
};

const initGallery = () => {
  const gallery = document.querySelector('[data-gallery]');
  if (!gallery) return;

  const lightbox = new PhotoSwipeLightbox({
    gallery,
    children: 'a.gallery-link',
    pswpModule: () => import('photoswipe'),
    bgOpacity: 0.92,
    showHideAnimationType: reduceMotionQuery.matches ? 'none' : 'zoom',
  });

  lightbox.on('uiRegister', () => {
    lightbox.pswp.ui.registerElement({
      name: 'custom-caption',
      order: 9,
      isButton: false,
      appendTo: 'root',
      html: '',
      onInit: (element, pswp) => {
        const updateCaption = () => {
          element.textContent = pswp.currSlide?.data?.element?.dataset.caption || '';
        };
        pswp.on('change', updateCaption);
        updateCaption();
      },
    });
  });
  lightbox.init();

  if (finePointerQuery.matches && !reduceMotionQuery.matches) {
    gallery.querySelectorAll('.gallery-link').forEach((link) => {
      const image = link.querySelector('img');
      link.addEventListener('pointermove', (event) => {
        const rect = link.getBoundingClientRect();
        const rotateY = ((event.clientX - rect.left) / rect.width - 0.5) * 3;
        const rotateX = -((event.clientY - rect.top) / rect.height - 0.5) * 3;
        gsap.to(image, { rotateX, rotateY, scale: 1.045, duration: 0.3, ease: 'power2.out', transformPerspective: 700 });
      });
      link.addEventListener('pointerleave', () => gsap.to(image, { rotateX: 0, rotateY: 0, scale: 1, duration: 0.45, ease: 'power3.out' }));
    });
  }
};

const initMobileSlider = () => {
  const slider = document.querySelector('[data-slider]');
  const dotsContainer = document.querySelector('[data-slider-dots]');
  const counter = document.querySelector('[data-slider-counter]');
  if (!slider || !dotsContainer || !counter) return;
  const slides = [...slider.querySelectorAll('.gallery-placeholder')];
  const dots = slides.map((slide, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'gallery-dot';
    dot.setAttribute('aria-label', `Pokaż ilustrację ${index + 1} z ${slides.length}`);
    dot.addEventListener('click', () => slide.scrollIntoView({ behavior: reduceMotionQuery.matches ? 'auto' : 'smooth', block: 'nearest', inline: 'center' }));
    dotsContainer.appendChild(dot);
    return dot;
  });

  const setActive = (index) => {
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle('is-active', dotIndex === index);
      dot.setAttribute('aria-current', dotIndex === index ? 'true' : 'false');
    });
    counter.textContent = `${index + 1} / ${slides.length}`;
  };
  setActive(0);

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      const current = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (current) setActive(slides.indexOf(current.target));
    }, { root: slider, threshold: [0.55, 0.75] });
    slides.forEach((slide) => observer.observe(slide));
  }
};

const initCupPaths = () => {
  const paths = [...document.querySelectorAll('[data-cup-path]')];
  if (!paths.length || reduceMotionQuery.matches || !('IntersectionObserver' in window)) return;
  paths.forEach((path) => {
    const line = path.querySelector('.cup-path__line');
    const lemon = path.querySelector('.cup-path__lemon');
    const length = line.getTotalLength();
    gsap.set(line, { strokeDasharray: length, strokeDashoffset: length });
    gsap.set(lemon, { scale: 0, rotation: -180 });
  });
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const line = entry.target.querySelector('.cup-path__line');
      const cup = entry.target.querySelector('.cup-path__cup');
      const lemon = entry.target.querySelector('.cup-path__lemon');
      const travel = Math.max(180, entry.target.clientWidth - cup.offsetWidth - 100);
      gsap.timeline()
        .to(line, { strokeDashoffset: 0, duration: 1.5, ease: 'power2.inOut' })
        .fromTo(cup, { x: 0, y: 15, rotation: -12, autoAlpha: 0 }, { x: travel, y: -5, rotation: 10, autoAlpha: 1, duration: 1.45, ease: 'power1.inOut' }, 0.05)
        .from(lemon, { scale: 0, rotation: -180, duration: 0.7, ease: 'back.out(2)' }, 1.05);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.35 });
  paths.forEach((path) => observer.observe(path));
};

const initMicroInteractions = () => {
  document.querySelectorAll('[data-donate]').forEach((link) => {
    link.addEventListener('click', () => createParticleBurst(elementCenter(link), ['♥', '✦', '🍋'], 9));
  });

  document.querySelectorAll('.step').forEach((step) => {
    const icon = step.querySelector('.step-icon');
    if (!icon || reduceMotionQuery.matches) return;
    const animate = () => {
      if (icon.classList.contains('step-icon--heart')) gsap.fromTo(icon, { scale: 1 }, { scale: 1.22, repeat: 1, yoyo: true, duration: 0.2, ease: 'power2.inOut' });
      else if (icon.classList.contains('step-icon--megaphone')) gsap.fromTo(icon, { rotation: -7 }, { rotation: 7, repeat: 3, yoyo: true, duration: 0.1 });
      else gsap.fromTo(icon, { y: 0, rotation: -4 }, { y: -10, rotation: 7, repeat: 1, yoyo: true, duration: 0.24, ease: 'power2.out' });
    };
    step.addEventListener('pointerenter', animate);
    step.addEventListener('focusin', animate);
  });
};

const initShare = () => {
  const shareButton = document.querySelector('[data-share]');
  if (!shareButton) return;
  const celebrate = (message) => {
    showToast(message);
    createParticleBurst(elementCenter(shareButton));
  };
  const copyPageUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      celebrate('Link skopiowany — dobro idzie dalej!');
    } catch {
      const field = document.createElement('textarea');
      field.value = window.location.href;
      field.setAttribute('readonly', '');
      field.className = 'clipboard-fallback';
      document.body.appendChild(field);
      field.select();
      const copied = document.execCommand('copy');
      field.remove();
      copied ? celebrate('Link skopiowany — dobro idzie dalej!') : showToast('Skopiuj adres strony z paska przeglądarki.');
    }
  };
  shareButton.addEventListener('click', async () => {
    const data = { title: 'Lemoniada, która pomaga', text: 'Dziewczynki z Kwidzyna sprzedają lemoniadę i ciasto, aby wesprzeć leczenie Małgorzaty. Pomóż razem z nami!', url: window.location.href };
    if (navigator.share) {
      try { await navigator.share(data); celebrate('Dziękujemy — dobro idzie dalej!'); } catch (error) { if (error.name !== 'AbortError') await copyPageUrl(); }
    } else await copyPageUrl();
  });
};

const initFinale = () => {
  const section = document.querySelector('[data-final-cta]');
  if (!section || reduceMotionQuery.matches || !('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver(([entry]) => {
    if (!entry?.isIntersecting) return;
    section.classList.add('is-celebrating');
    gsap.fromTo(section.querySelectorAll('.final-lemon'), { scale: 0.25, rotation: -70, autoAlpha: 0 }, { scale: 1, rotation: 0, autoAlpha: 0.22, stagger: 0.14, duration: 1, ease: 'elastic.out(1, 0.5)' });
    createParticleBurst({ x: window.innerWidth / 2, y: Math.min(window.innerHeight - 80, entry.boundingClientRect.top + 90) }, ['♥', '🍋', '✦'], 16);
    observer.disconnect();
  }, { threshold: 0.45 });
  observer.observe(section);
};

const initEasterEggs = () => {
  const brand = document.querySelector('[data-lemon-brand]');
  let clicks = [];
  let typedSequence = '';
  brand?.addEventListener('click', () => {
    if (reduceMotionQuery.matches) return;
    gsap.fromTo(brand.querySelector('.brand-lemon'), { rotation: -7 }, { rotation: 353, duration: 0.8, ease: 'back.out(1.5)' });
    const now = Date.now();
    clicks = [...clicks.filter((time) => now - time < 1800), now];
    if (clicks.length >= 3) {
      clicks = [];
      showToast('Kwaśna moc aktywowana! 🍋');
      createParticleBurst(elementCenter(brand), ['🍋', '✦', '♥'], 16);
      if (window.matchMedia('(pointer: coarse)').matches) rainLemons();
    }
  });

  document.addEventListener('keydown', (event) => {
    const target = event.target;
    const isTyping = target instanceof HTMLElement
      && (target.matches('input, textarea, select') || target.isContentEditable);
    if (isTyping || event.ctrlKey || event.altKey || event.metaKey || event.key.length !== 1) return;
    typedSequence = `${typedSequence}${event.key.toUpperCase()}`.slice(-5);
    if (typedSequence === 'LEMON') {
      typedSequence = '';
      showToast('Znaleziono sekretny składnik! 🍋');
      rainLemons();
    }
  });
};

initRevealAnimations();
initHeroDepth();
initNavigation();
initGallery();
initMobileSlider();
initCupPaths();
initMicroInteractions();
initShare();
initFinale();
initEasterEggs();
