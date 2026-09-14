import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { NAV_LINKS } from '../data';

/**
 * Tracks which section is currently in view so the nav can highlight it.
 *
 * Uses IntersectionObserver rather than a scroll listener: the browser does
 * the intersection maths off the main thread, so there is no per-frame layout
 * read and nothing to throttle.
 */
@Injectable({ providedIn: 'root' })
export class ScrollSpyService {
  private readonly _active = signal<string>(NAV_LINKS[0].id);
  readonly active = this._active.asReadonly();

  private observer?: IntersectionObserver;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.observer?.disconnect());
  }

  /** Called once by the header after the sections exist in the DOM. */
  observe(): void {
    if (this.observer || typeof IntersectionObserver === 'undefined') return;

    // Visibility is measured against a band across the upper-middle of the
    // viewport. Anchoring to a band (not the whole viewport) means exactly one
    // section wins at a time, even when a short section is fully visible
    // alongside a tall one.
    this.observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target.id) this._active.set(visible.target.id);
      },
      {
        rootMargin: '-20% 0px -65% 0px',
        threshold: [0, 0.25, 0.5, 1],
      },
    );

    for (const link of NAV_LINKS) {
      const el = document.getElementById(link.id);
      if (el) this.observer.observe(el);
    }
  }

  /** Set immediately on click so the highlight does not lag the smooth scroll. */
  setActive(id: string): void {
    this._active.set(id);
  }
}
