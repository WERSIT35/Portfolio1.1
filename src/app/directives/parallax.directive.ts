import { AfterViewInit, Directive, ElementRef, Input, NgZone, OnDestroy, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * appParallax — drifts the element vertically as the page scrolls, for a subtle
 * depth layer (masthead motifs, hero images). rAF-throttled, transform-only,
 * disabled under reduced-motion. Speed is a fraction of scroll offset.
 */
@Directive({ selector: '[appParallax]', standalone: true })
export class ParallaxDirective implements AfterViewInit, OnDestroy {
  @Input() parallaxSpeed = 0.12;
  @Input() parallaxMax = 60;          // px clamp

  private host = inject<ElementRef<HTMLElement>>(ElementRef);
  private zone = inject(NgZone);
  private platformId = inject(PLATFORM_ID);
  private enabled = false;
  private ticking = false;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    this.enabled = true;
    this.host.nativeElement.style.willChange = 'transform';
    this.zone.runOutsideAngular(() => {
      window.addEventListener('scroll', this.onScroll, { passive: true });
      this.update();
    });
  }

  private readonly onScroll = (): void => {
    if (this.ticking) return;
    this.ticking = true;
    requestAnimationFrame(this.update);
  };

  private readonly update = (): void => {
    this.ticking = false;
    const el = this.host.nativeElement;
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight || 1;
    // distance of element center from viewport center, normalized
    const rel = (r.top + r.height / 2 - vh / 2);
    const y = Math.max(-this.parallaxMax, Math.min(this.parallaxMax, -rel * this.parallaxSpeed));
    el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
  };

  ngOnDestroy(): void {
    if (this.enabled) window.removeEventListener('scroll', this.onScroll);
  }
}
