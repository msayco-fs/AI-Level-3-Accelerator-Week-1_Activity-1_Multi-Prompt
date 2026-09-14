import { Injectable } from '@angular/core';
import { SHOP } from '../data';
import type { CartLine, CartTotals, OrderChannel, OrderDetails } from '../models';

/** Hard cap on a wa.me URL before mobile browsers start truncating. */
const WHATSAPP_SAFE_LENGTH = 1800;

@Injectable({ providedIn: 'root' })
export class OrderService {
  /** Human-readable, collision-resistant enough for a day's orders. */
  reference(): string {
    const stamp = Date.now().toString(36).slice(-4).toUpperCase();
    const rand = Math.floor(Math.random() * 1296)
      .toString(36)
      .toUpperCase()
      .padStart(2, '0');
    return `MR-${stamp}${rand}`;
  }

  /**
   * Formats the order as plain text. Kept free of markup so the exact same
   * body works in WhatsApp, SMS and email.
   */
  compose(
    reference: string,
    details: OrderDetails,
    lines: readonly CartLine[],
    totals: CartTotals,
  ): string {
    const peso = (n: number) => `\u20b1${n.toLocaleString('en-PH')}`;

    const rows = lines.map((line) => {
      const size = line.size === 'large' ? ' (Large)' : '';
      const lineTotal = peso(line.qty * line.unitPrice);
      const base = `${line.qty}x ${line.name}${size} — ${lineTotal}`;
      return line.note ? `${base}\n     ↳ ${line.note}` : base;
    });

    return [
      `${SHOP.name.toUpperCase()} ORDER ${reference}`,
      '',
      `Name: ${details.name}`,
      `Phone: ${details.phone}`,
      `Type: ${details.fulfilment === 'pickup' ? 'Pickup' : 'Dine-in'}`,
      `Wanted: ${details.pickupTime || 'ASAP'}`,
      '',
      '--- ORDER ---',
      ...rows,
      '',
      `Items: ${totals.itemCount}`,
      `Subtotal: ${peso(totals.subtotal)}`,
      ...(details.notes?.trim() ? ['', `Notes: ${details.notes.trim()}`] : []),
      '',
      'Sent from matcharap.ph',
    ].join('\n');
  }

  /** wa.me deep link. Number must be digits-only with country code. */
  whatsappUrl(message: string): string {
    return `https://wa.me/${SHOP.whatsapp}?text=${encodeURIComponent(message)}`;
  }

  mailtoUrl(subject: string, body: string): string {
    const params = new URLSearchParams({ subject, body });
    // URLSearchParams encodes spaces as '+', which mail clients render
    // literally in the body. %20 is what mailto actually expects.
    return `mailto:${SHOP.email}?${params.toString().replace(/\+/g, '%20')}`;
  }

  /**
   * True when the composed WhatsApp URL is long enough to risk truncation on
   * mobile, so the UI can steer a large order to email instead.
   */
  exceedsWhatsappLimit(message: string): boolean {
    return this.whatsappUrl(message).length > WHATSAPP_SAFE_LENGTH;
  }

  /** Builds the final link for the chosen channel. */
  buildUrl(channel: OrderChannel, reference: string, message: string): string {
    return channel === 'whatsapp'
      ? this.whatsappUrl(message)
      : this.mailtoUrl(`${SHOP.name} order ${reference}`, message);
  }
}
