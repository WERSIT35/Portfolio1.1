import { DestroyRef, Directive, ElementRef, afterNextRender, inject, input } from '@angular/core';

const DURATION_MS = 900;

// Renders the final value (SSR / no-JS / crawlers), then in the browser replays it
// counting up from 0 the first time the host scrolls into view.
@Directive({
  selector: '[appCountUp]',
  standalone: true,
  host: { '[textContent]': 'value()' },
})
export class CountUpDirective {
  value = input.required<number>({ alias: 'appCountUp' });

  private readonly el = inject(ElementRef<HTMLElement>);

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const host = this.el.nativeElement;
      let frame = 0;

      const run = () => {
        const target = this.value();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - start) / DURATION_MS, 1);
          const eased = 1 - Math.pow(1 - t, 4);
          host.textContent = String(Math.round(target * eased));
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      };

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) {
            observer.disconnect();
            run();
          }
        },
        { threshold: 0.6 },
      );
      observer.observe(host);

      destroyRef.onDestroy(() => {
        observer.disconnect();
        cancelAnimationFrame(frame);
      });
    });
  }
}
