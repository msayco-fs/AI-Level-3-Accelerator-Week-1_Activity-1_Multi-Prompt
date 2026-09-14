import {
  Directive,
  ElementRef,
  inject,
  input,
  type OnDestroy,
  type OnInit,
} from '@angular/core';

/**
 * Adds `is-revealed` to the host the first time it scrolls into view, so CSS
 * can fade/slide it in. Unobserves immediately after firing — the animation
 * should never replay on scroll-back.
 *
 * Honours `prefers-reduced-motion` by revealing instantly, and degrades to
 * "always visible" if IntersectionObserver is unavailable. Content must never
 * depend on JS to become readable.
 */
@Directive({
  selector: '[appReveal]',
  host: { class: 'reveal' },
})
export class Reveal implements OnInit, OnDestroy {
  /** Stagger in ms, applied as an animation-delay. */
  readonly revealDelay = input<number>(0);

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private observer?: IntersectionObserver;

  ngOnInit(): void {
    const el = this.host.nativeElement;

    const reducedMotion =
      typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion || typeof IntersectionObserver === 'undefined') {
      el.classList.add('is-revealed');
      return;
    }

    if (this.revealDelay() > 0) {
      el.style.setProperty('--reveal-delay', `${this.revealDelay()}ms`);
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-revealed');
          this.observer?.unobserve(entry.target);
        }
      },
      // Fire slightly before the element is fully on screen so the motion has
      // finished by the time the user is actually looking at it.
      { rootMargin: '0px 0px -12% 0px', threshold: 0.05 },
    );

    this.observer.observe(el);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
