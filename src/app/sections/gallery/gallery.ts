import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { GALLERY } from '../../core/data';
import { ScrollLockService } from '../../core/services';
import { MediaFrame } from '../../shared/ui/media-frame/media-frame';
import { FocusTrap } from '../../shared/a11y/focus-trap';
import { Reveal } from '../../shared/a11y/reveal';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MediaFrame, FocusTrap, Reveal],
  host: {
    '(document:keydown.escape)': 'closeLightbox()',
    '(document:keydown.arrowRight)': 'next()',
    '(document:keydown.arrowLeft)': 'previous()',
  },
})
export class Gallery {
  protected readonly images = GALLERY;
  private readonly scrollLock = inject(ScrollLockService);

  /** Index of the open image, or null when the lightbox is closed. */
  protected readonly openIndex = signal<number | null>(null);

  protected readonly current = computed(() => {
    const i = this.openIndex();
    return i === null ? null : this.images[i];
  });

  /** Grid span per aspect token. */
  protected readonly spanFor: Record<string, string> = {
    portrait: 'row-span-2',
    landscape: 'col-span-2',
    square: '',
  };

  /** Intrinsic size per aspect, so each <img> reserves the right box. */
  protected readonly dimsFor: Record<string, { w: number; h: number }> = {
    portrait: { w: 960, h: 1280 },
    landscape: { w: 1280, h: 854 },
    square: { w: 1040, h: 1040 },
  };

  constructor() {
    let locked = false;
    effect(() => {
      const open = this.openIndex() !== null;
      if (open && !locked) {
        this.scrollLock.lock();
        locked = true;
      } else if (!open && locked) {
        this.scrollLock.release();
        locked = false;
      }
    });
  }

  protected openLightbox(index: number): void {
    this.openIndex.set(index);
  }

  protected closeLightbox(): void {
    if (this.openIndex() !== null) this.openIndex.set(null);
  }

  /** Wraps around, so arrow keys never dead-end. */
  protected next(): void {
    const i = this.openIndex();
    if (i === null) return;
    this.openIndex.set((i + 1) % this.images.length);
  }

  protected previous(): void {
    const i = this.openIndex();
    if (i === null) return;
    this.openIndex.set((i - 1 + this.images.length) % this.images.length);
  }
}
