import { Injectable, signal } from '@angular/core';

/**
 * One id per palette defined in styles.css.
 */
export type ThemeId =
  | 'classic-slate'
  | 'midnight-navy'
  | 'ocean-petrol'
  | 'royal-sapphire'
  | 'steel-sage';

export interface ThemeOption {
  readonly id: ThemeId;
  readonly label: string;
}

export const THEMES: readonly ThemeOption[] = [
  { id: 'classic-slate', label: 'Classic Slate' },
  { id: 'midnight-navy', label: 'Midnight Navy' },
  { id: 'ocean-petrol', label: 'Ocean Petrol' },
  { id: 'royal-sapphire', label: 'Royal Sapphire' },
  { id: 'steel-sage', label: 'Steel & Sage' },
];

/**
 * ⭐ SINGLE SWITCH POINT — change this one value to change the site's
 * palette. Whatever you set here is what renders for every visitor who
 * hasn't picked their own theme yet (no stored preference in localStorage).
 * No CSS edits, no index.html edits — just this line.
 */
export const DEFAULT_THEME: ThemeId = 'classic-slate';

const STORAGE_KEY = 'matcharap.theme';

/**
 * Applies a color palette at runtime by setting `data-theme` on <html>, and
 * remembers the visitor's own choice across visits (if they ever change it
 * via setTheme). Every palette is pure CSS (see styles.css) — this service
 * only ever writes one attribute; it never touches a color value itself.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly current = signal<ThemeId>(this.restore());
  readonly options = THEMES;

  constructor() {
    this.apply(this.current());
  }

  setTheme(theme: ThemeId): void {
    this.current.set(theme);
    this.apply(theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Private browsing or a full quota — the theme still applies for this
      // session, it just won't be remembered next visit.
    }
  }

  /** Clears the visitor's saved preference and falls back to DEFAULT_THEME. */
  resetToDefault(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Nothing to clean up if storage isn't available.
    }
    this.setTheme(DEFAULT_THEME);
  }

  private apply(theme: ThemeId): void {
    // Always set the attribute explicitly — including for 'classic-slate'.
    // There's no [data-theme='classic-slate'] override block in styles.css,
    // so that value simply falls through to the un-prefixed @theme tokens.
    // (Deliberately NOT special-cased to "remove the attribute for the
    // default" — that shortcut only works while the default happens to be
    // classic-slate. Setting it explicitly means DEFAULT_THEME above can be
    // changed to any palette and this keeps working correctly.)
    document.documentElement.setAttribute('data-theme', theme);
  }

  private restore(): ThemeId {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as ThemeId | null;
      return saved && THEMES.some((t) => t.id === saved) ? saved : DEFAULT_THEME;
    } catch {
      return DEFAULT_THEME;
    }
  }
}
