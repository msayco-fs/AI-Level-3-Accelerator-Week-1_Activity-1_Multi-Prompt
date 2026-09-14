/**
 * Menu domain models.
 * All prices are stored as whole Philippine pesos (integers) to avoid
 * floating-point rounding errors in cart totals.
 */

export type MenuCategoryId = 'matcha' | 'coffee' | 'cold-brew' | 'pastries';

export interface MenuCategory {
  readonly id: MenuCategoryId;
  readonly label: string;
  /** Short line shown under the category heading. */
  readonly blurb: string;
}

/** Drink volume. Food items are always `regular`. */
export type ItemSize = 'regular' | 'large';

/** Dietary / serving-style markers rendered as pills on the item card. */
export type MenuTag =
  | 'vegan'
  | 'dairy-free'
  | 'gluten-free'
  | 'contains-nuts'
  | 'iced'
  | 'hot'
  | 'decaf';

/** Merchandising flag rendered as a corner ribbon. At most one per item. */
export type MenuBadge = 'bestseller' | 'new' | 'seasonal';

export interface MenuItem {
  readonly id: string;
  readonly name: string;
  readonly category: MenuCategoryId;
  readonly description: string;
  /** Price in PHP for the `regular` size. */
  readonly price: number;
  /** Extra PHP charged for `large`. Omit for items with a single size. */
  readonly largeUpcharge?: number;
  /** Path under /assets/images/menu, or '' to render the SVG placeholder. */
  readonly image: string;
  readonly tags?: readonly MenuTag[];
  readonly badge?: MenuBadge;
  /** Sold-out items stay visible but are not orderable. */
  readonly available: boolean;
  readonly caffeineMg?: number;
}

/** Type guard: does this item offer a large size? */
export function hasLargeSize(item: MenuItem): boolean {
  return typeof item.largeUpcharge === 'number';
}

/** Resolved price for a given size. */
export function priceForSize(item: MenuItem, size: ItemSize): number {
  return size === 'large' ? item.price + (item.largeUpcharge ?? 0) : item.price;
}
