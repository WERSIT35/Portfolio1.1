import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevealOnScrollDirective } from '../../directives/reveal-on-scroll.directive';

interface Step {
  num: string;
  title: string;
  body: string;
  icon: string;
  detail: string;
}

@Component({
  selector: 'app-process',
  standalone: true,
  imports: [CommonModule, RevealOnScrollDirective],
  templateUrl: './process.component.html',
  styleUrl: './process.component.scss',
})
export class ProcessComponent {
  readonly active = signal(0);

  steps: Step[] = [
    {
      num: '01',
      title: 'Discover',
      body: 'Understand the real product goal, who it serves, and where the friction is. No code yet — just questions.',
      detail: 'Stakeholder interviews, journey mapping, constraint discovery. Output: a one-page problem statement and the smallest viable cut.',
      icon: 'bi-search',
    },
    {
      num: '02',
      title: 'Design',
      body: 'Map flows, draft architecture, choose stack honestly. The boring sketch that prevents the rewrite later.',
      detail: 'Module boundaries, contract sketches, data flows, auth model. Output: a thin architecture doc and a stack decision you can defend.',
      icon: 'bi-bezier2',
    },
    {
      num: '03',
      title: 'Ship',
      body: 'Build in vertical slices with clean module boundaries, typed contracts, and code-split where it actually matters.',
      detail: 'Standalone components, signals, lazy loading; secure APIs with typed contracts; containerized rollouts. Output: production traffic.',
      icon: 'bi-rocket-takeoff',
    },
    {
      num: '04',
      title: 'Measure',
      body: 'Watch behavior, fix the real bottlenecks, document what changed. Velocity comes from clarity, not heroics.',
      detail: 'Real-user metrics, SQL anomaly tracing, performance regressions, content-shipping cadence. Output: the next quarter\'s priorities.',
      icon: 'bi-graph-up-arrow',
    },
  ];

  select(i: number): void {
    if (i < 0 || i >= this.steps.length) return;
    this.active.set(i);
  }

  toggle(i: number): void {
    if (this.active() === i) {
      /* Keep at least one open on desktop; allow re-toggle on mobile. */
      return;
    }
    this.active.set(i);
  }

  onStepKey(e: KeyboardEvent, i: number): void {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      this.select((i + 1) % this.steps.length);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      this.select((i - 1 + this.steps.length) % this.steps.length);
    } else if (e.key === 'Home') {
      e.preventDefault();
      this.select(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      this.select(this.steps.length - 1);
    }
  }
}
