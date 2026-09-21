// contact.ts
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SHOP } from '../../core/data';
import { Reveal } from '../../shared/a11y/reveal';
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';

type SubjectKey = 'general' | 'catering' | 'events' | 'feedback' | 'press';

// From your EmailJS dashboard. Safe to keep client-side — EmailJS scopes
// sending by these IDs plus rate limits, not by secrecy.
const EMAILJS_SERVICE_ID = 'service_jvcfhlm';
const EMAILJS_TEMPLATE_ID = 'template_fqls405';
const EMAILJS_PUBLIC_KEY = 'aifPr1Qqz1fiN9bVl';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, Reveal],
})
export class Contact {
  private readonly fb = inject(FormBuilder);

  protected readonly shop = SHOP;
  protected readonly sent = signal(false);
  protected readonly sending = signal(false);
  protected readonly sendError = signal<string | null>(null);

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

  protected remaining(): number {
    return 1200 - this.form.controls.message.value.length;
  }

  protected async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (this.sending()) return;

    const { name, email, subject, message } = this.form.getRawValue();
    const label = this.subjects.find((s) => s.value === subject)?.label ?? 'Enquiry';

    this.sending.set(true);
    this.sendError.set(null);

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          to_email: this.shop.email,
          from_name: name,
          from_email: email,
          subject: `${label} — ${name}`,
          message,
        },
        { publicKey: EMAILJS_PUBLIC_KEY },
      );
      this.sent.set(true);
    } catch(err) {
      console.error('EmailJS send failed:', err);
      const detail =
        err instanceof EmailJSResponseStatus ? `${err.status} ${err.text}` : String(err);
      this.sendError.set(
        `Something went wrong sending that (${detail}). Please email us directly at ${this.shop.email}.`,
      );
    } finally {
      this.sending.set(false);
    }
  }

  protected reset(): void {
    this.form.reset({ name: '', email: '', subject: 'general', message: '' });
    this.sent.set(false);
    this.sendError.set(null);
  }
}