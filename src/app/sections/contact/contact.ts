import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SHOP } from '../../core/data';
import { OrderService } from '../../core/services';
import { Reveal } from '../../shared/a11y/reveal';

type SubjectKey = 'general' | 'catering' | 'events' | 'feedback' | 'press';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, Reveal],
})
export class Contact {
  private readonly fb = inject(FormBuilder);
  private readonly order = inject(OrderService);

  protected readonly shop = SHOP;
  protected readonly sent = signal(false);

  protected readonly subjects: readonly { value: SubjectKey; label: string }[] = [
    { value: 'general', label: 'General enquiry' },
    { value: 'catering', label: 'Catering & bulk orders' },
    { value: 'events', label: 'Private events' },
    { value: 'feedback', label: 'Feedback' },
    { value: 'press', label: 'Press' },
  ];

  protected readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(60)]],
    email: ['', [Validators.required, Validators.email]],
    subject: ['general' as SubjectKey, Validators.required],
    message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1200)]],
  });

  protected invalid(control: 'name' | 'email' | 'message'): boolean {
    const c = this.form.controls[control];
    return c.invalid && (c.touched || c.dirty);
  }

  /** Remaining characters, for the message counter. */
  protected remaining(): number {
    return 1200 - this.form.controls.message.value.length;
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { name, email, subject, message } = this.form.getRawValue();
    const label = this.subjects.find((s) => s.value === subject)?.label ?? 'Enquiry';

    // There is no backend, so the form composes a mailto rather than
    // pretending to POST somewhere. Swap this for an HTTP call when an
    // endpoint exists — the validation and UI stay unchanged.
    window.location.href = this.order.mailtoUrl(
      `${label} — ${name}`,
      [message, '', '---', `From: ${name}`, `Reply to: ${email}`].join('\n'),
    );

    this.sent.set(true);
  }

  protected reset(): void {
    this.form.reset({ name: '', email: '', subject: 'general', message: '' });
    this.sent.set(false);
  }
}
