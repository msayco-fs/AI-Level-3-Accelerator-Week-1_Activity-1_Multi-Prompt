import type { ItemSize, MenuItem } from './menu.model';

/**
 * A single orderable line in the cart.
 *
 * `lineId` is distinct from `itemId` because the same product can appear
 * multiple times with different sizes or notes (e.g. one large Hojicha with
 * oat milk, one regular Hojicha plain) and each must be independently
 * editable.
 */
export interface CartLine {
  readonly lineId: string;
  readonly itemId: MenuItem['id'];
  /** Denormalised so the drawer renders without re-querying the menu. */
  readonly name: string;
  readonly size: ItemSize;
  /** PHP unit price already resolved for the chosen size. */
  readonly unitPrice: number;
  readonly qty: number;
  /** Optional customer instruction, e.g. "light ice, oat milk". */
  readonly note?: string;
}

/** Derived totals. Never persisted — always recomputed from lines. */
export interface CartTotals {
  readonly lineCount: number;
  /** Total number of physical items (sum of quantities). */
  readonly itemCount: number;
  readonly subtotal: number;
}

/** How the finished order is handed off to the shop. */
export type OrderChannel = 'whatsapp' | 'email';

export type FulfilmentType = 'pickup' | 'dine-in';

/** Customer details collected before the order link is generated. */
export interface OrderDetails {
  readonly name: string;
  readonly phone: string;
  readonly fulfilment: FulfilmentType;
  /** Free-text pickup time, e.g. "ASAP" or "4:30 PM". */
  readonly pickupTime: string;
  readonly notes?: string;
}

/** Composed payload used to build the WhatsApp / mailto deep link. */
export interface OrderPayload {
  readonly reference: string;
  readonly placedAt: string;
  readonly details: OrderDetails;
  readonly lines: readonly CartLine[];
  readonly totals: CartTotals;
}

/** Shape written to localStorage. Versioned so old carts can be discarded. */
export interface PersistedCart {
  readonly version: 1;
  readonly lines: readonly CartLine[];
  readonly savedAt: string;
}
