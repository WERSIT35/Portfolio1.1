import { Component, afterNextRender, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DynamicIsland } from './components/layout/dynamic-island/dynamic-island';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, DynamicIsland],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  /** Film grain is decoration: it waits for load + an idle moment so it never competes with LCP. */
  protected readonly grain = signal(false);

  constructor() {
    afterNextRender(() => {
      const show = () => this.grain.set(true);
      const idle = () =>
        'requestIdleCallback' in window
          ? requestIdleCallback(show, { timeout: 2000 })
          : setTimeout(show, 1200);
      if (document.readyState === 'complete') idle();
      else addEventListener('load', idle, { once: true });
    });

    // iOS Safari only applies :active (the touch press state in styles.scss) when a
    // touchstart listener exists; an empty passive one costs nothing.
    afterNextRender(() => document.body.addEventListener('touchstart', () => {}, { passive: true }));
  }
}
