import { Injectable, signal } from '@angular/core';

export type ThemePreference = 'light' | 'dark' | 'system';
export type ThemeResolved = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly storageKey = 'portfolio-theme';
  private mediaQuery: MediaQueryList | null = null;
  private mediaListenerAttached = false;
  private initialized = false;

  readonly preference = signal<ThemePreference>('system');
  readonly resolved = signal<ThemeResolved>('light');

  initTheme(): void {
    if (this.initialized) return;
    this.initialized = true;

    if (typeof window !== 'undefined' && 'matchMedia' in window) {
      this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    }

    const saved = this.readStoredTheme();
    this.preference.set(saved);
    this.applyTheme(saved);

    if (this.mediaQuery && !this.mediaListenerAttached) {
      this.mediaQuery.addEventListener('change', () => {
        if (this.preference() === 'system') {
          this.applyTheme('system');
        }
      });
      this.mediaListenerAttached = true;
    }
  }

  setTheme(preference: ThemePreference): void {
    this.preference.set(preference);
    this.storeTheme(preference);
    this.applyTheme(preference);
  }

  private readStoredTheme(): ThemePreference {
    if (typeof localStorage === 'undefined') {
      return 'system';
    }

    const raw = localStorage.getItem(this.storageKey);
    if (raw === 'light' || raw === 'dark' || raw === 'system') {
      return raw;
    }
    return 'system';
  }

  private storeTheme(preference: ThemePreference): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(this.storageKey, preference);
  }

  private getResolvedTheme(preference: ThemePreference): ThemeResolved {
    if (preference === 'light' || preference === 'dark') {
      return preference;
    }
    return this.mediaQuery?.matches ? 'dark' : 'light';
  }

  private applyTheme(preference: ThemePreference): void {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    const resolved = this.getResolvedTheme(preference);

    root.setAttribute('data-theme', preference);
    root.setAttribute('data-theme-resolved', resolved);
    root.style.colorScheme = resolved;

    this.resolved.set(resolved);
  }
}

