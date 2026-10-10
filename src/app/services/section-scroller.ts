import { DOCUMENT, Injectable, PLATFORM_ID, inject } from '@angular/core';
import { ViewportScroller, isPlatformBrowser } from '@angular/common';

/**
 * Drop-in ViewportScroller for the router's anchor scrolling. The built-in one measures
 * an anchor with getBoundingClientRect(), which for a `position: sticky` section (the
 * Contact curtain is pinned to the bottom of the viewport) reports where it is stuck —
 * already on screen — so the page never moves. This one measures sticky sections at
 * their in-flow position and also honours the target's `scroll-margin-top`.
 *
 * Scrolling is left to the CSS `scroll-behavior` on <html>, which is smooth unless the
 * user prefers reduced motion.
 */
@Injectable()
export class SectionScroller implements ViewportScroller {
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private offset: () => [number, number] = () => [0, 0];

  setOffset(offset: [number, number] | (() => [number, number])): void {
    this.offset = Array.isArray(offset) ? () => offset : offset;
  }

  getScrollPosition(): [number, number] {
    return this.isBrowser ? [window.scrollX, window.scrollY] : [0, 0];
  }

  scrollToPosition(position: [number, number], options?: ScrollOptions): void {
    if (this.isBrowser) window.scrollTo({ ...options, left: position[0], top: position[1] });
  }

  scrollToAnchor(anchor: string, options?: ScrollOptions): void {
    if (!this.isBrowser) return;
    const target =
      this.document.getElementById(anchor) ?? this.document.getElementsByName(anchor)[0];
    if (!(target instanceof HTMLElement)) return;

    const destination = () => {
      const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
      return Math.max(0, this.inFlowTop(target) - margin - this.offset()[1]);
    };
    const scroll = () => window.scrollTo({ ...options, left: window.scrollX, top: destination() });
    scroll();

    // Arriving from another route, the page above can still settle while the smooth
    // scroll runs. Correct once when it ends — only if it landed near the target, so a
    // user who scrolled away meanwhile is never pulled back.
    const done = new AbortController();
    window.addEventListener(
      'scrollend',
      () => {
        const off = Math.abs(destination() - window.scrollY);
        if (off > 1 && off < 48) scroll();
      },
      { once: true, signal: done.signal },
    );
    setTimeout(() => done.abort(), 2000);

    // Move focus with the view so keyboard and screen-reader users continue from there.
    target.focus({ preventScroll: true });
  }

  setHistoryScrollRestoration(scrollRestoration: 'auto' | 'manual'): void {
    try {
      window.history.scrollRestoration = scrollRestoration;
    } catch {
      // Sandboxed or inactive windows can refuse this; restoration just stays default.
    }
  }

  /**
   * Document-relative layout top of `el`. Walks offsetTop, which ignores transforms (the
   * stages' scroll-driven sink/rise would otherwise skew a rect), with every sticky
   * ancestor briefly un-stuck — synchronously, so no frame is painted in between.
   */
  private inFlowTop(el: HTMLElement): number {
    const stuck: HTMLElement[] = [];
    for (let n: HTMLElement | null = el; n; n = n.parentElement) {
      if (getComputedStyle(n).position === 'sticky') stuck.push(n);
    }
    const previous = stuck.map((n) => n.style.position);
    stuck.forEach((n) => (n.style.position = 'relative'));

    let top = 0;
    for (let n: HTMLElement | null = el; n; n = n.offsetParent as HTMLElement | null) {
      top += n.offsetTop;
    }

    stuck.forEach((n, i) => (n.style.position = previous[i]));
    return top;
  }
}
