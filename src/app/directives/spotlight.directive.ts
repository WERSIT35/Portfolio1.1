import { DestroyRef, Directive, ElementRef, afterNextRender, inject, input } from '@angular/core';

const MAX_TILT_DEG = 4;

// Exposes the pointer position as --spot-x / --spot-y (for a CSS radial glow) and,
// when `tilt` is set, --tilt-x / --tilt-y in degrees for a subtle 3D lean.
@Directive({
  selector: '[appSpotlight]',
  standalone: true,
})
export class SpotlightDirective {
  tilt = input(false);

  private readonly el = inject(ElementRef<HTMLElement>);

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
      const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

      const host = this.el.nativeElement;
      let frame = 0;

      const onMove = (event: PointerEvent) => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          const rect = host.getBoundingClientRect();
          const px = (event.clientX - rect.left) / rect.width;
          const py = (event.clientY - rect.top) / rect.height;
          host.style.setProperty('--spot-x', `${(px * 100).toFixed(1)}%`);
          host.style.setProperty('--spot-y', `${(py * 100).toFixed(1)}%`);

          if (this.tilt() && !reduced) {
            host.style.setProperty('--tilt-x', `${((0.5 - py) * 2 * MAX_TILT_DEG).toFixed(2)}deg`);
            host.style.setProperty('--tilt-y', `${((px - 0.5) * 2 * MAX_TILT_DEG).toFixed(2)}deg`);
          }
        });
      };

      const onLeave = () => {
        cancelAnimationFrame(frame);
        host.style.setProperty('--tilt-x', '0deg');
        host.style.setProperty('--tilt-y', '0deg');
      };

      host.addEventListener('pointermove', onMove);
      host.addEventListener('pointerleave', onLeave);
      destroyRef.onDestroy(() => {
        cancelAnimationFrame(frame);
        host.removeEventListener('pointermove', onMove);
        host.removeEventListener('pointerleave', onLeave);
      });
    });
  }
}
