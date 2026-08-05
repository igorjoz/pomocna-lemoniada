import '@fontsource-variable/fredoka';
import '@fontsource-variable/nunito-sans';
import './style.css';

document.documentElement.classList.add('js');

const shareButton = document.querySelector('[data-share]');
const toast = document.querySelector('[data-toast]');
let toastTimeout;

const showToast = (message) => {
  toast.textContent = message;
  toast.classList.add('toast--visible');
  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => {
    toast.classList.remove('toast--visible');
  }, 3000);
};

const copyPageUrl = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);
    showToast('Link do strony został skopiowany!');
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
    showToast(copied ? 'Link do strony został skopiowany!' : 'Skopiuj adres strony z paska przeglądarki.');
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
    } catch (error) {
      if (error.name !== 'AbortError') await copyPageUrl();
    }
    return;
  }

  await copyPageUrl();
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
