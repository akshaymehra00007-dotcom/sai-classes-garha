const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealItems = document.querySelectorAll('[data-reveal]');

if ('IntersectionObserver' in window && !prefersReducedMotion) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16, rootMargin: '0px 0px -28px 0px' });
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');

function closeMenu() {
  if (!menuToggle || !mainNav) return;
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation');
  mainNav.classList.remove('is-open');
}

menuToggle?.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
  mainNav?.classList.toggle('is-open', !isOpen);
});

mainNav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});

const progressElement = document.querySelector('.scroll-progress');
let scrollFrame = 0;
function updateScrollProgress() {
  if (scrollFrame) return;
  scrollFrame = window.requestAnimationFrame(() => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? Math.min(100, (window.scrollY / scrollable) * 100) : 0;
    progressElement?.style.setProperty('--scroll-progress', `${progress}%`);
    scrollFrame = 0;
  });
}
window.addEventListener('scroll', updateScrollProgress, { passive: true });
window.addEventListener('resize', updateScrollProgress, { passive: true });
updateScrollProgress();

if (!prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
  const visual = document.querySelector('[data-parallax]');
  let pointerFrame = 0;
  visual?.addEventListener('pointermove', (event) => {
    if (pointerFrame) return;
    pointerFrame = window.requestAnimationFrame(() => {
      const rect = visual.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      visual.style.setProperty('--pointer-x', `${x * 10}px`);
      visual.style.setProperty('--pointer-y', `${y * 10}px`);
      pointerFrame = 0;
    });
  });
  visual?.addEventListener('pointerleave', () => {
    visual.style.setProperty('--pointer-x', '0px');
    visual.style.setProperty('--pointer-y', '0px');
  });
}

const year = document.querySelector('#year');
if (year) year.textContent = String(new Date().getFullYear());
