import { Injectable, OnDestroy, Inject, PLATFORM_ID, NgZone } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import Lenis from 'lenis';

@Injectable({ providedIn: 'root' })
export class SmoothScrollService implements OnDestroy {
  private lenis: Lenis | null = null;
  private rafId: number | null = null;
  private clickHandler: ((e: MouseEvent) => void) | null = null;
  private resizeHandler: (() => void) | null = null;
  private mqlReducedMotion: MediaQueryList | null = null;
  private mqlCoarsePointer: MediaQueryList | null = null;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private zone: NgZone,
  ) {}

  init(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.lenis) return;

    this.mqlReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.mqlCoarsePointer = window.matchMedia('(pointer: coarse)');

    // Always install anchor interception so #fragment links use our offset logic.
    this.installAnchorInterceptor();

    if (this.mqlReducedMotion.matches || this.mqlCoarsePointer.matches) {
      // Reduced motion OR touch device: keep native scrolling. CSS scroll-padding-top + scroll-margin-top handle offset.
      return;
    }

    // Run the RAF loop OUTSIDE Angular so it doesn't trigger change detection 60×/s.
    this.zone.runOutsideAngular(() => {
      this.lenis = new Lenis({
        duration: 1.15,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 0.85,
        touchMultiplier: 1.2,
        infinite: false,
      });

      const raf = (time: number) => {
        this.lenis?.raf(time);
        this.rafId = requestAnimationFrame(raf);
      };
      this.rafId = requestAnimationFrame(raf);
    });
  }

  /** Programmatic scroll to top. immediate=true on route changes avoids a long animated rewind. */
  scrollToTop(immediate = true): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.lenis) {
      this.lenis.scrollTo(0, { immediate, force: true });
      return;
    }
    window.scrollTo({ top: 0, behavior: immediate ? 'auto' : 'smooth' });
  }

  /** Scroll to an element by id (without the leading #). */
  scrollToFragment(fragment: string): void {
    if (!isPlatformBrowser(this.platformId) || !fragment) return;
    const el = document.getElementById(fragment);
    if (!el) return;
    const offset = this.computeOffset(el);
    if (this.lenis) {
      this.lenis.scrollTo(el, { offset: -offset });
      return;
    }
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  private installAnchorInterceptor(): void {
    this.clickHandler = (e: MouseEvent) => {
      // Modifier keys / non-primary click → let the browser handle it.
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const anchor = (e.target as HTMLElement | null)?.closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!anchor) return;

      // Skip explicit opt-outs.
      if (anchor.target === '_blank' || anchor.hasAttribute('download')) return;

      const href = anchor.getAttribute('href');
      if (!href || href === '#' || href.length < 2) return;

      // Match scope: same-page anchors only. Lenis/native both resolve them on the current doc.
      const id = href.slice(1);
      const el = document.getElementById(id);
      if (!el) return;

      e.preventDefault();
      const offset = this.computeOffset(el);
      if (this.lenis) {
        this.lenis.scrollTo(el, { offset: -offset });
      } else {
        const top = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
      // Reflect the fragment in the URL without triggering a route navigation.
      try {
        history.replaceState(null, '', href);
      } catch {
        /* noop */
      }
    };
    document.addEventListener('click', this.clickHandler);
  }

  /**
   * Compute the pixel offset above a target element so the anchor doesn't land under fixed/sticky UI.
   * Priority: element's `scroll-margin-top` (per-section overrides) → html's `scroll-padding-top` → 80px fallback.
   */
  private computeOffset(el: Element): number {
    const elMargin = parseFloat(getComputedStyle(el).scrollMarginTop);
    if (!Number.isNaN(elMargin) && elMargin > 0) return elMargin;
    const htmlPad = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop);
    if (!Number.isNaN(htmlPad) && htmlPad > 0) return htmlPad;
    return 80;
  }

  ngOnDestroy(): void {
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
    this.lenis?.destroy();
    this.lenis = null;
    if (this.clickHandler) document.removeEventListener('click', this.clickHandler);
    if (this.resizeHandler) window.removeEventListener('resize', this.resizeHandler);
  }
}
