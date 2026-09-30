import { DestroyRef, Directive, ElementRef, afterNextRender, inject, input } from '@angular/core';

// Spring constants for the follow / release motion (per 60fps frame).
// light: snappy UI chrome (the island). heavy: the "pulling on metal" feel shared with the
// Contact email — 90% there at ~333ms, 2.9% overshoot, settled by ~0.67s.
const SPRINGS = {
  light: { stiffness: 0.14, damping: 0.78 },
  heavy: { stiffness: 0.022, damping: 0.81 },
} as const;
const REST_EPSILON = 0.05;

// Pulls the host toward the pointer while hovered, then springs back on leave.
// Driven by a tiny rAF spring on the standalone `translate` property, so it never
// touches `transform` or `transition` — the host keeps its own CSS motion intact.
@Directive({
  selector: '[appMagnetic]',
  standalone: true,
})
export class MagneticDirective {
  /** Fraction of the pointer's offset from center the host follows. */
  strength = input<number, number | ''>(0.3, {
    alias: 'appMagnetic',
    transform: (v) => (v === '' ? 0.3 : v),
  });

  /** Spring character: 'light' (default) or 'heavy'. */
  magneticWeight = input<keyof typeof SPRINGS>('light');

  private readonly el = inject(ElementRef<HTMLElement>);

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const canHover = matchMedia('(hover: hover) and (pointer: fine)').matches;
      const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!canHover || reduced) return;

      const host = this.el.nativeElement;
      const pos = { x: 0, y: 0 };
      const vel = { x: 0, y: 0 };
      const target = { x: 0, y: 0 };
      let frame = 0;
      let last = 0;

      // dt-normalised (k = frames elapsed at 60fps), so the spring has the same weight
      // on 60Hz and 120Hz displays.
      const step = (now: number) => {
        const k = Math.min(now - last, 64) / 16.667;
        last = now;
        const { stiffness, damping } = SPRINGS[this.magneticWeight()];
        const d = Math.pow(damping, k);
        vel.x = (vel.x + (target.x - pos.x) * stiffness * k) * d;
        vel.y = (vel.y + (target.y - pos.y) * stiffness * k) * d;
        pos.x += vel.x * k;
        pos.y += vel.y * k;
        host.style.translate = `${pos.x.toFixed(2)}px ${pos.y.toFixed(2)}px`;

        const settled =
          Math.abs(target.x - pos.x) < REST_EPSILON &&
          Math.abs(target.y - pos.y) < REST_EPSILON &&
          Math.abs(vel.x) < REST_EPSILON &&
          Math.abs(vel.y) < REST_EPSILON;
        if (settled) {
          host.style.translate = target.x || target.y ? host.style.translate : '';
          frame = 0;
          return;
        }
        frame = requestAnimationFrame(step);
      };

      const kick = () => {
        if (frame) return;
        last = performance.now();
        frame = requestAnimationFrame(step);
      };

      const onMove = (event: PointerEvent) => {
        // Measure without our own offset so the pull doesn't feed back on itself.
        const rect = host.getBoundingClientRect();
        const cx = rect.left - pos.x + rect.width / 2;
        const cy = rect.top - pos.y + rect.height / 2;
        target.x = (event.clientX - cx) * this.strength();
        target.y = (event.clientY - cy) * this.strength();
        kick();
      };

      const onLeave = () => {
        target.x = 0;
        target.y = 0;
        kick();
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
