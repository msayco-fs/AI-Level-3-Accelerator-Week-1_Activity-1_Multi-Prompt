import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type MediaFolder = 'hero' | 'menu' | 'gallery' | 'people';

/** Instance counter for SVG element IDs — see `gradientId` below. */
let instanceCount = 0;

/**
 * Renders a real <img> when a filename is supplied, or a deterministic
 * palette-colored SVG placeholder when it is not.
 *
 * This exists so every section can be built and reviewed with zero photos on
 * disk, then light up as assets land — no template changes required. The
 * placeholder glyph is picked from a hash of the alt text, so tiles look
 * varied but never reshuffle between renders.
 */
@Component({
  selector: 'app-media-frame',
  templateUrl: './media-frame.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block h-full w-full overflow-hidden' },
})
export class MediaFrame {
  /** Filename only, e.g. `matcha-latte.webp`. Empty renders the placeholder. */
  readonly src = input<string>('');
  readonly alt = input.required<string>();
  readonly folder = input<MediaFolder>('menu');

  /** Intrinsic dimensions — always set these to reserve space and avoid CLS. */
  readonly width = input<number>(800);
  readonly height = input<number>(600);

  /** Above-the-fold images opt out of lazy loading. */
  readonly priority = input(false);

  protected readonly url = computed(() => {
    const file = this.src().trim();
    return file ? `assets/images/${this.folder()}/${file}` : null;
  });

  /**
   * Unique per instance. SVG `url(#id)` references resolve against the whole
   * document, so a shared ID would make every placeholder on the page point
   * at the first gradient it finds — and duplicate IDs are invalid HTML.
   */
  protected readonly gradientId = `mf-bg-${++instanceCount}`;

  /** 0 | 1 | 2 — stable glyph choice derived from the alt text. */
  protected readonly variant = computed(() => {
    const text = this.alt();
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = (hash * 31 + text.charCodeAt(i)) | 0;
    }
    return Math.abs(hash) % 3;
  });
}
