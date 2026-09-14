import { Pipe, type PipeTransform } from '@angular/core';

/**
 * Formats whole pesos as `₱1,250`.
 *
 * Deliberately not Angular's CurrencyPipe: that needs locale data registered
 * to render ₱ reliably, and its `PHP` default emits `PHP 1,250.00` — wrong
 * symbol and centavos we never charge. Prices are integers by design
 * (see MenuItem.price), so this stays lossless.
 */
@Pipe({ name: 'peso' })
export class PesoPipe implements PipeTransform {
  private static readonly fmt = new Intl.NumberFormat('en-PH', {
    maximumFractionDigits: 0,
  });

  transform(value: number | null | undefined): string {
    if (value == null || !Number.isFinite(value)) return '—';
    return `\u20b1${PesoPipe.fmt.format(Math.round(value))}`;
  }
}
