import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevealOnScrollDirective } from '../../directives/reveal-on-scroll.directive';

interface Step {
  num: string;
  title: string;
  body: string;
  icon: string;
}

@Component({
  selector: 'app-process',
  standalone: true,
  imports: [CommonModule, RevealOnScrollDirective],
  templateUrl: './process.component.html',
  styleUrl: './process.component.scss',
})
export class ProcessComponent {
  steps: Step[] = [
    {
      num: '01',
      title: 'Discover',
      body: 'Understand the real product goal, who it serves, and where the friction is. No code yet — just questions.',
      icon: 'bi-search',
    },
    {
      num: '02',
      title: 'Design',
      body: 'Map flows, draft architecture, choose stack honestly. The boring sketch that prevents the rewrite later.',
      icon: 'bi-bezier2',
    },
    {
      num: '03',
      title: 'Ship',
      body: 'Build in vertical slices with clean module boundaries, typed contracts, and code-split where it actually matters.',
      icon: 'bi-rocket-takeoff',
    },
    {
      num: '04',
      title: 'Measure',
      body: 'Watch behavior, fix the real bottlenecks, document what changed. Velocity comes from clarity, not heroics.',
      icon: 'bi-graph-up-arrow',
    },
  ];
}
