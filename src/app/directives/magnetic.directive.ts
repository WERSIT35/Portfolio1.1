import { Directive, ElementRef, Input, NgZone, OnDestroy, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * appMagnetic — the element drifts toward the cursor while hovered, springing
 * back on leave. Fine-pointer + motion-allowed only; rAF runs outside Angular.
 */
@Directive({ selector: '[appMagnetic]', standalone: true })
export class MagneticDirective implements OnDestroy {
  /** Fraction of the cursor offset the element follows (0–1). */
  @Input() magnetStrength = 0.3;

  private host = inject<ElementRef<HTMLElement>>(ElementRef);
  private zone = inject(NgZone);
  private platformId = inject(PLATFORM_ID);

  private enabled = false;
  private raf = 0;
  private cx = 0; private cy = 0;   // current
  private dx = 0; private dy = 0;   // target

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced) return;

    this.enabled = true;
    this.zone.runOutsideAngular(() => {
      const el = this.host.nativeElement;
      el.addEventListener('pointermove', this.onMove, { passive: true });
      el.addEventListener('pointerleave', this.onLeave, { passive: true });
    });
  }

  private readonly onMove = (e: PointerEvent): void => {
    const el = this.host.nativeElement;
    const r = el.getBoundingClientRect();
    this.dx = (e.clientX - (r.left + r.width / 2)) * this.magnetStrength;
    this.dy = (e.clientY - (r.top + r.height / 2)) * this.magnetStrength;
    el.style.transition = 'none';   // rAF owns the transform; don't let CSS lag it
    if (!this.raf) this.raf = requestAnimationFrame(this.tick);
  };

  private readonly onLeave = (): void => {
    this.dx = 0; this.dy = 0;
    if (!this.raf) this.raf = requestAnimationFrame(this.tick);
  };

  private readonly tick = (): void => {
    this.raf = 0;
    this.cx += (this.dx - this.cx) * 0.2;
    this.cy += (this.dy - this.cy) * 0.2;
    const el = this.host.nativeElement;
    const settled = Math.abs(this.dx - this.cx) < 0.1 && Math.abs(this.dy - this.cy) < 0.1;
    if (settled && this.dx === 0 && this.dy === 0) {
      el.style.transform = '';
      el.style.transition = '';
      return;
    }
    el.style.transform = `translate(${this.cx.toFixed(2)}px, ${this.cy.toFixed(2)}px)`;
    this.raf = requestAnimationFrame(this.tick);
  };

  ngOnDestroy(): void {
    if (!this.enabled) return;
    if (this.raf) cancelAnimationFrame(this.raf);
    const el = this.host.nativeElement;
    el.removeEventListener('pointermove', this.onMove);
    el.removeEventListener('pointerleave', this.onLeave);
  }
}
