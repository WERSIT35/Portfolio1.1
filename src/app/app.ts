import { Component, afterNextRender } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DynamicIsland } from './components/layout/dynamic-island/dynamic-island';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, DynamicIsland],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  constructor() {
    // iOS Safari only applies :active (the touch press state in styles.scss) when a
    // touchstart listener exists; an empty passive one costs nothing.
    afterNextRender(() => document.body.addEventListener('touchstart', () => {}, { passive: true }));
  }
}
