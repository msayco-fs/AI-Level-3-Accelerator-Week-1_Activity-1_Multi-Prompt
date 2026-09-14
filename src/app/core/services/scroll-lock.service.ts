import { Injectable } from '@angular/core';

/**
 * Locks background scrolling while an overlay is open.
 *
 * Reference-counted, because the cart drawer, mobile nav and gallery lightbox
 * can legitimately overlap (open the nav, tap a link, land on the lightbox).
 * A naive `overflow: hidden` toggle would let whichever closed first unlock
 * the page underneath the one still open.
 */
@Injectable({ providedIn: 'root' })
export class ScrollLockService {
  private depth = 0;
  private savedOverflow = '';
  private savedPaddingRight = '';

  lock(): void {
    if (this.depth++ > 0) return;

    const body = document.body;
    // Removing the scrollbar shifts layout by its width; pad it back so the
    // page does not visibly jump sideways when an overlay opens.
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;

    this.savedOverflow = body.style.overflow;
    this.savedPaddingRight = body.style.paddingRight;

    body.style.overflow = 'hidden';
    if (scrollbar > 0) {
      const current = parseFloat(getComputedStyle(body).paddingRight) || 0;
      body.style.paddingRight = `${current + scrollbar}px`;
    }
  }

  release(): void {
    if (this.depth === 0) return;
    if (--this.depth > 0) return;

    document.body.style.overflow = this.savedOverflow;
    document.body.style.paddingRight = this.savedPaddingRight;
  }
}
