import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  signal,
  type OnInit,
} from '@angular/core';
import { NAV_LINKS, SHOP } from '../../core/data';
import { CartService, ScrollLockService, ScrollSpyService } from '../../core/services';
import { FocusTrap } from '../../shared/a11y/focus-trap';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FocusTrap],
  host: {
    class: 'fixed inset-x-0 top-0 z-50',
    '(document:keydown.escape)': 'closeNav()',
  },
})
export class Header implements OnInit {
  protected readonly shop = SHOP;
  protected readonly links = NAV_LINKS;
  protected readonly cart = inject(CartService);

  private readonly spy = inject(ScrollSpyService);
  private readonly scrollLock = inject(ScrollLockService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly active = this.spy.active;
  protected readonly navOpen = signal(false);
  /** True once the page has scrolled past the hero fold. */
  protected readonly condensed = signal(false);

  constructor() {
    let locked = false;
    effect(() => {
      const open = this.navOpen();
      if (open && !locked) {
        this.scrollLock.lock();
        locked = true;
      } else if (!open && locked) {
        this.scrollLock.release();
        locked = false;
      }
    });
  }

  ngOnInit(): void {
    this.spy.observe();
    this.watchScroll();
  }

  protected toggleNav(): void {
    this.navOpen.update((v) => !v);
  }

  protected closeNav(): void {
    if (this.navOpen()) this.navOpen.set(false);
  }

  /** Anchor clicks close the drawer and claim the highlight immediately. */
  protected onNavigate(id: string): void {
    this.spy.setActive(id);
    this.closeNav();
  }

  protected openCart(): void {
    this.closeNav();
    this.cart.open();
  }

  /**
   * Condense the header once scrolled. A sentinel + IntersectionObserver
   * keeps this off the scroll event entirely — no listener firing on every
   * frame, no manual throttling, no layout thrash.
   */
  private watchScroll(): void {
    if (typeof IntersectionObserver === 'undefined') return;

    const sentinel = document.createElement('div');
    sentinel.setAttribute('aria-hidden', 'true');
    sentinel.style.cssText = 'position:absolute;top:0;height:120px;width:1px;pointer-events:none';
    document.body.prepend(sentinel);

    const observer = new IntersectionObserver(
      ([entry]) => this.condensed.set(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(sentinel);

    // The header lives for the whole session today, but tearing this down
    // keeps it safe if it is ever rendered conditionally.
    this.destroyRef.onDestroy(() => {
      observer.disconnect();
      sentinel.remove();
    });
  }
}
