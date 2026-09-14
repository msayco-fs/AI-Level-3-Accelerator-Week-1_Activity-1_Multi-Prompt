import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { CartService } from '../../core/services';
import { hasLargeSize, priceForSize, type ItemSize, type MenuItem } from '../../core/models';
import { MediaFrame } from '../ui/media-frame/media-frame';
import { PesoPipe } from '../ui/peso.pipe';

@Component({
  selector: 'app-menu-item-card',
  templateUrl: './menu-item-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MediaFrame, PesoPipe],
  host: { class: 'contents' },
})
export class MenuItemCard {
  readonly item = input.required<MenuItem>();

  private readonly cart = inject(CartService);

  protected readonly size = signal<ItemSize>('regular');
  /** Drives the transient "Added" state on the button. */
  protected readonly justAdded = signal(false);

  protected readonly canPickSize = computed(() => hasLargeSize(this.item()));
  protected readonly currentPrice = computed(() => priceForSize(this.item(), this.size()));
  protected readonly inCart = computed(() => this.cart.qtyOf(this.item().id));

  /** Human-readable dietary labels; the raw tokens are kebab-case. */
  protected readonly tagLabels = computed(() =>
    (this.item().tags ?? []).map((tag) => tag.replace(/-/g, ' ')),
  );

  protected readonly badgeClass = computed(() => {
    switch (this.item().badge) {
      case 'new':
        return 'ribbon ribbon-new';
      case 'seasonal':
        return 'ribbon ribbon-seasonal';
      default:
        return 'ribbon';
    }
  });

  protected selectSize(next: ItemSize): void {
    this.size.set(next);
  }

  protected addToCart(): void {
    const item = this.item();
    if (!item.available) return;

    this.cart.add(item, this.size());

    // Feedback without a timer-based state machine: the flag resets on the
    // next macrotask tick after the animation would have finished.
    this.justAdded.set(true);
    setTimeout(() => this.justAdded.set(false), 1600);
  }
}
