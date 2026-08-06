import '@fontsource-variable/nunito';
import '@fontsource-variable/nunito-sans';
import './style.css';

const shareButton = document.querySelector('[data-share]');
const toast = document.querySelector('[data-toast]');
const lemonBrand = document.querySelector('[data-lemon-brand]');
const brandLemon = lemonBrand?.querySelector('.brand-lemon');
const lemonadeScene = document.querySelector('[data-lemonade-scene]');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let toastTimeout;
let sceneTimeout;
let lemonRainActive = false;
let typedSequence = '';
let brandClicks = [];

const showToast = (message) => {
  toast.textContent = message;
  toast.classList.add('toast--visible');
  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => {
    toast.classList.remove('toast--visible');
  }, 3000);
};

const elementCenter = (element) => {
  const rect = element.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
};

const createParticleBurst = ({ x, y }, symbols = ['🍋', '✦', '♥'], count = 14) => {
  if (reduceMotion) return;

  const fragment = document.createDocumentFragment();

  for (let index = 0; index < count; index += 1) {
    const particle = document.createElement('span');
    const angle = (Math.PI * 2 * index) / count + (Math.random() - 0.5) * 0.35;
    const distance = 65 + Math.random() * 85;

    particle.className = 'easter-particle';
    particle.setAttribute('aria-hidden', 'true');
    particle.textContent = symbols[index % symbols.length];
    particle.style.setProperty('--particle-x', `${x}px`);
    particle.style.setProperty('--particle-y', `${y}px`);
    particle.style.setProperty('--particle-dx', `${Math.cos(angle) * distance}px`);
    particle.style.setProperty('--particle-dy', `${Math.sin(angle) * distance}px`);
    particle.style.setProperty('--particle-rotation', `${Math.round((Math.random() - 0.5) * 520)}deg`);
    particle.style.setProperty('--particle-delay', `${index * 12}ms`);
    particle.addEventListener('animationend', () => particle.remove(), { once: true });
    window.setTimeout(() => particle.remove(), 1600);
    fragment.appendChild(particle);
  }

  document.body.appendChild(fragment);
};

const celebrateShare = () => {
  if (!shareButton) return;
  createParticleBurst(elementCenter(shareButton), ['♥', '🍋', '✦'], 12);
};

const announceShareSuccess = (message) => {
  showToast(message);
  celebrateShare();
};

const copyPageUrl = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);
    announceShareSuccess('Link skopiowany — dobro idzie dalej!');
  } catch {
    const temporaryInput = document.createElement('textarea');
    temporaryInput.value = window.location.href;
    temporaryInput.setAttribute('readonly', '');
    temporaryInput.style.position = 'fixed';
    temporaryInput.style.opacity = '0';
    document.body.appendChild(temporaryInput);
    temporaryInput.select();
    const copied = document.execCommand('copy');
    temporaryInput.remove();
    if (copied) {
      announceShareSuccess('Link skopiowany — dobro idzie dalej!');
    } else {
      showToast('Skopiuj adres strony z paska przeglądarki.');
    }
  }
};

shareButton?.addEventListener('click', async () => {
  const shareData = {
    title: 'Lemoniada, która pomaga',
    text: 'Dziewczynki z Kwidzyna sprzedają lemoniadę i ciasto, aby wesprzeć leczenie Małgorzaty. Pomóż razem z nami!',
    url: window.location.href,
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
      announceShareSuccess('Dziękujemy — dobro idzie dalej!');
    } catch (error) {
      if (error.name !== 'AbortError') await copyPageUrl();
    }
    return;
  }

  await copyPageUrl();
});

const replayClass = (element, className, duration) => {
  if (!element || reduceMotion) return;
  element.classList.remove(className);
  void element.offsetWidth;
  element.classList.add(className);
  window.setTimeout(() => element.classList.remove(className), duration);
};

const rainLemons = () => {
  if (lemonRainActive) return;

  showToast('Znaleziono sekretny składnik! 🍋');
  if (reduceMotion) return;

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

const activateSourPower = () => {
  showToast('Kwaśna moc aktywowana! 🍋');
  replayClass(lemonBrand, 'is-sour-powered', 850);
  if (brandLemon) createParticleBurst(elementCenter(brandLemon));

  if (window.matchMedia('(pointer: coarse)').matches) {
    rainLemons();
  }
};

lemonBrand?.addEventListener('click', () => {
  const now = Date.now();
  replayClass(lemonBrand, 'is-lemon-spinning', 850);
  brandClicks = [...brandClicks.filter((time) => now - time < 1800), now];

  if (brandClicks.length >= 3) {
    brandClicks = [];
    activateSourPower();
  }
});

const playLemonadeScene = () => {
  if (!lemonadeScene || reduceMotion) return;
  lemonadeScene.classList.remove('is-playing');
  void lemonadeScene.offsetWidth;
  lemonadeScene.classList.add('is-playing');
  window.clearTimeout(sceneTimeout);
  sceneTimeout = window.setTimeout(() => lemonadeScene.classList.remove('is-playing'), 1800);
};

lemonadeScene?.addEventListener('pointerdown', playLemonadeScene);
lemonadeScene?.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter' && event.key !== ' ') return;
  event.preventDefault();
  playLemonadeScene();
});

document.addEventListener('keydown', (event) => {
  const target = event.target;
  const isTyping = target instanceof HTMLElement
    && (target.matches('input, textarea, select') || target.isContentEditable);

  if (isTyping || event.ctrlKey || event.altKey || event.metaKey || event.key.length !== 1) return;

  typedSequence = `${typedSequence}${event.key.toUpperCase()}`.slice(-5);
  if (typedSequence === 'LEMON') {
    typedSequence = '';
    rainLemons();
  }
});

if (!reduceMotion && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('reveal--visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12 },
  );

  document.querySelectorAll('[data-reveal]').forEach((element) => observer.observe(element));
} else {
  document.querySelectorAll('[data-reveal]').forEach((element) => element.classList.add('reveal--visible'));
}
