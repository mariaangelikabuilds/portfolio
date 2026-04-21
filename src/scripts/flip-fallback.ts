import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';

gsap.registerPlugin(Flip);

function supportsViewTransitions(): boolean {
  return typeof (document as Document & { startViewTransition?: unknown }).startViewTransition === 'function';
}

const STORAGE_KEY = 'flip-state';

if (!supportsViewTransitions()) {
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement | null;
    if (!target) return;
    const link = target.closest('a[href^="/work/"]') as HTMLAnchorElement | null;
    if (!link) return;

    const sharedEl =
      link.querySelector<HTMLElement>('[transition\\:name]') ??
      link.querySelector<HTMLElement>('[data-flip]');
    if (!sharedEl) return;

    const rect = sharedEl.getBoundingClientRect();
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        rect: { left: rect.left, top: rect.top, width: rect.width, height: rect.height },
        text: sharedEl.textContent ?? '',
      })
    );
  });

  window.addEventListener('DOMContentLoaded', () => {
    const stashed = sessionStorage.getItem(STORAGE_KEY);
    if (!stashed) return;
    sessionStorage.removeItem(STORAGE_KEY);

    const parsed = JSON.parse(stashed) as {
      rect: { left: number; top: number; width: number; height: number };
      text: string;
    };

    const target =
      document.querySelector<HTMLElement>('[transition\\:name]') ??
      document.querySelector<HTMLElement>('[data-flip]');
    if (!target) return;
    if ((target.textContent ?? '').trim() !== parsed.text.trim()) return;

    const currentRect = target.getBoundingClientRect();
    gsap.from(target, {
      x: parsed.rect.left - currentRect.left,
      y: parsed.rect.top - currentRect.top,
      scale: parsed.rect.width / currentRect.width,
      duration: 0.6,
      ease: 'power3.out',
      transformOrigin: 'top left',
    });
  });
}
