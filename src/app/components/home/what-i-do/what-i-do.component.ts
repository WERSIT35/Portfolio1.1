import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevealOnScrollDirective } from '../../../directives/reveal-on-scroll.directive';

interface Capability {
  icon: string;
  title: string;
  focus: string;
}

@Component({
  selector: 'app-what-i-do',
  standalone: true,
  imports: [CommonModule, RevealOnScrollDirective],
  templateUrl: './what-i-do.component.html',
  styleUrl: './what-i-do.component.scss',
})
export class WhatIDoComponent {
  currentStack = ['Angular', 'Node.js', 'Docker', 'MongoDB'];

  capabilities: Capability[] = [
    {
      icon: 'bi-layers-half',
      title: 'Frontend Engineering',
      focus: 'Angular · TypeScript · RxJS · Signals · SCSS · Performance',
    },
    {
      icon: 'bi-hdd-rack',
      title: 'Backend & APIs',
      focus: 'Node.js · Express · REST · JWT · PostgreSQL · MongoDB',
    },
    {
      icon: 'bi-shield-check',
      title: 'Systems & Compliance',
      focus: 'Docker · CI/CD · Fraud Detection · iGaming AML · SQL Analysis',
    },
  ];
}
