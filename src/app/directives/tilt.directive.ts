import { Directive, ElementRef, Input, NgZone, OnDestroy, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * appTilt — subtle cursor-reactive 3D tilt for cards.
 *
 * Only activates on fine-pointer devices with motion allowed. The rAF loop runs
 * outside Angular (no change-detection churn) and only while it has work to do;
 * the transform springs back to flat on pointer leave / destroy.
 */
@Directive({ selector: '[appTilt]', standalone: true })
export class TiltDirective implements OnDestroy {
  /** Max tilt in degrees on each axis. */
  @Input() tiltMax = 5;

  private host = inject<ElementRef<HTMLElement>>(ElementRef);
  private zone = inject(NgZone);
  private platformId = inject(PLATFORM_ID);

  private enabled = false;
  private raf = 0;
  private rx = 0; private ry = 0;     // current angles
  private tx = 0; private ty = 0;     // target angles

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced) return;

    this.enabled = true;
    const el = this.host.nativeElement;
    el.style.transformStyle = 'preserve-3d';
    this.zone.runOutsideAngular(() => {
      el.addEventListener('pointermove', this.onMove, { passive: true });
      el.addEventListener('pointerleave', this.onLeave, { passive: true });
    });
  }

  private readonly onMove = (e: PointerEvent): void => {
    const el = this.host.nativeElement;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    this.tx = -py * this.tiltMax * 2;
    this.ty = px * this.tiltMax * 2;
    el.style.willChange = 'transform';
    el.style.transition = 'none';   // rAF owns the transform; don't let CSS lag it
    if (!this.raf) this.raf = requestAnimationFrame(this.tick);
  };

  private readonly onLeave = (): void => {
    this.tx = 0; this.ty = 0;
    if (!this.raf) this.raf = requestAnimationFrame(this.tick);
  };

  private readonly tick = (): void => {
    this.raf = 0;
    this.rx += (this.tx - this.rx) * 0.15;
    this.ry += (this.ty - this.ry) * 0.15;
    const el = this.host.nativeElement;
    const settled = Math.abs(this.tx - this.rx) < 0.05 && Math.abs(this.ty - this.ry) < 0.05;
    if (settled && this.tx === 0 && this.ty === 0) {
      el.style.transform = '';
      el.style.willChange = '';
      el.style.transition = '';     // restore CSS hover transitions at rest
      return;
    }
    el.style.transform = `perspective(900px) rotateX(${this.rx.toFixed(2)}deg) rotateY(${this.ry.toFixed(2)}deg)`;
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
