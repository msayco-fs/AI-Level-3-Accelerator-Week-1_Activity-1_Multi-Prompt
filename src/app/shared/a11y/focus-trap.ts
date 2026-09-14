import { Directive, ElementRef, inject, input, type OnDestroy, type OnInit } from '@angular/core';

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

/**
 * Confines keyboard focus to the host element for as long as it exists, and
 * restores focus to wherever it came from on teardown.
 *
 * Required for any `aria-modal="true"` dialog: without it, Tab walks straight
 * out of the overlay into the page behind, which is invisible to a sighted
 * keyboard user and completely disorienting with a screen reader.
 */
@Directive({
  selector: '[appFocusTrap]',
  host: { '(keydown.tab)': 'onTab($event)', '(keydown.shift.tab)': 'onTab($event)' },
})
export class FocusTrap implements OnInit, OnDestroy {
  /** Optional selector for the element to focus first. */
  readonly initialFocus = input<string>('');

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private previouslyFocused: HTMLElement | null = null;

  ngOnInit(): void {
    this.previouslyFocused = document.activeElement as HTMLElement | null;

    // Defer one frame: the host's children may not be laid out yet, and
    // focusing an element with zero size is silently ignored by some browsers.
    requestAnimationFrame(() => {
      const preferred = this.initialFocus()
        ? this.host.nativeElement.querySelector<HTMLElement>(this.initialFocus())
        : null;
      (preferred ?? this.focusable()[0] ?? this.host.nativeElement).focus();
    });
  }

  ngOnDestroy(): void {
    // Only restore if focus is still inside the trap; if the user has clicked
    // elsewhere in the meantime, yanking it back would be hostile.
    if (this.host.nativeElement.contains(document.activeElement)) {
      this.previouslyFocused?.focus();
    }
  }

  /** Host bindings type `$event` as the base `Event`, so narrow here. */
  protected onTab(event: Event): void {
    if (!(event instanceof KeyboardEvent)) return;

    const items = this.focusable();
    if (items.length === 0) {
      event.preventDefault();
      return;
    }

    const first = items[0];
    const last = items[items.length - 1];
    const current = document.activeElement;

    if (event.shiftKey && (current === first || !this.host.nativeElement.contains(current))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && current === last) {
      event.preventDefault();
      first.focus();
    }
  }

  private focusable(): HTMLElement[] {
    return Array.from(this.host.nativeElement.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
      (el) =>
        !el.hasAttribute('inert') &&
        el.getAttribute('aria-hidden') !== 'true' &&
        // offsetParent is null for display:none subtrees — cheaper than
        // calling getComputedStyle on every candidate.
        (el.offsetParent !== null || el.getClientRects().length > 0),
    );
  }
}
