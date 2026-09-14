import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CartService, OrderService, ScrollLockService } from '../../core/services';
import { SHOP } from '../../core/data';
import type { FulfilmentType, OrderChannel } from '../../core/models';
import { PesoPipe } from '../ui/peso.pipe';
import { FocusTrap } from '../a11y/focus-trap';

type Step = 'review' | 'details' | 'sent';

@Component({
  selector: 'app-cart-drawer',
  templateUrl: './cart-drawer.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, PesoPipe, FocusTrap],
  host: {
    '(document:keydown.escape)': 'onEscape()',
  },
})
export class CartDrawer {
  private readonly fb = inject(FormBuilder);
  protected readonly cart = inject(CartService);
  private readonly order = inject(OrderService);
  private readonly scrollLock = inject(ScrollLockService);

  protected readonly shop = SHOP;
  protected readonly step = signal<Step>('review');
  protected readonly channel = signal<OrderChannel>('whatsapp');
  protected readonly reference = signal('');

  constructor() {
    // Pair lock/release off the open flag rather than sprinkling calls through
    // open() and close(); that way no future exit path can leak a lock.
    let locked = false;
    effect(() => {
      const open = this.cart.isOpen();
      if (open && !locked) {
        this.scrollLock.lock();
        locked = true;
      } else if (!open && locked) {
        this.scrollLock.release();
        locked = false;
      }
    });
  }

  protected readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(60)]],
    // Deliberately permissive: landlines, +63 prefixes and spaced groups are
    // all valid here. Over-strict phone regexes reject real customers.
    phone: ['', [Validators.required, Validators.pattern(/^[+\d][\d\s()-]{6,19}$/)]],
    fulfilment: ['pickup' as FulfilmentType, Validators.required],
    pickupTime: ['ASAP', [Validators.maxLength(40)]],
    notes: ['', [Validators.maxLength(280)]],
  });

  /**
   * Long orders silently truncate in some mobile WhatsApp clients, so we warn
   * and nudge toward email before the customer loses half their order.
   */
  protected readonly whatsappTooLong = computed(() => {
    const lines = this.cart.lines();
    if (!lines.length) return false;
    const probe = this.order.compose(
      'MR-0000',
      { name: 'Customer Name', phone: '+63 900 000 0000', fulfilment: 'pickup', pickupTime: 'ASAP' },
      lines,
      this.cart.totals(),
    );
    return this.order.exceedsWhatsappLimit(probe);
  });

  /* ------------------------------ NAVIGATION ---------------------------- */

  protected onEscape(): void {
    if (this.cart.isOpen()) this.close();
  }

  protected close(): void {
    this.cart.close();
    // Reset back to review, but only once closed — resetting mid-flight would
    // yank the form out from under a customer who mis-tapped the scrim.
    if (this.step() === 'sent') this.resetFlow();
  }

  protected goToDetails(): void {
    if (!this.cart.isEmpty()) this.step.set('details');
  }

  protected backToReview(): void {
    this.step.set('review');
  }

  protected resetFlow(): void {
    this.step.set('review');
    this.reference.set('');
    this.form.reset({ name: '', phone: '', fulfilment: 'pickup', pickupTime: 'ASAP', notes: '' });
  }

  protected setChannel(next: OrderChannel): void {
    this.channel.set(next);
  }

  protected setFulfilment(next: FulfilmentType): void {
    this.form.controls.fulfilment.setValue(next);
  }

  /* -------------------------------- SUBMIT ------------------------------ */

  protected send(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (this.cart.isEmpty()) return;

    const ref = this.order.reference();
    const message = this.order.compose(
      ref,
      this.form.getRawValue(),
      this.cart.lines(),
      this.cart.totals(),
    );
    const url = this.order.buildUrl(this.channel(), ref, message);

    if (this.channel() === 'whatsapp') {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      // mailto in a new tab leaves an orphaned blank window in most browsers.
      window.location.href = url;
    }

    this.reference.set(ref);
    this.step.set('sent');
    this.cart.clear();
  }

  /* ------------------------------- HELPERS ------------------------------ */

  protected invalid(control: 'name' | 'phone'): boolean {
    const c = this.form.controls[control];
    return c.invalid && (c.touched || c.dirty);
  }

  protected lineTotal(qty: number, unitPrice: number): number {
    return qty * unitPrice;
  }
}
