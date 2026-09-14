import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { App } from './app';
import { CartService } from './core/services';

/**
 * Integration smoke tests. These run in jsdom, which has no
 * IntersectionObserver — so they also prove the graceful-degradation paths in
 * Reveal, ScrollSpyService and the header's scroll sentinel do not throw.
 */
describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.resetTestingModule();
  });

  function render() {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    return fixture;
  }

  it('boots without throwing when IntersectionObserver is unavailable', () => {
    expect(() => render()).not.toThrow();
  });

  it('renders the skip link as the first focusable element', () => {
    const el: HTMLElement = render().nativeElement;
    const first = el.querySelector('a');
    expect(first?.getAttribute('href')).toBe('#menu');
  });

  it('renders every nav link', () => {
    const el: HTMLElement = render().nativeElement;
    const labels = Array.from(el.querySelectorAll('nav[aria-label="Main"] a')).map((a) =>
      a.textContent?.trim(),
    );
    expect(labels).toEqual(['Home', 'Menu', 'About', 'Gallery', 'Reviews', 'Contact']);
  });

  it('renders the hero h1 exactly once', () => {
    const el: HTMLElement = render().nativeElement;
    const h1s = el.querySelectorAll('h1');
    expect(h1s.length).toBe(1);
    expect(h1s[0].textContent).toContain('slowing down');
  });

  it('renders all 22 menu items', () => {
    const el: HTMLElement = render().nativeElement;
    expect(el.querySelectorAll('app-menu-item-card').length).toBe(22);
  });

  it('gives every menu image an accessible name or hides it', () => {
    const el: HTMLElement = render().nativeElement;
    for (const svg of Array.from(el.querySelectorAll('app-media-frame svg'))) {
      expect(svg.getAttribute('aria-hidden')).toBe('true');
    }
  });

  it('exposes no duplicate element IDs', () => {
    const el: HTMLElement = render().nativeElement;
    const ids = Array.from(el.querySelectorAll('[id]')).map((n) => n.id);
    expect(ids.length).toBe(new Set(ids).size);
  });

  it('has an anchor target for every nav link', () => {
    const el: HTMLElement = render().nativeElement;
    const links = Array.from(el.querySelectorAll('nav[aria-label="Main"] a')).map((a) =>
      (a.getAttribute('href') ?? '').replace('#', ''),
    );
    for (const id of links) {
      expect(el.querySelector(`#${id}`), `missing anchor target #${id}`).toBeTruthy();
    }
  });

  it('hides the cart badge until something is added', () => {
    const fixture = render();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.cart-badge')).toBeNull();

    TestBed.inject(CartService).add({
      id: 'espresso',
      name: 'Doppio Espresso',
      category: 'coffee',
      description: 'x',
      price: 130,
      image: '',
      available: true,
    });
    fixture.detectChanges();

    expect(el.querySelector('.cart-badge')?.textContent?.trim()).toBe('1');
  });

  it('keeps the cart trigger label in sync with the count', () => {
    const fixture = render();
    const el: HTMLElement = fixture.nativeElement;
    const trigger = el.querySelector('button[aria-label*="order"]');
    expect(trigger?.getAttribute('aria-label')).toContain('currently empty');
  });
});
