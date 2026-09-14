import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { CartService } from './cart.service';
import { OrderService } from './order.service';
import type { MenuItem } from '../models';

const latte: MenuItem = {
  id: 'matcha-latte',
  name: 'Matcharap Signature Latte',
  category: 'matcha',
  description: 'x',
  price: 205,
  largeUpcharge: 45,
  image: '',
  available: true,
};

const soldOut: MenuItem = { ...latte, id: 'gone', name: 'Gone', available: false };

describe('CartService', () => {
  let cart: CartService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.resetTestingModule();
    cart = TestBed.inject(CartService);
  });

  it('starts empty', () => {
    expect(cart.isEmpty()).toBe(true);
    expect(cart.totals()).toEqual({ lineCount: 0, itemCount: 0, subtotal: 0 });
  });

  it('adds an item at the regular price', () => {
    cart.add(latte);
    expect(cart.totals().subtotal).toBe(205);
    expect(cart.totals().itemCount).toBe(1);
  });

  it('applies the large upcharge', () => {
    cart.add(latte, 'large');
    expect(cart.totals().subtotal).toBe(250);
  });

  it('merges the same item+size into one line', () => {
    cart.add(latte);
    cart.add(latte);
    expect(cart.totals().lineCount).toBe(1);
    expect(cart.totals().itemCount).toBe(2);
    expect(cart.totals().subtotal).toBe(410);
  });

  it('keeps different sizes as separate lines', () => {
    cart.add(latte, 'regular');
    cart.add(latte, 'large');
    expect(cart.totals().lineCount).toBe(2);
    expect(cart.totals().subtotal).toBe(455);
  });

  it('keeps different notes as separate lines', () => {
    cart.add(latte, 'regular', 1, 'oat milk');
    cart.add(latte, 'regular', 1);
    expect(cart.totals().lineCount).toBe(2);
  });

  it('refuses unavailable items', () => {
    cart.add(soldOut);
    expect(cart.isEmpty()).toBe(true);
  });

  it('removes the line when quantity drops below one', () => {
    cart.add(latte);
    cart.decrement(cart.lines()[0].lineId);
    expect(cart.isEmpty()).toBe(true);
  });

  it('caps quantity at 20', () => {
    cart.add(latte, 'regular', 999);
    expect(cart.lines()[0].qty).toBe(20);
  });

  it('counts a product across sizes via qtyOf', () => {
    cart.add(latte, 'regular', 2);
    cart.add(latte, 'large', 3);
    expect(cart.qtyOf('matcha-latte')).toBe(5);
  });

  it('persists and restores across instances', () => {
    cart.add(latte, 'large', 2);
    TestBed.resetTestingModule();
    const restored = TestBed.inject(CartService);
    expect(restored.totals().subtotal).toBe(500);
  });

  it('discards a corrupted stored cart instead of throwing', () => {
    localStorage.setItem(
      'matcharap.cart',
      JSON.stringify({ version: 1, lines: [{ lineId: 'x', qty: -5 }], savedAt: '' }),
    );
    TestBed.resetTestingModule();
    expect(TestBed.inject(CartService).isEmpty()).toBe(true);
  });

  it('ignores a stored cart from a future schema version', () => {
    localStorage.setItem(
      'matcharap.cart',
      JSON.stringify({ version: 99, lines: [], savedAt: '' }),
    );
    TestBed.resetTestingModule();
    expect(TestBed.inject(CartService).isEmpty()).toBe(true);
  });
});

describe('OrderService', () => {
  let order: OrderService;
  let cart: CartService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.resetTestingModule();
    order = TestBed.inject(OrderService);
    cart = TestBed.inject(CartService);
  });

  it('builds a reference with the MR- prefix', () => {
    expect(order.reference()).toMatch(/^MR-[0-9A-Z]{5,7}$/);
  });

  it('includes every line and the subtotal in the message', () => {
    cart.add(latte, 'large', 2);
    const msg = order.compose(
      'MR-TEST',
      { name: 'Ana', phone: '0917', fulfilment: 'pickup', pickupTime: 'ASAP' },
      cart.lines(),
      cart.totals(),
    );
    expect(msg).toContain('MR-TEST');
    expect(msg).toContain('2x Matcharap Signature Latte (Large)');
    expect(msg).toContain('\u20b1500');
    expect(msg).toContain('Ana');
  });

  it('encodes the message into the wa.me link', () => {
    const url = order.whatsappUrl('a b&c');
    expect(url).toContain('https://wa.me/639170000000?text=');
    expect(url).toContain('a%20b%26c');
  });

  it('uses %20 rather than + in mailto bodies', () => {
    const url = order.mailtoUrl('Hi there', 'line one');
    expect(url).not.toContain('+');
    expect(url).toContain('%20');
  });

  it('flags oversized WhatsApp messages', () => {
    expect(order.exceedsWhatsappLimit('x'.repeat(50))).toBe(false);
    expect(order.exceedsWhatsappLimit('x'.repeat(2000))).toBe(true);
  });
});
