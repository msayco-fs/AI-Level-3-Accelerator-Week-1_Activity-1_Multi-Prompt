import { computed, Injectable, signal } from '@angular/core';
import type {
  CartLine,
  CartTotals,
  ItemSize,
  MenuItem,
  PersistedCart,
} from '../models';
import { priceForSize } from '../models';

const STORAGE_KEY = 'matcharap.cart';
const MAX_QTY_PER_LINE = 20;

/**
 * Signal-based cart store.
 *
 * Lines are the only state; every total is derived. The store also owns the
 * drawer's open/closed flag so any component can open the cart without
 * plumbing outputs up to the app shell.
 */
@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly _lines = signal<readonly CartLine[]>(this.restore());
  private readonly _open = signal(false);
  /** Bumped on every add so the UI can flash a confirmation. */
  private readonly _lastAdded = signal<string | null>(null);

  readonly lines = this._lines.asReadonly();
  readonly isOpen = this._open.asReadonly();
  readonly lastAdded = this._lastAdded.asReadonly();

  readonly totals = computed<CartTotals>(() => {
    const lines = this._lines();
    let itemCount = 0;
    let subtotal = 0;
    for (const line of lines) {
      itemCount += line.qty;
      subtotal += line.qty * line.unitPrice;
    }
    return { lineCount: lines.length, itemCount, subtotal };
  });

  readonly isEmpty = computed(() => this._lines().length === 0);

  /**
   * Single write path: updates state and flushes to storage in the same tick.
   *
   * An `effect()` would be the idiomatic-looking choice, but effects are
   * scheduled asynchronously — a change made immediately before the tab
   * closes would never reach localStorage. Committing synchronously makes the
   * stored snapshot and the in-memory state impossible to desynchronise.
   */
  private commit(next: readonly CartLine[]): void {
    this._lines.set(next);
    this.persist(next);
  }

  /* ------------------------------ MUTATORS ------------------------------ */

  /**
   * Adds an item. Identical item + size + note merges into the existing line
   * instead of creating a duplicate row.
   */
  add(item: MenuItem, size: ItemSize = 'regular', qty = 1, note?: string): void {
    if (!item.available || qty < 1) return;

    const trimmedNote = note?.trim() || undefined;
    const lineId = this.buildLineId(item.id, size, trimmedNote);
    const unitPrice = priceForSize(item, size);

    const lines = this._lines();
    const index = lines.findIndex((l) => l.lineId === lineId);

    if (index === -1) {
      this.commit([
        ...lines,
        {
          lineId,
          itemId: item.id,
          name: item.name,
          size,
          unitPrice,
          qty: Math.min(qty, MAX_QTY_PER_LINE),
          note: trimmedNote,
        },
      ]);
    } else {
      const next = [...lines];
      next[index] = {
        ...next[index],
        qty: Math.min(next[index].qty + qty, MAX_QTY_PER_LINE),
      };
      this.commit(next);
    }

    this._lastAdded.set(lineId);
  }

  /** Sets an absolute quantity. Zero or less removes the line. */
  setQty(lineId: string, qty: number): void {
    if (qty < 1) {
      this.remove(lineId);
      return;
    }
    this.commit(
      this._lines().map((line) =>
        line.lineId === lineId ? { ...line, qty: Math.min(qty, MAX_QTY_PER_LINE) } : line,
      ),
    );
  }

  increment(lineId: string): void {
    const line = this._lines().find((l) => l.lineId === lineId);
    if (line) this.setQty(lineId, line.qty + 1);
  }

  decrement(lineId: string): void {
    const line = this._lines().find((l) => l.lineId === lineId);
    if (line) this.setQty(lineId, line.qty - 1);
  }

  remove(lineId: string): void {
    this.commit(this._lines().filter((line) => line.lineId !== lineId));
  }

  clear(): void {
    this.commit([]);
  }

  /* ----------------------------- DRAWER UI ----------------------------- */

  open(): void {
    this._open.set(true);
  }

  close(): void {
    this._open.set(false);
  }

  toggle(): void {
    this._open.update((v) => !v);
  }

  /* ------------------------------ HELPERS ------------------------------ */

  /** How many of a given product are in the cart, across all sizes. */
  qtyOf(itemId: string): number {
    return this._lines()
      .filter((line) => line.itemId === itemId)
      .reduce((sum, line) => sum + line.qty, 0);
  }

  private buildLineId(itemId: string, size: ItemSize, note?: string): string {
    // Notes are part of the identity, so "oat milk" and plain stay separate.
    return `${itemId}::${size}::${note ? encodeURIComponent(note) : ''}`;
  }

  /* ---------------------------- PERSISTENCE ---------------------------- */

  private persist(lines: readonly CartLine[]): void {
    try {
      if (lines.length === 0) {
        localStorage.removeItem(STORAGE_KEY);
        return;
      }
      const payload: PersistedCart = {
        version: 1,
        lines,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Private browsing or a full quota. A cart that forgets itself is a
      // far better outcome than a page that throws.
    }
  }

  private restore(): readonly CartLine[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];

      const parsed = JSON.parse(raw) as PersistedCart;
      if (parsed?.version !== 1 || !Array.isArray(parsed.lines)) return [];

      // Validate every field: prices may have changed, or the stored shape
      // could be from a hand-edited/corrupted entry.
      return parsed.lines.filter(
        (line): line is CartLine =>
          typeof line?.lineId === 'string' &&
          typeof line.itemId === 'string' &&
          typeof line.name === 'string' &&
          (line.size === 'regular' || line.size === 'large') &&
          Number.isFinite(line.unitPrice) &&
          line.unitPrice >= 0 &&
          Number.isInteger(line.qty) &&
          line.qty > 0 &&
          line.qty <= MAX_QTY_PER_LINE,
      );
    } catch {
      return [];
    }
  }
}
