import { Directive, ElementRef, NgZone, OnDestroy, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * appSpotlight — writes `--spot-x` / `--spot-y` (0–100%) on the host from the
 * cursor position, so a card's radial-glow `::before` can follow the pointer.
 * Generalizes the old hand-rolled `onTileMove`. Fine-pointer only; no rAF
 * needed — it just sets two custom properties.
 */
@Directive({ selector: '[appSpotlight]', standalone: true })
export class SpotlightDirective implements OnDestroy {
  private host = inject<ElementRef<HTMLElement>>(ElementRef);
  private zone = inject(NgZone);
  private platformId = inject(PLATFORM_ID);
  private enabled = false;

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    this.enabled = true;
    this.zone.runOutsideAngular(() => {
      this.host.nativeElement.addEventListener('pointermove', this.onMove, { passive: true });
    });
  }

  private readonly onMove = (e: PointerEvent): void => {
    const el = this.host.nativeElement;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--spot-x', `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty('--spot-y', `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  ngOnDestroy(): void {
    if (this.enabled) this.host.nativeElement.removeEventListener('pointermove', this.onMove);
  }
}
